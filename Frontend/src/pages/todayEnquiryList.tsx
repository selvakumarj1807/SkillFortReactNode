import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import PageBreadCrumbEnquiryList from "../components/common/PageBreadCrumbEnquiryList";
import PageMeta from "../components/common/PageMeta";
import { GroupIcon } from "../icons";

export default function TodayEnquiryList() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  interface Enquiry {
    _id: string;
    enquiryId: string;
    name: string;
    requiredCourse: string;
    createdAt: string;
    referName?: string;
  }

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const { data } = await axios.get("https://skillfortreactnode.onrender.com/api/v1/enquiry");
        setEnquiries(data.enquiry);
      } catch (error) {
        console.error("Failed to fetch enquiries", error);
      }
    };
    fetchEnquiries();
  }, []);

  const today = new Date().toDateString();
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredEnquiries = enquiries
    .filter((item) => new Date(item.createdAt).toDateString() === today)
    .filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.enquiryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.requiredCourse.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchTerm("");
  };

  return (
    <>
      <PageMeta title="Skill Fort | Today Enquiry List" description="Today Enquiry List" />
      <PageBreadCrumbEnquiryList pageTitle="Today Enquiry List" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex justify-between items-center bg-teal-700 text-white rounded-xl p-4">
            <div>
              <p className="text-sm">Today Enquiry</p>
              <p className="text-2xl font-bold">{filteredEnquiries.length}</p>
            </div>
            <div className="bg-teal-800 p-2 rounded-md">
              <GroupIcon className="text-white size-6" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, ID, course"
            className="w-full sm:w-[70%] border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={resetFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2 w-full lg:w-auto"
          >
            Reset Filters
          </button>
        </div>


        {/* Enquiry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paginatedEnquiries.map((item) => (
            <div key={item._id} className="rounded-xl border p-4 text-center">
              <Link to={`/enquiryDetails/${item._id}`} className="text-center hover:opacity-90">
                <p className="text-orange-500 font-medium text-sm">ENQUIRY ID : {item.enquiryId}</p>
                <p className="text-lg font-semibold">{item.name}</p>
                <span className="inline-block bg-gray-200 text-sm px-2 py-1 rounded mt-2 mb-4">
                  {item.requiredCourse}
                </span>
              </Link>
              <div className="flex justify-between text-sm text-gray-700 w-full mt-2">
                <div className="text-left">
                  <p className="font-medium">Enquiry Date</p>
                  <p>{formatDate(item.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Refer By</p>
                  <p>{item.referName || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 📄 Responsive Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6 gap-4 text-sm">
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded transition ${page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredEnquiries.length)}–
              {Math.min(currentPage * itemsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
