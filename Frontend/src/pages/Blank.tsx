import { useEffect, useState } from 'react';
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css"; // Custom CSS for responsiveness
import axios from 'axios';
import Swal from 'sweetalert2';

export default function StudentEnquiryForm() {
  const [isWorking, setIsWorking] = useState(false); // state to toggle fields
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);

  // Inside your component:
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://skillfortreactnode.onrender.com/api/v1/masterManagement/addCourse/");
        if (res.data.success) {
          setCourses(res.data.addCourse);
        }
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formEl = e.target as HTMLFormElement;
    const form = new FormData(formEl);
    const formData: any = Object.fromEntries(form.entries());

    formData.dob = selectedDate ? selectedDate.toISOString() : '';
    formData.fromDate = fromDate ? fromDate.toISOString() : '';
    formData.toDate = toDate ? toDate.toISOString() : '';

    // Required fields
    const requiredFields = [
      'name',
      'mobile',
      'email',
      'education',
      'yearOfPassout',
      'percentage',
      'requiredCourse',
      'placement',
      'work',
      'address',
      'panorAadhar',
      'referName',
      'referPhone',
    ];

    if (!selectedDate) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Date of Birth is required.' });
      setLoading(false);
      return;
    }

    // General field presence check
    for (let field of requiredFields) {
      if (!formData[field]) {
        Swal.fire({ icon: 'error', title: 'Validation Error', text: `Please enter ${field}` });
        setLoading(false);
        return;
      }
    }

    // ✅ Mobile & ReferPhone: 10-digit validation
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Mobile number must be 10 digits.' });
      setLoading(false);
      return;
    }

    if (!mobileRegex.test(formData.referPhone)) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Referal Mobile No must be 10 digits.' });
      setLoading(false);
      return;
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Enter a valid email address.' });
      setLoading(false);
      return;
    }

    // Extra validations if isWorking === true
    if (isWorking) {
      const workingFields = ['profession', 'company', 'designation', 'pf', 'uanNo'];
      for (let field of workingFields) {
        if (!formData[field]) {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: `Please fill the ${field} field.`,
          });
          setLoading(false);
          return;
        }
      }

      if (!fromDate || !toDate) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please select both From Date and To Date',
        });
        setLoading(false);
        return;
      }
    }

    // ✅ Send request
    try {
      await axios.post('https://skillfortreactnode.onrender.com/api/v1/enquiry/new', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Enquiry Submitted!',
        text: 'Your enquiry has been successfully submitted.',
      });

      formEl.reset();
      setSelectedDate(null);
      setFromDate(null);
      setToDate(null);
      setIsWorking(false);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed!',
        text: error.response?.data?.message || 'Something went wrong!',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <PageMeta
        title="Skill Fort | Enquiry Form"
        description="Skill Fort is a leading online and offline learning platform that offers a wide range of courses to help you enhance your skills and knowledge."
      />
      <PageBreadcrumb pageTitle="Enquiry Form" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Enquiry Form
          </h3>

          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="name" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"

                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                placeholder="Enter your full name"
              />
            </div>

            {/* DOB */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="dob" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Date of Birth
              </label>
              <DatePicker
                id="dob"
                name="dob"
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                className="rounded-md border border-gray-300 p-2 w-full text-sm sm:text-base"
                placeholderText="Select your DOB"
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                dropdownMode="select"
              />
            </div>

            {/* Mobile No */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="mobile" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Mobile No
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                placeholder="Enter your mobile number"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Email ID
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                placeholder="Enter your email address"
              />
            </div>

            {/* Education Qualification */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="education" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Education Qualification
              </label>
              <input
                type="text"
                id="education"
                name="education"
                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                placeholder="Your highest qualification"
              />
            </div>

            {/* Year of Pass Out */}
            <div className="flex flex-col text-left">
              <label htmlFor="yearOfPassout" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Year of Pass Out
              </label>
              <input
                type="number"
                id="yearOfPassout"
                name="yearOfPassout"
                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                placeholder="Enter year"
              />
            </div>

            {/* CGPA / Percentage Course */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="percentage" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                CGPA / Percentage
              </label>
              <input
                type="text"
                id="percentage"
                name="percentage"

                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                placeholder="Enter CGPA / Percentage"
              />
            </div>

            {/* Required Course */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="requiredCourse" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Required Course
              </label>
              <select
                id="requiredCourse"
                name="requiredCourse"
                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                defaultValue=""
              >
                <option value="" disabled>-- Select Course --</option>
                {courses.map((course: any) => (
                  <option key={course._id} value={course.course}>
                    {course.course}
                  </option>
                ))}
              </select>
            </div>


            {/* Placements Required */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Placements Required
              </label>
              <div className="flex gap-4">
                <label>
                  <input type="radio" name="placement" value="yes" /> Yes
                </label>
                <label>
                  <input type="radio" name="placement" value="no" /> No
                </label>
              </div>
            </div>

            {/* Currently Working */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Currently Working
              </label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="work"
                    value="yes"
                    onChange={() => setIsWorking(true)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="work"
                    value="no"
                    onChange={() => setIsWorking(false)}
                  />{" "}
                  No
                </label>
              </div>
            </div>

            {/* Show below fields only if isWorking === true */}
            {isWorking && (
              <>
                {/* Profession: */}
                <div className="flex flex-col sm:col-span-2 text-left">
                  <label className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Profession:
                  </label>
                  <div className="flex gap-4">
                    <label>
                      <input type="radio" name="profession" value="yes" /> IT
                    </label>
                    <label>
                      <input type="radio" name="profession" value="no" /> Non-IT
                    </label>
                  </div>
                </div>

                {/* Company Name */}
                <div className="flex flex-col sm:col-span-2 text-left">
                  <label htmlFor="company" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                    placeholder="Enter Company Name"
                  />
                </div>

                {/* Designation */}
                <div className="flex flex-col sm:col-span-2 text-left">
                  <label htmlFor="designation" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Designation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                    placeholder="Enter Designation"
                  />
                </div>

                {/* Duration */}
                <div className="flex flex-col sm:col-span-2 text-left">
                  <label className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Duration (From - To)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* From Date */}
                    <DatePicker
                      selected={fromDate}
                      onChange={(date: Date | null) => setFromDate(date)}
                      selectsStart
                      startDate={fromDate}
                      endDate={toDate}
                      placeholderText="From Date"
                      dateFormat="dd-MM-yyyy"
                      className="rounded-md border border-gray-300 p-2 w-full text-sm sm:text-base"
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      dropdownMode="select"
                      name="fromDate"
                    />

                    {/* To Date */}
                    <DatePicker
                      selected={toDate}
                      onChange={(date: Date | null) => setToDate(date)}
                      selectsEnd
                      startDate={fromDate}
                      endDate={toDate}
                      minDate={fromDate || undefined}
                      placeholderText="To Date"
                      dateFormat="dd-MM-yyyy"
                      className="rounded-md border border-gray-300 p-2 w-full text-sm sm:text-base"
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      dropdownMode="select"
                      name="toDate"
                    />
                  </div>
                </div>

                {/* PF */}
                <div className="flex flex-col sm:col-span-2 text-left">
                  <label className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    PF
                  </label>
                  <div className="flex gap-4">
                    <label>
                      <input type="radio" name="pf" value="yes" /> Yes
                    </label>
                    <label>
                      <input type="radio" name="pf" value="no" /> No
                    </label>
                  </div>
                </div>

                {/* UAN No */}
                <div className="flex flex-col sm:col-span-2 text-left">
                  <label htmlFor="uanNo" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    UAN No
                  </label>
                  <input
                    type="text"
                    id="uanNo"
                    name="uanNo"
                    className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                    placeholder="Enter UAN No"
                  />
                </div>
              </>
            )}


            {/* Address */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="address" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                placeholder="Enter your address"
              ></textarea>
            </div>

            {/* PAN / Aadhar No */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="panorAadhar" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                PAN / Aadhar No
              </label>
              <input
                type="text"
                id="panorAadhar"
                name="panorAadhar"
                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                placeholder="Enter PAN / Aadhar No"
              />
            </div>

            {/* Referal Name */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="referName" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Referal Name
              </label>
              <input
                type="text"
                id="referName"
                name="referName"
                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                placeholder="Enter Referal Name"
              />
            </div>

            {/* Referal Mobile No */}
            <div className="flex flex-col sm:col-span-2 text-left">
              <label htmlFor="referPhone" className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Referal Mobile No
              </label>
              <input
                type="text"
                id="referPhone"
                name="referPhone"
                className="rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-white/[0.03]"
                placeholder="Enter Referal Mobile No"
              />
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-lg px-4 py-3 text-white focus:ring focus:ring-blue-300 
    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}