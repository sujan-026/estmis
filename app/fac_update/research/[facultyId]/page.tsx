"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { title } from "process";
const formatDateForInput = (date: string | Date | undefined): string => {
  if (!date) 
    return "";
  if (typeof date === "string") 
  {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) 
      return "";
    return parsedDate.toISOString().split("T")[0];
  }
  return date.toISOString().split("T")[0];
};
  const FormField 
  = 
  ({ 
    label, 
    value, 
    onChange, 
    type = "text",
    className = "",
    options = []
  }:{
    label: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type?: string;
    className?: string;
    options?: { value: string; label: string }[];
  }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === "select" ? (
        <select
          value={value || ""}
          onChange={onChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  );
const FacultyDetailsPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [delta, setDelta] = useState(1); // For animation direction
  const params = useParams();
  const employeeId = params?.facultyId as string;
  const STANDARD_EVENTS = ["Conference", "Workshop", "Seminar"];
  const defaultSchemas = {
    facultyResearchDetails: [
      {
        employee_id: employeeId,
        orcidIdId:"",
        googleScholarId:"",
        scopusId:"",
        publonsId:"",
        researchId:"",
      },
    ],
    ConferenceAndJournal: [
      {
        employee_id: employeeId,
        typeOfPublication:"",
        title:"",
        doi:"",
        issn:"",
        joConName:"",
        yearOfPublication:"",
        pageNo:"",
        authors:"",
        publishedUnder:"",
        impactFactor:"",
        quartile:"",
        sponsor:"",
        venue:"",
        volume:"",
        issueNo:"",
      },
    ],
    EmployeeMooc: [
      {
        id: "",
        employee_id: employeeId,
        title: "",
        typeofMooc: "",
        duration: "",
        FDP: "No",
        result: "",
        grade: "",
        otherMoocType: "",
        otherDuration: "",
      },
    ],
    ResearchProjects: [
      {
        employee_id: employeeId,
        projectTitle: "",
        pi: "",
        coPi: "",
        dOfSanction: "",
        duration: "",
        fundingAgency: "",
        amount: "",
        status: "",
      },
    ],
    ResearchSupervision: [
      {
        employee_id: employeeId,
        Research_Scholar_Name: "",
        Research_Supervisor: "",
        USN: "",
        University: "",
        Institute: "",
        Discipline: "",
        Title_Research: "",
        Status: "",
      },
    ],
    ResearchExperience: [
      {
        employee_id: employeeId,
        areaofresearch: "",
        from_date: "",
        to_date: "",
      },
    ],
    Consultancy: [
      {
        employee_id: employeeId,
        title: "",
        sanctionedDate: "",
        projectPeriod: "",
        amount: "",
        principalInvestigator: "",
        coPrincipalInvestigator: "",
        status: "",
      },
    ],
    Patent: [
      {
        employee_id: employeeId,
        areaOfResearch: "",
        grantedYear: "",
        patentNo: "",
        patentStatus: "",
        authors: "",
      },
    ],
    BookPublication: [
      {
        employee_id: employeeId,
        publicationType: "",
        name: "",
        volume: "",
        pageNumber: "",
        issn: "",
        publisher: "",
        title: "",
        area: "",
        impactFactor: "",
        yearOfPublish: "",
        authors: "",
      },
    ],
     EventAttended: [
      {
        employee_id: employeeId,
        fromDate: "",
        toDate: "",
        organizer: "",
        venue: "",
        sponsor: "",
        targetAudience: "",
        nameofevent: "",
        typeofevent: "",
        otherType: "",
      },
    ],
    EventOrganized: [
      {
        employee_id: employeeId,
        typeofevent: "",
        nameofevent: "",
        fromDate: "",
        toDate: "",
        organizer: "",
        venue: "",
        sponsor: "",
        targetAudience: "",
        otherType: "",
      },
    ],
    ProfessionalMembers: [
      {
        employee_id: employeeId,
        professionalBody: "",
        membershipId: "",
        membershipSince: "",
        membershipType: "",
        otherType: "",
      },
    ],
  };
 const STD_EVENTS   = ["Conference", "Workshop", "Seminar"];
  const STD_MEMBERS  = ["Life", "Annual", "Student", "Institutional", "Permanent"];
  const STD_Mooc   = ["NPTEL", "NITTTR", "ARPIT"];
  const STD_Duration = ["4 weeks", "8 weeks", "12 weeks"];
  const normaliseEvent = (e: any) => {
    if (!STD_EVENTS.includes(e.typeofevent)) {
      return { ...e, otherType: e.typeofevent, typeofevent: "Other" };
    }
    return { ...e, otherType: e.otherType ?? "" };
  };
function removeResearchSupervisor(
  rowIndex: number,
  supIndex: number,
  rows: any[],
  setRows: React.Dispatch<React.SetStateAction<any[]>>
) {
  const copy = [...rows];
  const list = copy[rowIndex].Research_Scholar_Name
    ? copy[rowIndex].Research_Scholar_Name.split(/\s*,\s*/)
    : [];
  list.splice(supIndex, 1);
  copy[rowIndex].Research_Scholar_Name = list.join(", ");
  setRows(copy);
}

function appendResearchSupervisor(
  rowIndex: number,
  rows: any[],
  setRows: React.Dispatch<React.SetStateAction<any[]>>
) {
  const copy = [...rows];
  const list = copy[rowIndex].Research_Scholar_Name
    ? copy[rowIndex].Research_Scholar_Name.split(/\s*,\s*/)
    : [];
  list.push("");
  copy[rowIndex].Research_Scholar_Name = list.join(", ");
  setRows(copy);
}



  const normaliseMember = (m: any) => {
    if (!STD_MEMBERS.includes(m.membershipType)) {
      return { ...m, otherType: m.membershipType, membershipType: "Other" };
    }
    return { ...m, otherType: m.otherType ?? "" };
  };
  const normaliseMooc = (m: any) => {
    if (!STD_Mooc.includes(m.typeofMooc)) {
      return { ...m, otherMoocType: m.typeofMooc, typeofMooc: "Others" };
    }
    return { ...m, otherMoocType: m.otherMoocType ?? "" };
  }
  const normaliseDuration = (d: any) => {
    if (!STD_Duration.includes(d.duration)) {
      return { ...d, otherDuration: d.duration, duration: "Others" };
    }
    return { ...d, otherDuration: d.otherDuration ?? "" };
  };
useEffect(() => {
  if (!employeeId) return;

  setLoading(true);

  fetch(`/api/fac_update_research?employee_id=${employeeId}`)
    .then(res => res.json())
    .then(res => {
      if (!res.data) {
        setError(res.message || "Failed to fetch data");
        return;
      }

      const stdEvent   = ["Conference", "Workshop", "Seminar"];
      const stdMember  = ["Life", "Annual", "Student", "Institutional"];
      const stdMooc    = ["NPTEL", "NITTTR", "ARPIT"];
      const stdDuration = ["4 weeks", "8 weeks", "12 weeks"];
      const cleanEvents = (events?: any[]) =>
        (events ?? []).map(e =>
          stdEvent.includes(e.typeofevent)
            ? e
            : { ...e, typeofevent: "Other", otherType: e.typeofevent }
        );

      const cleanMembers = (m?: any[]) =>
        (m ?? []).map(mem =>
          stdMember.includes(mem.membershipType)
            ? mem
            : { ...mem, membershipType: "Other", otherType: mem.membershipType }
        );
      const cleanMooc = (mooc?: any[]) =>
        (mooc ?? []).map(m =>
          stdMooc.includes(m.typeofMooc)
            ? m
            : { ...m, typeofMooc: "Other", otherMoocType: m.typeofMooc }
        );
      const cleanDuration = (duration?: any[]) =>
        (duration ?? []).map(d =>
          stdDuration.includes(d.duration)
            ? d
            : { ...d, duration: "Other", otherDuration: d.duration }
        );
        
      const transformed = {
        ...res.data,
        EventAttended:      cleanEvents(res.data.EventAttended),
        EventOrganized:     cleanEvents(res.data.EventOrganized),
        ProfessionalMembers: cleanMembers(res.data.ProfessionalMembers),
        EmployeeMooc:      cleanMooc(res.data.EmployeeMooc),
        EmployeeMocc:      cleanDuration(res.data.EmployeeMooc),
        
      };

      setData(transformed);
    })
    .catch(() => setError("Failed to fetch data"))
    .finally(() => setLoading(false));
}, [employeeId]);
  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
const normalizeAuthors = (pub: any) => {
  let raw = pub.authors;

  // 1) If it's already an array, great
  if (Array.isArray(raw)) {
    return { ...pub, authors: raw.join(',') };
  }

  // 2) If it's a string that looks like JSON, try to parse
  if (typeof raw === 'string') {
    const str = raw.trim();
    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          return { ...pub, authors: parsed.join(',') };
        }
      } catch {
        // fall through to next step
      }
    }
    // 3) Otherwise treat it as comma-separated
    return { ...pub, authors: str.split(',').map(s => s.trim()).filter(Boolean).join(',') };
  }

  // 4) Fallback to empty
  return { ...pub, authors: '' };
};
const normalizeSupervisors = (entry: any) => {
  let raw = entry.Research_Scholar_Name;

  // 1) If it's already an array
  if (Array.isArray(raw)) {
    return {
      ...entry,
      Research_Scholar_Name: raw.join(', ')
    };
  }

  // 2) If it's a JSON-string array
  if (typeof raw === 'string') {
    const str = raw.trim();

    // JSON array?
    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          return {
            ...entry,
            Research_Scholar_Name: parsed.join(', ')
          };
        }
      } catch {
        // not valid JSON, fall back
      }
    }

    // otherwise treat as comma-separated
    return {
      ...entry,
      Research_Scholar_Name: str
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .join(', ')
    };
  }

  // 3) Anything else → empty
  return {
    ...entry,
    Research_Scholar_Name: ''
  };
};

    fetch(`/api/fac_update_research?employee_id=${employeeId}`)
      .then(r => r.json())
      .then(r => {
        if (!r.data) {
          setError(r.message || "Failed to fetch data");
          return;
        }
        setData({
          ...r.data,
          EventAttended:       (r.data.EventAttended       ?? []).map(normaliseEvent),
          EventOrganized:      (r.data.EventOrganized      ?? []).map(normaliseEvent),
          ProfessionalMembers: (r.data.ProfessionalMembers ?? []).map(normaliseMember),
          EmployeeMooc:       (r.data.EmployeeMooc       ?? []).map(normaliseMooc).map(normaliseDuration),
          ConferenceAndJournal: (r.data.ConferenceAndJournal ?? []).map(normalizeAuthors),
           BookPublication:    (r.data.BookPublication    ?? []).map(normalizeAuthors),
          Patent:           (r.data.Patent            ?? []).map(normalizeAuthors),
          ResearchSupervision: (r.data.ResearchSupervision ?? []).map(normalizeSupervisors),
         });
      })
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false));
  }, [employeeId]);


 const handleChange = (table: string, index: number, field: string, value: any) => {
    setData((prev: any) => {
      const rows = prev[table] || [];
      return {
        ...prev,
        [table]: rows.map((r: any, i: number) => (i === index ? { ...r, [field]: value } : r)),
      };
    });
  };

  const addNewRow = (table: string, custom?: any) => {
    const base = (defaultSchemas as any)[table]?.[0];
    if (!base && !custom) {
      alert(`No default schema for ${table}`);
      return;
    }
    setData((prev: any) => ({
      ...prev,
      [table]: [...(prev[table] || []), { ...(custom ?? base) }],
    }));
    setDelta(d => -d);
  };


 const handleDelete = (table: string, index: number, id?: number | null) => {
    if (id) {
      fetch("/api/fac_update_research", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, table }),
      }).catch(() => alert("Failed to delete from DB"));
    }
    setData((prev: any) => ({ ...prev, [table]: prev[table].filter((_: any, i: number) => i !== index) }));
    setDelta(d => -d);
  };
const renderFacultyResearchDetailsSection = (rows: any[]) => {
    // Initialize a default row if empty
    if (!rows || rows.length === 0) {
      setData((prev: any) => ({
        ...prev,
        FacultyResearchDetails: [
          {
            employee_id: employeeId,
            googleScholarId: "",
            orcidId: "",
            scopusId: "",
            publonsId: "",
            researchId: "",
          },
        ],
      }));
    }

    // Use the first row (or default to empty values if state hasn't updated yet)
    const row = rows[0] || {
      googleScholarId: "",
      orcidId: "",
      scopusId: "",
      publonsId: "",
      researchId: "",
    };
    return (
      <motion.div
        initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Faculty Research Details
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            label="Google Scholar ID"
            value={row.googleScholarId || ""}
            onChange={(e) =>
              handleChange("FacultyResearchDetails", 0, "googleScholarId", e.target.value)
            }
            type="text"
          />
          <FormField
            label="orcidId"
            value={row.orcidId || ""}
            onChange={(e) =>
              handleChange("FacultyResearchDetails", 0, "orcidId", e.target.value)
            }
            type="text"
          />
          <FormField
            label="Scopus ID"
            value={row.scopusId || ""}
            onChange={(e) =>
              handleChange("FacultyResearchDetails", 0, "scopusId", e.target.value)
            }
            type="text"
          />
          <FormField
            label="Publons and Web of Science ID"
            value={row.publonsId || ""}
            onChange={(e) =>
              handleChange(
                "FacultyResearchDetails",
                0,
                "publonsId",
                e.target.value
              )
            }
            type="text"
          />
          <FormField
            label="Research ID"
            value={row.researchId || ""}
            onChange={(e) =>
              handleChange("FacultyResearchDetails", 0, "researchId", e.target.value)
            }
            type="text"
          />
        </div>
      </motion.div>
    );
  };
const renderConferenceJournalSection = (rows: any[]) => {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-6 mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Conference & Journal Publications
      </h2>
      
      {rows.map((row, index) => (
        <div 
          key={row.id || index} 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
        >
          {/* Row Number */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {index + 1}.
              </h3>
            </div>
          {/* Publication Type */}
          <FormField
            label="Type of Publication"
            value={row.typeOfPublication}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "typeOfPublication", e.target.value)}
            type="select"
            options={[
              { value: "", label: "Select Type" },
              { value: "NC", label: "National Conference" },
              { value: "IC", label: "International Conference" },
              { value: "NJ", label: "National Journal" },
              { value: "IJ", label: "International Journal" }
            ]}
          />

          <FormField
            label="Title"
            value={row.title}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "title", e.target.value)}
            type="text"
          />

          <FormField
            label="Journal/Conference Name"
            value={row.joConName}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "joConName", e.target.value)}
            type="text"
          />

          <FormField
            label="Year of Publication"
            value={row.yearOfPublication}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "yearOfPublication", e.target.value)}
            type="number"
          />

          <FormField
            label="DOI"
            value={row.doi}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "doi", e.target.value)}
            type="text"
          />

          <FormField
            label="ISSN"
            value={row.issn}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "issn", e.target.value)}
            type="text"
          />

          <FormField
            label="Volume"
            value={row.volume}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "volume", e.target.value)}
            type="number"
          />

          <FormField
            label="Issue No"
            value={row.issueNo}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "issueNo", e.target.value)}
            type="text"
          />

          <FormField
            label="Page Numbers"
            value={row.pageNo}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "pageNo", e.target.value)}
            type="text"
          />

          {/* Published Under */}
          <FormField
            label="Published Under"
            value={row.publishedUnder}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "publishedUnder", e.target.value)}
            type="select"
            options={[
              { value: "", label: "Select Category" },
              { value: "Web of Science", label: "Web of Science" },
              { value: "Scopus", label: "Scopus" },
              { value: "UGC Care List", label: "UGC Care List" },
              { value: "Peer Reviewed", label: "Peer Reviewed" },
              {value: "SCI", label: "SCI" },
              { value: "Others", label: "Others" },
              { value: "Not Applicable", label: "Not Applicable" }
            ]}
          />

          <FormField
            label="Impact Factor"
            value={row.impactFactor}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "impactFactor", e.target.value)}
            type="number"
          />

          <FormField
            label="Quartile"
            value={row.quartile}
            onChange={(e) => handleChange("ConferenceAndJournal", index, "quartile", e.target.value)}
            type="select"
            options={[
              { value: "", label: "Select Quartile" },
              { value: "Q1", label: "Q1" },
              { value: "Q2", label: "Q2" },
              { value: "Q3", label: "Q3" },
              { value: "Q4", label: "Q4" }
            ]}
          />

          {/* Authors Section */}
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Authors</h3>
            {row.authors?.split(',').filter(Boolean).map((author: string, authorIndex: number) => (
              <div key={authorIndex} className="flex items-center gap-3 mb-2">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => {
                    const newAuthors = [...row.authors.split(',').filter(Boolean)];
                    newAuthors[authorIndex] = e.target.value;
                    handleChange("ConferenceAndJournal", index, "authors", newAuthors.join(','));
                  }}
                  className="flex-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Author ${authorIndex + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newAuthors = [...row.authors.split(',').filter(Boolean)];
                    newAuthors.splice(authorIndex, 1);
                    handleChange("ConferenceAndJournal", index, "authors", newAuthors.join(','));
                  }}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const currentAuthors = row.authors ? row.authors.split(',').filter(Boolean) : [];
                handleChange("ConferenceAndJournal", index, "authors", [...currentAuthors, "New Author"].join(','));
              }}
              className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
            >
              + Add Author
            </button>
          </div>

          {/* Remove Button */}
          <div className="col-span-2 flex justify-end pt-4">
            <button
              type="button"
              onClick={() => handleDelete("ConferenceAndJournal", index, row.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Remove Publication
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => addNewRow("ConferenceAndJournal")}
        className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-dashed border-blue-200"
      >
        + Add New Publication
      </button>
    </motion.div>
  );
};

  const renderMoocSection = (rows: any[]) => {
    return (
      <motion.div
        initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="space-y-6 mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">MOOC Courses</h2>
        
        {rows.map((row, index) => (
          <div 
            key={row.id || index} 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
          >
            {/* MOOC Course Title */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {index + 1}.
              </h3>

              <FormField
                label="MOOC Course Title"
                value={row.title}
                onChange={(e) => handleChange("EmployeeMooc", index, "title", e.target.value)}
                type="text"
              />
            </div>

            {/* Type of MOOC */}
            <div>
              <FormField
                label="Type of MOOC"
                value={row.typeofMooc}
                onChange={(e) => {
                  handleChange("EmployeeMooc", index, "typeofMooc", e.target.value);
                  if (e.target.value !== "Others") {
                    handleChange("EmployeeMooc", index, "otherMoocType", "");
                  }
                }}
                type="select"
                options={[
                  { value: "", label: "Select Type" },
                  { value: "NPTEL", label: "NPTEL" },
                  { value: "NITTTR", label: "NITTTR" },
                  { value: "ARPIT", label: "ARPIT" },
                  { value: "Others", label: "Other Platform" }
                ]}
              />
              {row.typeofMooc === "Others" && (
                <div className="mt-2">
                  <FormField
                    label="Specify Platform Name"
                    value={row.otherMoocType}
                    onChange={(e) => handleChange("EmployeeMooc", index, "otherMoocType", e.target.value)}
                    type="text"
                    placeholder="e.g., Coursera"
                  />
                </div>
              )}
            </div>

            {/* Duration */}
            <div>
              <FormField
                label="Duration"
                value={row.duration}
                onChange={(e) => {
                  handleChange("EmployeeMooc", index, "duration", e.target.value);
                  if (e.target.value !== "Others") {
                    handleChange("EmployeeMooc", index, "otherDuration", "");
                  }
                }}
                type="select"
                options={[
                  { value: "", label: "Select Duration" },
                  { value: "4 weeks", label: "4 weeks" },
                  { value: "8 weeks", label: "8 weeks" },
                  { value: "12 weeks", label: "12 weeks" },
                  { value: "Others", label: "Custom Duration" }
                ]}
              />
              {row.duration === "Others" && (
                <div className="mt-2">
                  <FormField
                    label="Specify Duration"
                    value={row.otherDuration}
                    onChange={(e) => handleChange("EmployeeMooc", index, "otherDuration", e.target.value)}
                    type="text"
                    placeholder="e.g., 6 weeks"
                  />
                </div>
              )}
            </div>

            {/* Result (Percentage)
            <div>
              <FormField
                label="Result (Percentage, 0-100)"
                value={row.result}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
                    handleChange("EmployeeMooc", index, "result", value);
                  }
                }}
                type="number"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div> */}

            {/* FDP */}
            <div>
              <FormField
                label="Faculty Development Program (FDP)"
                value={row.FDP}
                onChange={(e) => handleChange("EmployeeMooc", index, "FDP", e.target.value)}
                type="select"
                options={[
                  { value: "No", label: "No" },
                  { value: "Yes", label: "Yes" }
                ]}
              />
            </div>

            {/* Grade */}
            <div>
              <FormField
                label="Grade/Score"
                value={row.grade}
                onChange={(e) => handleChange("EmployeeMooc", index, "grade", e.target.value)}
                type="select"
                options={[
                  { value: "", label: "Select Grade" },
                  ...(row.typeofMooc === "NPTEL" ? [
                    { value: "Elite", label: "Elite" },
                    { value: "Silver", label: "Silver" },
                    { value: "Gold", label: "Gold" }
                  ] : [
                    { value: "Pass", label: "Pass" },
                    { value: "Elite", label: "Elite" },
                    { value: "Silver", label: "Silver" },
                    { value: "Gold", label: "Gold" }
                  ]),
                  { value: "Other", label: "Other" }
                ]}
              />
            </div>

            {/* Delete button */}
            <div className="col-span-2 flex justify-end pt-4">
              <button
                type="button"
                onClick={() => handleDelete("EmployeeMooc", index, row.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
              >
                Remove Course
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addNewRow("EmployeeMooc")}
          className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-dashed border-blue-200"
        >
          + Add New MOOC Course
        </button>
      </motion.div>
    );
  };
   const renderResearchProjectsSection = (rows: any[]) => {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-6 mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Research Projects</h2>

      {rows.map((row, index) => (
        <div
          key={row.id || index}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
        >
          {/* Project Title */}
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
                {index + 1}.
              </h3>
            <FormField
              label="Project Title"
              value={row.projectTitle}
              onChange={(e) => handleChange("ResearchProjects", index, "projectTitle", e.target.value)}
              type="text"
            />
          </div>

          {/* Principal Investigator */}
          <div>
            <FormField
              label="Principal Investigator"
              value={row.pi}
              onChange={(e) => handleChange("ResearchProjects", index, "pi", e.target.value)}
              type="text"
            />
          </div>

          {/* Co-Principal Investigator */}
          <div>
            <FormField
              label="Co-Principal Investigator"
              value={row.coPi}
              onChange={(e) => handleChange("ResearchProjects", index, "coPi", e.target.value)}
              type="text"
            />
          </div>

          {/* Date of Sanction */}
          <div>
            <FormField
              label="Date of Sanction"
              value={row.dOfSanction}
              onChange={(e) => handleChange("ResearchProjects", index, "dOfSanction", e.target.value)}
              type="date"
            />
          </div>

          {/* Duration */}
          <div>
            <FormField
              label="Duration (in months)"
              value={row.duration}
              onChange={(e) => handleChange("ResearchProjects", index, "duration", e.target.value)}
              type="number"
              placeholder="e.g., 12"
            />
          </div>

          {/* Funding Agency */}
          <div>
            <FormField
              label="Funding Agency"
              value={row.fundingAgency}
              onChange={(e) => handleChange("ResearchProjects", index, "fundingAgency", e.target.value)}
              type="text"
            />
          </div>

          {/* Amount */}
          <div>
            <FormField
              label="Amount (in INR)"
              value={row.amount}
              onChange={(e) => handleChange("ResearchProjects", index, "amount", e.target.value)}
              type="number"
              placeholder="e.g., 100000"
            />
          </div>

          {/* Status */}
          <div>
            <FormField
              label="Status of Project"
              value={row.status}
              onChange={(e) => handleChange("ResearchProjects", index, "status", e.target.value)}
              type="select"
              options={[
                { value: "Ongoing", label: "Ongoing" },
                { value: "Completed", label: "Completed" },
                {value: "Others", label: "Others" },
              ]}
            />
          </div>

          {/* Delete Button */}
          <div className="col-span-2 flex justify-end pt-4">
            <button
              type="button"
              onClick={() => handleDelete("ResearchProjects", index, row.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Remove Project
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          addNewRow("ResearchProjects", {
            projectTitle: "",
            pi: "",
            coPi: "",
            dOfSanction: "",
            duration: "",
            fundingAgency: "",
            amount: "",
            status: "Ongoing",
          })
        }
        className="mt-4 w-full px-4 py.table2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-dashed border-blue-200"
      >
        + Add New Research Project
      </button>
    </motion.div>
  );
};
const renderResearchExperienceSection = (rows: any[]) => {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-6 mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Research Experience Details</h2>

      {rows.map((row, index) => (
        <div
          key={row.id || index}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
        >
          {/* Area of Research */}
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
                {index + 1}.
              </h3>
            <FormField
              label="Area of Research"
              value={row.areaofresearch}
              onChange={(e) => handleChange("ResearchExperience", index, "areaofresearch", e.target.value)}
              type="text"
            />
          </div>

          {/* From Date */}
          <div>
            <FormField
              label="From Date"
              value={formatDateForInput(row.from_date)}
              onChange={(e) => handleChange("ResearchExperience", index, "from_date", e.target.value)}
              type="date"
            />
          </div>

          {/* To Date */}
          <div>
            <FormField
              label="To Date"
              value={formatDateForInput(row.to_date)}
              onChange={(e) => handleChange("ResearchExperience", index, "to_date", e.target.value)}
              type="date"
            />
          </div>

          {/* Delete Button */}
          <div className="col-span-2 flex justify-end pt-4">
            <button
              type="button"
              onClick={() => handleDelete("ResearchExperience", index, row.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Remove Research Experience
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          addNewRow("ResearchExperience", {
            areaofresearch: "",
            from_date: "", // Empty string for date input
            to_date: "", // Empty string for date input
          })
        }
        className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-dashed border-blue-200"
      >
        + Add New Research Experience
      </button>
    </motion.div>
  );
};
const renderResearchSupervisionSection = (rows: any[]) => (
  <motion.div
    initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="space-y-6 mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
  >
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
      Research Supervised Details
    </h2>

    {rows.map((row, idx) => {
      const supervisors = row.Research_Scholar_Name
  ? row.Research_Scholar_Name.split(/\s*,\s*/)
  : [""];
      return (
        <div
          key={row.id ?? idx}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b pb-6 last:border-0"
        >
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {idx + 1}.
            </h3>
          </div>

          {/* Dynamic Supervisors list */}
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Research Scholar Name
            </h3>
            {supervisors.map((sup: string, supIdx: number) => (
              <div
                key={supIdx}
                className="flex items-center space-x-4 mb-2"
              >
                <input
                type="text"
                placeholder={`Supervisor ${supIdx + 1}`}
                value={sup}
                onChange={(e) => {
                const parts = row.Research_Scholar_Name
                  ? row.Research_Scholar_Name.split(/\s*,\s*/)
                  : [];
                parts[supIdx] = e.target.value;
                handleChange(
                  "ResearchSupervision",
                  idx,
                  "Research_Scholar_Name",
                  parts.join(", ")
                );
              }}
                  className="flex-1 p-2 border rounded-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() =>
                    removeResearchSupervisor(
                      idx,
                      supIdx,
                      data.ResearchSupervision,
                      setData.bind(null, (prev: any) => ({
                        ...prev,
                        ResearchSupervision: data.ResearchSupervision
                      }))
                    )
                  }
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendResearchSupervisor(
                  idx,
                  data.ResearchSupervision,
                  setData.bind(null, (prev: any) => ({
                    ...prev,
                    ResearchSupervision: data.ResearchSupervision
                  }))
                )
              }
              className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            >
              + Add Supervisor
            </button>
          </div>

          {/* The rest of your fields */}
          <FormField
            label="Research Supervisor Name"
            value={row.Research_Supervisor}
            onChange={(e) =>
              handleChange(
                "ResearchSupervision",
                idx,
                "Research_Supervisor",
                e.target.value
              )
            }
            type="text"
          />
          <FormField
            label="USN"
            value={row.USN}
            onChange={(e) =>
              handleChange("ResearchSupervision", idx, "USN", e.target.value)
            }
            type="text"
          />
          <FormField
            label="University"
            value={row.University}
            onChange={(e) =>
              handleChange(
                "ResearchSupervision",
                idx,
                "University",
                e.target.value
              )
            }
            type="text"
          />
          <FormField
            label="Institute"
            value={row.Institute}
            onChange={(e) =>
              handleChange(
                "ResearchSupervision",
                idx,
                "Institute",
                e.target.value
              )
            }
            type="text"
          />
          <FormField
            label="Discipline"
            value={row.Discipline}
            onChange={(e) =>
              handleChange("ResearchSupervision", idx, "Discipline", e.target.value)
            }
            type="text"
          />
          <FormField
            label="Title of Research"
            value={row.Title_Research}
            onChange={(e) =>
              handleChange(
                "ResearchSupervision",
                idx,
                "Title_Research",
                e.target.value
              )
            }
            type="text"
          />

          <div>
            <FormField
              label="Status"
              value={row.Status}
              onChange={(e) =>
                handleChange("ResearchSupervision", idx, "Status", e.target.value)
              }
              type="select"
              options={[
                { value: "", label: "Select Status" },
                { value: "Ongoing", label: "Ongoing" },
                { value: "Complete", label: "Complete" },
              ]}
            />
          </div>

          <div className="col-span-2 flex justify-end pt-4">
            <button
              type="button"
              onClick={() => handleDelete("ResearchSupervision", idx, row.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Remove Supervision
            </button>
          </div>
        </div>
      );
    })}

    <button
      type="button"
      onClick={() =>
        addNewRow("ResearchSupervision", {
          Research_Scholar_Name: "",
          Research_Supervisor: "",
          USN: "",
          University: "",
          Institute: "",
          Discipline: "",
          Title_Research: "",
          Status: "",
        })
      }
      className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-dashed border-blue-200"
    >
      + Add New Research Supervision
    </button>
  </motion.div>
);

const renderConsultancySection = (rows: any[]) => {
  // Debug: Inspect rows data (uncomment to use)
   console.log("Consultancy rows:", rows);

  // Format date to YYYY-MM-DD for <input type="date">
  const formatDateForInput = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return ""; // Invalid date
      return d.toISOString().split("T")[0]; // Returns YYYY-MM-DD
    } catch (e) {
      console.warn("Invalid date format for sanctionedDate:", date);
      return "";
    }
  };

  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-6 mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Consultancy Details</h2>

      {rows.map((row, index) => (
        <div
          key={row.id || index}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
        >
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
                {index + 1}.
              </h3>
            <FormField
              label="Title"
              value={row.title || ""}
              onChange={(e) => handleChange("Consultancy", index, "title", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Sanctioned Date"
              value={formatDateForInput(row.sanctionedDate)}
              onChange={(e) => handleChange("Consultancy", index, "sanctionedDate", e.target.value)}
              type="date"
            />
          </div>
          <div>
            <FormField
              label="Project Period (in months)"
              value={row.projectPeriod || ""}
              onChange={(e) => handleChange("Consultancy", index, "projectPeriod", e.target.value)}
              type="number"
            />
          </div>
          <div>
            <FormField
              label="Amount (in INR)"
              value={row.amount || ""}
              onChange={(e) => handleChange("Consultancy", index, "amount", e.target.value)}
              type="number"
            />
          </div>

          <div>
            <FormField
              label="Principal Investigator"
              value={row.principalInvestigator || ""}
              onChange={(e) => handleChange("Consultancy", index, "principalInvestigator", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Co-Principal Investigator"
              value={row.coPrincipalInvestigator || ""}
              onChange={(e) => handleChange("Consultancy", index, "coPrincipalInvestigator", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Status of Project"
              value={row.status || ""}
              onChange={(e) => handleChange("Consultancy", index, "status", e.target.value)}
              type="select"
              options={[
                { value: "", label: "Select Status" },
                { value: "Ongoing", label: "Ongoing" },
                { value: "Completed", label: "Completed" },
              ]}
            />
          </div>

          <div className="col-span-2 flex justify-end pt-4">
            <button
              type="button"
              onClick={() => handleDelete("Consultancy", index, row.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Remove Consultancy
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          addNewRow("Consultancy", {
            faculty_name: "",
            title: "",
            sanctionedDate: "",
            projectPeriod: "",
            amount: "",
            principalInvestigator: "",
            coPrincipalInvestigator: "",
            status: "",
          })
        }
        className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-dashed border-blue-200"
      >
        + Add New Consultancy
      </button>
    </motion.div>
  );
};
const renderPatentsSection = (rows: any[]) => {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-6 mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Patents</h2>

      {rows.map((row, index) => (
        <div
          key={row.id || index}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
        >
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
                {index + 1}.
              </h3>
            <FormField
              label="Area Of Research"
              value={row.areaOfResearch || ""}
              onChange={(e) => handleChange("Patent", index, "areaOfResearch", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Granted Year"
              value={row.grantedYear || ""}
              onChange={(e) => handleChange("Patent", index, "grantedYear", e.target.value)}
              type="number"
            />
          </div>

          <div>
            <FormField
              label="Patent Number"
              value={row.patentNo || ""}
              onChange={(e) => handleChange("Patent", index, "patentNo", e.target.value)}
              type="text"
            />
          </div>

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Authors</h3>
           {(row.authors?.split(',') || ['']).map((authors, authorIndex) => (
              <div key={authorIndex} className="flex items-center space-x-4 mb-2">
                <input
                  type="text"
                  placeholder={`Author ${authorIndex + 1}`}
                  value={authors.trim()}
                  onChange={(e) => {
                    const newAuthors = row.authors ? row.authors.split(',') : [];
                    newAuthors[authorIndex] = e.target.value;
                    handleChange("Patent", index, "authors", newAuthors.join(','));
                  }}
                  className="flex-1 p-2 border rounded-md bg-gray-50 border-gray-300 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newAuthors = (row.authors ? row.authors.split(',') : []).filter(
                      (_, ai) => ai !== authorIndex
                    );
                    handleChange("Patent", index, "authors", newAuthors.join(','));
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const currentAuthors = row.authors ? row.authors.split(',') : [];
                handleChange("Patent", index, "authors", [...currentAuthors, ""].join(','));
              }}
              className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            >
              + Add Author
            </button>
          </div>

          <div>
            <FormField
              label="Status of Project"
              value={row.patentStatus || ""}
              onChange={(e) => handleChange("Patent", index, "patentStatus", e.target.value)}
              type="select"
              options={[
                { value: "", label: "Select Status" },
                { value: "Pending", label: "Pending" },
                { value: "Expired", label: "Expired" },
                { value: "Granted", label: "Granted" },
                { value: "Filed", label: "Filed" },
                { value: "Published", label: "Published" },
                { value: "Provisional", label: "Provisional" },
                { value: "Non-Provisional", label: "Non-Provisional" },
                { value: "Utility", label: "Utility" },
                { value: "Design", label: "Design" },
                { value: "Plant", label: "Plant" },
                { value: "Reissue", label: "Reissue" },
                { value: "Divisional", label: "Divisional" },
                { value: "Continuation", label: "Continuation" },
                { value: "Continuation-in-Part", label: "Continuation-in-Part" },
                { value: "Supplemental", label: "Supplemental" },
                { value: "Reexamination", label: "Reexamination" },
                { value: "Certificate of Correction", label: "Certificate of Correction" },
                { value: "Other", label: "Other" }
              ]}
            />
          </div>

          <div className="col-span-2 flex justify-end pt-4">
            <button
              type="button"
              onClick={() => handleDelete("Patent", index, row.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Remove Patent
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          addNewRow("Patent", {
            areaOfResearch: "",
            grantedYear: "",
            patentNo: "",
            patentStatus: "",
            authors: "",  // Initialize as empty string
          })
        }
        className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-dashed border-blue-200"
      >
        + Add New Patent
      </button>
    </motion.div>
  );
};
const renderBookPublicationsSection = (rows: any[]) => {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-6 mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Book Publications</h2>

      {rows.map((row, index) => (
        <div
          key={row.id || index}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
                {index + 1}.
              </h3>
            <FormField
              label="Book Publication Type"
              value={row.publicationType || ""}
              onChange={(e) => handleChange("BookPublication", index, "publicationType", e.target.value)}
              type="select"
              options={[
                { value: "", label: "Select Publication Type" },
                { value: "Textbook", label: "Textbook" },
                { value: "Reference", label: "Reference" },
                { value: "Monograph", label: "Monograph" },
                { value: "Edited", label: "Edited" },
                { value: "Chapter", label: "Chapter" },
              ]}
            />
          </div>

          <div>
            <FormField
              label="Name"
              value={row.name || ""}
              onChange={(e) => handleChange("BookPublication", index, "name", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Volume"
              value={row.volume || ""}
              onChange={(e) => handleChange("BookPublication", index, "volume", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Page Number"
              value={row.pageNumber || ""}
              onChange={(e) => handleChange("BookPublication", index, "pageNumber", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="ISSN"
              value={row.issn || ""}
              onChange={(e) => handleChange("BookPublication", index, "issn", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Publisher"
              value={row.publisher || ""}
              onChange={(e) => handleChange("BookPublication", index, "publisher", e.target.value)}
              type="text"
            />
          </div>

          <div className="col-span-2">
            <FormField
              label="Title"
              value={row.title || ""}
              onChange={(e) => handleChange("BookPublication", index, "title", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Area Covered"
              value={row.area || ""}
              onChange={(e) => handleChange("BookPublication", index, "area", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Impact Factor"
              value={row.impactFactor || ""}
              onChange={(e) => handleChange("BookPublication", index, "impactFactor", e.target.value)}
              type="number"
            />
          </div>

          <div>
            <FormField
              label="Year Of Publish"
              value={row.yearOfPublish || ""}
              onChange={(e) => handleChange("BookPublication", index, "yearOfPublish", e.target.value)}
              type="number"
            />
          </div>

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Authors</h3>
           {(row.authors?.split(',') || ['']).map((author, authorIndex) => (
              <div key={authorIndex} className="flex items-center space-x-4 mb-2">
                <input
                  type="text"
                  placeholder={`Author ${authorIndex + 1}`}
                  value={author.trim()}
                  onChange={(e) => {
                    const newAuthors = row.authors ? row.authors.split(',') : [];
                    newAuthors[authorIndex] = e.target.value;
                    handleChange("BookPublication", index, "authors", newAuthors.join(','));
                  }}
                  className="flex-1 p-2 border rounded-md bg-gray-50 border-gray-300 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newAuthors = (row.authors ? row.authors.split(',') : []).filter(
                      (_, ai) => ai !== authorIndex
                    );
                    handleChange("BookPublication", index, "authors", newAuthors.join(','));
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const currentAuthors = row.authors ? row.authors.split(',') : [];
                handleChange("BookPublication", index, "authors", [...currentAuthors, ""].join(','));
              }}
              className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            >
              + Add Author
            </button>
          </div>

          <div className="col-span-2 flex justify-end pt-4">
            <button
              type="button"
              onClick={() => handleDelete("BookPublication", index, row.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Remove Publication
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          addNewRow("BookPublication", {
            publicationType: "",
            name: "",
            volume: "",
            pageNumber: "",
            issn: "",
            publisher: "",
            title: "",
            area: "",
            impactFactor: "",
            yearOfPublish: "",
            authors: "",  // Initialize as empty string
          })
        }
        className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-dashed border-blue-200"
      >
        + Add New Publication
      </button>
    </motion.div>
  );
};
   const EventTypeOptions = [
    { value: "", label: "Select…" },
    { value: "Conference", label: "Conference" },
    { value: "Workshop",   label: "Workshop"   },
    { value: "Seminar",    label: "Seminar"    },
    { value: "Other",     label: "Other"     },
  ];
const renderEventAttendedSection = (rows: any[]) => (
  <motion.div
    initial={{ x: delta > 0 ? "50%" : "-50%", opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-6 mb-6 border p-6 bg-white rounded shadow"
  >
    <h2 className="text-2xl font-semibold">Events Attended</h2>
    {rows.map((row, i) => (
      <div
        key={row.id || i}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b pb-6 last:border-0 last:pb-0"
      >
        <div className="col-span-2">
          <h3 className="font-medium">#{i + 1}</h3>
        </div>

        <FormField label="Type of Event" type="select" options={EventTypeOptions} value={row.typeofevent} onChange={e => handleChange("EventAttended", i, "typeofevent", e.target.value)} />
          {row.typeofevent === "Other" && (
            <FormField label="Please specify" value={row.otherType} onChange={e => handleChange("EventAttended", i, "otherType", e.target.value)} className="col-span-2" />
          )}

        <FormField
          label="Title"
          type="text"
          value={row.nameofevent}
          onChange={e =>
            handleChange("EventAttended", i, "nameofevent", e.target.value)
          }
        />
        <FormField
          label="From"
          type="date"
          value={formatDateForInput(row.fromDate)}
          onChange={e =>
            handleChange("EventAttended", i, "fromDate", e.target.value)
          }
        />
        <FormField
          label="To"
          type="date"
          value={formatDateForInput(row.toDate)}
          onChange={e =>
            handleChange("EventAttended", i, "toDate", e.target.value)
          }
        />
        <FormField
          label="Organizer"
          type="text"
          value={row.organizer}
          onChange={e =>
            handleChange("EventAttended", i, "organizer", e.target.value)
          }
        />
        <FormField
          label="Venue"
          type="text"
          value={row.venue}
          onChange={e =>
            handleChange("EventAttended", i, "venue", e.target.value)
          }
        />
        <FormField
          label="Sponsor"
          type="text"
          value={row.sponsor}
          onChange={e =>
            handleChange("EventAttended", i, "sponsor", e.target.value)
          }
        />
        <FormField
          label="Audience"
          type="text"
          value={row.targetAudience}
          onChange={e =>
            handleChange("EventAttended", i, "targetAudience", e.target.value)
          }
        />

        <div className="col-span-2 text-right">
          <button
            onClick={() => handleDelete("EventAttended", i, row.id)}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    ))}
    <button
      onClick={() => addNewRow("EventAttended")}
      className="w-full py-2 bg-blue-50 text-blue-600 rounded border-dashed border"
    >
      + Add Event Attended
    </button>
  </motion.div>
);

const renderEventOrganizedSection = (rows: any[]) => (
  <motion.div
    initial={{ x: delta > 0 ? "50%" : "-50%", opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-6 mb-6 border p-6 bg-white rounded shadow"
  >
    <h2 className="text-2xl font-semibold">Events Organized</h2>
    {rows.map((row, i) => (
      <div
        key={row.id || i}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b pb-6 last:border-0 last:pb-0"
      >
        <div className="col-span-2">
          <h3 className="font-medium">#{i + 1}</h3>
        </div>

         <FormField label="Type of Event" type="select" options={EventTypeOptions} value={row.typeofevent} onChange={e => handleChange("EventOrganized", i, "typeofevent", e.target.value)} />
          {row.typeofevent === "Other" && (
            <FormField label="Please specify" value={row.otherType} onChange={e => handleChange("EventOrganized", i, "otherType", e.target.value)} className="col-span-2" />
          )}

        <FormField
          label="Title"
          type="text"
          value={row.nameofevent}
          onChange={e =>
            handleChange("EventOrganized", i, "nameofevent", e.target.value)
          }
        />
        <FormField
          label="From"
          type="date"
          value={formatDateForInput(row.fromDate)}
          onChange={e =>
            handleChange("EventOrganized", i, "fromDate", e.target.value)
          }
        />
        <FormField
          label="To"
          type="date"
          value={formatDateForInput(row.toDate)}
          onChange={e =>
            handleChange("EventOrganized", i, "toDate", e.target.value)
          }
        />
        <FormField
          label="Organizer"
          type="text"
          value={row.organizer}
          onChange={e =>
            handleChange("EventOrganized", i, "organizer", e.target.value)
          }
        />
        <FormField
          label="Venue"
          type="text"
          value={row.venue}
          onChange={e =>
            handleChange("EventOrganized", i, "venue", e.target.value)
          }
        />
        <FormField
          label="Sponsor"
          type="text"
          value={row.sponsor}
          onChange={e =>
            handleChange("EventOrganized", i, "sponsor", e.target.value)
          }
        />
        <FormField
          label="Audience"
          type="text"
          value={row.targetAudience}
          onChange={e =>
            handleChange("EventOrganized", i, "targetAudience", e.target.value)
          }
        />

        <div className="col-span-2 text-right">
          <button
            onClick={() => handleDelete("EventOrganized", i, row.id)}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    ))}
    <button
      onClick={() => addNewRow("EventOrganized")}
      className="w-full py-2 bg-blue-50 text-blue-600 rounded border-dashed border"
    >
      + Add Event Organized
    </button>
  </motion.div>
);
  const MembershipTypeOptions = [
    { value: "", label: "Select Membership Type" },
    { value: "Annual", label: "Annual" },
    { value: "Permanent", label: "Permanent" },
    { value: "Other", label: "Other" },
  ];

const renderProfessionalMembersSection = (rows: any[]) => {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-6 mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Professional Memberships and Activities</h2>

      {rows.map((row, index) => (
        <div
          key={row.id || index}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
                {index + 1}.
              </h3>
            <FormField
              label="Professional Body"
              value={row.professionalBody || ""}
              onChange={(e) => handleChange("ProfessionalMembers", index, "professionalBody", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Membership ID"
              value={row.membershipId || ""}
              onChange={(e) => handleChange("ProfessionalMembers", index, "membershipId", e.target.value)}
              type="text"
            />
          </div>

          <div>
            <FormField
              label="Membership Since"
              value={formatDateForInput(row.membershipSince)}
              onChange={(e) => handleChange("ProfessionalMembers", index, "membershipSince", e.target.value)}
              type="date"
            />
          </div>

          {/* <div>
            <FormField
              label="Membership Type"
              value={row.membershipType || ""}
              onChange={(e) => handleChange("ProfessionalMembers", index, "membershipType", e.target.value)}
              type="select"
              options={[
                { value: "", label: "Select Membership Type" },
                { value: "Annual", label: "Annual" },
                { value: "Permanent", label: "Permanent" },
                {value:"Other", label:"Other"}
              ]}
            />
          </div>
              {row.membershipType === "Other" && (
          <FormField
            label="Please specify"
            type="text"
            value={row.otherType}
            onChange={e =>
              handleChange("ProfessionalMembers", index, "otherType", e.target.value)
            }
            className="col-span-2"
          />
        )} */}

          <div>
            <FormField
              label="Membership Type"
              value={row.membershipType || ""}
              onChange={(e) => handleChange("ProfessionalMembers", index, "membershipType", e.target.value)}
              type="select"
              options={MembershipTypeOptions}
            />
          </div>
          {row.membershipType === "Other" && (
            <FormField
              label="Please specify"
              value={row.otherType || ""}
              onChange={(e) => handleChange("ProfessionalMembers", index, "otherType", e.target.value)}
              type="text"
              className="col-span-2"
            />
          )}

          <div className="col-span-2 flex justify-end pt-4">
            <button
              type="button"
              onClick={() => handleDelete("ProfessionalMembers", index, row.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Remove Membership
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => addNewRow("ProfessionalMembers")}
        className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-dashed border-blue-200"
      >
        + Add New Professional Membership
      </button>
    </motion.div>
  );
};
  const handleUpdate = () => {
    fetch(`/api/fac_update_research`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        facultyId: employeeId,
        researchDetails: data.FacultyResearchDetails
          ? data.FacultyResearchDetails[0]
          : null,
        conferenceJournals: data.ConferenceAndJournal || [],
        researchProjects: data.ResearchProjects || [],
        researchSupervision: data.ResearchSupervision || [],
        researchExperience: data.ResearchExperience || [],
        consultancy: data.Consultancy || [],
        patents: data.Patent || [],
        bookPublications: data.BookPublication || [],
       eventsAttended: data.EventAttended || [], 
      eventsOrganized: data.EventOrganized || [], 
      professionalMemberships: data.ProfessionalMembers || [], 
        EmployeeMooc: data.EmployeeMooc || [],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Data updated successfully!");
        } else {
          alert(`Error: ${data.error}`);
        }
      })
      .catch(() => {
        alert("Failed to update data");
      });
      console.log(data)
  };

  const renderTable = (table: string, rows: any[]) => {
    if (table === "FacultyResearchDetails") return renderFacultyResearchDetailsSection(rows);
    if (table === "ConferenceAndJournal") return renderConferenceJournalSection(rows);
    if (table === "EmployeeMooc") return renderMoocSection(rows);
    if (table === "ResearchProjects") return renderResearchProjectsSection(rows);
    if (table === "ResearchExperience") return renderResearchExperienceSection(rows);
    if(table === "ResearchSupervision") return renderResearchSupervisionSection(rows);
    if(table ==="Consultancy") return renderConsultancySection(rows);  
    if (table === "Patent") return renderPatentsSection(rows);
if (table === "BookPublication") return renderBookPublicationsSection(rows);
if (table === "EventAttended") return renderEventAttendedSection(rows);
if (table === "EventOrganized") return renderEventOrganizedSection(rows);
if (table === "ProfessionalMembers") return renderProfessionalMembersSection(rows);         
    const headers = rows.length
      ? Object.keys(rows[0]).filter(
          (key) => key !== "id" && key !== "employee_id"
        )
      : [];

    return (
      <motion.div
        initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {table.replace(/([A-Z])/g, " $1").trim()}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.replace(/([A-Z])/g, " $1").trim()}
                  </th>
                ))}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, index) => (
                <tr key={row.id || index}>
                  {headers.map((header) => (
                    <td key={header} className="px-6 py-4 whitespace-nowrap">
                      {header === "status" || header === "Status" ? (
                        <select
                          value={row[header] || ""}
                          onChange={(e) =>
                            handleChange(table, index, header, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Status</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      ) : header.toLowerCase().includes("date") || 
                         header === "membershipSince" ||
                         header === "from_date" ||
                         header === "to_date" ? (
                        <input
                          type="date"
                          value={row[header]?.split("T")[0] || ""}
                          onChange={(e) =>
                            handleChange(table, index, header, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : header === "typeOfPublication" ? (
                        <select
                          value={row[header] || ""}
                          onChange={(e) =>
                            handleChange(table, index, header, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Type</option>
                          <option value="NC">National Conference</option>
                          <option value="IC">International Conference</option>
                          <option value="NJ">National Journal</option>
                          <option value="IJ">International Journal</option>
                        </select>
                      ) : header === "publishedUnder" ? (
                        <select
                          value={row[header] || ""}
                          onChange={(e) =>
                            handleChange(table, index, header, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Category</option>
                          <option value="Web of Science">Web of Science</option>
                          <option value="Scopus">Scopus</option>
                          <option value="Q1">Q1</option>
                          <option value="Q2">Q2</option>
                          <option value="Q3">Q3</option>
                        </select>
                      ) : header === "membershipType" ? (
                        <select
                          value={row[header] || ""}
                          onChange={(e) =>
                            handleChange(table, index, header, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Type</option>
                          <option value="Annual">Annual</option>
                          <option value="Permanent">Permanent</option>
                        </select>
                      ) : header === "amount" ||
                        header === "yearOfPublication" ? (
                        <input
                          type="number"
                          value={row[header] || ""}
                          onChange={(e) =>
                            handleChange(table, index, header, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-24"
                        />
                      ) : (
                        <input
                          type="text"
                          value={row[header] || ""}
                          onChange={(e) =>
                            handleChange(table, index, header, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(table, index, row.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {table !== "facultyResearchDetails" && (
          <button
            onClick={() => addNewRow(table)}
            className="mt-4 px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 border border-green-200"
          >
            Add New Row
          </button>
        )}
      </motion.div>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading faculty data...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-500 text-2xl mb-4">⚠</div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex flex-wrap items-center justify-end gap-4 mb-8">
          <a
            href="/mis_faculty/faculty_home"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Home
          </a>
          <a
            href={`/fac_update/${employeeId}`}
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Personal Details
          </a>
          <a
            href={`/fac_update/academic/${employeeId}`}
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Academic Details
          </a>
          <a
            href={`/fac_update/research/${employeeId}`}
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Research Details
          </a>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Faculty Research Details
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Update your research publications, projects, and academic activities
          </p>
        </div>

        {data &&
          Object.entries(data).map(([table, rows]) => (
            <React.Fragment key={table}>
              {renderTable(table, rows)}
            </React.Fragment>
          ))}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleUpdate}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetailsPage;