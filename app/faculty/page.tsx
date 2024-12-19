// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// const Page = () => {
//   const router = useRouter();
//   const [facultyId, setFacultyId] = useState("");
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (facultyId) {
//       try {
//         const response = await fetch(`/api/check_emp`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ facultyId }),
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           alert(errorData.message || "Something went wrong");
//           return;
//         }
//         const data = await response.json();
//         if (data) {
//           router.push(`/faculty/faculty_reg/${facultyId}`);
//         } else {
//           alert("Faculty is not registered or does not exist.");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("An error occurred while checking faculty ID.");
//       }
//     } else {
//       alert("Please enter a Faculty ID");
//     }
//   };
//   return (
//     <div>
//       {" "}
//       <h1>Find Faculty Page</h1>{" "}
//       <form onSubmit={handleSubmit}>
//         {" "}
//         <input
//           type="text"
//           value={facultyId}
//           onChange={(e) => setFacultyId(e.target.value)}
//           placeholder="Enter Faculty ID"
//         />{" "}
//         <button type="submit">Submit</button>{" "}
//       </form>{" "}
//     </div>
//   );
// };
// export default Page;


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
        if (data) {
          router.push(`/faculty/faculty_reg/${facultyId}`);
        } else {
          alert("Faculty is not registered or does not exist.");
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
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4 my-4"
          onClick={() => router.push("/mis_est")}
          >
          Home
          </button>
      </div>
    </div>
  );
};

export default Page;
