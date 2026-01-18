import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PageMeta from "../components/common/PageMeta";

/* ================= TYPES ================= */
interface Education {
    degree: string;
    department: string;
    collegeName: string;
    startDate: string;
    endDate: string;
    percentage: string;
    overall: string;
    collegeAddress: string;
}

interface Project {
    title: string;
    clientName: string;
    clientLocation: string;
    domain: string;
}

/* ================= INITIAL STATES ================= */
const emptyEducation: Education = {
    degree: "",
    department: "",
    collegeName: "",
    startDate: "",
    endDate: "",
    percentage: "",
    overall: "",
    collegeAddress: "",
};

const emptyProject: Project = {
    title: "",
    clientName: "",
    clientLocation: "",
    domain: "",
};


export default function CandidateInformation() {
    const [loading, setLoading] = useState(false);

    const [educations, setEducations] = useState<Education[]>([emptyEducation]);
    const [projects, setProjects] = useState<Project[]>([emptyProject]);

    /* ================= EDUCATION HANDLERS ================= */
    const addEducation = () =>
        setEducations([...educations, { ...emptyEducation }]);

    const removeEducation = (index: number) =>
        setEducations(educations.filter((_, i) => i !== index));

    const updateEducation = (
        index: number,
        field: keyof Education,
        value: string
    ) => {
        const updated = [...educations];
        updated[index] = { ...updated[index], [field]: value };
        setEducations(updated);
    };

    /* ================= PROJECT HANDLERS ================= */
    const addProject = () =>
        setProjects([...projects, { ...emptyProject }]);

    const removeProject = (index: number) =>
        setProjects(projects.filter((_, i) => i !== index));

    const updateProject = (
        index: number,
        field: keyof Project,
        value: string
    ) => {
        const updated = [...projects];
        updated[index] = { ...updated[index], [field]: value };
        setProjects(updated);
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // ✅ STORE FORM REFERENCE IMMEDIATELY
        const form = e.currentTarget;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const studentData = localStorage.getItem("student");
        const student = studentData ? JSON.parse(studentData) : null;

        if (!student?.id) {
            Swal.fire("Error", "Student ID not found", "error");
            setLoading(false);
            return;
        }

        const payload = {
            fullName: data.fullName,
            yearsOfExperience: data.yearsOfExperience,

            previousEmployment: {
                companyName: data.prevCompany,
                startDate: data.prevStart,
                endDate: data.prevEnd,
                overallExperience: data.prevOverAll,
                employeeId: data.prevEmpId,
                dateOfJoining: data.prevDateOfJoin,
                lastWorkingDay: data.prevLastWorkingDay,
            },

            currentEmployment: {
                companyName: data.currCompany,
                startDate: data.currStart,
                endDate: data.currEnd,
                overallExperience: data.currOverAll,
                employeeId: data.currEmpId,
                dateOfJoining: data.currDateOfJoin,
                lastWorkingDay: data.currLastWorkingDay,
            },

            noticePeriod: data.noticePeriod,
            currentCTC: data.currentCTC,
            expectedCTC: data.expectedCTC,

            education: educations.map((edu) => ({
                degree: edu.degree,
                department: edu.department,
                collegeName: edu.collegeName,
                startDate: edu.startDate,
                endDate: edu.endDate,
                overallDuration: edu.overall,
                collegeAddress: edu.collegeAddress,
                percentage: edu.percentage,
            })),

            hscOrDiploma: {
                schoolName: data.hscSchoolName,
                address: data.hscAddress,
                startDate: data.hscStart,
                endDate: data.hscEnd,
                overallDuration: data.hscOverAll,
                percentage: data.hscPercentage,
            },

            sslc: {
                schoolName: data.sslcSchoolName,
                address: data.sslcAddress,
                startDate: data.sslcStart,
                endDate: data.sslcEnd,
                overallDuration: data.sslcOverAll,
                percentage: data.sslcPercentage,
            },

            projects: projects,

            supervisorDetails: data.supervisorDetails,
            hrDetails: data.hrDetails,

            fatherName: data.fatherName,
            fatherOccupation: data.fatherOccupation,
            motherName: data.motherName,
            motherOccupation: data.motherOccupation,
            siblingsDetails: data.sibilingDetails,
            maritalStatus: data.maritalStatus,

            email: data.email,
            mobile: data.mobile,
            dob: data.dob,
            age: Number(data.age),
            permanentAddress: data.permanentAddress,

            panNo: data.panNo,
            aadharNo: data.aadharNo,
            studentId: student.id,
        };

        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/masterManagement/candidate/new",
                payload
            );

            // ✅ OPTIONAL SAFETY CHECK
            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Candidate Information Submitted!",
                    text: "Your Candidate Information has been successfully submitted.",
                });

                // ✅ SAFE RESET
                form.reset();
                setEducations([emptyEducation]);
                setProjects([emptyProject]);
            }

        } catch (error: any) {
            console.error("Submission error:", error);

            Swal.fire({
                icon: "error",
                title: "Submission Failed!",
                text:
                    error.response?.data?.message ||
                    "Candidate already exists",
            });
        }
        finally {
            setLoading(false);
        }
    };



    /* ================= UI ================= */
    return (
        <>
            <PageMeta title="Candidate Information" description="Candidate Information Form" />
            <form
                onSubmit={handleSubmit}
                className="max-w-6xl mx-auto p-4 space-y-6"
            >
                <h2 className="text-2xl font-bold" style={{ textAlign: 'center' }}>Candidate Information</h2>

                <h2 className="text-2xl font-bold">Employment Details</h2>

                {/* BASIC INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="fullName" placeholder="Full Name" className="input" />
                    <input name="yearsOfExperience" placeholder="Years of Experience" className="input" />
                </div>

                {/* PREVIOUS EMPLOYMENT */}
                <h3 className="text-xl font-semibold text-gray-500">
                    Previous Company
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <input
                        name="prevCompany"
                        placeholder="Company Name"
                        className="input"
                    />

                    <input
                        name="prevEmpId"
                        placeholder="Employee ID"
                        className="input"
                    />

                    <input
                        name="prevOverAll"
                        placeholder="Overall Experience"
                        className="input"
                    />

                    {/* Start Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            Start Date
                        </label>
                        <input
                            name="prevStart"
                            type="date"
                            className="input"
                        />
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            End Date
                        </label>
                        <input
                            name="prevEnd"
                            type="date"
                            className="input"
                        />
                    </div>

                    {/* Date Of Joining */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            Date Of Joining
                        </label>
                        <input
                            name="prevDateOfJoin"
                            type="date"
                            className="input"
                        />
                    </div>

                    {/* Last Working Day */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            Last Working Day
                        </label>
                        <input
                            name="prevLastWorkingDay"
                            type="date"
                            className="input"
                        />
                    </div>

                </div>


                {/* CURRENT EMPLOYMENT */}
                <h3 className="text-xl font-semibold text-gray-500">
                    Current Company
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <input
                        name="currCompany"
                        placeholder="Company Name"
                        className="input"
                    />

                    <input
                        name="currEmpId"
                        placeholder="Employee ID"
                        className="input"
                    />

                    <input
                        name="currOverAll"
                        placeholder="Overall Experience"
                        className="input"
                    />

                    {/* Start Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            Start Date
                        </label>
                        <input
                            name="currStart"
                            type="date"
                            className="input"
                        />
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            End Date
                        </label>
                        <input
                            name="currEnd"
                            type="date"
                            className="input"
                        />
                    </div>

                    {/* Date Of Joining */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            Date Of Joining
                        </label>
                        <input
                            name="currDateOfJoin"
                            type="date"
                            className="input"
                        />
                    </div>

                    {/* Last Working Day */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            Last Working Day
                        </label>
                        <input
                            name="currLastWorkingDay"
                            type="date"
                            className="input"
                        />
                    </div>

                </div>


                {/* ADDITIONAL DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="noticePeriod" placeholder="Notice Period" className="input" />
                    <input name="currentCTC" placeholder="Current CTC" className="input" />
                    <input name="expectedCTC" placeholder="Expected CTC" className="input" />
                </div>


                {/* EDUCATION */}
                <h3 className="text-xl font-semibold">Education</h3>
                {educations.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input placeholder="Degree" value={edu.degree}
                                onChange={(e) => updateEducation(index, "degree", e.target.value)} />
                            <input placeholder="Department" value={edu.department}
                                onChange={(e) => updateEducation(index, "department", e.target.value)} />
                            <input placeholder="College Name" value={edu.collegeName}
                                onChange={(e) => updateEducation(index, "collegeName", e.target.value)} />
                            <input placeholder="Start Year" value={edu.startDate}
                                onChange={(e) => updateEducation(index, "startDate", e.target.value)} />
                            <input placeholder="End Year" value={edu.endDate}
                                onChange={(e) => updateEducation(index, "endDate", e.target.value)} />
                            <input placeholder="Overall Year" value={edu.overall}
                                onChange={(e) => updateEducation(index, "overall", e.target.value)} />
                            <input placeholder="Percentage" value={edu.percentage}
                                onChange={(e) => updateEducation(index, "percentage", e.target.value)} />


                            <textarea
                                placeholder="College Address"
                                value={edu.collegeAddress}
                                onChange={(e) =>
                                    updateEducation(index, "collegeAddress", e.target.value)
                                }
                                className="input"
                            />
                        </div>

                        {educations.length > 1 && (
                            <button
                                type="button"
                                className="text-red-600 text-sm"
                                onClick={() => removeEducation(index)}
                            >
                                Remove Education
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addEducation} className="btn-secondary">
                    + Add Education
                </button>

                {/* HSC/DIPLOMA DETAILS */}
                <h3 className="text-xl font-semibold">HSC/DIPLOMA DETAILS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="hscSchoolName" placeholder="School/Institute Name" className="input" />
                    <input name="hscStart" placeholder="Start" className="input" />
                    <input name="hscEnd" placeholder="End" className="input" />
                    <input name="hscOverAll" placeholder="Overall" className="input" />
                    <input name="hscPercentage" placeholder="Percentage" className="input" />

                    <textarea
                        placeholder="HSC/Institute Address"
                        name="hscAddress"
                        className="input"
                    />
                </div>

                {/* SSLC DETAILS */}
                <h3 className="text-xl font-semibold">SSLC DETAILS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="sslcSchoolName" placeholder="School Name" className="input" />
                    <input name="sslcStart" placeholder="Start" className="input" />
                    <input name="sslcEnd" placeholder="End" className="input" />
                    <input name="sslcOverAll" placeholder="Overall" className="input" />
                    <input name="sslcPercentage" placeholder="Percentage" className="input" />

                    <textarea
                        placeholder="SSLC Address"
                        name="sslcAddress"
                        className="input"
                    />
                </div>


                {/* PROJECTS */}
                <h3 className="text-xl font-semibold">Projects</h3>
                {
                    projects.map((proj, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input placeholder="Project Title" value={proj.title}
                                    onChange={(e) => updateProject(index, "title", e.target.value)} />
                                <input placeholder="Client Name" value={proj.clientName}
                                    onChange={(e) => updateProject(index, "clientName", e.target.value)} />
                                <input placeholder="Client Location" value={proj.clientLocation}
                                    onChange={(e) => updateProject(index, "clientLocation", e.target.value)} />
                                <input placeholder="Domain" value={proj.domain}
                                    onChange={(e) => updateProject(index, "domain", e.target.value)} />
                            </div>

                            {projects.length > 1 && (
                                <button
                                    type="button"
                                    className="text-red-600 text-sm"
                                    onClick={() => removeProject(index)}
                                >
                                    Remove Project
                                </button>
                            )}
                        </div>
                    ))
                }

                <button type="button" onClick={addProject} className="btn-secondary">
                    + Add Project
                </button>

                {/* SUPERVISOR & HR DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="supervisorDetails" placeholder="Supervisor Details" className="input" />
                    <input name="hrDetails" placeholder="HR Details" className="input" />
                </div>

                {/* PERSONAL DETAILS */}
                <h2 className="text-2xl font-bold">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="fatherName" placeholder="Father's Name" className="input" />
                    <input name="fatherOccupation" placeholder="Father's Occupation" className="input" />
                    <input name="motherName" placeholder="Mother's Name" className="input" />
                    <input name="motherOccupation" placeholder="Mother's Occupation" className="input" />
                    <input name="sibilingDetails" placeholder="Sibling Details" className="input" />
                    <input name="maritalStatus" placeholder="Marital Status" className="input" />
                    <input name="email" type="email" placeholder="Email" className="input" />
                    <input name="mobile" placeholder="Mobile Number" className="input" />
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="dob"
                            className="text-sm font-medium text-gray-500"
                        >
                            Date of Birth
                        </label>

                        <input
                            id="dob"
                            name="dob"
                            type="date"
                            className="input text-gray-700"
                        />
                    </div>

                    <input name="age" type="number" placeholder="Age" className="input" />

                    <textarea
                        placeholder="Permanent Address"
                        name="permanentAddress"
                        className="input"
                    />
                </div>

                {/* IDENTIFICATION DETAILS */}
                <h2 className="text-2xl font-bold">Identification Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="panNo" placeholder="PAN Number" className="input" />
                    <input name="aadharNo" placeholder="Aadhar Number" className="input" />
                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    {loading ? "Submitting..." : "Submit Candidate"}
                </button>
            </form >
        </>
    );
}
