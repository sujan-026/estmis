import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";
function validateDate(date) {

  
  const parsedDate = new Date(date);
  if (
    isNaN(parsedDate.getTime()) ||
    parsedDate < new Date("1900-01-01") ||
    parsedDate > new Date("2079-06-06")
  ) {
    return new Date(); // Return null for invalid dates
  }
  return parsedDate; // Return valid date
}



export default async function POST(req, res) {
  try {
    const {
      facultyResearchSchema,
      nationalJournalDetailsSchema,
      internationalJournalDetailsSchema,
      nationalConferenceDetailsSchema,
      internationalConferenceDetailsSchema,
      researchGrantsSchema,
      patentsSchema,
      consultancySchema,
      professionalMembershipSchema,
      eventsAttendedSchema,
      eventsOrganizedSchema,
      publicationsSchema,
      research_experienceSchema,
      researchSupervisionSchema,
      employeeMoocsSchema, // Add this line
      facultyId,
    } = req.body;

    if (
      !facultyResearchSchema ||
      !nationalJournalDetailsSchema ||
      !eventsAttendedSchema ||
      !eventsOrganizedSchema ||
      !internationalJournalDetailsSchema ||
      !nationalConferenceDetailsSchema ||
      !internationalConferenceDetailsSchema ||
      !researchGrantsSchema ||
      !consultancySchema ||
      !patentsSchema ||
      !publicationsSchema ||
      !professionalMembershipSchema ||
      !facultyId ||
      !research_experienceSchema ||
      !researchSupervisionSchema
      || !employeeMoocsSchema // Add this line
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid schema data",
      });
    }

    console.log("Validated Request Body:", {
      research_experienceSchema,
      facultyId,
    });
    const pool = await connectToDatabase();
    const insertFacultyResearchDetailsQuery = `
        INSERT INTO [aittest].[dbo].[FacultyResearchDetails] (
          employee_id, orcidId, googleScholarId, scopusId, publonsId, researchId
        )
        VALUES (@employee_id, @orcidId, @googleScholarId, @scopusId, @publonsId, @researchId);
      `;
    await pool
      .request()
      .input("employee_id", sql.NVarChar, facultyId)
      .input("orcidId", sql.NVarChar, facultyResearchSchema.orcId)
      .input(
        "googleScholarId",
        sql.NVarChar,
        facultyResearchSchema.googleScholarId
      )
      .input("scopusId", sql.NVarChar, facultyResearchSchema.scopusId)
      .input(
        "publonsId",
        sql.NVarChar,
        facultyResearchSchema.publonsAndWebOfScienceId
      )
      .input("researchId", sql.NVarChar, facultyResearchSchema.researchId)
      .query(insertFacultyResearchDetailsQuery);
    const insertConferenceAndJournalQuery = `
            INSERT INTO [aittest].[dbo].[ConferenceAndJournal] (
                employee_id, typeOfPublication, title, doi, issn, joConName, 
                yearOfPublication, pageNo, authors, publishedUnder, impactFactor, 
                quartile, sponsor, venue, volume, issueNo
            )
            VALUES (
                @employee_id, @typeOfPublication, @title, @doi, @issn, @joConName, 
                @yearOfPublication, @pageNo, @authors, @publishedUnder, 
                @impactFactor, @quartile, @sponsor, @venue, @volume, @issueNo
            );
            `;
    const nationaljournal = nationalJournalDetailsSchema || [];
    for (const journalDetails of nationaljournal) {
      await pool
        .request()
        .input("employee_id", sql.VarChar, facultyId)
        .input("typeOfPublication", sql.VarChar, "NJ")
        .input(
          "title",
          sql.VarChar,
          journalDetails.titleOfResearchPaper || "Unknown"
        )
        .input("doi", sql.VarChar, journalDetails.doi || "Unknown")
        .input("issn", sql.VarChar, journalDetails.issn || "Unknown")
        .input("joConName", sql.VarChar, journalDetails.joConName || "Unknown")
        .input(
          "yearOfPublication",
          sql.Int,
          journalDetails.yearOfPublication || 0
        )
        .input("pageNo", sql.VarChar, journalDetails.pageNo || "Unknown")
        .input(
          "authors",
          sql.VarChar,
          Array.isArray(journalDetails.authors)
            ? JSON.stringify(journalDetails.authors)
            : ""
        )
        .input(
          "publishedUnder",
          sql.VarChar,
          journalDetails.publishedUnder || "Unknown"
        )
        .input("impactFactor", sql.NVarChar, journalDetails.impactFactor || 0)
        .input("quartile", sql.VarChar, journalDetails.quartile || "Unknown")
        .input("sponsor", sql.VarChar, journalDetails.sponsor || "Unknown")
        .input("venue", sql.VarChar, journalDetails.venue || "Unknown")
        .input("volume", sql.VarChar, journalDetails.volume || "Unknown")
        .input("issueNo", sql.NVarChar, journalDetails.issueNo || "Unknown")
        .query(insertConferenceAndJournalQuery);
    }
    const internationaljournal = internationalJournalDetailsSchema || [];
    for (const internationalJournalDetailsSchema1 of internationaljournal) {
      await pool
        .request()
        .input("employee_id", sql.NVarChar, facultyId)
        .input("typeOfPublication", sql.VarChar, "IJ")
        .input(
          "title",
          sql.VarChar,
          internationalJournalDetailsSchema1.titleOfResearchPaper || "Unknown"
        )
        .input(
          "doi",
          sql.VarChar,
          internationalJournalDetailsSchema1.doi || "Unknown"
        )
        .input(
          "issn",
          sql.VarChar,
          internationalJournalDetailsSchema1.issn || "Unknown"
        )
        .input(
          "joConName",
          sql.VarChar,
          internationalJournalDetailsSchema1.joConName || "Unknown"
        )
        .input(
          "yearOfPublication",
          sql.Int,
          internationalJournalDetailsSchema1.yearOfPublication || 0
        )
        .input(
          "pageNo",
          sql.VarChar,
          internationalJournalDetailsSchema1.pageNo || "Unknown"
        )
        .input(
          "authors",
          sql.VarChar,
          Array.isArray(internationalJournalDetailsSchema1.authors)
            ? JSON.stringify(internationalJournalDetailsSchema1.authors)
            : ""
        )
        .input(
          "publishedUnder",
          sql.VarChar,
          internationalJournalDetailsSchema1.publishedUnder || "Unknown"
        )
        .input(
          "impactFactor",
          sql.NVarChar,
          internationalJournalDetailsSchema1.impactFactor || 0
        )
        .input(
          "quartile",
          sql.VarChar,
          internationalJournalDetailsSchema1.quartile || "Unknown"
        )
        .input(
          "sponsor",
          sql.VarChar,
          internationalJournalDetailsSchema1.sponsor || "Unknown"
        )
        .input(
          "venue",
          sql.VarChar,
          internationalJournalDetailsSchema1.venue || "Unknown"
        )
        .input(
          "volume",
          sql.VarChar,
          internationalJournalDetailsSchema1.volume || "Unknown"
        )
        .input(
          "issueNo",
          sql.NVarChar,
          internationalJournalDetailsSchema1.issueNo || "Unknown"
        )
        .query(insertConferenceAndJournalQuery);
    }
    const nationalConference = nationalConferenceDetailsSchema || [];
    for (const nationalConferenceDetailsSchema1 of nationalConference) {
      await pool
        .request()
        .input("employee_id", sql.NVarChar, facultyId)
        .input("typeOfPublication", sql.VarChar, "National Conference")
        .input(
          "title",
          sql.VarChar,
          nationalConferenceDetailsSchema1.titleOfResearchPaper || "Unknown"
        )
        .input(
          "doi",
          sql.VarChar,
          nationalConferenceDetailsSchema1.doi || "Unknown"
        )
        .input(
          "issn",
          sql.VarChar,
          nationalConferenceDetailsSchema1.issn || "Unknown"
        )
        .input(
          "joConName",
          sql.VarChar,
          nationalConferenceDetailsSchema1.joConName || "Unknown"
        )
        .input(
          "yearOfPublication",
          sql.Int,
          nationalConferenceDetailsSchema1.yearOfPublication || 0
        )
        .input(
          "pageNo",
          sql.VarChar,
          nationalConferenceDetailsSchema1.pageNo || "Unknown"
        )
        .input(
          "authors",
          sql.VarChar,
          Array.isArray(nationalConferenceDetailsSchema1.authors)
            ? JSON.stringify(nationalConferenceDetailsSchema1.authors)
            : ""
        )
        .input(
          "publishedUnder",
          sql.VarChar,
          nationalConferenceDetailsSchema1.publishedUnder || "Unknown"
        )
        .input(
          "impactFactor",
          sql.NVarChar,
          nationalConferenceDetailsSchema1.impactFactor || 0
        )
        .input(
          "quartile",
          sql.VarChar,
          nationalConferenceDetailsSchema1.quartile || "Unknown"
        )
        .input(
          "sponsor",
          sql.VarChar,
          nationalConferenceDetailsSchema1.sponsor || "Unknown"
        )
        .input(
          "venue",
          sql.VarChar,
          nationalConferenceDetailsSchema1.venue || "Unknown"
        )
        .input(
          "volume",
          sql.VarChar,
          nationalConferenceDetailsSchema1.volume || "Unknown"
        )
        .input(
          "issueNo",
          sql.NVarChar,
          nationalConferenceDetailsSchema1.issueNo || "Unknown"
        )
        .query(insertConferenceAndJournalQuery);
    }
    const internationalConference = internationalConferenceDetailsSchema || [];
    for (const internationalConferenceDetailsSchema1 of internationalConference) {
      await pool
        .request()
        .input("employee_id", sql.NVarChar, facultyId)
        .input("typeOfPublication", sql.VarChar, "International Conference")
        .input(
          "title",
          sql.VarChar,
          internationalConferenceDetailsSchema1.titleOfResearchPaper ||
            "Unknown"
        )
        .input(
          "doi",
          sql.VarChar,
          internationalConferenceDetailsSchema1.doi || "Unknown"
        )
        .input(
          "issn",
          sql.VarChar,
          internationalConferenceDetailsSchema1.issn || "Unknown"
        )
        .input(
          "joConName",
          sql.VarChar,
          internationalConferenceDetailsSchema1.joConName || "Unknown"
        )
        .input(
          "yearOfPublication",
          sql.Int,
          internationalConferenceDetailsSchema1.yearOfPublication || 0
        )
        .input(
          "pageNo",
          sql.VarChar,
          internationalConferenceDetailsSchema1.pageNo || "Unknown"
        )
        .input(
          "authors",
          sql.VarChar,
          Array.isArray(internationalConferenceDetailsSchema1.authors)
            ? JSON.stringify(internationalConferenceDetailsSchema1.authors)
            : ""
        )
        .input(
          "publishedUnder",
          sql.VarChar,
          internationalConferenceDetailsSchema1.publishedUnder || "Unknown"
        )
        .input(
          "impactFactor",
          sql.NVarChar,
          internationalConferenceDetailsSchema1.impactFactor || 0
        )
        .input(
          "quartile",
          sql.VarChar,
          internationalConferenceDetailsSchema1.quartile || "Unknown"
        )
        .input(
          "sponsor",
          sql.VarChar,
          internationalConferenceDetailsSchema1.sponsor || "Unknown"
        )
        .input(
          "venue",
          sql.VarChar,
          internationalConferenceDetailsSchema1.venue || "Unknown"
        )
        .input(
          "volume",
          sql.VarChar,
          internationalConferenceDetailsSchema1.volume || "Unknown"
        )
        .input(
          "issueNo",
          sql.NVarChar,
          internationalConferenceDetailsSchema1.issueNo || "Unknown"
        )
        .query(insertConferenceAndJournalQuery);
    }

    const insertResearchProjectsQuery = `
            INSERT INTO [aittest].[dbo].[ResearchProjects] (
                employee_id, projectTitle, pi, coPi, dOfSanction, 
                duration, fundingAgency, amount, status
            )
            VALUES (
                @employee_id, @projectTitle, @pi, @coPi, @dOfSanction, 
                @duration, @fundingAgency, @amount, @status
            );
            `;
    const researchGrants = researchGrantsSchema || [];
    for (const researchGrantsSchemas of researchGrants) {
      await pool
        .request()
        .input("employee_id", sql.NVarChar, facultyId)
        .input("projectTitle", sql.NVarChar, researchGrantsSchemas.projectTitle)
        .input("pi", sql.NVarChar, researchGrantsSchemas.pi)
        .input("coPi", sql.NVarChar, researchGrantsSchemas.coPi)
        .input("dOfSanction", sql.Date, researchGrantsSchemas.dOfSanction)
        .input("duration", sql.NVarChar, researchGrantsSchemas.duration)
        .input(
          "fundingAgency",
          sql.NVarChar,
          researchGrantsSchemas.fundingAgency
        )
        .input("amount", sql.Decimal, parseFloat(researchGrantsSchemas.amount))
        .input("status", sql.NVarChar, researchGrantsSchemas.status)
        .query(insertResearchProjectsQuery); // Correct usage
    }
    const insertResearchSupervisionQuery = `
                INSERT INTO [aittest].[dbo].[research_supervision] (
                    employee_id, Research_Supervisor, Research_Scholar_Name, USN, 
                    University, Institute, Discipline, Title_Research, Status
                )
                VALUES (
                    @employee_id, @Research_Supervisor, @Research_Scholar_Name, @USN, 
                    @University, @Institute, @Discipline, @Title_Research, @Status
                );
            `;

    const researchSupervisionData = researchSupervisionSchema || [];
    for (const supervision of researchSupervisionData) {
      await pool
        .request()
        .input("employee_id", sql.NVarChar, facultyId)
        .input(
          "Research_Scholar_Name",
          sql.VarChar,
          Array.isArray( supervision.research_supervisors)
            ? JSON.stringify( supervision.research_supervisors)
            : ""
        )
        .input(
          "Research_Supervisor",
          sql.NVarChar,
          supervision.Research_Scholar_Name
        )
        .input("USN", sql.NVarChar, supervision.USN)
        .input("University", sql.NVarChar, supervision.University)
        .input("Institute", sql.NVarChar, supervision.Institute)
        .input("Discipline", sql.NVarChar, supervision.Discipline)
        .input("Title_Research", sql.NVarChar, supervision.Title_Research)
        .input("Status", sql.NVarChar, supervision.Status)
        .query(insertResearchSupervisionQuery);
    }

    const insertResearchExperienceQuery = `
                INSERT INTO [aittest].[dbo].[research_experience] (
                    employee_id, areaofresearch, from_date, to_date
                )
                VALUES (
                    @employee_id, @areaofresearch, @from_date, @to_date
                );
            `;

    const researchExperienceData = research_experienceSchema || [];
    for (const experience of researchExperienceData) {
      await pool
        .request()
        .input("employee_id", sql.NVarChar, facultyId)
        .input("areaofresearch", sql.NVarChar, experience.areaofresearch)
        .input("from_date", sql.Date, experience.from_date)
        .input("to_date", sql.Date, experience.to_date)
        .query(insertResearchExperienceQuery); // Insert into research_experience
    }

    const insertConsultancyQuery = `
                INSERT INTO [aittest].[dbo].[Consultancy] (
                    employee_id,title,  sanctionedDate, projectPeriod, amount, 
                    principalInvestigator, coPrincipalInvestigator, status
                )
                VALUES (
                    @employee_id,@title, @sanctionedDate, @projectPeriod, @amount, 
                    @principalInvestigator, @coPrincipalInvestigator, @status
                );
                `;
    const consultancy = consultancySchema || [];
    for (const consultancySchemas of consultancy) {
      await pool
        .request()
        .input("employee_id", sql.NVarChar, facultyId || "Unknown ID")
        .input(
          "title",
          sql.NVarChar,
          consultancySchemas.title || "Unknown"
        )
        .input(
          "sanctionedDate",
          sql.Date,
          consultancySchemas.sanctionedDate || new Date()
        )
        .input(
          "projectPeriod",
          sql.NVarChar,
          consultancySchemas.projectPeriod || "Unknown"
        )
        .input(
          "amount",
          sql.Decimal,
          parseFloat(consultancySchemas.amount) || 0
        )
        .input(
          "principalInvestigator",
          sql.NVarChar,
          consultancySchemas.principalInvestigator || "Unknown"
        )
        .input(
          "coPrincipalInvestigator",
          sql.NVarChar,
          consultancySchemas.coPrincipalInvestigator || "Unknown"
        )
        .input("status", sql.NVarChar, consultancySchemas.status || "Unknown")
        .query(insertConsultancyQuery);
    }
    const insertPatentQuery = `
                INSERT INTO [aittest].[dbo].[Patent] (
                    employee_id, areaOfResearch, grantedYear, patentNo, patentStatus, authors
                )
                VALUES (
                    @employee_id, @areaOfResearch, @grantedYear, @patentNo, @patentStatus, @authors
                );
                `;
    const patents = patentsSchema || [];
    for (const patentsSchema1 of patents) {
      await pool
        .request()
        .input("employee_id", sql.NVarChar, facultyId)
        .input(
          "areaOfResearch",
          sql.NVarChar,
          patentsSchema1.areaOfResearch || "Unknown"
        )
        .input("grantedYear", sql.Int, patentsSchema1.grantedYear || 0)
        .input("patentNo", sql.NVarChar, patentsSchema1.patentNo || "Unknown")
        .input(
          "patentStatus",
          sql.NVarChar,
          patentsSchema1.patentStatus || "Unknown"
        )
        .input("authors", sql.NVarChar,Array.isArray(patentsSchema1.authors)
          ? JSON.stringify(patentsSchema1.authors) : "")
        .query(insertPatentQuery);
    }
    const insertBookPublicationQuery = `
                INSERT INTO [aittest].[dbo].[bookPublication] (
                    publicationType, name, volume, pageNumber, issn, publisher, 
                    title, area, impactFactor, employee_id, yearOfPublish , authors
                )
                VALUES (
                    @publicationType, @name, @volume, @pageNumber, @issn, @publisher, 
                    @title, @area, @impactFactor, @employee_id, @yearOfPublish , @authors
                );
                `;
    const publications = publicationsSchema || [];
    for (const publicationsSchema1 of publications) {
      await pool
        .request()
        .input(
          "publicationType",
          sql.NVarChar,
          publicationsSchema1.publicationType || "Unknown"
        )
        .input("name", sql.NVarChar, publicationsSchema1.name || "Unknown")
        .input("volume", sql.NVarChar, publicationsSchema1.volume || "Unknown")
        .input(
          "pageNumber",
          sql.NVarChar,
          publicationsSchema1.pageNumber || "Unknown"
        )
        .input("issn", sql.NVarChar, publicationsSchema1.issn || "Unknown")
        .input(
          "authors",
          sql.NVarChar,
          Array.isArray(publicationsSchema1.authors)
            ? JSON.stringify(publicationsSchema1.authors)
            : ""
        )
        .input(
          "publisher",
          sql.NVarChar,
          publicationsSchema1.publisher || "Unknown"
        )
        .input("title", sql.NVarChar, publicationsSchema1.title || "Unknown")
        .input("area", sql.NVarChar, publicationsSchema1.area || "Unknown")
        .input(
          "impactFactor",
          sql.Float,
          parseFloat(publicationsSchema1.impactFactor) || 0
        )
        .input("employee_id", sql.NVarChar, facultyId || "Unknown ID")
        .input("yearOfPublish", sql.Int, publicationsSchema1.yearOfPublish || 0)
        .query(insertBookPublicationQuery);
    }
    const insertEventAttendedQuery = `
      INSERT INTO [aittest].[dbo].[EventAttended] (
        fromDate, toDate, organizer, venue, sponsor,
        targetAudience, employee_id, nameofevent, typeofevent
      ) VALUES (
        @fromDate, @toDate, @organizer, @venue, @sponsor,
        @targetAudience, @employee_id, @nameofevent, @typeofevent
      );
    `;
    const eventsAttended = eventsAttendedSchema || [];
    for (const row of eventsAttended) {
      // choose the real type:
      const finalType =
        row.typeOfEvent === "Other"
          ? (row.otherType?.trim() || "Other")
          : (row.typeOfEvent || "Unknown");

      await pool
        .request()
        .input("fromDate", sql.Date, validateDate(row.fromDate))
        .input("toDate",   sql.Date, validateDate(row.toDate))
        .input("organizer",      sql.NVarChar, row.organizer || "Unknown")
        .input("venue",          sql.NVarChar, row.venue     || "Unknown")
        .input("sponsor",        sql.NVarChar, row.sponsor   || "Unknown")
        .input("targetAudience", sql.NVarChar, row.targetAudience || "Unknown")
        .input("employee_id",    sql.NVarChar, facultyId)
        .input("nameofevent",    sql.NVarChar, row.nameofevent || "Unknown")
        .input("typeofevent",    sql.NVarChar, finalType)
        .query(insertEventAttendedQuery);
    }

       const insertEventOrganizedQuery = `
      INSERT INTO [aittest].[dbo].[EventOrganized] (
        typeofevent, nameofevent, fromDate, toDate,
        organizer, venue, sponsor, targetAudience, employee_id
      ) VALUES (
        @typeofevent, @nameofevent, @fromDate, @toDate,
        @organizer, @venue, @sponsor, @targetAudience, @employee_id
      );
    `;
    const eventsOrganized = eventsOrganizedSchema || [];
    for (const row of eventsOrganized) {
      const finalType =
        row.typeOfEvent === "Other"
          ? (row.otherType?.trim() || "Other")
          : (row.typeOfEvent || "Unknown");

      await pool
        .request()
        .input("typeofevent", sql.NVarChar, finalType)
        .input("nameofevent", sql.NVarChar, row.nameofevent || "Unknown")
        .input("fromDate",    sql.Date,     validateDate(row.fromDate))
        .input("toDate",      sql.Date,     validateDate(row.toDate))
        .input("organizer",   sql.NVarChar, row.organizer || "Unknown")
        .input("venue",       sql.NVarChar, row.venue     || "Unknown")
        .input("sponsor",     sql.NVarChar, row.sponsor   || "Unknown")
        .input("targetAudience", sql.NVarChar, row.targetAudience || "Unknown")
        .input("employee_id", sql.NVarChar, facultyId)
        .query(insertEventOrganizedQuery);
    }

    const insertProfessionalMembersQuery = `
                INSERT INTO [aittest].[dbo].[ProfessionalMembers] (
                    employee_id, professionalBody, membershipId, membershipSince, membershipType
                )
                VALUES (
                    @employee_id, @professionalBody, @membershipId, @membershipSince, @membershipType
                );
                `;
    const professionalMemberships = professionalMembershipSchema || [];
    

    for (const professionalMembershipsSchema of professionalMemberships) {
      const finalType =
        professionalMembershipsSchema.membershipType === "Other"
          ? (professionalMembershipsSchema.OtherType?.trim() || "Other")
          : (professionalMembershipsSchema.membershipType || "Unknown");  
      await pool
        .request()
        .input("employee_id", sql.NVarChar, facultyId)
        .input(
          "professionalBody",
          sql.NVarChar,
          professionalMembershipsSchema.professionalBody || "Unknown"
        )
        .input(
          "membershipId",
          sql.NVarChar,
          professionalMembershipsSchema.membershipId || "Unknown"
        )
        .input(
          "membershipSince",
          sql.Date,
          professionalMembershipsSchema.membershipSince || new Date()
        )
        .input(
          "membershipType",
          sql.NVarChar,
          finalType || "Unknown"
        )
        .query(insertProfessionalMembersQuery);
    }
    const insertMoocQuery = `
  INSERT INTO [aittest].[dbo].[EmployeeMooc] (
    employee_id, title, typeofMooc, duration, FDP, result, grade
  )
  VALUES (
    @employee_id, @title, @typeofMooc, @duration, @FDP, @result, @grade
  );
`;

const moocs = employeeMoocsSchema || [];
for (const mooc of moocs) {  const moocType = mooc.typeofMooc === "Others" 
    ? mooc.otherMoocType || "Other (Not Specified)"
    : mooc.typeofMooc;
  const duration = mooc.duration === "Others"
    ? mooc.otherDuration || "Other Duration (Not Specified)"
    : mooc.duration;
  let grade = mooc.grade;
  if (moocType === "NPTEL" && !["Elite", "Silver", "Gold", "Pass"].includes(grade)) {
    grade = "Invalid Grade";
  }

  await pool
    .request()
    .input("employee_id", sql.NVarChar, facultyId)
    .input("title", sql.NVarChar, mooc.title || "Unnamed Course")
    .input("typeofMooc", sql.NVarChar, moocType || "Unspecified Type")
    .input("duration", sql.NVarChar, duration || "Unspecified Duration")
    .input("FDP", sql.NVarChar, mooc.FDP === "Yes" ? "Yes" : "No") // Enforce Yes/No
    .input("result", sql.NVarChar, mooc.result || "Result Not Available")
    .input("grade", sql.NVarChar, grade || "No Grade")
    .query(insertMoocQuery);
}
    return res
      .status(200)
      .json({ success: true, message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch faculty" });
  }
}
