import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { GroupIcon } from "../../icons";
import PageBreadCrumbEnquiryList from "../../components/common/PageBreadCrumbEnquiryList";
import PageMeta from "../../components/common/PageMeta";

export default function TodayEnquiryList() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  type CourseData = {
    _id: string;
    course: string;
  };

  type ClassData = {
    _id: string;
    course: string;
    batch_name: string;
    batchStartDate: string;
    batchEndDate: string;
    batchDescription: string;
    whatsappLink: string;
    classTime: string;
  };

  const [data, setData] = useState<CourseData | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);

  // Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add Class form state
  const [formData, setFormData] = useState({
    batchStartDate: new Date().toISOString().split("T")[0],
    batchEndDate: "",
    batchDescription: "",
    whatsappLink: "",
    classTime: "",
  });

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    course: "",
    batchStartDate: "",
    batchEndDate: "",
    batchDescription: "",
    whatsappLink: "",
    classTime: "",
  });

  // Search + Pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch course + classes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Course by id
        const courseRes = await axios.get(
          `http://localhost:8000/api/v1/masterManagement/addCourse/${id}`
        );
        setData(courseRes.data.addCourse);

        // Classes for this course
        const classRes = await axios.get(
          `http://localhost:8000/api/v1/masterManagement/addClasses/?course=${courseRes.data.addCourse.course}`
        );
        setClasses(classRes.data.addClass || []);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8000/api/v1/masterManagement/addClasses",
        {
          course: data?.course,
          ...formData,
        }
      );

      alert("Class added successfully!");
      setIsModalOpen(false);
      setFormData({
        batchStartDate: new Date().toISOString().split("T")[0],
        batchEndDate: "",
        batchDescription: "",
        whatsappLink: "",
        classTime: "",
      });

      // Refresh classes
      const classRes = await axios.get(
        `http://localhost:8000/api/v1/masterManagement/addClasses/?course=${data?.course}`
      );
      setClasses(classRes.data.addClass || []);
    } catch (err) {
      alert("Failed to add class!");
    }
  };

  // 👉 Open Edit Modal with prefilled data
  const handleEditModal = (cls: ClassData) => {
    setEditId(cls._id);
    setEditFormData({
      course: cls.course,
      batchStartDate: cls.batchStartDate.split("T")[0],
      batchEndDate: cls.batchEndDate ? cls.batchEndDate.split("T")[0] : "",
      batchDescription: cls.batchDescription,
      whatsappLink: cls.whatsappLink,
      classTime: cls.classTime,
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;

    try {
      await axios.put(
        `http://localhost:8000/api/v1/masterManagement/addClasses/${editId}`,
        editFormData
      );
      alert("Class updated!");
      setIsEditModalOpen(false);

      // refresh list
      const res = await axios.get(
        `http://localhost:8000/api/v1/masterManagement/addClasses/?course=${data?.course}`
      );
      setClasses(res.data.addClass || []);
    } catch (err) {
      alert("Failed to update class");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/v1/masterManagement/addClasses/${id}`
      );
      alert("Class deleted!");
      setClasses((prev) => prev.filter((cls) => cls._id !== id));
    } catch (err) {
      alert("Failed to delete class");
    }
  };

  // Search + Pagination logic
  const searchedClasses = classes.filter(
    (cls) =>
      cls.batch_name.toLowerCase().includes(search.toLowerCase()) ||
      cls.batchDescription.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(searchedClasses.length / itemsPerPage);
  const paginatedClasses = searchedClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!data) return null;

  return (
    <>
      <PageMeta
        title={`Skill Fort | Course Details`}
        description="Course Details"
      />
      <PageBreadCrumbEnquiryList pageTitle={data.course} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Grid showing dynamic count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex justify-between items-center bg-teal-700 text-white rounded-xl p-4">
            <div>
              <p className="text-sm">Total {data.course} Classes</p>
              <p className="text-2xl font-bold">{classes.length}</p>
            </div>
            <div className="bg-teal-800 p-2 rounded-md">
              <GroupIcon className="text-white size-6" />
            </div>
          </div>
        </div>

        {/* Add Class Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Class
        </button>
      </div>

      {/* Add Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-black/50">
          <div className="mt-20 w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg mx-4 sm:mx-0">
            <h2 className="mb-4 text-xl font-semibold">
              Add Class for {data.course}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Batch Start Date
                  </label>
                  <input
                    type="date"
                    name="batchStartDate"
                    value={formData.batchStartDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Batch End Date
                  </label>
                  <input
                    type="date"
                    name="batchEndDate"
                    value={formData.batchEndDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Batch Description
                </label>
                <textarea
                  name="batchDescription"
                  value={formData.batchDescription}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">WhatsApp Link</label>
                <input
                  type="text"
                  name="whatsappLink"
                  value={formData.whatsappLink}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Class Time</label>
                <input
                  type="text"
                  name="classTime"
                  value={formData.classTime}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg bg-gray-300 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-black/50">
          <div className="mt-20 w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg mx-4 sm:mx-0">
            <h2 className="mb-4 text-xl font-semibold">Edit Class</h2>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Batch Start Date
                  </label>
                  <input
                    type="date"
                    name="batchStartDate"
                    value={editFormData.batchStartDate}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Batch End Date
                  </label>
                  <input
                    type="date"
                    name="batchEndDate"
                    value={editFormData.batchEndDate}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Batch Description
                </label>
                <textarea
                  name="batchDescription"
                  value={editFormData.batchDescription}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">WhatsApp Link</label>
                <input
                  type="text"
                  name="whatsappLink"
                  value={editFormData.whatsappLink}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Class Time</label>
                <input
                  type="text"
                  name="classTime"
                  value={editFormData.classTime}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border p-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg bg-gray-300 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Classes + Search + Pagination */}
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12 mt-8">
        <div className="mx-auto w-full max-w-5xl">
          <h3 className="mb-6 text-center text-2xl font-semibold text-gray-800">
            {data.course} Classes
          </h3>

          <div className="mb-5 text-center">
            <input
              type="text"
              placeholder="Search class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded border border-gray-300 p-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paginatedClasses.map((cls) => (
              <div
                key={cls._id}
                className="rounded-xl border p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <Link to={`/addStudents/${cls._id}`} className="no-underline hover:opacity-90">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      {cls.batch_name}{" "}
                      <span className="text-sm text-gray-500 font-bold">
                        - {cls.classTime}
                      </span>
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {new Date(cls.batchStartDate).toLocaleDateString("en-GB")} -{" "}
                      {cls.batchEndDate
                        ? new Date(cls.batchEndDate).toLocaleDateString("en-GB")
                        : "Ongoing"}
                    </p>
                  </div>
                </Link>
                <a
                  href={cls.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Join WhatsApp
                </a>
                <div className="flex justify-between mt-4">
                  <button
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                    onClick={() => handleEditModal(cls)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    onClick={() => handleDelete(cls._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {paginatedClasses.length === 0 && (
              <p className="col-span-full text-center text-red-500">
                No classes found.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              <button
                className={`px-3 py-1 rounded ${currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1 rounded ${currentPage === idx + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                className={`px-3 py-1 rounded ${currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div >
    </>
  );
}
