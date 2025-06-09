// pages/api/fac_update_education.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../app/config/dbconfig";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let pool;
  try {
    pool = await connectToDatabase();
  } catch (dbErr) {
    console.error("DB connection error:", dbErr);
    return res
      .status(500)
      .json({ message: "Database connection failed", error: dbErr.message });
  }

  try {
    // --- GET: fetch education details ---
    if (req.method === "GET") {
      const { employee_id } = req.query as { employee_id?: string };
      if (!employee_id) {
        return res
          .status(400)
          .json({ message: "Employee ID is required (query param)" });
      }

      const result = await pool
        .request()
        .input("employee_id", employee_id)
        .query(`
          SELECT 
            id,
            employee_id,
            Program,
            regNo,
            university,
            schoolCollege,
            specialization,
            mediumOfInstruction,
            passClass,
            yearOfAward
          FROM aittest.dbo.facultyEducation
          WHERE employee_id = @employee_id;
        `);

      // Always return an array, even if empty
      return res.status(200).json({ educationDetails: result.recordset });
    }

    // --- POST: insert or update array of records ---
    if (req.method === "POST") {
      const { employee_id, educationDetails } = req.body;
      if (
        !employee_id ||
        !educationDetails ||
        !Array.isArray(educationDetails)
      ) {
        return res.status(400).json({
          message:
            "Request body must have `employee_id` and an array `educationDetails`",
        });
      }

      for (const education of educationDetails) {
        if (education.id) {
          // UPDATE existing record
          const updateQuery = `
            UPDATE aittest.dbo.facultyEducation
            SET 
              Program               = @Program,
              regNo                 = @regNo,
              university            = @university,
              schoolCollege         = @schoolCollege,
              specialization        = @specialization,
              mediumOfInstruction   = @mediumOfInstruction,
              passClass             = @passClass,
              yearOfAward           = @yearOfAward
            WHERE id = @id AND employee_id = @employee_id;
          `;
          const reqU = pool.request();
          reqU.input("id", education.id);
          reqU.input("employee_id", employee_id);
          reqU.input("Program", education.Program ?? "");
          reqU.input("regNo", education.regNo ?? "");
          reqU.input("university", education.university ?? "");
          reqU.input("schoolCollege", education.schoolCollege ?? "");
          reqU.input("specialization", education.specialization ?? "");
          reqU.input("mediumOfInstruction", education.mediumOfInstruction ?? "");
          reqU.input("passClass", education.passClass ?? "");
          reqU.input("yearOfAward", education.yearOfAward ?? 0);
          await reqU.query(updateQuery);
        } else {
          // INSERT new record
          const insertQuery = `
            INSERT INTO aittest.dbo.facultyEducation (
              employee_id, Program, regNo, university,
              schoolCollege, specialization, mediumOfInstruction,
              passClass, yearOfAward
            ) VALUES (
              @employee_id, @Program, @regNo, @university,
              @schoolCollege, @specialization, @mediumOfInstruction,
              @passClass, @yearOfAward
            );
          `;
          const reqI = pool.request();
          reqI.input("employee_id", employee_id);
          reqI.input("Program", education.Program ?? "");
          reqI.input("regNo", education.regNo ?? "");
          reqI.input("university", education.university ?? "");
          reqI.input("schoolCollege", education.schoolCollege ?? "");
          reqI.input("specialization", education.specialization ?? "");
          reqI.input("mediumOfInstruction", education.mediumOfInstruction ?? "");
          reqI.input("passClass", education.passClass ?? "");
          reqI.input("yearOfAward", education.yearOfAward ?? 0);
          await reqI.query(insertQuery);
        }
      }

      // Send a success JSON so front-end can read `data.message`
      return res
        .status(200)
        .json({ message: "Education records added/updated successfully" });
    }

    // --- DELETE: remove a record by id ---
    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) {
        return res
          .status(400)
          .json({ message: "Education ID is required for deletion" });
      }
      await pool
        .request()
        .input("id", id)
        .query(`DELETE FROM aittest.dbo.facultyEducation WHERE id = @id;`);
      return res.status(200).json({ message: "Record deleted successfully" });
    }

    // --- Method Not Allowed ---
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    console.error("Education handler error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}
