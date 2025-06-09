"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/app/components/ui/Layout";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface PrincipalData {
  personalDetails: {
    principal_name: string;
    designation: string;
    institution: string;
    dateOfJoining: string;
  };
  departmentStats?: Array<{
    departmentName: string;
    facultyCount: number;
    publications: number;
    researchProjects: number;
  }>;
  institutionalStats?: {
    totalFaculty?: number;
    totalStudents?: number;
    totalDepartments?: number;
    totalResearchProjects?: number;
    totalPublications?: number;
  };
  awards?: Array<{
    awardDate: string;
  }>;
  eventOrganized?: Array<{
    toDate: string;
  }>;
}

const PrincipalDashboard = () => {
  const router = useRouter();
  const [principalData, setPrincipalData] = useState<PrincipalData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        try {
          const employeeId = sessionStorage.getItem("emp_id");
          const role = sessionStorage.getItem("userRole");

          if (!role || role !== "principal") {
            throw new Error(
              "Unauthorized access. Only Principal can view this page."
            );
          }

          const response = await fetch("/api/fetchPrincipalDashboardData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employee_id: employeeId }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch principal data");
          }

          const data = await response.json();
          setPrincipalData(data);
        } catch (err) {
          console.error("Error:", err);
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  // Utility functions
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
        dateValue.length === 4
          ? parseInt(dateValue)
          : new Date(dateValue).getFullYear();
      return year === currentYear;
    }).length;
  };

  if (loading) {
    return (
      <Layout moduleType="principal">
        <div className="container mx-auto p-4">
          Loading principal dashboard...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout moduleType="principal">
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

  // Calculate experience for the Principal
  const currentYear = getCurrentYear();
  const joiningYear = principalData?.personalDetails?.dateOfJoining
    ? new Date(principalData.personalDetails.dateOfJoining).getFullYear()
    : null;
  const experience = joiningYear ? currentYear - joiningYear : 0;

  return (
    <Layout moduleType="principal">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Principal Dashboard</h1>

        {/* Institutional Summary Cards - All in blue */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Personal Info Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-1">
              {principalData?.personalDetails?.principal_name || "Principal"}
            </h3>
            <p className="text-base">
              {principalData?.personalDetails?.designation ||
                "Institution Head"}
            </p>
            <p className="text-sm mt-2 text-blue-200">
              Experience: {experience} years
            </p>
          </div>

          {/* Total Faculty Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">
              {principalData?.institutionalStats?.totalFaculty || 0}
            </h3>
            <p className="text-base">Total Faculty Members</p>
          </div>

          {/* Total Students Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">
              {principalData?.institutionalStats?.totalStudents || 0}
            </h3>
            <p className="text-base">Total Students</p>
          </div>

          {/* Total Departments Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">
              {principalData?.institutionalStats?.totalDepartments || 0}
            </h3>
            <p className="text-base">Total Departments</p>
          </div>

          {/* Research Projects Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">
              {principalData?.institutionalStats?.totalResearchProjects || 0}
            </h3>
            <p className="text-base">Research Projects</p>
          </div>

          {/* Total Publications Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">
              {principalData?.institutionalStats?.totalPublications || 0}
            </h3>
            <p className="text-base">Total Publications</p>
          </div>

          {/* Awards Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">
              {principalData?.awards?.length || 0}
            </h3>
            <p className="text-base">
              Institutional Awards
              {principalData?.awards && principalData.awards.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {getLatestYear(principalData.awards, "awardDate")}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year:{" "}
                    {getThisYearCount(principalData.awards, "awardDate")}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Events Organized Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">
              {principalData?.eventOrganized?.length || 0}
            </h3>
            <p className="text-base">
              Events Organized
              {principalData?.eventOrganized &&
                principalData.eventOrganized.length > 0 && (
                  <>
                    <span className="block text-base mt-1 text-blue-200">
                      Latest:{" "}
                      {getLatestYear(principalData.eventOrganized, "toDate")}
                    </span>
                    <span className="block text-base text-blue-200">
                      This Year:{" "}
                      {getThisYearCount(principalData.eventOrganized, "toDate")}
                    </span>
                  </>
                )}
            </p>
          </div>

          {/* Department Summary Section */}
          {principalData?.departmentStats &&
            principalData.departmentStats.length > 0 && (
              <div className="col-span-full bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4">Department Insights</h3>
                <div className="grid grid-cols-4 gap-4">
                  {principalData.departmentStats.map((dept, index) => (
                    <div key={index} className="bg-blue-600 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold">
                        {dept.departmentName}
                      </h4>
                      <p>Faculty: {dept.facultyCount}</p>
                      <p>Publications: {dept.publications}</p>
                      <p>Research Projects: {dept.researchProjects}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default PrincipalDashboard;
