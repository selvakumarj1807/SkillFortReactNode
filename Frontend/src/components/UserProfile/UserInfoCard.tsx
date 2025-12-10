import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface EnquiryDetails {
  name: string;
  dob: string;
  mobile: string;
  email: string;
  education: string;
  yearOfPassout: number;
  percentage: string;
  requiredCourse: string;
  placement: string;
  work: string;
  profession: string;
  company: string;
  designation: string;
  fromDate: string;
  toDate: string;
  pf: string;
  uanNo: string;
  address: string;
  panorAadhar: string;
  referName: string;
  referPhone: string;
  createdAt: string;
  enquiryId: string; // Added property
}

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [data, setData] = useState<EnquiryDetails | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/enquiry/${id}`);
        setData(res.data.enquiry);
      } catch (err) {
        console.error("Failed to fetch enquiry details");
      }
    };

    fetchData();
  }, [id]);

  if (!data) return <p className="text-center">Loading...</p>;

  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };

  const formatDOB = (dob: string) => {
    return new Date(dob).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCreatedAt = (date: string) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const orderedFields: (keyof EnquiryDetails)[] = [
    "name", "email", "mobile", "dob", "education", "yearOfPassout", "percentage",
    "requiredCourse", "placement", "work", "profession", "company", "designation",
    "fromDate", "toDate", "pf", "uanNo", "address", "panorAadhar", "referName", "referPhone"
  ];

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Enquiry Details
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            {orderedFields.map((key) => (
              <div key={key}>
                <p className="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {key === 'dob' ? formatDOB(data[key]) : data[key] || "N/A"}
                </p>
              </div>
            ))}
            <div>
              <p className="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400 capitalize">
                Enquiry Date
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatCreatedAt(data.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          Update Enquiry Status
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <h4 className="text-lg sm:text-x2 md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Enquiry Status Update
              </h4>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                You're updating enquiry for
                <span className="font-medium text-blue-600 dark:text-blue-400 mx-1">{data.name}</span>
                (Enquiry ID:
                <span className="font-mono text-gray-700 dark:text-gray-300 ml-1">{data.enquiryId}</span>),
                interested in
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 mx-1">{data.requiredCourse}</span>.
              </p>
            </div>
          </div>

          <form className="flex flex-col">
            <div className="custom-scrollbar h-auto max-h-[350px] overflow-y-auto px-2 pb-3">

              <div className="mt-7">

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>Enquired person comments</Label>
                    <Input type="text" value="want Online" />
                  </div>

                  <div className="col-span-2">
                    <Label>Attender Comments</Label>
                    <Input type="text" value="Positive" />
                  </div>


                  <div className="col-span-2 lg:col-span-1">
                    <Label>Attender Name</Label>
                    <Input type="text" value="Sample Attender" />
                  </div>


                  <div className="col-span-2 lg:col-span-1">
                    <Label>Expected Joining Date</Label>
                    <Input type="text" value="25-04-2025" />
                  </div>

                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse items-stretch gap-3 px-4 mt-8 sm:flex-row sm:justify-end sm:items-center">
              <Button
                size="sm"
                variant="outline"
                onClick={closeModal}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="w-full sm:w-auto"
              >
                Update Status
              </Button>
            </div>

          </form>
        </div>
      </Modal>

    </div>
  );
}
