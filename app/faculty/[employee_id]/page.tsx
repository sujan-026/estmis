"use client";

import { useEffect, useState } from "react";
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
  maritalstatus?: string;
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
  title?: string;
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
  author: string;
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


export default function FacultyDetailsPage() {
  const params = useParams();
  const employee_id = params?.employee_id;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const [facultyDetails, setFacultyDetails] = useState<FacultyDetails | null>(
    null
  );
  const [researchDetails, setResearchDetails] =
    useState<facultyResearchDetails | null>(null);
  const [educationDetails, setEducationDetails] =
    useState<facultyEducationDetails | null>(null);
  const [consultancyDetails, setConsultancyDetails] = useState<
    facultyConsultancyDetails[]
  >([]);
  const [conferenceAndJournal, setConferenceAndJournal] =
    useState<ConferenceAndJournalDetails | null>([]);
  const [bookPublication, setBookPublication] =
    useState<BookPublicationDetails | null>(null);
  const [awardAndRecognition, setAwardAndRecognition] =
    useState<AwardAndRecognitionDetails | null>(null);
  const [addtionalResponsibility, setAddtionalResponsibility] =
    useState<AddtionalResponsibilityDetails | null>(null);

  const [eventAttended, setEventAttended] = useState<EventAttendedDetails[]>(
    []
  );
  const [eventOrganized, setEventOrganized] = useState<EventOrganizedDetails[]>(
    []
  );
  const [industryExperience, setIndustryExperience] = useState<
    IndustryExperienceDetails[]
  >([]);

  const [outreachActivity, setOutreachActivity] = useState<
    OutreachActivityDetails[]
  >([]);
  const [patent, setPatent] = useState<PatentDetails[]>([]);
  const [professionalMembers, setProfessionalMembers] = useState<
    ProfessionalMembersDetails[]
  >([]);
  const [teachingExperience, setTeachingExperience] = useState<
    TeachingExperienceDetails[]
  >([]);
  const [researchProjects, setResearchProjects] = useState<
    ResearchProjectDetails[]
  >([]);
  const [researchExp, setResearchExp] = useState<
    ResearchExpDetails[]
  >([]);
  const [researchSupervision, setResearchSupervision] = useState<
    ResearchSupervision[]
  >([]);


  useEffect(() => {
    console.log("Client-side log"); // This appears in the browser's console
  }, []);

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

  // const customLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  //   return `http://192.168.29.12/Employee_photos/${src}`;
  // };
// Add these utility functions at the top
// Add these utility functions INSIDE your component, before the return statement
const getCurrentYear = () => new Date().getFullYear();

const getLatestYear = (entries: any[], dateField?: string): string | null => {
  if (!entries || entries.length === 0 || !dateField) return null;
  
  const dates = entries
    .map(entry => {
      const dateValue = entry[dateField];
      if (!dateValue) return null;
      if (/^\d{4}$/.test(dateValue)) return parseInt(dateValue);
      const date = new Date(dateValue);
      return date.getFullYear();
    })
    .filter(year => year !== null);

  return dates.length > 0 ? Math.max(...dates).toString() : null;
};

const getThisYearCount = (entries: any[], dateField?: string): number => {
  if (!entries || !dateField) return 0;
  const currentYear = getCurrentYear();
  
  return entries.filter(entry => {
    const dateValue = entry[dateField];
    if (!dateValue) return false;
    const year = dateValue.length === 4 ? parseInt(dateValue) : new Date(dateValue).getFullYear();
    return year === currentYear;
  }).length;
};

  return (
    <div>
      {/* <FacultyProfileNav /> */}
      <nav
        className="flex items-center justify-end gap-4 mr-4 mt-2 text-xl text-blue-500 font-bold
        bg-white shadow-md sticky top-0 z-50 p-4"
      >
        <a
          className="link hover:underline underline-offset-3"
          href="/mis_faculty/faculty_home"
        >
          Home
        </a>
        <a
          className="link hover:underline underline-offset-3"
          href="#personal-section"
        >
          Personal Details
        </a>
        <a
          className="link hover:underline underline-offset-3"
          href="#education-section"
        >
          Academic Details
        </a>
        <a
          className="link hover:underline underline-offset-3"
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
            {/* <Image
              loader={customLoader}
              // src={facultyDetails.employee_id + ".jpg"} // just the image name
              src={'//192.168.29.12/Employee_photos/ECU03.jpg'} // just the image name
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
              alt="Employee ECU03"
              width={100}
              height={100}
            /> */}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">
                <span className="">{facultyDetails.title}</span>{" "}
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
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.contactNo}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Email Id</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.emailId || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
<div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Book Publications Card */}
  <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-2xl font-bold mb-1">{bookPublication?.length ?? 0}</h3>
    <p className="text-sm">
      Book Publications
      {bookPublication?.length > 0 && (
        <>
          <span className="block text-xs mt-1 text-blue-200">
            Latest: {getLatestYear(bookPublication, 'yearOfPublish')}
          </span>
          <span className="block text-xs text-blue-200">
            This Year: {getThisYearCount(bookPublication, 'yearOfPublish')}
          </span>
        </>
      )}
    </p>
  </div>

  {/* Conference & Journals Card */}
  <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-2xl font-bold mb-1">{conferenceAndJournal?.length ?? 0}</h3>
    <p className="text-sm">
      Conferences & Journals
      {conferenceAndJournal?.length > 0 && (
        <>
          <span className="block text-xs mt-1 text-blue-200">
            Latest: {getLatestYear(conferenceAndJournal, 'yearOfPublication')}
          </span>
          <span className="block text-xs text-blue-200">
            This Year: {getThisYearCount(conferenceAndJournal, 'yearOfPublication')}
          </span>
        </>
      )}
    </p>
  </div>

  {/* Awards & Recognition Card */}
  <div className="bg-blue-700 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-2xl font-bold mb-1">{awardAndRecognition?.length ?? 0}</h3>
    <p className="text-sm">
      Awards & Recognition
      {awardAndRecognition?.length > 0 && (
        <>
          <span className="block text-xs mt-1 text-blue-200">
            Latest: {getLatestYear(awardAndRecognition, 'awardDate')}
          </span>
          <span className="block text-xs text-blue-200">
            This Year: {getThisYearCount(awardAndRecognition, 'awardDate')}
          </span>
        </>
      )}
    </p>
  </div>

  {/* Events Card */}
  <div className="bg-blue-800 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-2xl font-bold mb-1">
      {(eventAttended?.length ?? 0) + (eventOrganized?.length ?? 0)}
    </h3>
    <p className="text-sm">
      Total Events
      {(eventAttended?.length > 0 || eventOrganized?.length > 0) && (
        <>
          <span className="block text-xs mt-1 text-blue-200">
            Latest: {Math.max(
              getLatestYear(eventAttended, 'toDate') || 0,
              getLatestYear(eventOrganized, 'toDate') || 0
            )}
          </span>
          <span className="block text-xs text-blue-200">
            This Year: {getThisYearCount(eventAttended, 'toDate') + getThisYearCount(eventOrganized, 'toDate')}
          </span>
        </>
      )}
    </p>
  </div>

  {/* Outreach Activities Card */}
  <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-2xl font-bold mb-1">{outreachActivity?.length ?? 0}</h3>
    <p className="text-sm">
      Outreach Activities
      {outreachActivity?.length > 0 && (
        <>
          <span className="block text-xs mt-1 text-blue-200">
            Latest: {getLatestYear(outreachActivity, 'toDate')}
          </span>
          <span className="block text-xs text-blue-200">
            This Year: {getThisYearCount(outreachActivity, 'toDate')}
          </span>
        </>
      )}
    </p>
  </div>

  {/* Patents Card */}
  <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-2xl font-bold mb-1">{patent?.length ?? 0}</h3>
    <p className="text-sm">
      Patents
      {patent?.length > 0 && (
        <>
          <span className="block text-xs mt-1 text-blue-200">
            Latest: {getLatestYear(patent, 'grantedYear')}
          </span>
          <span className="block text-xs text-blue-200">
            This Year: {getThisYearCount(patent, 'grantedYear')}
          </span>
        </>
      )}
    </p>
  </div>

  {/* Professional Memberships Card */}
  <div className="bg-blue-700 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-2xl font-bold mb-1">{professionalMembers?.length ?? 0}</h3>
    <p className="text-sm">
      Professional Memberships
      {professionalMembers?.length > 0 && (
        <>
          <span className="block text-xs mt-1 text-blue-200">
            Latest: {getLatestYear(professionalMembers, 'membershipSince')}
          </span>
          <span className="block text-xs text-blue-200">
            This Year: {getThisYearCount(professionalMembers, 'membershipSince')}
          </span>
        </>
      )}
    </p>
  </div>

  

  {/* Research Projects Card */}
  <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-2xl font-bold mb-1">{researchProjects?.length ?? 0}</h3>
    <p className="text-sm">
      Research Projects
      {researchProjects?.length > 0 && (
        <>
          <span className="block text-xs mt-1 text-blue-200">
            Latest: {getLatestYear(researchProjects, 'dOfSanction')}
          </span>
          <span className="block text-xs text-blue-200">
            This Year: {getThisYearCount(researchProjects, 'dOfSanction')}
          </span>
        </>
      )}
    </p>
  </div>

  {/* Research Experience Card */}
  <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-2xl font-bold mb-1">{researchExp?.length ?? 0}</h3>
    <p className="text-sm">
      Research Experience
      {researchExp?.length > 0 && (
        <>
          <span className="block text-xs mt-1 text-blue-200">
            Latest: {getLatestYear(researchExp, 'to_date')}
          </span>
          <span className="block text-xs text-blue-200">
            This Year: {getThisYearCount(researchExp, 'to_date')}
          </span>
        </>
      )}
    </p>
  </div>

  {/* Research Supervision Card */}
  <div className="bg-blue-700 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-2xl font-bold mb-1">{researchSupervision?.length ?? 0}</h3>
    <p className="text-sm">
      Research Supervision
      {researchSupervision?.length > 0 && (
        <span className="block text-xs mt-1 text-blue-200">
          {researchSupervision.length} ongoing
        </span>
      )}
    </p>
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
              <p className="text-sm text-gray-500">Highest Qualification</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.qualification || "N/A"}
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
                {facultyDetails.dob ? new Date(facultyDetails.dob).toLocaleDateString('en-GB') : "N/A"}
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
              <p className="text-sm text-gray-500">Permanent Address</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.firstAddressLine || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Correspondence Address
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
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Languages Known</p>
              <div className="font-medium text-gray-800 space-y-1">
                {facultyDetails.languages ? (
                  (() => {
                    let languages = [];
                    try {
                      // Check if it's a JSON string and parse it
                      languages = Array.isArray(facultyDetails.languages)
                        ? facultyDetails.languages // Already an array
                        : JSON.parse(facultyDetails.languages); // JSON string
                    } catch (e) {
                      // Fallback for comma-separated string
                      languages = facultyDetails.languages
                        .split(",")
                        .map((lang) => lang.trim());
                    }
                    return languages.map((language, index) => (
                      <p key={index}>{language}</p>
                    ));
                  })()
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
          </div>

          {/* Bank details */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Bank And Other Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Bank Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.bankName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Account Holder Name</p>
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
                <p className="text-sm text-gray-500">Mother&apos;s Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.motherName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Father&apos;s Name</p>
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
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Marital Status</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.maritalstatus || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Number of children</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.children || "N/A"}
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
            {educationDetails ? (
              Object.entries(educationDetails).map(([key, value], index) => (
                <div key={index} className="space-y-1">
                  {/* <p className="text-sm text-black font-weight:500">
                    Education {index + 1}
                  </p> */}
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium text-gray-800">
                    {value.Program || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="font-medium text-gray-800">
                    {value.regNo || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">School/College</p>
                  <p className="font-medium text-gray-800">
                    {value.schoolCollege || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Specialization</p>
                  <p className="font-medium text-gray-800">
                    {value.specialization || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Medium of Instruction</p>
                  <p className="font-medium text-gray-800">
                    {value.mediumOfInstruction || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Pass Class</p>
                  <p className="font-medium text-gray-800">
                    {value.passClass || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Year of Pass</p>
                  <p className="font-medium text-gray-800">
                    {value.yearOfAward || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education data available.</p>
            )}
          </div>
        </div>

        {/* Additional Responsibility */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="additional-responsibility-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additional Responsibility
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addtionalResponsibility && addtionalResponsibility.length > 0 ? (
              addtionalResponsibility.map((responsibility, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Responsibility {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="font-medium text-gray-800">
                    {responsibility.level || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Responsibility</p>
                  <p className="font-medium text-gray-800">
                    {responsibility.responsibility || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">From Date</p>
                  <p className="font-medium text-gray-800">
                    {responsibility.fromDate?.split("T")[0] || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">To Date</p>
                  <p className="font-medium text-gray-800">
                    {responsibility.toDate?.split("T")[0] || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No additional responsibility data available.
              </p>
            )}
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
              <p className="text-sm text-gray-500">Orcid Id</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.orcidId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Scopus Id</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.scopusId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Publons Id</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.publonsId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Researcher Id</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.researchId || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Consultancy Details */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="consultancy-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Consultancy Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultancyDetails ? (
              Object.entries(consultancyDetails).map(([key, value], index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Consultancy {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-medium text-gray-800">
                    {value.title || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Sanctioned Date</p>
                  <p className="font-medium text-gray-800">
                    {value.sanctionedDate ? new Date(value.sanctionedDate).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '-') : "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Project Period</p>
                  <p className="font-medium text-gray-800">
                    {value.projectPeriod || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-gray-800">
                    {value.amount || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Principal Investigator
                  </p>
                  <p className="font-medium text-gray-800">
                    {value.principalInvestigator || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Co-Principal Investigator
                  </p>
                  <p className="font-medium text-gray-800">
                    {value.coPrincipalInvestigator || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-800">
                    {value.status || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No consultancy data available.</p>
            )}
          </div>
        </div>

        {/* Book Publication */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="conference-bookPublication-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Book Publication
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Type of Publication</p>
              <p className="font-medium text-gray-800">
                {bookPublication?.publicationType || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Edition</p>
              <p className="font-medium text-gray-800">
                {bookPublication?.volume || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">ISSN</p>
              <p className="font-medium text-gray-800">
                {bookPublication?.issn || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Publisher</p>
              <p className="font-medium text-gray-800">
                {bookPublication?.publsiher || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Title of Book</p>
              <p className="font-medium text-gray-800">
                {bookPublication?.title || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Area</p>
              <p className="font-medium text-gray-800">
                {bookPublication?.area || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Year Of Publish</p>
              <p className="font-medium text-gray-800">
                {bookPublication?.yearOfPublication || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Authors</p>
              <p className="font-medium text-gray-800">
                {bookPublication?.authors || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* ConferenceAndJournal */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="book-publication-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Conference And Journal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conferenceAndJournal && conferenceAndJournal.length > 0 ? (
              <>
                {/* National Journals (NJ, National Journal) */}
                {conferenceAndJournal
                  .filter((item) =>
                    ["NJ", "National Journal"].includes(item.typeOfPublication)
                  )
                  .map((value, index) => (
                    <div
                      key={`national-journal-${index}`}
                      className="space-y-1"
                    >
                      <p className="text-lg font-semibold text-blue-600">
                        National Journal {index + 1}
                      </p>
                      <p className="text-sm text-gray-500">Title</p>
                      <p className="font-medium text-gray-800">
                        {value.title || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">DOI</p>
                      <p className="font-medium text-gray-800">
                        {value.doi || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">ISSN</p>
                      <p className="font-medium text-gray-800">
                        {value.issn || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Year Of Publication
                      </p>
                      <p className="font-medium text-gray-800">
                        {value.yearOfPublication || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Authors</p>
                      <p className="font-medium text-gray-800">
                        {value.authors || "N/A"}
                      </p>
                    </div>
                  ))}

                {/* International Journals (IJ, International Journal) */}
                {conferenceAndJournal
                  .filter((item) =>
                    ["IJ", "International Journal"].includes(
                      item.typeOfPublication
                    )
                  )
                  .map((value, index) => (
                    <div
                      key={`international-journal-${index}`}
                      className="space-y-1"
                    >
                      <p className="text-lg font-semibold text-green-600">
                        International Journal {index + 1}
                      </p>
                      <p className="text-sm text-gray-500">Title</p>
                      <p className="font-medium text-gray-800">
                        {value.title || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">DOI</p>
                      <p className="font-medium text-gray-800">
                        {value.doi || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">ISSN</p>
                      <p className="font-medium text-gray-800">
                        {value.issn || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Year Of Publication
                      </p>
                      <p className="font-medium text-gray-800">
                        {value.yearOfPublication || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Authors</p>
                      <p className="font-medium text-gray-800">
                        {value.authors || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Journal/Conference Name</p>
                      <p className="font-medium text-gray-800">
                        {value.joConName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Page Number</p>
                      <p className="font-medium text-gray-800">
                        {value.pageNo || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Published Under</p>
                      <p className="font-medium text-gray-800">
                        {value.publishedUnder || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Sponsor</p>
                      <p className="font-medium text-gray-800">
                        {value.sponsor || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium text-gray-800">
                        {value.venue || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Volume</p>
                      <p className="font-medium text-gray-800">
                        {value.volume || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Issue Number</p>
                      <p className="font-medium text-gray-800">
                        {value.issueNo || "N/A"}
                      </p>
                    </div>
                  ))}

                {/* National Conferences (NC, National Conference) */}
                {conferenceAndJournal
                  .filter((item) =>
                    ["NC", "National Conference"].includes(
                      item.typeOfPublication
                    )
                  )
                  .map((value, index) => (
                    <div
                      key={`national-conference-${index}`}
                      className="space-y-1"
                    >
                      <p className="text-lg font-semibold text-orange-600">
                        National Conference {index + 1}
                      </p>
                      <p className="text-sm text-gray-500">Title</p>
                      <p className="font-medium text-gray-800">
                        {value.title || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium text-gray-800">
                        {value.venue || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Year Of Publication
                      </p>
                      <p className="font-medium text-gray-800">
                        {value.yearOfPublication || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Authors</p>
                      <p className="font-medium text-gray-800">
                        {value.authors || "N/A"}
                      </p>
                    </div>
                  ))}

                {/* International Conferences (IC, International Conference) */}
                {conferenceAndJournal
                  .filter((item) =>
                    ["IC", "International Conference"].includes(
                      item.typeOfPublication
                    )
                  )
                  .map((value, index) => (
                    <div
                      key={`international-conference-${index}`}
                      className="space-y-1"
                    >
                      <p className="text-lg font-semibold text-red-600">
                        International Conference {index + 1}
                      </p>
                      <p className="text-sm text-gray-500">Title</p>
                      <p className="font-medium text-gray-800">
                        {value.title || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium text-gray-800">
                        {value.venue || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Year Of Publication
                      </p>
                      <p className="font-medium text-gray-800">
                        {value.yearOfPublication || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Authors</p>
                      <p className="font-medium text-gray-800">
                        {value.authors || "N/A"}
                      </p>
                    </div>
                  ))}
              </>
            ) : (
              <p className="text-gray-500">
                No conference and journal data available.
              </p>
            )}
          </div>
        </div>

        {/* Award & Recognition */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="award-recognition-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Award & Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awardAndRecognition ? (
              Object.entries(awardAndRecognition).map(([key, value], index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Award & Recognition {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">
                    Recognition Award Received
                  </p>
                  <p className="font-medium text-gray-800">
                    {value.recognitionorawardReceived || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Recognition Award From
                  </p>
                  <p className="font-medium text-gray-800">
                    {value.recognitionorawardFrom || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Award Received Date</p>
                  <p className="font-medium text-gray-800">
                    {value.awardReceived || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No award and recognition data available.
              </p>
            )}
          </div>
        </div>

        {/* Events Attended */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="event-attended-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Events Attended
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventAttended && eventAttended.length > 0 ? (
              eventAttended.map((event, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Event {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">Event Name</p>
                  <p className="font-medium text-gray-800">
                    {event.nameofevent || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Type of Event</p>
                  <p className="font-medium text-gray-800">
                    {event.typeofevent || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Organizer</p>
                  <p className="font-medium text-gray-800">
                    {event.organizer || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-medium text-gray-800">
                    {event.venue || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Sponsor</p>
                  <p className="font-medium text-gray-800">
                    {event.sponsor || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Target Audience</p>
                  <p className="font-medium text-gray-800">
                    {event.targetAudience || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">From Date</p>
                  <p className="font-medium text-gray-800">
                    {event.fromDate?.split("T")[0] || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">To Date</p>
                  <p className="font-medium text-gray-800">
                    {event.toDate?.split("T")[0] || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No event data available.</p>
            )}
          </div>
        </div>

        {/* Events Organized */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="event-organized-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Events Organized
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventOrganized && eventOrganized.length > 0 ? (
              eventOrganized.map((event, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Event Organized {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">Event Name</p>
                  <p className="font-medium text-gray-800">
                    {event.nameofevent || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Type of Event</p>
                  <p className="font-medium text-gray-800">
                    {event.typeofevent || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Organizer</p>
                  <p className="font-medium text-gray-800">
                    {event.organizer || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-medium text-gray-800">
                    {event.venue || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Sponsor</p>
                  <p className="font-medium text-gray-800">
                    {event.sponsor || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Target Audience</p>
                  <p className="font-medium text-gray-800">
                    {event.targetAudience || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">From Date</p>
                  <p className="font-medium text-gray-800">
                    {event.fromDate?.split("T")[0] || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">To Date</p>
                  <p className="font-medium text-gray-800">
                    {event.toDate?.split("T")[0] || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No event organized data available.
              </p>
            )}
          </div>
        </div>

        {/* Outreach Activity */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="outreach-activity-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Outreach Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {outreachActivity.length === 0 ? (
              <p className="text-gray-500">
                No outreach activity data available.
              </p>
            ) : (
              outreachActivity.map((activity) => (
                <div key={activity.id} className="space-y-1">
                  <p className="text-lg text-black font-weight: 800">
                    Outreach Activity {activity.id}
                  </p>
                  <p className="font-medium text-gray-800">
                    {activity.activity || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-800">
                    {activity.role || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Place</p>
                  <p className="font-medium text-gray-800">
                    {activity.place || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">From Date</p>
                  <p className="font-medium text-gray-800">
                    {activity.fromDate || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">To Date</p>
                  <p className="font-medium text-gray-800">
                    {activity.toDate || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Patent */}
        <div className="mt-8 pt-8 border-t border-gray-200" id="patent-section">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Patents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patent && patent.length > 0 ? (
              patent.map((item, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Patent {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">Area of Research</p>
                  <p className="font-medium text-gray-800">
                    {item.areaOfResearch || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Granted Year</p>
                  <p className="font-medium text-gray-800">
                    {item.grantedYear || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Patent Number</p>
                  <p className="font-medium text-gray-800">
                    {item.patentNo || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Patent Status</p>
                  <p className="font-medium text-gray-800">
                    {item.patentStatus || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Author</p>
                  <p className="font-medium text-gray-800">
                    {item.author || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No patent data available.</p>
            )}
          </div>
        </div>

        {/* Professional Members */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="professional-membership-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Professional Memberships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professionalMembers && professionalMembers.length > 0 ? (
              professionalMembers.map((membership, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Professional Membership {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">Professional Body</p>
                  <p className="font-medium text-gray-800">
                    {membership.professionalBody || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Membership ID</p>
                  <p className="font-medium text-gray-800">
                    {membership.membershipId || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Membership Since</p>
                  <p className="font-medium text-gray-800">
                    {membership.membershipSince?.split("T")[0] || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Membership Type</p>
                  <p className="font-medium text-gray-800">
                    {membership.membershipType || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No professional memberships data available.
              </p>
            )}
          </div>
        </div>

        {/* Teaching Experience */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="teaching-experience-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Teaching Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachingExperience && teachingExperience.length > 0 ? (
              teachingExperience.map((experience, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Teaching Experience {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">Institute Name</p>
                  <p className="font-medium text-gray-800">
                    {experience.instituteName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="font-medium text-gray-800">
                    {experience.Designation || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Department Name</p>
                  <p className="font-medium text-gray-800">
                    {experience.departmentName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">From Date</p>
                  <p className="font-medium text-gray-800">
                    {experience.fromDate || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">To Date</p>
                  <p className="font-medium text-gray-800">
                    {experience.toDate || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Total Experience</p>
                  <p className="font-medium text-gray-800">
                    {experience.fromDate && experience.toDate ? 
                      (() => {
                        const fromDate = new Date(experience.fromDate);
                        const toDate = new Date(experience.toDate);
                        const diffYears = toDate.getFullYear() - fromDate.getFullYear();
                        const diffMonths = toDate.getMonth() - fromDate.getMonth();
                        const totalMonths = (diffYears * 12) + diffMonths;
                        const years = Math.floor(totalMonths / 12);
                        const months = totalMonths % 12;
                        return `${years} years ${months} months`;
                      })()
                      : "N/A"
                    }
                  </p>
                  
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No teaching experience data available.
              </p>
            )}
          </div>
        </div>

        {/* Research Projects */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="research-projects-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Research Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchProjects && researchProjects.length > 0 ? (
              researchProjects.map((project, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Research Project {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">Project Title</p>
                  <p className="font-medium text-gray-800">
                    {project.projectTitle || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Principal Investigator (PI)
                  </p>
                  <p className="font-medium text-gray-800">
                    {project.pi || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Co-Principal Investigator (Co-PI)
                  </p>
                  <p className="font-medium text-gray-800">
                    {project.coPi || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Date of Sanction</p>
                  <p className="font-medium text-gray-800">
                    {project.dOfSanction || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-800">
                    {project.duration || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Funding Agency</p>
                  <p className="font-medium text-gray-800">
                    {project.fundingAgency || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-gray-800">
                    {project.amount || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-800">
                    {project.status || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No research project data available.
              </p>
            )}
          </div>
        </div>

        {/* Research Experience */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="research-projects-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Research Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchExp && researchExp.length > 0 ? (
              researchExp.map((project, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Research Project {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">Area Of Research</p>
                  <p className="font-medium text-gray-800">
                    {project.areaOfResearch || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">From Date</p>
                  <p className="font-medium text-gray-800">
                    {project.from_date || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">To Date</p>
                  <p className="font-medium text-gray-800">
                    {project.to_date || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Research Experience</p>
                  <p className="font-medium text-gray-800">
                    {project.from_date && project.to_date ? 
                      Math.round((new Date(project.to_date).getTime() - new Date(project.from_date).getTime()) / (1000 * 60 * 60 * 24 * 365)) + " years"
                      : "N/A"
                    }
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No research project data available.
              </p>
            )}
          </div>
        </div>

        {/* Research SuperVision */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="research-supervision-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Research Supervision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchSupervision && researchSupervision.length > 0 ? (
              researchSupervision.map((item, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-black font-weight:500">
                    Research Supervision {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">Research Supervisor</p>
                  <p className="font-medium text-gray-800">
                    {item.Research_Supervisor || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Research Scholar Name</p>
                  <p className="font-medium text-gray-800">
                    {item.Research_Scholar_Name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">USN</p>
                  <p className="font-medium text-gray-800">
                    {item.USN || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">University</p>
                  <p className="font-medium text-gray-800">
                    {item.University || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Institute</p>
                  <p className="font-medium text-gray-800">
                    {item.Institute || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Discipline</p>
                  <p className="font-medium text-gray-800">
                    {item.Discipline || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Title of Research</p>
                  <p className="font-medium text-gray-800">
                    {item.Title_Research || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-800">
                    {item.Status || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No research supervision data available.
              </p>
            )}
          </div>
        </div>

        {/*  */}
      </div>
    </div>
  );
}
