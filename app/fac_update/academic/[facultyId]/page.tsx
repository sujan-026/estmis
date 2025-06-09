"use client";
import levelImage from "@/app/assets/lvlaca.jpg";
import React, { useState, useEffect } from "react";

type FormFieldProps = {
  label: string;
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: "text" | "date" | "number";
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {type === "date" ? (
      <input
        type="date"
        value={value ? new Date(value).toISOString().split("T")[0] : ""}
        onChange={onChange}
        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
    ) : type === "number" ? (
      <input
        type="number"
        value={value || 0}
        onChange={onChange}
        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
    ) : (
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
    )}
  </div>
);

const FacultyDetailsPage: React.FC = () => {
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, any[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLevelInfo, setShowLevelInfo] = useState(false);

  const sectionLabels: Record<string, string> = {
    FacultyAcademicDetails: "Academic Details",
    TeachingExperience: "Teaching Experience",
    IndustryExperience: "Industrial Experience",
    AwardAndRecognition: "Awards or Recognitions",
    addtionalResponsibility: "Additional Responsibilities",
    Extracurricular: "Extracurricular Activities",
    OutreachActivity: "Outreach Activities",
  };

  const awardFieldLabels: Record<string, string> = {
    recognitionorawardReceived: "Recognition or Award Received",
    recognitionorawardFrom: "Recognition or Award From",
    recognitionorawardDate: "Recognition or Award Date",
  };

  // 1) grab facultyId from URL
  useEffect(() => {
    const segments = window.location.pathname.split("/");
    const id = segments[segments.length - 1];
    if (id && id !== "academic") {
      setEmployeeId(id);
    } else {
      console.warn("Faculty ID is not present in the dynamic route.");
      setError("Invalid faculty ID");
      setLoading(false);
    }
  }, []);

  // 2) blank/default schemas for “Add New”
  const defaultSchemas: Record<string, any[]> = {
    FacultyAcademicDetails: [{ employee_id: employeeId, id: "", level: 100 }],
    TeachingExperience: [
      {
        employee_id: employeeId,
        id: "",
        instituteName: "",
        fromDate: "",
        toDate: "",
        Designation: "",
        departmentName: "",
      },
    ],
    IndustryExperience: [
      {
        employee_id: employeeId,
        id: "",
        organization: "",
        fromDate: "",
        toDate: "",
        designation: "",
      },
    ],
    AwardAndRecognition: [
      {
        employee_id: employeeId,
        id: "",
        recognitionorawardReceived: "",
        recognitionorawardFrom: "",
        recognitionorawardDate: "",
      },
    ],
    addtionalResponsibility: [
      {
        employee_id: employeeId,
        id: "",
        level: "",
        fromDate: "",
        toDate: "",
        responsibility: "",
      },
    ],
    Extracurricular: [
      {
        employee_id: employeeId,
        id: "",
        eventType: "",
        eventTitle: "",
        fromDate: "",
        toDate: "",
        organizer: "",
        level: "",
        otherLevel: "",
        achievement: "",
      },
    ],
    OutreachActivity: [
      {
        employee_id: employeeId,
        id: "",
        activity: "",
        role: "",
        fromDate: "",
        toDate: "",
        place: "",
      },
    ],
  };

  // 3) fetch + massage API data once we have employeeId
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/fac_update_academics?employee_id=${employeeId}`
        );
        const response = await res.json();
        if (!response.data) {
          throw new Error(response.message || "Failed to fetch data");
        }

        // force any non-standard level into “Other”
        const rawX = response.data.Extracurricular || [];
        const fixedX = rawX.map((item: any) => {
          const std = ["National", "International"];
          if (!std.includes(item.level)) {
            return {
              ...item,
              level: "Other",
              otherLevel: item.level,
            };
          }
          return { ...item, otherLevel: "" };
        });

        const mappedData = {
          ...response.data,
          Extracurricular: fixedX,
          addtionalResponsibility:
            response.data.addtionalResponsibility || [],
          AwardAndRecognition:
            response.data.AwardAndRecognition?.map((item: any) => ({
              employee_id: item.employee_id,
              id: item.id,
              recognitionorawardReceived: item.recognitionorawardReceived,
              recognitionorawardFrom: item.recognitionorawardFrom,
              recognitionorawardDate: item.recognitionorawardDate,
            })) || [],
        };

        // for FacultyAcademicDetails: fall back to default if empty
        // for every other table: use whatever array (even if empty)
        const initializedData = Object.keys(defaultSchemas).reduce(
          (acc, key) => {
            const arr = mappedData[key];
            if (key === "FacultyAcademicDetails") {
              acc[key] =
                Array.isArray(arr) && arr.length > 0
                  ? arr
                  : defaultSchemas[key];
            } else {
              acc[key] = Array.isArray(arr) ? arr : [];
            }
            return acc;
          },
          {} as Record<string, any[]>
        );

        setData(initializedData);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) fetchData();
  }, [employeeId]);

  // generic change / add / delete handlers
  const handleChange = (
    table: string,
    index: number,
    field: string,
    value: any
  ) => {
    setData((prev) => ({
      ...prev!,
      [table]: prev![table].map((row, i) =>
        i === index
          ? {
              ...row,
              [field]:
                field === "level" && table === "FacultyAcademicDetails"
                  ? parseInt(value) || 0
                  : value,
            }
            
          : row
      ),
    }));
  };

  const addNewRow = (table: string) => {
    if (
      table === "FacultyAcademicDetails" &&
      data!.FacultyAcademicDetails.length > 0
    ) {
      alert("Only one FacultyAcademicDetails record is allowed.");
      return;
    }
    const newRow = { ...defaultSchemas[table][0], employee_id: employeeId };
    setData((prev) => ({
      ...prev!,
      [table]: [...prev![table], newRow],
    }));
  };

  const handleDelete = async (
    table: string,
    index: number,
    id: string
  ) => {
    if (id) {
      try {
        const res = await fetch(`/api/fac_update_academics`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, table }),
        });
        const resp = await res.json();
        if (resp.message !== "Record deleted successfully") {
          throw new Error(resp.message || "Failed to delete record");
        }
        alert("Record deleted successfully!");
      } catch (err: any) {
        alert(err.message || "Failed to delete record");
      }
    }

    setData((prev) => ({
      ...prev!,
      [table]: prev![table].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleUpdate = async () => {
    try {
      // for Extracurricular, swap in otherLevel when needed
      const extracurricularsSchema = data!.Extracurricular.map(
        ({ otherLevel, level, ...rest }) => ({
          ...rest,
          level: level === "Other" ? otherLevel : level,
        })
      );

      const payload = {
        facultyId: employeeId,
        academicSchema: data!.FacultyAcademicDetails[0] || { level: 0 },
        previousTeachingExperienceSchema: data!.TeachingExperience,
        teachingExperienceIndustrySchema: data!.IndustryExperience,
        awardsSchema: data!.AwardAndRecognition,
        recognitionsSchema: data!.AwardAndRecognition,
        responsibilitiesSchema: data!.addtionalResponsibility,
        extracurricularsSchema,
        outreachSchema: data!.OutreachActivity,
      };

      console.log("Update Payload:", payload);

      const res = await fetch(`/api/fac_update_academics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resp = await res.json();
      if (!resp.success) throw new Error(resp.error || "Update failed");
      alert("Data updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update data");
    }
  };

  // per‐section renderer
  const renderSection = (table: string) => {
    const rows = data![table];              // might be []
    const isSingle = table === "FacultyAcademicDetails";
    const hasRows = Array.isArray(rows) && rows.length > 0;

    // fields come either from real data or from default schema
    const fields = hasRows
      ? Object.keys(rows[0]).filter((k) => k !== "id" && k !== "employee_id")
      : Object.keys(defaultSchemas[table][0]).filter(
          (k) => k !== "id" && k !== "employee_id"
        );

    return (
      <div
        key={table}
        className="space-y-6 mb-6 border border-gray-300 rounded-lg p-6 shadow-md bg-white"
      >
        <h2 className="text-2xl font-semibold">
          {sectionLabels[table] || table}
        </h2>

        {/* only render actual rows */}
        {hasRows &&
          rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
            >
              {!isSingle && (
                <div className="col-span-2">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    {index + 1}.
                  </h3>
                </div>
              )}

              {fields.map((field) => {
                let label = field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());
                if (
                  table === "AwardAndRecognition" &&
                  awardFieldLabels[field]
                ) {
                  label = awardFieldLabels[field];
                }

                const type =
                  field.toLowerCase().includes("date")
                    ? "date"
                    : field === "level" && table === "FacultyAcademicDetails"
                    ? "number"
                    : "text";

                // add-on: Additional Responsibilities dropdown
                if (
                  table === "addtionalResponsibility" &&
                  field === "level"
                ) {
                  return (
                    <div key={field} className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Level
                      </label>
                      <select
                        value={row.level}
                        onChange={(e) =>
                          handleChange(
                            table,
                            index,
                            "level",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-md focus:ring-blue-500"
                      >
                        <option value="">Select Level</option>
                        <option value="Department Level">
                          Department Level
                        </option>
                        <option value="College Level">
                          College Level
                        </option>
                      </select>
                    </div>
                  );
                }

                // Extracurricular → show “Other” text only if selected
                if (table === "Extracurricular" && field === "level") {
                  return (
                    <div key={field} className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Level
                      </label>
                      <select
                        value={row.level}
                        onChange={(e) =>
                          handleChange(
                            table,
                            index,
                            "level",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-md focus:ring-blue-500"
                      >
                        <option value="">Select Level</option>
                        <option value="National">National</option>
                        <option value="International">
                          International
                        </option>
                        <option value="Other">Other</option>
                      </select>
                      {row.level === "Other" && (
                        <input
                          type="text"
                          placeholder="Specify Other Level"
                          value={row.otherLevel}
                          onChange={(e) =>
                            handleChange(
                              table,
                              index,
                              "otherLevel",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md focus:ring-blue-500 mt-2"
                        />
                      )}
                    </div>
                  );
                }

                // FacultyAcademicDetails → “Know More”
                if (
                  table === "FacultyAcademicDetails" &&
                  field === "level"
                ) {
                  return (
                    <div key={field} className="space-y-1">
                      <div className="flex items-center">
                        <label className="text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setShowLevelInfo(!showLevelInfo)
                          }
                          className="ml-2 text-xs text-blue-500 hover:underline"
                        >
                          Know More
                        </button>
                      </div>
                      <input
                        type={type}
                        value={row[field]}
                        onChange={(e) =>
                          handleChange(
                            table,
                            index,
                            field,
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      {showLevelInfo && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-md">
                          <img
                            src={levelImage.src}
                            alt="Academic Level Information"
                            className="max-w-full h-auto border border-gray-200 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLevelInfo(false)}
                            className="mt-2 text-sm text-blue-500 hover:underline"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                // default text/date/number field
                return (
                  <FormField
                    key={field}
                    label={label}
                    value={row[field]}
                    onChange={(e) =>
                      handleChange(
                        table,
                        index,
                        field,
                        e.target.value
                      )
                    }
                    type={type}
                  />
                );
              })}

              {/* remove button on multi-row tables */}
              {!isSingle && (
                <div className="col-span-2 flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(table, index, row.id)
                    }
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}

        {/* always allow adding a row (except for the single-row section) */}
        {!isSingle && (
          <button
            type="button"
            onClick={() => addNewRow(table)}
            className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-dashed border-blue-200"
          >
            + Add New {table.replace(/([A-Z])/g, " $1")}
          </button>
        )}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      {/* nav */}
      <nav className="flex items-center justify-end gap-4 mr-4 mt-2 text-xl text-blue-500 font-bold">
        <a
          href="/mis_faculty/faculty_home"
          className="link hover:underline underline-offset-3"
        >
          Home
        </a>
        <a
          href={`/fac_update/${employeeId}`}
          className="link hover:underline underline-offset-3"
        >
          Personal Details
        </a>
        <a
          href={`/fac_update/academic/${employeeId}`}
          className="link hover:underline underline-offset-3"
        >
          Academic Details
        </a>
        <a
          href={`/fac_update/research/${employeeId}`}
          className="link hover:underline underline-offset-3"
        >
          Research Details
        </a>
      </nav>

      <h1 className="text-3xl font-bold mb-6 text-center my-10">
        Faculty Details
      </h1>

      {/* render all non-null sections */}
      {data && Object.keys(data).map((table) => renderSection(table))}

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        >
          Update All
        </button>
      </div>
    </div>
  );
};

export default FacultyDetailsPage;
