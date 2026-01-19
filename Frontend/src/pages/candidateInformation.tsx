import { useEffect, useState } from "react";
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
    const [isEditMode, setIsEditMode] = useState(false);
    const [candidateId, setCandidateId] = useState<string | null>(null);

    const [educations, setEducations] = useState<Education[]>([emptyEducation]);
    const [projects, setProjects] = useState<Project[]>([emptyProject]);

    const [formValues, setFormValues] = useState<any>({});

    /* ================= FETCH EXISTING DATA ================= */
    useEffect(() => {
        const studentData = localStorage.getItem("student");
        const student = studentData ? JSON.parse(studentData) : null;
        if (!student?.id) return;

        axios
            .get(
                `http://localhost:8000/api/v1/masterManagement/candidate/?studentId=${student.id}`
            )
            .then((res) => {
                if (res.data.count > 0) {
                    const c = res.data.candidates[0];

                    setIsEditMode(true);
                    setCandidateId(c._id);

                    setFormValues({
                        ...c,
                        prevCompany: c.previousEmployment?.companyName,
                        prevEmpId: c.previousEmployment?.employeeId,
                        prevOverAll: c.previousEmployment?.overallExperience,
                        prevStart: c.previousEmployment?.startDate,
                        prevEnd: c.previousEmployment?.endDate,
                        prevDateOfJoin: c.previousEmployment?.dateOfJoining,
                        prevLastWorkingDay: c.previousEmployment?.lastWorkingDay,

                        currCompany: c.currentEmployment?.companyName,
                        currEmpId: c.currentEmployment?.employeeId,
                        currOverAll: c.currentEmployment?.overallExperience,
                        currStart: c.currentEmployment?.startDate,
                        currEnd: c.currentEmployment?.endDate,
                        currDateOfJoin: c.currentEmployment?.dateOfJoining,
                        currLastWorkingDay: c.currentEmployment?.lastWorkingDay,

                        hscSchoolName: c.hscOrDiploma?.schoolName,
                        hscAddress: c.hscOrDiploma?.address,
                        hscStart: c.hscOrDiploma?.startDate,
                        hscEnd: c.hscOrDiploma?.endDate,
                        hscOverAll: c.hscOrDiploma?.overallDuration,
                        hscPercentage: c.hscOrDiploma?.percentage,

                        sslcSchoolName: c.sslc?.schoolName,
                        sslcAddress: c.sslc?.address,
                        sslcStart: c.sslc?.startDate,
                        sslcEnd: c.sslc?.endDate,
                        sslcOverAll: c.sslc?.overallDuration,
                        sslcPercentage: c.sslc?.percentage,
                    });

                    setEducations(
                        c.education.map((e: any) => ({
                            degree: e.degree,
                            department: e.department,
                            collegeName: e.collegeName,
                            startDate: e.startDate,
                            endDate: e.endDate,
                            percentage: e.percentage,
                            overall: e.overallDuration,
                            collegeAddress: e.collegeAddress,
                        }))
                    );

                    setProjects(c.projects);
                }
            })
            .catch(() => { });
    }, []);

    /* ================= FORM HANDLERS ================= */
    const handleChange = (e: any) =>
        setFormValues({ ...formValues, [e.target.name]: e.target.value });

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

        const studentData = localStorage.getItem("student");
        const student = studentData ? JSON.parse(studentData) : null;
        if (!student?.id) return;

        const payload = {
            fullName: formValues.fullName,
            yearsOfExperience: formValues.yearsOfExperience,

            previousEmployment: {
                companyName: formValues.prevCompany,
                employeeId: formValues.prevEmpId,
                overallExperience: formValues.prevOverAll,
                startDate: formValues.prevStart,
                endDate: formValues.prevEnd,
                dateOfJoining: formValues.prevDateOfJoin,
                lastWorkingDay: formValues.prevLastWorkingDay,
            },

            currentEmployment: {
                companyName: formValues.currCompany,
                employeeId: formValues.currEmpId,
                overallExperience: formValues.currOverAll,
                startDate: formValues.currStart,
                endDate: formValues.currEnd,
                dateOfJoining: formValues.currDateOfJoin,
                lastWorkingDay: formValues.currLastWorkingDay,
            },

            noticePeriod: formValues.noticePeriod,
            currentCTC: formValues.currentCTC,
            expectedCTC: formValues.expectedCTC,

            education: educations.map((e) => ({
                degree: e.degree,
                department: e.department,
                collegeName: e.collegeName,
                startDate: e.startDate,
                endDate: e.endDate,
                overallDuration: e.overall,
                collegeAddress: e.collegeAddress,
                percentage: e.percentage,
            })),

            hscOrDiploma: {
                schoolName: formValues.hscSchoolName,
                address: formValues.hscAddress,
                startDate: formValues.hscStart,
                endDate: formValues.hscEnd,
                overallDuration: formValues.hscOverAll,
                percentage: formValues.hscPercentage,
            },

            sslc: {
                schoolName: formValues.sslcSchoolName,
                address: formValues.sslcAddress,
                startDate: formValues.sslcStart,
                endDate: formValues.sslcEnd,
                overallDuration: formValues.sslcOverAll,
                percentage: formValues.sslcPercentage,
            },

            projects,
            supervisorDetails: formValues.supervisorDetails,
            hrDetails: formValues.hrDetails,

            fatherName: formValues.fatherName,
            fatherOccupation: formValues.fatherOccupation,
            motherName: formValues.motherName,
            motherOccupation: formValues.motherOccupation,
            siblingsDetails: formValues.sibilingDetails,
            maritalStatus: formValues.maritalStatus,

            email: formValues.email,
            mobile: formValues.mobile,
            dob: formValues.dob,
            age: Number(formValues.age),
            permanentAddress: formValues.permanentAddress,

            panNo: formValues.panNo,
            aadharNo: formValues.aadharNo,
            studentId: student.id,
        };

        try {
            await axios({
                method: isEditMode ? "put" : "post",
                url: isEditMode
                    ? `http://localhost:8000/api/v1/masterManagement/candidate/${candidateId}`
                    : "http://localhost:8000/api/v1/masterManagement/candidate/new",
                data: payload,
            });

            Swal.fire(
                "Success",
                isEditMode ? "Updated Successfully" : "Created Successfully",
                "success"
            ).then(() => {
                window.location.reload();
            });

        } catch (err: any) {
            Swal.fire("Error", err.response?.data?.message || "Failed", "error");
        } finally {
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
                <h2 className="text-2xl font-bold text-center">
                    {isEditMode ? "Update Candidate Information" : "Candidate Information"}
                </h2>

                <h2 className="text-2xl font-bold">Employment Details</h2>

                {/* BASIC INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <input
                            name="fullName"
                            value={formValues.fullName || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Years of Experience</label>
                        <input
                            name="yearsOfExperience"
                            value={formValues.yearsOfExperience || ""}
                            onChange={handleChange}
                            placeholder="Years of Experience"
                            className="input"
                        />
                    </div>
                </div>

                {/* PREVIOUS EMPLOYMENT */}
                <h3 className="text-xl font-semibold text-gray-500">Previous Company</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Company Name</label>
                        <input
                            name="prevCompany"
                            value={formValues.prevCompany || ""}
                            onChange={handleChange}
                            placeholder="Company Name"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Employee ID</label>
                        <input
                            name="prevEmpId"
                            value={formValues.prevEmpId || ""}
                            onChange={handleChange}
                            placeholder="Employee ID"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Overall Experience</label>
                        <input
                            name="prevOverAll"
                            value={formValues.prevOverAll || ""}
                            onChange={handleChange}
                            placeholder="Overall Experience"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Start Date</label>

                        <input
                            type="date"
                            name="prevStart"
                            value={formValues.prevStart || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">End Date</label>
                        <input
                            type="date"
                            name="prevEnd"
                            value={formValues.prevEnd || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Date of Joining</label>
                        <input
                            type="date"
                            name="prevDateOfJoin"
                            value={formValues.prevDateOfJoin || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Last Working Day</label>
                        <input
                            type="date"
                            name="prevLastWorkingDay"
                            value={formValues.prevLastWorkingDay || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                </div>

                {/* CURRENT EMPLOYMENT */}
                <h3 className="text-xl font-semibold text-gray-500">Current Company</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Company Name</label>

                        <input
                            name="currCompany"
                            value={formValues.currCompany || ""}
                            onChange={handleChange}
                            placeholder="Company Name"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Employee ID</label>
                        <input
                            name="currEmpId"
                            value={formValues.currEmpId || ""}
                            onChange={handleChange}
                            placeholder="Employee ID"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Overall Experience</label>
                        <input
                            name="currOverAll"
                            value={formValues.currOverAll || ""}
                            onChange={handleChange}
                            placeholder="Overall Experience"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Start Date</label>
                        <input
                            type="date"
                            name="currStart"
                            value={formValues.currStart || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">End Date</label>
                        <input
                            type="date"
                            name="currEnd"
                            value={formValues.currEnd || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Date of Joining</label>
                        <input
                            type="date"
                            name="currDateOfJoin"
                            value={formValues.currDateOfJoin || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Last Working Day</label>
                        <input
                            type="date"
                            name="currLastWorkingDay"
                            value={formValues.currLastWorkingDay || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                </div>

                {/* ADDITIONAL DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Notice Period</label>
                        <input
                            name="noticePeriod"
                            value={formValues.noticePeriod || ""}
                            onChange={handleChange}
                            placeholder="Notice Period"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Current CTC</label>
                        <input
                            name="currentCTC"
                            value={formValues.currentCTC || ""}
                            onChange={handleChange}
                            placeholder="Current CTC"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Expected CTC</label>
                        <input
                            name="expectedCTC"
                            value={formValues.expectedCTC || ""}
                            onChange={handleChange}
                            placeholder="Expected CTC"
                            className="input"
                        />
                    </div>
                </div>

                {/* EDUCATION */}
                <h3 className="text-xl font-semibold">Education</h3>
                {educations.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">Degree</label>
                                <input placeholder="Degree" value={edu.degree}
                                    onChange={(e) => updateEducation(index, "degree", e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">Department</label>
                                <input placeholder="Department" value={edu.department}
                                    onChange={(e) => updateEducation(index, "department", e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">College Name</label>
                                <input placeholder="College Name" value={edu.collegeName}
                                    onChange={(e) => updateEducation(index, "collegeName", e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">Start Year</label>
                                <input placeholder="Start Year" value={edu.startDate}
                                    onChange={(e) => updateEducation(index, "startDate", e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">End Year</label>
                                <input placeholder="End Year" value={edu.endDate}
                                    onChange={(e) => updateEducation(index, "endDate", e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">Overall Year</label>
                                <input placeholder="Overall Year" value={edu.overall}
                                    onChange={(e) => updateEducation(index, "overall", e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">Percentage</label>
                                <input placeholder="Percentage" value={edu.percentage}
                                    onChange={(e) => updateEducation(index, "percentage", e.target.value)} />

                            </div>
                            <div className="flex flex-col gap-1 md:col-span-3">
                                <label className="text-sm font-medium text-gray-600">College Address</label>

                                <textarea
                                    placeholder="College Address"
                                    value={edu.collegeAddress}
                                    onChange={(e) =>
                                        updateEducation(index, "collegeAddress", e.target.value)
                                    }
                                    className="input"
                                />
                            </div>
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

                {/* HSC / DIPLOMA DETAILS */}
                <h3 className="text-xl font-semibold">HSC / DIPLOMA DETAILS</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">School / Institute Name</label>

                        <input
                            name="hscSchoolName"
                            value={formValues.hscSchoolName || ""}
                            onChange={handleChange}
                            placeholder="School / Institute Name"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Start</label>

                        <input

                            name="hscStart"
                            value={formValues.hscStart || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">End</label>

                        <input

                            name="hscEnd"
                            value={formValues.hscEnd || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Overall Duration</label>

                        <input
                            name="hscOverAll"
                            value={formValues.hscOverAll || ""}
                            onChange={handleChange}
                            placeholder="Overall Duration"
                            className="input"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Percentage</label>

                        <input
                            name="hscPercentage"
                            value={formValues.hscPercentage || ""}
                            onChange={handleChange}
                            placeholder="Percentage"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-600">HSC / Institute Address</label>
                        <textarea
                            name="hscAddress"
                            value={formValues.hscAddress || ""}
                            onChange={handleChange}
                            placeholder="HSC / Institute Address"
                            className="input md:col-span-2"
                        />
                    </div>
                </div>


                {/* SSLC DETAILS */}
                <h3 className="text-xl font-semibold">SSLC DETAILS</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">School Name</label>

                        <input
                            name="sslcSchoolName"
                            value={formValues.sslcSchoolName || ""}
                            onChange={handleChange}
                            placeholder="School Name"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Start</label>
                        <input

                            name="sslcStart"
                            value={formValues.sslcStart || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">End</label>
                        <input

                            name="sslcEnd"
                            value={formValues.sslcEnd || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Overall Duration</label>
                        <input
                            name="sslcOverAll"
                            value={formValues.sslcOverAll || ""}
                            onChange={handleChange}
                            placeholder="Overall Duration"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Percentage</label>
                        <input
                            name="sslcPercentage"
                            value={formValues.sslcPercentage || ""}
                            onChange={handleChange}
                            placeholder="Percentage"
                            className="input"
                        />
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-600">SSLC Address</label>
                        <textarea
                            name="sslcAddress"
                            value={formValues.sslcAddress || ""}
                            onChange={handleChange}
                            placeholder="SSLC Address"
                            className="input md:col-span-2"
                        />
                    </div>
                </div>


                {/* PROJECTS */}
                <h3 className="text-xl font-semibold">Projects</h3>
                {
                    projects.map((proj, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Project Title</label>
                                    <input placeholder="Project Title" value={proj.title}
                                        onChange={(e) => updateProject(index, "title", e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Client Name</label>
                                    <input placeholder="Client Name" value={proj.clientName}
                                        onChange={(e) => updateProject(index, "clientName", e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Client Location</label>
                                    <input placeholder="Client Location" value={proj.clientLocation}
                                        onChange={(e) => updateProject(index, "clientLocation", e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Domain</label>
                                    <input placeholder="Domain" value={proj.domain}
                                        onChange={(e) => updateProject(index, "domain", e.target.value)} />
                                </div>
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
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Supervisor Details</label>

                        <input name="supervisorDetails" placeholder="Supervisor Details" className="input" value={formValues.supervisorDetails || ""}
                            onChange={handleChange} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">HR Details</label>
                        <input name="hrDetails" placeholder="HR Details" className="input" value={formValues.hrDetails || ""}
                            onChange={handleChange} />
                    </div>
                </div>

                {/* PERSONAL DETAILS */}
                <h2 className="text-2xl font-bold">Personal Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Father Name</label>
                        <input
                            name="fatherName"
                            value={formValues.fatherName || ""}
                            onChange={handleChange}
                            placeholder="Father's Name"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Father Occupation</label>
                        <input
                            name="fatherOccupation"
                            value={formValues.fatherOccupation || ""}
                            onChange={handleChange}
                            placeholder="Father's Occupation"
                            className="input"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Mother Name</label>
                        <input
                            name="motherName"
                            value={formValues.motherName || ""}
                            onChange={handleChange}
                            placeholder="Mother's Name"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Mother Occupation</label>
                        <input
                            name="motherOccupation"
                            value={formValues.motherOccupation || ""}
                            onChange={handleChange}
                            placeholder="Mother's Occupation"
                            className="input"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Siblings Details</label>
                        <input
                            name="sibilingDetails"
                            value={formValues.sibilingDetails || ""}
                            onChange={handleChange}
                            placeholder="Siblings Details"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Marital Status</label>
                        <input
                            name="maritalStatus"
                            value={formValues.maritalStatus || ""}
                            onChange={handleChange}
                            placeholder="Marital Status"
                            className="input"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <input
                            name="email"
                            value={formValues.email || ""}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                        <input
                            name="mobile"
                            value={formValues.mobile || ""}
                            onChange={handleChange}
                            placeholder="Mobile Number"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formValues.dob || ""}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formValues.age || ""}
                            onChange={handleChange}
                            placeholder="Age"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-600">Permanent Address</label>
                        <textarea
                            name="permanentAddress"
                            value={formValues.permanentAddress || ""}
                            onChange={handleChange}
                            placeholder="Permanent Address"
                            className="input"
                        />
                    </div>
                </div>

                {/* IDENTIFICATION */}
                <h2 className="text-2xl font-bold">Identification Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">PAN Number</label>
                        <input
                            name="panNo"
                            value={formValues.panNo || ""}
                            onChange={handleChange}
                            placeholder="PAN Number"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Aadhar Number</label>
                        <input
                            name="aadharNo"
                            value={formValues.aadharNo || ""}
                            onChange={handleChange}
                            placeholder="Aadhar Number"
                            className="input"
                        />
                    </div>
                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    {loading
                        ? "Submitting..."
                        : isEditMode
                            ? "Update Candidate"
                            : "Submit Candidate"}
                </button>
            </form >

        </>
    );
}
