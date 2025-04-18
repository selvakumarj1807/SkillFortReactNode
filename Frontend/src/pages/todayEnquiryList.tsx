import { useEffect, useState } from "react";
import axios from "axios";
import PageBreadCrumbEnquiryList from "../components/common/PageBreadCrumbEnquiryList";
import PageMeta from "../components/common/PageMeta";
import { GroupIcon } from "../icons";

export default function UserProfiles() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/v1/enquiry");
        setEnquiries(data.enquiry);
      } catch (error) {
        console.error("Failed to fetch enquiries", error);
      }
    };

    fetchEnquiries();
  }, []);

  interface Enquiry {
    _id: string;
    enquiryId: string;
    name: string;
    requiredCourse: string;
    createdAt: string;
    referName?: string;
  }

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-IN", options);
  };

  // Get today's date in string format
  const today = new Date().toDateString();

  // Filter today's enquiries only
  const todayEnquiries = enquiries
    .filter((item) => new Date(item.createdAt).toDateString() === today)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <PageMeta title="Skill Fort | Today Enquiry List" description="Enquiry List" />
      <PageBreadCrumbEnquiryList pageTitle="Today Enquiry List" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Total Today Enquiry */}
          <div className="flex justify-between items-center bg-teal-700 text-white rounded-xl p-4">
            <div>
              <p className="text-sm">Today Enquiry</p>
              <p className="text-2xl font-bold">{todayEnquiries.length}</p>
            </div>
            <div className="bg-teal-800 p-2 rounded-md">
              <GroupIcon className="text-white-800 size-6 dark:text-white/90" />
            </div>
          </div>
        </div>

        {/* Enquiry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayEnquiries.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border p-4 flex flex-col items-center text-center"
            >
              <p className="text-orange-500 font-medium text-sm">
                ENQUIRY ID : {item.enquiryId}
              </p>
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
        </div>
      </div>
    </>
  );
}
