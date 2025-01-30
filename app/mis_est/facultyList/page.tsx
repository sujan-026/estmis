"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Faculty {
  faculty_name: string;
  department: string;
  qualification: string;
  contactNo: string;
  title: string;
  employee_id: string; // New field from backend
}

export default function FacultyInfoPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // For search functionality
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All"); // For department filter
  const [errorMessage, setErrorMessage] = useState<string>(""); // For error handling  
  const [branch, setBranch] = useState<Branch[]>([]);
  const router = useRouter();

  // Fetch Faculty Data
  useEffect(() => {
    async function fetchFacultyData() {
      try {
        const response = await fetch("/api/fetchFaculty");
        if (!response.ok) throw new Error("Failed to fetch faculty data.");
        const data = await response.json();
        setFacultyList(data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setErrorMessage("Failed to load faculty data.");
      }
    }
    fetchFacultyData();
  }, []);

  // Fetch Branch
  useEffect(() => {
    async function fetchBranch() {
      try {
        const response = await fetch("/api/fetchBranch");
        if (!response.ok) throw new Error("Failed to fetch branch.");
        const data = await response.json();
        console.log(data);
        setBranch(data);
      } catch (error) {
        console.error("Error fetching branch:", error);
        setErrorMessage("Failed to load branch.");
      }
    }
    fetchBranch();
  }, []);

  // Filter Faculty
  const filteredFaculty = facultyList.filter((faculty) => {
    const matchesSearch = faculty.faculty_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || faculty.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-4 bg-gray-100 p-3 rounded-lg shadow">
        <h1 className="text-xl font-semibold">Faculty Information</h1>
        <div className="flex space-x-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by Name"
            className="input px-3 py-2 rounded-md border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Department Filter */}
          <label htmlFor="department-select" className="sr-only">
            Select Department
          </label>
          <select
            id="department-select"
            className="input px-3 py-2 rounded-md border"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="">Select Department</option>
            {branch.map((br) => (
              <option key={br.brcode} value={br.brcode}>
                {br.brcode_title}
              </option>
            ))}
          </select>

          <button
            className="px-4 py-2 rounded-lg bg-blue-500 text-white"
            onClick={() => router.push("/mis_est")}
          >
            Back
          </button>
        </div>
      </nav>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {errorMessage}
        </div>
      )}

      {/* Table View */}
      <motion.div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-center">Name</th>
              <th className="px-6 py-3 text-center">Department</th>
              <th className="px-6 py-3 text-center">Qualification</th>
              <th className="px-6 py-3 text-center">Contact No</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaculty.map((faculty, index) => (
              <tr
                key={index}
                onClick={() => router.push(`/faculty/${faculty.employee_id}`)} // Navigate to slug page
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="px-6 py-3 text-center">{faculty.title}</td>
                <td className="px-6 py-3">{faculty.faculty_name}</td>
                <td className="px-6 py-3 text-center">{faculty.department}</td>
                <td className="px-6 py-3 text-center">
                  {faculty.qualification}
                </td>
                <td className="px-6 py-3 text-center">{faculty.contactNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
