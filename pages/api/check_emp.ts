import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

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
    if (req.method === "POST") {
      const { facultyId } = req.body;
      if (!facultyId) {
        return res
          .status(400)
          .json({ success: false, message: "Faculty ID is required" });
      }

      // First, check if the employee exists in the employee table
      const empQuery = `
        USE aittest;
        SELECT eid, ename, role
        FROM employee_table
        WHERE eid = @facultyId
      `;
      const empInputs = [
        { name: "facultyId", type: sql.VarChar, value: facultyId },
      ];
      const empResult = await dbQuery(empQuery, empInputs);
      if (empResult.recordset.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Faculty ID not found" });
      }
      const { role } = empResult.recordset[0];

      // Now, check counts in the three tables.
      const personalQuery = `
        USE aittest;
        SELECT COUNT(*) AS count 
        FROM [dbo].[facultyPersonalDetails]
        WHERE [employee_id] = @employee_id
      `;
      const researchQuery = `
        USE aittest;
        SELECT COUNT(*) AS count 
        FROM [dbo].[FacultyResearchDetails]
        WHERE [employee_id] = @employee_id
      `;
      const academicQuery = `
        USE aittest;
        SELECT COUNT(*) AS count 
        FROM [dbo].[facultyAcademicDetails]
        WHERE [employee_id] = @employee_id
      `;
      const inputs2 = [
        { name: "employee_id", type: sql.VarChar, value: facultyId },
      ];
      const personalResult = await dbQuery(personalQuery, inputs2);
      const researchResult = await dbQuery(researchQuery, inputs2);
      const academicResult = await dbQuery(academicQuery, inputs2);

      const personalCount = personalResult.recordset[0].count;
      const researchCount = researchResult.recordset[0].count;
      const academicCount = academicResult.recordset[0].count;

      // If any of these counts is greater than zero, assume the user has already entered details.
      const isRegistered =
        personalCount > 0 || researchCount > 0 || academicCount > 0;

      return res.status(200).json({
        success: true,
        role,
        isRegistered,
        personalCount,
        researchCount,
        academicCount,
      });
    }
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}
