import { connectToDatabase } from '../../app/config/dbconfig';
import sql from "mssql";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const pool = await connectToDatabase();

    const personalDetailsQuery = `
      SELECT 
        [id], [employee_id], [qualification], [department], [photo], [title], [faculty_name],
        [emailId], [contactNo], [alternateContactNo], [emergencyContactNo], [adharNo], [panNo],
        [dob], [gender], [nationality], [firstAddressLine], [correspondenceAddressLine], [religion],
        [caste], [category], [motherTongue], [speciallyChallenged], [remarks], [languages],
        [bankName], [accountNo], [accountName], [accountType], [branch], [ifsc], [pfNumber],
        [uanNumber], [pensionNumber], [motherName], [fatherName], [spouseName], [children],
        [dateOfJoiningDrait], [designation], [aided]
      FROM [aittest].[dbo].[facultyPersonalDetails]
      WHERE [employee_id] = @employee_id
    `;

    const academicDetailsQuery = `
      SELECT  
       [qualification], [department], [level], [designation]
      FROM [aittest].[dbo].[facultyAcademicDetails]
      WHERE [employee_id] = @employee_id
    `;

     // Fetch faculty education details
    const educationDetailsQuery = `
      SELECT TOP (1000)
        [id],
        [employee_id],
        [Program],
        [regNo],
        [schoolCollege],
        [specialization],
        [mediumOfInstruction],
        [passClass],
        [yearOfAward]
      FROM [aittest].[dbo].[facultyEducation]
      WHERE [employee_id] = @employee_id
    `;

     const researchDetailsQuery = `
      SELECT TOP (1000) 
       [employee_id], [orcidId], [googleScholarId], [scopusId], [publonsId], [researchId]
      FROM [aittest].[dbo].[FacultyResearchDetails]
      WHERE [employee_id] = @employee_id
    `;

    const personalDetailsResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(personalDetailsQuery);

    // const academicDetailsResult = await pool
    //   .request()
    //   .input("employee_id", sql.NVarChar, employee_id)
    //   .query(academicDetailsQuery);

    const educationDetailsResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(educationDetailsQuery);

    const researchDetailsResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(researchDetailsQuery);

    if (personalDetailsResult.recordset.length === 0 && academicDetailsResult.recordset.length === 0 && researchDetailsResult.recordset.length === 0 && educationDetailsResult.recordset.length === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const response = {
      personalDetails: personalDetailsResult.recordset[0],
      // academicDetails: academicDetailsResult.recordset[0],
      researchDetails: researchDetailsResult.recordset[0],
      educationDetails: educationDetailsResult.recordset[0]
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    return res.status(500).json({ error: "Failed to fetch faculty details" });
  }
}
