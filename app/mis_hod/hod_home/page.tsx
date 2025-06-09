"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../../app/components/ui/Layout";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface FacultyData {
  personalDetails: {
    faculty_name: string;
    designation: string;
    department: string;
    dateOfJoiningDrait: string;
  };
  researchDetails?: {
    orcidId?: string;
    googleScholarId?: string;
  };
  conferenceAndJournal?: Array<{
    typeOfPublication: string;
    yearOfPublication: string;
  }>;
  bookPublication?: Array<{
    yearOfPublish: string;
  }>;
  awardAndRecognition?: Array<{
    awardDate: string;
  }>;
  eventAttended?: Array<{
    toDate: string;
  }>;
  eventOrganized?: Array<{
    toDate: string;
  }>;
  outreachActivity?: Array<{
    toDate: string;
  }>;
  patent?: Array<{
    grantedYear: string;
  }>;
  professionalMembers?: Array<{
    membershipSince: string;
  }>;
  teachingExperience?: Array<{
    toDate: string;
  }>;
  researchProjects?: Array<{
    dOfSanction: string;
  }>;
  researchExp?: Array<{
    to_date: string;
  }>;
  researchSuperVision?: Array<any>;
}

const HODDashboard = () => {
  const router = useRouter();
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    // Client-side only
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        try {
          const employeeId = sessionStorage.getItem("emp_id");
          const dept = sessionStorage.getItem("departmentName");
          const role = sessionStorage.getItem("userRole");

          if (!role || role !== "hod") {
            throw new Error("Unauthorized access. Only HODs can view this page.");
          }

          if (!dept) {
            throw new Error("Department information not found");
          }

          setDepartment(dept);

          const response = await fetch("/api/fetchFullFacDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employee_id: employeeId }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch faculty data");
          }

          const data = await response.json();
          setFacultyData(data);
        } catch (err) {
          console.error("Error:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  // Utility functions for dates
  const getCurrentYear = () => new Date().getFullYear();

  const getLatestYear = (entries: any[], dateField?: string): string | null => {
    if (!entries || entries.length === 0 || !dateField) return null;

    const dates = entries
      .map((entry) => {
        const dateValue = entry[dateField];
        if (!dateValue) return null;
        if (/^\d{4}$/.test(dateValue)) return parseInt(dateValue);
        const date = new Date(dateValue);
        return date.getFullYear();
      })
      .filter((year) => year !== null);

    return dates.length > 0 ? Math.max(...dates).toString() : null;
  };

  const getThisYearCount = (entries: any[], dateField?: string): number => {
    if (!entries || !dateField) return 0;
    const currentYear = getCurrentYear();

    return entries.filter((entry) => {
      const dateValue = entry[dateField];
      if (!dateValue) return false;
      const year =
        dateValue.length === 4 ? parseInt(dateValue) : new Date(dateValue).getFullYear();
      return year === currentYear;
    }).length;
  };

  if (loading) {
    return (
      <Layout moduleType="hod">
        <div className="container mx-auto p-4">Loading department data...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout moduleType="hod">
        <div className="container mx-auto p-4 text-red-500">
          <h1>Error</h1>
          <p>{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  // Calculate experience for the HOD
  const currentYear = getCurrentYear();
  const joiningYear = facultyData?.personalDetails?.dateOfJoiningDrait 
    ? new Date(facultyData.personalDetails.dateOfJoiningDrait).getFullYear() 
    : null;
  const experience = joiningYear ? currentYear - joiningYear : 0;

  return (
    <Layout moduleType="hod">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">HOD Dashboard - {department}</h1>
        
        {/* Department Summary Cards - All in blue */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Personal Info Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-1">{facultyData?.personalDetails?.faculty_name || 'HOD'}</h3>
            <p className="text-base">{facultyData?.personalDetails?.designation || 'Head of Department'}</p>
            <p className="text-sm mt-2 text-blue-200">
              Experience: {experience} years
            </p>
          </div>

          {/* Publications Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{facultyData?.conferenceAndJournal?.length || 0}</h3>
            <p className="text-base">
              Conferences & Journals
              {facultyData?.conferenceAndJournal && facultyData.conferenceAndJournal.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {getLatestYear(facultyData.conferenceAndJournal, "yearOfPublication")}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {getThisYearCount(facultyData.conferenceAndJournal, "yearOfPublication")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Books Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{facultyData?.bookPublication?.length || 0}</h3>
            <p className="text-base">
              Book Publications
              {facultyData?.bookPublication && facultyData.bookPublication.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {getLatestYear(facultyData.bookPublication, "yearOfPublish")}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {getThisYearCount(facultyData.bookPublication, "yearOfPublish")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Awards Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{facultyData?.awardAndRecognition?.length || 0}</h3>
            <p className="text-base">
              Awards & Recognition
              {facultyData?.awardAndRecognition && facultyData.awardAndRecognition.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {getLatestYear(facultyData.awardAndRecognition, "awardDate")}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {getThisYearCount(facultyData.awardAndRecognition, "awardDate")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Events Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">
              {(facultyData?.eventAttended?.length || 0) + (facultyData?.eventOrganized?.length || 0)}
            </h3>
            <p className="text-base">
              Total Events
              {(facultyData?.eventAttended || facultyData?.eventOrganized) && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {Math.max(
                      getLatestYear(facultyData?.eventAttended || [], "toDate") || 0,
                      getLatestYear(facultyData?.eventOrganized || [], "toDate") || 0
                    )}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {getThisYearCount(facultyData?.eventAttended || [], "toDate") +
                      getThisYearCount(facultyData?.eventOrganized || [], "toDate")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Outreach Activities Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{facultyData?.outreachActivity?.length || 0}</h3>
            <p className="text-base">
              Outreach Activities
              {facultyData?.outreachActivity && facultyData.outreachActivity.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {getLatestYear(facultyData.outreachActivity, "toDate")}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {getThisYearCount(facultyData.outreachActivity, "toDate")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Patents Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{facultyData?.patent?.length || 0}</h3>
            <p className="text-base">
              Patents
              {facultyData?.patent && facultyData.patent.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {getLatestYear(facultyData.patent, "grantedYear")}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {getThisYearCount(facultyData.patent, "grantedYear")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Professional Memberships Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{facultyData?.professionalMembers?.length || 0}</h3>
            <p className="text-base">
              Professional Memberships
              {facultyData?.professionalMembers && facultyData.professionalMembers.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {getLatestYear(facultyData.professionalMembers, "membershipSince")}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {getThisYearCount(facultyData.professionalMembers, "membershipSince")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Teaching Experience Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{facultyData?.teachingExperience?.length || 0}</h3>
            <p className="text-base">
              Teaching Experience
              {facultyData?.teachingExperience && facultyData.teachingExperience.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {getLatestYear(facultyData.teachingExperience, "toDate")}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {getThisYearCount(facultyData.teachingExperience, "toDate")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Research Projects Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{facultyData?.researchProjects?.length || 0}</h3>
            <p className="text-base">
              Research Projects
              {facultyData?.researchProjects && facultyData.researchProjects.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {getLatestYear(facultyData.researchProjects, "dOfSanction")}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {getThisYearCount(facultyData.researchProjects, "dOfSanction")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Research Experience Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{facultyData?.researchExp?.length || 0}</h3>
            <p className="text-base">
              Research Experience
              {facultyData?.researchExp && facultyData.researchExp.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {getLatestYear(facultyData.researchExp, "to_date")}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {getThisYearCount(facultyData.researchExp, "to_date")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Research Supervision Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{facultyData?.researchSuperVision?.length || 0}</h3>
            <p className="text-base">
              Research Supervision
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HODDashboard;