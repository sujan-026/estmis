"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import img from "../../assets/buddha.jpg";
import { facultyResearchDetailsSchema } from "@/app/schemas/research-details";
import { FacultyProfileNav } from "../../components/faculty/facultyProfileNav";

interface FacultyDetails {
  id: number;
  faculty_name?: string;
  employee_id: string;
  qualification: string;
  department: string;
  photo?: string;
  title: string;
  emailId?: string;
  contactNo: string;
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
  speciallyChallenged?: string;
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
}

interface facultyAcademicDetails {
  facultyId?: string;
  qualification?: string;
  department?: string;
  level?: string;
  designation?: string;
}

interface facultyResearchDetails {
  id: number;
  employee_id: string;
  orcidId?: string;
  googleScholarId?: string;
  scopusId?: string;
  publonsId?: string;
  researchId?: string;
}

interface facultyEducationDetails {
  id: number;
  employee_id: string;
  Program?: string;
  regNo?: string;
  schoolCollege?: string;
  specialization?: string;
  mediumOfInstruction?: string;
  passClass?: string;
  yearOfAward?: string;
}


export default function FacultyDetailsPage() {
  const params = useParams();
  const employee_id = params?.employee_id;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const [facultyDetails, setFacultyDetails] = useState<FacultyDetails | null>(null);
  const [facultyAcademicDetails, setFacultyAcademicDetails] = useState<facultyAcademicDetails | null>(null);
  const [researchDetails, setResearchDetails] = useState<facultyResearchDetails | null>(null);
  const [educationDetails, setEducationDetails] = useState<facultyEducationDetails | null>(null);


  useEffect(() => {
    async function fetchFacultyDetails() {
      if (!employee_id) return;

      try {
        const response = await fetch("/api/fetchFullFacDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch faculty details."
          );
        }

        const data = await response.json();
        console.log(data.educationDetails);
        setFacultyDetails(data.personalDetails);
        // setFacultyAcademicDetails(data.academicDetails);
        setResearchDetails(data.researchDetails);
        setEducationDetails(data.educationDetails);

      } catch (error) {
        console.error("Error fetching faculty details:", error);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred.");
        }
      }
    }

    fetchFacultyDetails();
  }, [employee_id]);

  // const isValidImageUrl = (url: string | undefined): boolean => {
  //   return (
  //     !!url &&
  //     (url.startsWith("/") ||
  //       url.startsWith("http://") ||
  //       url.startsWith("https://"))
  //   );
  // };

  if (errorMessage) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1>Error</h1>
        <p>{errorMessage}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!facultyDetails) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div>
      {/* <FacultyProfileNav /> */}
      <nav className="flex items-center justify-end gap-4 mr-4 mt-2 text-xl text-blue-500 font-bold">
        <a
          className={`link hover:underline underline-offset-3`}
          href="/mis_faculty/faculty_home"
        >
          Home
        </a>
        <a
          className={`link hover:underline underline-offset-3`}
          href="#personal-section"
        >
          Personal Details
        </a>
        <a
          className={`link hover:underline underline-offset-3`}
          href="#education-section"
        >
          Academic Details
        </a>
        <a
          className={`link hover:underline underline-offset-3 `}
          href="#research-section"
        >
          Research Details
        </a>
      </nav>

      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative">
            <Image
              src={img}
              alt={`${facultyDetails?.faculty_name || ""} ${
                facultyDetails?.faculty_name || ""
              }`}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
              width={100}
              height={100}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.faculty_name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Faculty ID</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.employee_id}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.designation}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.contactNo}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.emailId || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="personal-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Qualification</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.qualification || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.title || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Alternate Contact No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.alternateContactNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Emergency Contact No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.emergencyContactNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Aadhar No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.adharNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">PAN No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.panNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.dob || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.gender || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.nationality || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">First Address Line 1</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.firstAddressLine || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Correspondence Address Line 1
              </p>
              <p className="font-medium text-gray-800">
                {facultyDetails.correspondenceAddressLine || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Religion</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.religion || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Caste</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.caste || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.category || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Mother Tongue</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.motherTongue || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Specially Challenged</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.speciallyChallenged ? "Yes" : "No"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Remarks</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.remarks || "N/A"}
              </p>
            </div>
            {/* <div className="space-y-1">
            <p className="text-sm text-gray-500">Languages</p>
            <p className="font-medium text-gray-800">
              {facultyDetails.data.languages || "N/A"}
            </p>
          </div> */}
          </div>

          {/* Bank details */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Bank Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Bank Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.bankName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Account Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.accountName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.accountType || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.accountNo || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.branch || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">IFSC</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.ifsc || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">PF Number</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.pfNumber || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">UAN Number</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.uanNumber || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Pension Number</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.pensionNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Family Details */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Family Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Mother's Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.motherName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Father's Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.fatherName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Spouse Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.spouseName || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Education Details */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="education-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Education Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.Program || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Registration Number</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.regNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">School/College</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.schoolCollege || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.specialization || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Medium of Instruction</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.mediumOfInstruction || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Pass Class</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.passClass || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Year of Award</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.yearOfAward || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Research Details */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="research-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Research Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">GoogleScholarId</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.googleScholarId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Father's Name</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.orcidId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Spouse Name</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.scopusId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Spouse Name</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.publonsId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Spouse Name</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.researchId || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
