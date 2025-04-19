import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css"; // Custom CSS for responsiveness

import PageBreadCrumbEnquiryList from "../components/common/PageBreadCrumbEnquiryList";
import PageMeta from "../components/common/PageMeta";
import { GroupIcon } from "../icons";

export default function UserProfiles() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ FILTERING LOGIC
  const filteredEnquiries = enquiries
    .slice() // clone the array to avoid mutating original state
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // sort DESC
    .filter((item) => {
      const search = searchTerm.toLowerCase();
      const matchSearch =
        item.enquiryId.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search) ||
        item.requiredCourse.toLowerCase().includes(search);

      const createdAt = new Date(item.createdAt);
      const withinDateRange =
        (!fromDate || createdAt >= fromDate) &&
        (!toDate || createdAt <= toDate);

      return matchSearch && withinDateRange;
    });


  const todayCount = enquiries.filter((item) => {
    const today = new Date();
    const createdAt = new Date(item.createdAt);
    return createdAt.toDateString() === today.toDateString();
  }).length;

  return (
    <>
      <PageMeta title="Skill Fort | Enquiry List" description="Enquiry List" />
      <PageBreadCrumbEnquiryList pageTitle="Enquiry List" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* 🔢 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex justify-between items-center bg-purple-600 text-white rounded-xl p-4">
            <div>
              <p className="text-sm">Total Enquiry</p>
              <p className="text-2xl font-bold">{enquiries.length}</p>
            </div>
            <div className="bg-purple-700 p-2 rounded-md">
              <GroupIcon className="size-6 text-white" />
            </div>
          </div>

          <div className="flex justify-between items-center bg-teal-700 text-white rounded-xl p-4">
            <div>
              <p className="text-sm">Today Enquiry</p>
              <p className="text-2xl font-bold">{todayCount}</p>
            </div>
            <div className="bg-teal-800 p-2 rounded-md">
              <GroupIcon className="size-6 text-white" />
            </div>
          </div>
        </div>

        {/* 🔍 Search and Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by ID, Name or Course"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
          />
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            placeholderText="From Date"
            dateFormat="dd-MM-yyyy"
            className="rounded-md border border-gray-300 p-2 w-full text-sm sm:text-base"
            showYearDropdown
            showMonthDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            dropdownMode="select"
          />
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            placeholderText="To Date"
            dateFormat="dd-MM-yyyy"
            className="rounded-md border border-gray-300 p-2 w-full text-sm sm:text-base"
            showYearDropdown
            showMonthDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            dropdownMode="select"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2"
            onClick={() => {
              setSearchTerm("");
              setFromDate(null);
              setToDate(null);
            }}
          >
            Reset Filters
          </button>
        </div>

        {/* 🧾 Enquiry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredEnquiries.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border p-4 flex flex-col items-center text-center"
            >
              <p className="text-orange-500 font-medium text-sm">ENQUIRY ID : {item.enquiryId}</p>
              <p className="text-lg font-semibold">{item.name}</p>
              <span className="inline-block bg-gray-200 text-sm px-2 py-1 rounded mt-2 mb-4">
                {item.requiredCourse}
              </span>

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

          {filteredEnquiries.length === 0 && (
            <p className="col-span-full text-center text-red-500">No enquiries found.</p>
          )}
        </div>
      </div>
    </>
  );
}
