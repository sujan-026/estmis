"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [facultyId, setFacultyId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (facultyId) {
      try {
        const response = await fetch(`/api/check_emp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ facultyId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Something went wrong");
          return;
        }
        const data = await response.json();
        console.log("Role:", data.role);
        console.log(
          "Counts:",
          data.personalCount,
          data.researchCount,
          data.academicCount
        );

        // If details are already present (any count > 0), redirect to update route
        if (data.isRegistered) {
          router.push(`/fac_update/${facultyId}`);
        } else {
          // Otherwise, if not registered, send to registration based on role
          if (
            data.role === "faculty" ||
            data.role === "deanp" ||
            data.role === "hod" ||
            data.role === "dean-exam" ||
            data.role === "principal" ||
            data.role === "acc_admin" ||
            data.role === "admin" ||
            data.role === "dean-academic" ||
            data.role === "est" ||
            data.role === "est_admin"
          ) {
            router.push(`/faculty/faculty_reg/${facultyId}`);
          } else if (
            data.role === "non-teaching staff" ||
            data.role === "staff" ||
            data.role === "Non-Teaching Staff"
          ) {
            router.push(`/mis_non_teaching_staff/register/${facultyId}`);
          } else {
            alert("Faculty is not registered or does not exist.");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while checking faculty ID.");
      }
    } else {
      alert("Please enter a Faculty ID");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Find Faculty Page
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            placeholder="Enter Faculty ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </form>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
          onClick={() => router.push("/mis_est")}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Page;
