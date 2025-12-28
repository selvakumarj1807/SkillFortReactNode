import { useEffect, useState } from "react";
import axios from "axios";
import { GroupIcon } from "../../icons";
import PageBreadCrumbEnquiryList from "../../components/common/PageBreadCrumbEnquiryList";
import PageMeta from "../../components/common/PageMeta";

// ================= TYPES =================
type Student = {
  _id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentDescription: string;
  techStack: string;
  followUp: string;
};

const API_URL =
  "http://localhost:8000/api/v1/masterManagement/addInterviewStudents";

const TECH_STACK_OPTIONS = [
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Python",
  "Java",
  "Django",
  "Spring Boot",
  "MERN Stack",
  "Full Stack",
];

const FOLLOW_UP_OPTIONS = [
  "Kiruba",
  "Magesh",
  "Yogesh",
  "Naveen",
  "Selvi",
];

// ================= COMPONENT =================
export default function InterviewStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [studentForm, setStudentForm] = useState<Omit<Student, "_id">>({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    studentDescription: "",
    techStack: "",
    followUp: "",
  });

  // ================= FETCH =================
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setStudents(res.data?.addStudent || []);
    } catch {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ================= HANDLERS =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, studentForm);
        alert("Student updated");
      } else {
        await axios.post(API_URL, studentForm);
        alert("Student added");
      }

      setStudentForm({
        studentName: "",
        studentEmail: "",
        studentPhone: "",
        studentDescription: "",
        techStack: "",
        followUp: "",
      });

      setEditId(null);
      setIsModalOpen(false);
      fetchStudents();
    } catch {
      alert("Operation failed");
    }
  };

  const handleEdit = (stu: Student) => {
    setEditId(stu._id);
    setStudentForm({
      studentName: stu.studentName,
      studentEmail: stu.studentEmail,
      studentPhone: stu.studentPhone,
      studentDescription: stu.studentDescription,
      techStack: stu.techStack,
      followUp: stu.followUp,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this student?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchStudents();
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // ================= UI =================
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <PageMeta title="Interview Students" description="Interview Students" />
      <PageBreadCrumbEnquiryList pageTitle="Interview Students" />

      {/* SUMMARY */}
     <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex justify-between items-center bg-teal-700 text-white rounded-xl p-4">
            <div>
              <p className="text-sm">Total Students</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
            <div className="bg-teal-800 p-2 rounded-md">
              <GroupIcon className="text-white size-6" />
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-6 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Student
        </button>
      </div>

      {/* STUDENTS LIST */}
      <div className="mt-10 rounded-2xl border bg-white p-6 shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((stu) => (
            <div
              key={stu._id}
              onClick={() => toggleExpand(stu._id)}
              className="cursor-pointer rounded-xl border p-4 shadow-sm hover:shadow-md"
            >
              <h4 className="text-lg font-semibold">{stu.studentName}</h4>

              <a
                href={`tel:${stu.studentPhone}`}
                className="text-sm text-blue-600 underline"
                onClick={(e) => e.stopPropagation()}
              >
                {stu.studentPhone}
              </a>

              {expandedId === stu._id && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600"><strong>Gmail: </strong>{stu.studentEmail}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Description: </strong>{stu.studentDescription}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Tech:</strong> {stu.techStack}
                  </p>
                  <p className="text-sm">
                    <strong>Follow Up:</strong> {stu.followUp}
                  </p>

                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(stu);
                      }}
                      className="rounded bg-yellow-500 px-3 py-1 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(stu._id);
                      }}
                      className="rounded bg-red-500 px-3 py-1 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {students.length === 0 && (
            <p className="col-span-full text-center text-red-500">
              No students found
            </p>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-black/50">
          <div className="mt-20 w-full max-w-lg rounded-2xl bg-white p-6 shadow mx-4">
            <h2 className="mb-4 text-xl font-semibold">
              {editId ? "Edit Student" : "Add Student"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="studentName"
                value={studentForm.studentName}
                onChange={handleChange}
                placeholder="Student Name"
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="email"
                name="studentEmail"
                value={studentForm.studentEmail}
                onChange={handleChange}
                placeholder="Student Email"
                className="w-full border p-2 rounded"
              />

              <input
                name="studentPhone"
                value={studentForm.studentPhone}
                onChange={handleChange}
                placeholder="Student Phone"
                className="w-full border p-2 rounded"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                inputMode="numeric"
              />

              <textarea
                name="studentDescription"
                value={studentForm.studentDescription}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
              />

              <select
                name="techStack"
                value={studentForm.techStack}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Tech Stack</option>
                {TECH_STACK_OPTIONS.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>

              <select
                name="followUp"
                value={studentForm.followUp}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Follow-up</option>
                {FOLLOW_UP_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditId(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
