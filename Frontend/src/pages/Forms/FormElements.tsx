import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function CourseManager() {
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [editCourse, setEditCourse] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/masterManagement/addCourse/");
      if (response.data.success) {
        setCourses(response.data.addCourse);
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch courses." });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/v1/masterManagement/addCourse/new", {
        course: course.trim(),
      });

      if (response.data.success) {
        Swal.fire({ icon: "success", title: "Added", text: "Course added!", timer: 1500, showConfirmButton: false });
        setCourse("");
        fetchCourses();
      }
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Oops", text: error.response?.data?.message || "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This will delete the course permanently.",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/masterManagement/addCourse/${id}`);
        Swal.fire({ icon: "success", title: "Deleted!", text: "Course deleted successfully!" });
        fetchCourses();
      } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Failed to delete course." });
      }
    }
  };

  const handleEditModal = (id: string, name: string) => {
    setEditId(id);
    setEditCourse(name);
    (document.getElementById("editModal") as HTMLDialogElement).showModal();
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/v1/masterManagement/addCourse/${editId}`, {
        course: editCourse.trim(),
      });
      Swal.fire({ icon: "success", title: "Updated", text: "Course updated successfully!" });
      fetchCourses();
      (document.getElementById("editModal") as HTMLDialogElement).close();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Update Failed", text: "Could not update the course." });
    }
  };

  // 🔍 Filtered & Paginated Courses
  const filteredCourses = courses.filter((c: any) =>
    c.course.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageMeta title="Skill Fort | Manage Courses" description="Manage your course catalog." />
      <PageBreadcrumb pageTitle="Manage Courses" />

      {/* ➕ Add Course Form */}
      <div className="mb-10 rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 text-2xl font-semibold text-gray-800">Add New Course</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <input
              type="text"
              placeholder="Enter course name"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg px-4 py-3 text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Submitting..." : "Add Course"}
            </button>
          </form>
        </div>
      </div>

      {/* 🔍 Search */}
      <div className="mb-5 text-center">
        <input
          type="text"
          placeholder="Search course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded border border-gray-300 p-2"
        />
      </div>

      {/* 📋 Course Table */}
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-5xl">
          <h3 className="mb-6 text-center text-2xl font-semibold text-gray-800">Course List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Course Name</th>
                  <th className="px-4 py-2">Created</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map((course: any, index: number) => (
                  <tr key={course._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-2">{course.course}</td>
                    <td className="px-4 py-2">{new Date(course.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-center space-x-3">
                      <button
                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                        onClick={() => handleEditModal(course._id, course.course)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                        onClick={() => handleDelete(course._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedCourses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-red-500">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-5 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`rounded px-3 py-1 text-sm ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✏️ Responsive Modal */}
      <dialog id="editModal" className="rounded-xl w-[95%] sm:w-[420px] backdrop:bg-black/50 p-0">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Edit Course</h3>

          <input
            type="text"
            value={editCourse}
            onChange={(e) => setEditCourse(e.target.value)}
            className="w-full mb-4 rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-gray-800 dark:text-white dark:bg-gray-700 shadow-sm focus:ring focus:ring-blue-500"
            placeholder="Edit course name"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleEditSubmit}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
            >
              Save
            </button>
            <form method="dialog">
              <button
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>

    </div>
  );
}
