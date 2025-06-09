"use client";

import React, { useEffect, useState } from "react";
import Layout from "../components/ui/Layout";
const Header = () => {
  const [sessionUser, setSessionUser] = useState<{
    name: string;
    department: string;
    role: string;
    emp_id: string;
  } | null>(null);

  useEffect(() => {
    // Access sessionStorage only on the client
    const savedUserName = sessionStorage.getItem("userName");
    const savedDepartmentName = sessionStorage.getItem("departmentName");
    const savedRole = sessionStorage.getItem("userRole");
    const employeeId = sessionStorage.getItem("emp_id");

    if (savedUserName && savedDepartmentName && savedRole && employeeId) {
      setSessionUser({
        name: savedUserName,
        department: savedDepartmentName,
        role: savedRole,
        emp_id: employeeId, // Set this if needed
      });
    }
  }, []);

  return (
    <Layout moduleType="non-teaching staff">
      {sessionUser ? (
        <div className="flex flex-1 items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">
            Non Teaching Staff Home
          </h1>
        </div>
      ) : (
        <p>Loading session data...</p>
      )}
    </Layout>
  );
};

export default Header;
