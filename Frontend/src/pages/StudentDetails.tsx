import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import PageMeta from "../components/common/PageMeta";
import PageBreadCrumbEnquiryList from "../components/common/PageBreadCrumbEnquiryList";
import { GroupIcon } from "../icons";

/* ================= TYPES ================= */
interface Student {
    _id: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    studentDescription?: string;
    techStack?: string;
    followUp?: string;
    interviewStudent: "Yes" | "No";
    batch_name?: string;
    joinDate?: string;
    endDate?: string;
    createdAt: string;
}

/* ================= COMPONENT ================= */
export default function StudentDetails() {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [studentType, setStudentType] =
        useState<"All" | "Interview" | "Class">("All");

    /* ================= FETCH (AUTO REFRESH) ================= */
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:8000/api/v1/masterManagement/addStudent/"
                );

                /* ✅ NORMALIZE DATA (IMPORTANT FIX) */
                const normalizedStudents: Student[] = data.addStudent.map(
                    (student: any) => ({
                        ...student,
                        interviewStudent:
                            student.interviewStudent === "Yes" ? "Yes" : "No",
                    })
                );

                setStudents(normalizedStudents);
            } catch (error) {
                console.error("Failed to fetch students", error);
            }
        };

        fetchStudents();
        const interval = setInterval(fetchStudents, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage, studentType]);

    /* ================= HELPERS ================= */
    const formatDate = (date?: string) =>
        date ? new Date(date).toLocaleDateString("en-IN") : "N/A";

    /* ================= SEARCH ================= */
    const baseFilteredStudents = students.filter((student) => {
        const search = searchTerm.toLowerCase();

        return (
            student.studentName.toLowerCase().includes(search) ||
            student.studentEmail.toLowerCase().includes(search) ||
            student.studentPhone.includes(search)
        );
    });

    /* ================= COUNTS (FIXED) ================= */
    const interviewCount = baseFilteredStudents.filter(
        (s) => s.interviewStudent === "Yes"
    ).length;

    const classStudentCount = baseFilteredStudents.filter(
        (s) => s.interviewStudent === "No"
    ).length;

    /* ================= TYPE FILTER ================= */
    const filteredStudents = baseFilteredStudents.filter((student) => {
        if (studentType === "Interview") return student.interviewStudent === "Yes";
        if (studentType === "Class") return student.interviewStudent === "No";
        return true;
    });

    /* ================= SORT ================= */
    const sortedStudents = [...filteredStudents].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

    const paginatedStudents = sortedStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    /* ================= UI (UNCHANGED) ================= */
    return (
        <>
            <PageMeta title="Skill Fort | Student Details" description="Student List" />
            <PageBreadCrumbEnquiryList pageTitle="Student Details" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6">

                {/* SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                    <div className="flex justify-between items-center bg-blue-600 text-white rounded-xl p-4">
                        <div>
                            <p className="text-sm">Total Students</p>
                            <p className="text-2xl font-bold">
                                {baseFilteredStudents.length}
                            </p>
                        </div>
                        <GroupIcon className="size-6" />
                    </div>

                    <div
                        className="flex justify-between items-center bg-orange-600 text-white rounded-xl p-4 cursor-pointer"
                        onClick={() => setStudentType("Interview")}
                    >
                        <div>
                            <p className="text-sm">Interview Students</p>
                            <p className="text-2xl font-bold">{interviewCount}</p>
                        </div>
                        <GroupIcon className="size-6" />
                    </div>

                    <div
                        className="flex justify-between items-center bg-green-600 text-white rounded-xl p-4 cursor-pointer"
                        onClick={() => setStudentType("Class")}
                    >
                        <div>
                            <p className="text-sm">Class Students</p>
                            <p className="text-2xl font-bold">{classStudentCount}</p>
                        </div>
                        <GroupIcon className="size-6" />
                    </div>

                </div>

                {/* SEARCH */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, email or phone"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded border border-gray-300 p-2"
                    />

                    <select
                        value={studentType}
                        onChange={(e) =>
                            setStudentType(
                                e.target.value as "All" | "Interview" | "Class"
                            )
                        }
                        className="w-[140px] border border-gray-300 rounded p-2"
                    >
                        <option value="All">All</option>
                        <option value="Interview">Interview</option>
                        <option value="Class">Class</option>
                    </select>

                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="w-[120px] border border-gray-300 rounded p-2"
                    >
                        {[6, 10, 15].map((size) => (
                            <option key={size} value={size}>
                                {size} / page
                            </option>
                        ))}
                    </select>
                </div>

                {/* STUDENT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paginatedStudents.map((student, index) => (
                        <div key={student._id} className="rounded-xl border p-4 flex flex-col gap-3">

                            <div className="text-center">
                                <p className="text-lg font-semibold">
                                    {index === 0 && currentPage === 1 && (
                                        <span className="text-xs bg-green-200 text-green-700 px-2 mr-2 rounded">
                                            NEW
                                        </span>
                                    )}
                                    {student.studentName}
                                </p>

                                <span
                                    className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                                        student.interviewStudent === "Yes"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-green-100 text-green-700"
                                    }`}
                                >
                                    {student.interviewStudent === "Yes"
                                        ? "Interview Student"
                                        : "Class Student"}
                                </span>
                            </div>

                            <div className="text-sm space-y-1">
                                <p><b>Email:</b> {student.studentEmail}</p>
                                <p><b>Phone:</b> {student.studentPhone}</p>
                                {student.techStack && <p><b>Tech:</b> {student.techStack}</p>}
                                {student.batch_name && <p><b>Batch:</b> {student.batch_name}</p>}
                            </div>

                            <div className="flex justify-between text-xs text-gray-600">
                                <span>Join: {formatDate(student.joinDate)}</span>
                                <span>End: {formatDate(student.endDate)}</span>
                            </div>

                            <Link
                                to={`/studentDetails/${student._id}`}
                                className="text-center text-blue-600 text-sm hover:underline"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}

                    {sortedStudents.length === 0 && (
                        <p className="col-span-full text-center text-red-500">
                            No students found.
                        </p>
                    )}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-3 py-1 bg-gray-200 rounded"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded ${
                                        page === currentPage
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100"
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-3 py-1 bg-gray-200 rounded"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
