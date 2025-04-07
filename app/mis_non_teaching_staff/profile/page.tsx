"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import image from "@/app/assets/image.jpg";

// Define interface for all fields in facultyPersonalDetails
interface PersonalDetails {
  id?: number;
  employee_id?: string;
  qualification?: string;
  department?: string;
  photo?: string;
  title?: string;
  faculty_name?: string;
  emailId?: string;
  contactNo?: string;
  alternateContactNo?: string;
  emergencyContactNo?: string;
  adharNo?: string;
  panNo?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  firstAddressLine?: string;
  correspondenceAddressLine?: string;
  religion?: string;
  caste?: string;
  category?: string;
  motherTongue?: string;
  speciallyChallenged?: boolean;
  remarks?: string;
  languages?: string;
  bankName?: string;
  accountNo?: string;
  accountName?: string;
  accountType?: string;
  branch?: string;
  ifsc?: string;
  pfNumber?: string;
  uanNumber?: string;
  pensionNumber?: string;
  motherName?: string;
  fatherName?: string;
  spouseName?: string;
  children?: string;
  dateOfJoiningDrait?: string;
  designation?: string;
  aided?: string;
  isRegistered?: boolean;
}

// Helper to format date strings
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString();
};

const formatLanguages = (lang?: string) => {
  if (!lang) return "N/A";
  try {
    const parsed = JSON.parse(lang);
    if (Array.isArray(parsed)) {
      return parsed.join(", ");
    }
  } catch (error) {
    // If JSON parse fails, remove brackets manually.
    return lang.replace(/^\[|\]$/g, "");
  }
  return lang;
};


export default function NonTeachingProfile() {
  const [personalDetails, setPersonalDetails] =
    useState<PersonalDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersonalDetails() {
      const employee_id = sessionStorage.getItem("emp_id");
      if (!employee_id) {
        console.error("Employee ID not found in sessionStorage");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          "/api/non_teaching_staff/get_personal_info",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employee_id }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch personal details");
        }

        const data = await response.json();
        console.log("Fetched Personal Details:", data);
        setPersonalDetails(data.personalDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPersonalDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!personalDetails) {
    return <div>Personal details not found</div>;
  }

  // Determine which image to use.
  // If personalDetails.photo is a valid URL (and not "No photo"), use it; otherwise use the default image.
  const profileImage =
    personalDetails.photo && personalDetails.photo !== "No photo"
      ? personalDetails.photo
      : image;

  return (
    <div>
      {/* Navigation */}
      <nav className="flex items-center justify-end gap-4 mr-4 mt-2 text-xl text-blue-500 font-bold bg-white shadow-md sticky top-0 z-50 p-4">
        <a
          className="link hover:underline underline-offset-3"
          href="/mis_non_teaching_staff"
        >
          Home
        </a>
      </nav>

      {/* Main Profile Card */}
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative">
            <Image
              src={profileImage}
              alt="Profile Picture"
              width={160}
              height={160}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {personalDetails.faculty_name || "N/A"}{" "}
              {personalDetails.title || ""}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Staff ID</p>
                <p className="font-medium text-gray-800">
                  {personalDetails.employee_id || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-800">
                  {personalDetails.department || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium text-gray-800">
                  {personalDetails.qualification || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">
                  {personalDetails.contactNo || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">
                  {personalDetails.emailId || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Faculty Name</p>
              <p className="font-medium text-gray-800">
                {personalDetails.faculty_name || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-medium text-gray-800">
                {personalDetails.employee_id || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Qualification</p>
              <p className="font-medium text-gray-800">
                {personalDetails.qualification || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium text-gray-800">
                {personalDetails.department || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium text-gray-800">
                {personalDetails.title || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">
                {personalDetails.emailId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Contact No</p>
              <p className="font-medium text-gray-800">
                {personalDetails.contactNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Alternate Contact No</p>
              <p className="font-medium text-gray-800">
                {personalDetails.alternateContactNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Emergency Contact No</p>
              <p className="font-medium text-gray-800">
                {personalDetails.emergencyContactNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Aadhar No</p>
              <p className="font-medium text-gray-800">
                {personalDetails.adharNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">PAN No</p>
              <p className="font-medium text-gray-800">
                {personalDetails.panNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-800">
                {formatDate(personalDetails.dob)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-gray-800">
                {personalDetails.gender || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium text-gray-800">
                {personalDetails.nationality || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">First Address Line</p>
              <p className="font-medium text-gray-800">
                {personalDetails.firstAddressLine || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Correspondence Address Line
              </p>
              <p className="font-medium text-gray-800">
                {personalDetails.correspondenceAddressLine || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Religion</p>
              <p className="font-medium text-gray-800">
                {personalDetails.religion || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Caste</p>
              <p className="font-medium text-gray-800">
                {personalDetails.caste || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-800">
                {personalDetails.category || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Mother Tongue</p>
              <p className="font-medium text-gray-800">
                {personalDetails.motherTongue || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Specially Challenged</p>
              <p className="font-medium text-gray-800">
                {personalDetails.speciallyChallenged ? "Yes" : "No"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Remarks</p>
              <p className="font-medium text-gray-800">
                {personalDetails.remarks || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Languages</p>
              <p className="font-medium text-gray-800">
                {formatLanguages(personalDetails.languages)}
              </p>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Bank Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Bank Name</p>
              <p className="font-medium text-gray-800">
                {personalDetails.bankName || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Account Name</p>
              <p className="font-medium text-gray-800">
                {personalDetails.accountName || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-medium text-gray-800">
                {personalDetails.accountType || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Account Number</p>
              <p className="font-medium text-gray-800">
                {personalDetails.accountNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Branch</p>
              <p className="font-medium text-gray-800">
                {personalDetails.branch || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">IFSC</p>
              <p className="font-medium text-gray-800">
                {personalDetails.ifsc || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">PF Number</p>
              <p className="font-medium text-gray-800">
                {personalDetails.pfNumber || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">UAN Number</p>
              <p className="font-medium text-gray-800">
                {personalDetails.uanNumber || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Pension Number</p>
              <p className="font-medium text-gray-800">
                {personalDetails.pensionNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Family Details Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Family Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Mother's Name</p>
              <p className="font-medium text-gray-800">
                {personalDetails.motherName || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Father's Name</p>
              <p className="font-medium text-gray-800">
                {personalDetails.fatherName || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Spouse Name</p>
              <p className="font-medium text-gray-800">
                {personalDetails.spouseName || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Children</p>
              <p className="font-medium text-gray-800">
                {personalDetails.children || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Employment Details Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Employment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Date of Joining (Drait)</p>
              <p className="font-medium text-gray-800">
                {formatDate(personalDetails.dateOfJoiningDrait)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Designation</p>
              <p className="font-medium text-gray-800">
                {personalDetails.designation || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Aided</p>
              <p className="font-medium text-gray-800">
                {personalDetails.aided || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Is Registered</p>
              <p className="font-medium text-gray-800">
                {personalDetails.isRegistered ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
