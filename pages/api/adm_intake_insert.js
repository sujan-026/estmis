import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { brcode, aicte, aided, unaided, comedk, mq, snq, admyear } = req.body;
        const {admission_year} = req.query; // Get the admission_year from the query parameters
        if (!admission_year) {
          return res.status(400).json({ error: 'Admission year is required' });
        }
    try {
      const pool = await connectToDatabase();
      // Insert data into the database
      const query = 'INSERT INTO dbo.admission_intake (brcode, aicte, aided, unaided, comedk, mq, snq, adm_year)'+
       'VALUES (@brcode,@aicte, @aided, @unaided, @comedk, @mq, @snq, @admyear)';
      
      await pool.request()
      .input('admissionYear', sql.Date, new Date(admission_year)) // Assuming admission_year is an integer
      .input('brcode', sql.VarChar, brcode)           
      .input('aicte', sql.Int, aicte)  
      .input('aided', sql.Int, aided)  
      .input('unaided', sql.Int, unaided)  
      .input('comedk', sql.Int, comedk)  
      .input('mq', sql.Int, mq) 
      .input('snq', sql.Int, snq)  
      .input('admyear', sql.Date, new Date(admyear))   
        .query(query);

      res.status(200).json({ message: 'Data inserted successfully' });
    } catch (error) {
      console.error('Error inserting data', error);
      res.status(500).json({ message: 'Error inserting data', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }  
}