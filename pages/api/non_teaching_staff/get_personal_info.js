import { connectToDatabase } from "../../../app/config/dbconfig";
import sql from "mssql";

// Helper function to execute a query with parameters
async function dbQuery(query, inputs = []) {
  try {
    const pool = await connectToDatabase();
    const request = pool.request();
    inputs.forEach(({ name, type, value }) => {
      request.input(name, type, value);
    });
    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Database query failed");
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res
        .status(405)
        .json({ success: false, message: `Method ${req.method} Not Allowed` });
    }

    const { employee_id } = req.body;
    if (!employee_id) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });
    }

    const query = `
      SELECT TOP (1)
        [id],
        [employee_id],
        [qualification],
        [department],
        [photo],
        [title],
        [faculty_name],
        [emailId],
        [contactNo],
        [alternateContactNo],
        [emergencyContactNo],
        [adharNo],
        [panNo],
        [dob],
        [gender],
        [nationality],
        [firstAddressLine],
        [correspondenceAddressLine],
        [religion],
        [caste],
        [category],
        [motherTongue],
        [speciallyChallenged],
        [remarks],
        [languages],
        [bankName],
        [accountNo],
        [accountName],
        [accountType],
        [branch],
        [ifsc],
        [pfNumber],
        [uanNumber],
        [pensionNumber],
        [motherName],
        [fatherName],
        [spouseName],
        [children],
        [dateOfJoiningDrait],
        [designation],
        [aided],
        [isRegistered]
      FROM [aittest].[dbo].[facultyPersonalDetails]
      WHERE [employee_id] = @employee_id
    `;

    const inputs = [
      { name: "employee_id", type: sql.VarChar, value: employee_id },
    ];
    const result = await dbQuery(query, inputs);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Personal details not found" });
    }

    return res
      .status(200)
      .json({ success: true, personalDetails: result.recordset[0] });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}
