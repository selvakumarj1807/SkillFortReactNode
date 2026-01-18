import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GroupIcon } from "../../icons";
import PageBreadCrumbEnquiryList from "../../components/common/PageBreadCrumbEnquiryList";
import PageMeta from "../../components/common/PageMeta";


// ✅ Types
type ClassData = {
  _id: string;
  batch_name: string;
};

type StudentData = {
  _id: string;
  classId: string;
  batch_name: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentDescription: string;
  joinDate: string;   // ✅ NEW
  endDate: string;    // ✅ NEW
  interviewStudent?: "Yes" | "No"; // ✅ ADD THIS
};

export default function TodayEnquiryList() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewStudentId, setInterviewStudentId] = useState<string | null>(null);
  const [interviewValue, setInterviewValue] = useState<"Yes" | "No">("No");


  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };


  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);

  // Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);

  // Form states
  const [studentForm, setStudentForm] = useState({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    studentDescription: "",
    joinDate: getTodayDate(),
    endDate: "",
  });

  // Fetch Class + Students
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axios.get(
          `http://localhost:8000/api/v1/masterManagement/addClasses/?_id=${id}`
        );
        const cls = courseRes.data.addClass?.[0] || null;
        setClassData(cls);

        if (cls?.batch_name) {
          const studentRes = await axios.get(
            `http://localhost:8000/api/v1/masterManagement/addStudent/?batch_name=${encodeURIComponent(
              cls.batch_name
            )}`
          );
          setStudents(studentRes.data.addStudent || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Add Student
  const handleStudentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classData) return;

    try {
      await axios.post("http://localhost:8000/api/v1/masterManagement/addStudent", {
        ...studentForm,
        classId: classData._id,
        batch_name: classData.batch_name,
      });

      alert("Student added!");
      setIsStudentModalOpen(false);
      setStudentForm({
        studentName: "",
        studentEmail: "",
        studentPhone: "",
        studentDescription: "",
        joinDate: getTodayDate(),
        endDate: "",
      });

      // refresh
      const res = await axios.get(
        `http://localhost:8000/api/v1/masterManagement/addStudent/?batch_name=${encodeURIComponent(
          classData.batch_name
        )}`
      );
      setStudents(res.data.addStudent || []);
    } catch (err) {
      alert("Failed to add student");
    }
  };

  // Edit Student
  const openEditStudentModal = (stu: StudentData) => {
    setEditStudentId(stu._id);
    setStudentForm({
      studentName: stu.studentName,
      studentEmail: stu.studentEmail,
      studentPhone: stu.studentPhone,
      studentDescription: stu.studentDescription,
      joinDate: stu.joinDate,
      endDate: stu.endDate,
    });
    setIsEditStudentModalOpen(true);
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudentId || !classData) return;

    try {
      await axios.put(
        `http://localhost:8000/api/v1/masterManagement/addStudent/${editStudentId}`,
        {
          ...studentForm,
          classId: classData._id,
          batch_name: classData.batch_name,
        }
      );

      alert("Student updated!");
      setIsEditStudentModalOpen(false);

      // refresh
      const res = await axios.get(
        `http://localhost:8000/api/v1/masterManagement/addStudent/?batch_name=${encodeURIComponent(
          classData.batch_name
        )}`
      );
      setStudents(res.data.addStudent || []);
    } catch (err) {
      alert("Failed to update student");
    }
  };

  // Delete Student
  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/v1/masterManagement/addStudent/${id}`
      );
      alert("Student deleted!");
      setStudents((prev) => prev.filter((stu) => stu._id !== id));
    } catch (err) {
      alert("Failed to delete student");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!classData) return null;

  return (
    <>
      <PageMeta title="Skill Fort | Class Details" description="Class Details" />
      <PageBreadCrumbEnquiryList pageTitle={classData.batch_name} />

      {/* Class Summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h2 className="text-xl font-semibold mb-4">
          {classData.batch_name}
        </h2>

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
          onClick={() => setIsStudentModalOpen(true)}
          className="mb-6 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Student
        </button>
      </div>

      {/* Students List */}
      <div className="rounded-2xl border bg-white p-6 shadow mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((stu) => (
            <div
              key={stu._id}
              className="border rounded-xl p-4 shadow-sm cursor-pointer transition hover:shadow-md"
              onClick={() => toggleExpand(stu._id)}
            >
              {/* Always visible */}
              <h4 className="text-lg font-semibold">{stu.studentName}</h4>
              <a
                href={`tel:+91 ${stu.studentPhone}`}
                className="text-sm text-gray-600 hover:text-blue-600 underline"
                onClick={(e) => e.stopPropagation()} // stops expanding card click
              >
                {stu.studentPhone}
              </a>


              {/* Expand on click */}
              {expandedId === stu._id && (
                <div className="mt-3 animate-fadeIn">
                  {/* 
                  <p className="text-sm text-gray-600">{stu.studentEmail}</p>
                  <p className="text-sm text-gray-500 mt-1">{stu.studentDescription}</p>
                  */}
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInterviewStudentId(stu._id);
                        setInterviewValue(stu.interviewStudent === "Yes" ? "Yes" : "No"); 
                        setIsInterviewModalOpen(true);
                      }}
                    >
                      Interview
                    </button>

                    <button
                      className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditStudentModal(stu);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStudent(stu._id);
                      }}
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
              No students found.
            </p>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-black/50">
          <div className="mt-20 w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg mx-4">
            <h2 className="mb-4 text-xl font-semibold">Add Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <input
                type="text"
                name="studentName"
                placeholder="Name"
                value={studentForm.studentName}
                onChange={handleStudentChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="email"
                name="studentEmail"
                placeholder="Email"
                value={studentForm.studentEmail}
                onChange={handleStudentChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="tel"
                name="studentPhone"
                placeholder="Phone"
                value={studentForm.studentPhone}
                onChange={handleStudentChange}
                className="w-full border p-2 rounded"
                required
                pattern="[0-9]{10}" // ✅ regex: only 10 digits
                maxLength={10} // ✅ ensures no more than 10 digits
                inputMode="numeric" // ✅ mobile keyboard shows numbers
              />
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Join Date
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={studentForm.joinDate}
                  onChange={handleStudentChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={studentForm.endDate}
                  onChange={handleStudentChange}
                  className="w-full border p-2 rounded"
                />
              </div>


              <textarea
                name="studentDescription"
                placeholder="Description"
                value={studentForm.studentDescription}
                onChange={handleStudentChange}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditStudentModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-black/50">
          <div className="mt-20 w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg mx-4">
            <h2 className="mb-4 text-xl font-semibold">Edit Student</h2>
            <form onSubmit={handleUpdateStudent} className="space-y-3">
              <input
                type="text"
                name="studentName"
                placeholder="Name"
                value={studentForm.studentName}
                onChange={handleStudentChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="email"
                name="studentEmail"
                placeholder="Email"
                value={studentForm.studentEmail}
                onChange={handleStudentChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="tel"
                name="studentPhone"
                placeholder="Phone"
                value={studentForm.studentPhone}
                onChange={handleStudentChange}
                className="w-full border p-2 rounded"
                required
                pattern="[0-9]{10}" // ✅ regex: only 10 digits
                maxLength={10} // ✅ ensures no more than 10 digits
                inputMode="numeric" // ✅ mobile keyboard shows numbers
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Join Date
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={studentForm.joinDate}
                  onChange={handleStudentChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={studentForm.endDate}
                  onChange={handleStudentChange}
                  className="w-full border p-2 rounded"
                />
              </div>


              <textarea
                name="studentDescription"
                placeholder="Description"
                value={studentForm.studentDescription}
                onChange={handleStudentChange}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditStudentModalOpen(false);
                    setStudentForm({
                      studentName: "",
                      studentEmail: "",
                      studentPhone: "",
                      studentDescription: "",
                      joinDate: getTodayDate(),
                      endDate: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isInterviewModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-black/50 z-50">
          <div className="mt-32 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg mx-4">
            <h2 className="mb-4 text-xl font-semibold">
              Add Interview Student
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!interviewStudentId) return;

                try {
                  await axios.put(
                    `http://localhost:8000/api/v1/masterManagement/addStudent/${interviewStudentId}`,
                    {
                      interviewStudent: interviewValue,
                    }
                  );

                  alert("Interview status updated");

                  // refresh list
                  const res = await axios.get(
                    `http://localhost:8000/api/v1/masterManagement/addStudent/?batch_name=${encodeURIComponent(
                      classData.batch_name
                    )}`
                  );
                  setStudents(res.data.addStudent || []);

                  setIsInterviewModalOpen(false);
                  setInterviewStudentId(null);
                } catch {
                  alert("Failed to update interview status");
                }
              }}
              className="space-y-4"
            >
              {/* Radio Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Interview Student?
                </p>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interviewStudent"
                    value="No"
                    checked={interviewValue === "No"}
                    onChange={() => setInterviewValue("No")}
                  />
                  <span>No</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interviewStudent"
                    value="Yes"
                    checked={interviewValue === "Yes"}
                    onChange={() => setInterviewValue("Yes")}
                  />
                  <span>Yes</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsInterviewModalOpen(false);
                    setInterviewStudentId(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
}
