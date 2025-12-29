import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../ui/dropdown/Dropdown";

interface StudentData {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
}

export default function StudentDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [student, setStudent] = useState<StudentData | null>(null);
  const navigate = useNavigate();

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  // Load student from localStorage
  useEffect(() => {
    const studentToken = localStorage.getItem("studentToken");
    const studentData = localStorage.getItem("student");

    if (!studentToken || !studentData) {
      navigate("/studentSignin");
      return;
    }

    try {
      setStudent(JSON.parse(studentData));
    } catch {
      navigate("/studentSignin");
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("student");

    navigate("/studentSignin");
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-2 font-medium text-theme-sm">
          {student ? student.studentName : "Student"}
        </span>

        <svg
          className={`stroke-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-4 w-[260px] rounded-2xl border bg-white p-4 shadow-lg dark:bg-gray-dark"
      >
        <div className="mb-3">
          <span className="block font-medium text-gray-800 dark:text-gray-200">
            {student?.studentName}
          </span>
          <span className="block text-sm text-gray-500">
            {student?.studentEmail}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 17L15 12L10 7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M15 12H3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
