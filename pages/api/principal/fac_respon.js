import { connectToDatabase } from '../../../app/config/dbconfig';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { branch } = req.query;

    

    try {
      const pool = await connectToDatabase();

      const query = `
        USE aittest;
        SELECT 
          ar.id, 
          ar.employee_id, 
          fp.faculty_name, 
          ar.level, 
          ar.fromDate,
          ar.toDate, 
          ar.responsibility
        FROM dbo.addtionalResponsibility AS ar
        INNER JOIN dbo.facultyPersonalDetails AS fp
        ON ar.employee_id = fp.employee_id;
        
      `;

      const result = await pool
        .request()
        .input('branch', branch)
        .query(query);

      res.status(200).json({ data: result.recordset });
    } catch (error) {
      console.error("Error fetching AdditionalResponsibility data: ", error);
      res.status(500).json({ message: "Error fetching AdditionalResponsibility data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}