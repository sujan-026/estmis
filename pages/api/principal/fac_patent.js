import { connectToDatabase } from "../../../app/config/dbconfig";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { branch } = req.query;

    try {
      const pool = await connectToDatabase();
      const query = `
      USE aittest;
      SELECT t.id, t.employee_id,fp.faculty_name,  t.areaOfResearch, t.grantedYear, t.patentNo, t.patentStatus, t.authors
      FROM dbo.Patent AS t
      INNER JOIN dbo.facultyPersonalDetails AS fp
      ON t.employee_id = fp.employee_id;
      
    `;

      const result = await pool.request().input("branch", branch).query(query);

      res.status(200).json({ data: result.recordset });
    } catch (error) {
      console.error("Error fetching data: ", error);
      res.status(500).json({ message: "Error fetching data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
