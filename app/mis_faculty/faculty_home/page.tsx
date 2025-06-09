"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Layout from "../../../app/components/ui/Layout";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import img from "../../assets/buddha.jpg";

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

interface facultyConsultancyDetails {
  employee_id: string;
  sanctionedDate?: string;
  projectPeriod?: string;
  amount?: number;
  principalInvestigator?: string;
  coPrincipalInvestigator?: string;
  status?: string;
}

interface ConferenceAndJournalDetails {
  id: number;
  employee_id: string;
  typeOfPublication?: string;
  title?: string;
  doi?: string;
  issn?: string;
  joConName?: string;
  yearOfPublication?: string;
  pageNo?: string;
  authors?: string;
  publishedUnder?: string;
  impactFactor?: string;
  quartile?: string;
  sponsor?: string;
  venue?: string;
  volume?: string;
  issueNo?: string;
}

interface BookPublicationDetails {
  id: number;
  publicationType?: string;
  name?: string;
  volume?: string;
  pageNumber?: string;
  issn?: string;
  publisher?: string;
  title?: string;
  area?: string;
  impactFactor?: string;
  employee_id: string;
  yearOfPublish?: string;
  authors?: string;
}

interface AwardAndRecognitionDetails {
  id: number;
  employee_id: string;
  recognitionorawardReceived?: string;
  recognitionorawardFrom?: string;
  awardReceived?: string;
  recognitionorawardDate?: string;
  awardDate?: string;
  awardFrom?: string;
}

interface AddtionalResponsibilityDetails {
  id: number;
  employee_id: string;
  level?: string;
  fromDate?: string;
  toDate?: string;
  responsibility?: string;
}

interface EventAttendedDetails {
  id: number;
  fromDate: string;
  toDate: string;
  organizer: string;
  venue: string;
  sponsor: string;
  targetAudience: string;
  employee_id: string;
  nameofevent: string;
  typeofevent: string;
}

interface EventOrganizedDetails {
  id: number;
  typeofevent: string;
  nameofevent: string;
  fromDate: string;
  toDate: string;
  organizer: string;
  venue: string;
  sponsor: string;
  targetAudience: string;
  employee_id: string;
}

interface IndustryExperienceDetails {
  id: number;
  employee_id: string;
  organization: string;
  designation: string;
  fromDate: string;
  toDate: string;
}

interface OutreachActivityDetails {
  id: number;
  employee_id: string;
  activity: string;
  role: string;
  fromDate: string;
  toDate: string;
  place: string;
}

interface PatentDetails {
  id: number;
  employee_id: string;
  areaOfResearch: string;
  grantedYear: string;
  patentNo: string;
  patentStatus: string;
  authors: string;
}

interface ProfessionalMembersDetails {
  employee_id: string;
  professionalBody: string;
  membershipId: string;
  membershipSince: string;
  membershipType: string;
}

interface TeachingExperienceDetails {
  id: number;
  employee_id: string;
  instituteName: string;
  fromDate: string;
  toDate: string;
  Designation: string;
  departmentName: string;
}

interface ResearchProjectDetails {
  employee_id: string;
  projectTitle: string;
  pi: string;
  coPi: string;
  dOfSanction: string;
  duration: string;
  fundingAgency: string;
  amount: number;
  status: string;
}

interface ResearchExpDetails {
  employee_id: string;
  areaOfResearch: string;
  from_date: string;
  to_date: string;
}

interface ResearchSupervision {
  id: number;
  employee_id: string;
  Research_Supervisor?: string;
  Research_Scholar_Name?: string;
  USN?: string;
  University?: string;
  Institute?: string;
  Discipline?: string;
  Title_Research?: string;
  Status?: string;
}
interface EmployeeMoocDetails {
  id: number;
  employee_id: string;
  title: string;
  typeofMooc: string;
  duration: string;
  result: string;
  grade: string;
  FDP: string;
}

const processData = (entries: any[], dateField?: string) => {
  if (!entries || !dateField) return {};
  const yearCounts: { [key: string]: number } = {};

  entries.forEach((entry) => {
    const dateValue = entry[dateField];
    if (!dateValue) return;

    const year = dateValue.length === 4 ? dateValue : new Date(dateValue).getFullYear();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  return yearCounts;
};
const Home = () => {
  const router = useRouter();
  
  // Get employee ID from sessionStorage (only available on client side)
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Data state variables
  const [facultyDetails, setFacultyDetails] = useState<FacultyDetails | null>(null);
  const [researchDetails, setResearchDetails] = useState<facultyResearchDetails | null>(null);
  const [educationDetails, setEducationDetails] = useState<facultyEducationDetails | null>(null);
  const [consultancyDetails, setConsultancyDetails] = useState<facultyConsultancyDetails[]>([]);
  const [conferenceAndJournal, setConferenceAndJournal] = useState<ConferenceAndJournalDetails | any>([]);
  const [bookPublication, setBookPublication] = useState<BookPublicationDetails | any>([]);
  const [awardAndRecognition, setAwardAndRecognition] = useState<AwardAndRecognitionDetails | any>([]);
  const [addtionalResponsibility, setAddtionalResponsibility] = useState<AddtionalResponsibilityDetails | null>(null);
  const [eventAttended, setEventAttended] = useState<EventAttendedDetails[]>([]);
  const [eventOrganized, setEventOrganized] = useState<EventOrganizedDetails[]>([]);
  const [industryExperience, setIndustryExperience] = useState<IndustryExperienceDetails[]>([]);
  const [outreachActivity, setOutreachActivity] = useState<OutreachActivityDetails[]>([]);
  const [patent, setPatent] = useState<PatentDetails[]>([]);
  const [professionalMembers, setProfessionalMembers] = useState<ProfessionalMembersDetails[]>([]);
  const [teachingExperience, setTeachingExperience] = useState<TeachingExperienceDetails[]>([]);
  const [researchProjects, setResearchProjects] = useState<ResearchProjectDetails[]>([]);
  const [researchExp, setResearchExp] = useState<ResearchExpDetails[]>([]);
  const [researchSupervision, setResearchSupervision] = useState<ResearchSupervision[]>([]);
    const [employeeMoocs, setEmployeeMoocs] = useState<EmployeeMoocDetails[]>([]);
  useEffect(() => {
    const empId = sessionStorage.getItem("emp_id");
    if (empId) {
      setEmployeeId(empId);
    }
  }, []);

  // Fetch data once employeeId is available
  useEffect(() => {
    async function fetchFacultyDetails() {
      if (!employeeId) return;

      try {
        const response = await fetch("/api/fetchFullFacDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          // If faculty not found, redirect to registration
          if (
            response.status === 404 ||
            errorData.error?.toLowerCase().includes("not found")
          ) {
            router.push(`/faculty`); // ✅ your custom register route
            return;
          }
          throw new Error(
            errorData.error || "Failed to fetch faculty details."
          );
        }

        const data = await response.json();
        setFacultyDetails(data.personalDetails);
        setResearchDetails(data.researchDetails);
        setEducationDetails(data.educationDetails);
        console.log(data.educationDetails);
        setConsultancyDetails(data.consultancyDetails);
        setConferenceAndJournal(data.conferenceAndJournal);
        console.log(data.conferenceAndJournal);
        setBookPublication(data.bookPublication);
        setAwardAndRecognition(data.awardAndRecognition);
        setAddtionalResponsibility(data.addtionalResponsibility);
        setEventAttended(data.eventAttended);
        setEventOrganized(data.eventOrganized);
        setIndustryExperience(data.industryExperience);
        setOutreachActivity(data.outreachActivity);
        console.log(data.patent);
        setPatent(data.patent);
        setProfessionalMembers(data.professionalMembers);
        setTeachingExperience(data.teachingExperience);
        setResearchProjects(data.researchProjects);
        setResearchExp(data.researchExp);
        setResearchSupervision(data.researchSuperVision);
        setEmployeeMoocs(data.employeeMoocs || []);
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
  }, [employeeId]);

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

  return (
    <Layout moduleType="faculty">
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Book Publications Card */}
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">{bookPublication?.length ?? 0}</h3>
          <p className="text-base">
            Book Publications
            {bookPublication?.length > 0 && (
              <>
                <span className="block text-base mt-1 text-blue-200">
                  Latest: {getLatestYear(bookPublication, "yearOfPublish")}
                </span>
                <span className="block text-base text-blue-200">
                  This Year: {getThisYearCount(bookPublication, "yearOfPublish")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Conference & Journals Card */}
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">{conferenceAndJournal?.length ?? 0}</h3>
          <p className="text-base">
            Conferences & Journals
            {conferenceAndJournal?.length > 0 && (
              <>
                <span className="block text-base mt-1 text-blue-200">
                  Latest: {getLatestYear(conferenceAndJournal, "yearOfPublication")}
                </span>
                <span className="block text-base text-blue-200">
                  This Year: {getThisYearCount(conferenceAndJournal, "yearOfPublication")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Awards & Recognition Card */}
        <div className="bg-blue-700 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">{awardAndRecognition?.length ?? 0}</h3>
          <p className="text-base">
            Awards & Recognition
            {awardAndRecognition?.length > 0 && (
              <>
                <span className="block text-base mt-1 text-blue-200">
                  Latest: {getLatestYear(awardAndRecognition, "awardDate")}
                </span>
                <span className="block text-base text-blue-200">
                  This Year: {getThisYearCount(awardAndRecognition, "awardDate")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Events Card */}
        <div className="bg-blue-800 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">
            {(eventAttended?.length ?? 0) + (eventOrganized?.length ?? 0)}
          </h3>
          <p className="text-base">
            Total Events
            {(eventAttended?.length > 0 || eventOrganized?.length > 0) && (
              <>
                <span className="block text-base mt-1 text-blue-200">
                  Latest:{" "}
                  {Math.max(
                    getLatestYear(eventAttended, "toDate") || 0,
                    getLatestYear(eventOrganized, "toDate") || 0
                  )}
                </span>
                <span className="block text-base text-blue-200">
                  This Year:{" "}
                  {getThisYearCount(eventAttended, "toDate") +
                    getThisYearCount(eventOrganized, "toDate")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Outreach Activities Card */}
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">{outreachActivity?.length ?? 0}</h3>
          <p className="text-base">
            Outreach Activities
            {outreachActivity?.length > 0 && (
              <>
                <span className="block text-base mt-1 text-blue-200">
                  Latest: {getLatestYear(outreachActivity, "toDate")}
                </span>
                <span className="block text-base text-blue-200">
                  This Year: {getThisYearCount(outreachActivity, "toDate")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Patents Card */}
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">{patent?.length ?? 0}</h3>
          <p className="text-base">
            Patents
            {patent?.length > 0 && (
              <>
                <span className="block text-base mt-1 text-blue-200">
                  Latest: {getLatestYear(patent, "grantedYear")}
                </span>
                <span className="block text-base text-blue-200">
                  This Year: {getThisYearCount(patent, "grantedYear")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Professional Memberships Card */}
        <div className="bg-blue-700 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">{professionalMembers?.length ?? 0}</h3>
          <p className="text-base">
            Professional Memberships
            {professionalMembers?.length > 0 && (
              <>
                <span className="block text-base mt-1 text-blue-200">
                  Latest: {getLatestYear(professionalMembers, "membershipSince")}
                </span>
                <span className="block text-base text-blue-200">
                  This Year: {getThisYearCount(professionalMembers, "membershipSince")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Teaching Experience Card */}
        <div className="bg-blue-800 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">{teachingExperience?.length ?? 0}</h3>
          <p className="text-base">
            Teaching Experience
            {teachingExperience?.length > 0 && (
              <>
                <span className="block text-base mt-1 text-blue-200">
                  Latest: {getLatestYear(teachingExperience, "toDate")}
                </span>
                <span className="block text-base text-blue-200">
                  This Year: {getThisYearCount(teachingExperience, "toDate")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Research Projects Card */}
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">{researchProjects?.length ?? 0}</h3>
          <p className="text-base">
            Research Projects
            {researchProjects?.length > 0 && (
              <>
                <span className="block text-base mt-1 text-blue-200">
                  Latest: {getLatestYear(researchProjects, "dOfSanction")}
                </span>
                <span className="block text-base text-blue-200">
                  This Year: {getThisYearCount(researchProjects, "dOfSanction")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Research Experience Card */}
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">{researchExp?.length ?? 0}</h3>
          <p className="text-base">
            Research Experience
            {researchExp?.length > 0 && (
              <>
                <span className="block text-base mt-1 text-blue-200">
                  Latest: {getLatestYear(researchExp, "to_date")}
                </span>
                <span className="block text-base text-blue-200">
                  This Year: {getThisYearCount(researchExp, "to_date")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Research Supervision Card */}
        <div className="bg-blue-700 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-3xl font-bold mb-1">{researchSupervision?.length ?? 0}</h3>
          <p className="text-base">
            Research Supervision
            {researchSupervision?.length > 0 && (
              <span className="block text-base mt-1 text-blue-200">
                {researchSupervision.length} ongoing
              </span>
            )}
          </p>
        </div>
                  {/* MOOC Courses Card */}
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold mb-1">{employeeMoocs.length}</h3>
            <p className="text-base">
              MOOC Courses
              {employeeMoocs.length > 0 && (
                <>
                  <span className="block text-base mt-1 text-blue-200">
                    Latest: {/* if you have a date field, plug it in here */}
                  </span>
                  <span className="block text-base text-blue-200">
                    This Year: {/* likewise, e.g. getThisYearCount(employeeMoocs, "someDateField") */}
                  </span>
                </>
              )}
            </p>
          </div>
      </div>
    </Layout>
  );
};

export default Home;
