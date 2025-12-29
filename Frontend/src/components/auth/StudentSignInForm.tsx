import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function StudentSignInForm() {
  const navigate = useNavigate();

  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  const [errors, setErrors] = useState<{
    studentEmail?: string;
    studentPhone?: string;
    general?: string;
  }>({});

  // ✅ Form validation
  const validateForm = () => {
    const newErrors: {
      studentEmail?: string;
      studentPhone?: string;
    } = {};

    if (!studentEmail.trim()) {
      newErrors.studentEmail = "Email is required";
    }

    if (!studentPhone.trim()) {
      newErrors.studentPhone = "Phone number is required";
    }

    return newErrors;
  };

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/studentAuth/student-login",
        {
          studentEmail,
          studentPhone,
        }
      );

      if (response.data?.success) {
        // ✅ Store auth data
        localStorage.setItem("studentToken", response.data.token);
        localStorage.setItem("student", JSON.stringify(response.data.student));

        // ✅ Redirect to student dashboard
        navigate("/student");
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    } catch (error: any) {
      setErrors({
        general:
          error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <div className="mb-6">
          <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
            Student Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your registered email and phone number
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              placeholder="arun.kumar@example.com"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
            />
            {errors.studentEmail && (
              <p className="mt-1 text-sm text-red-500">
                {errors.studentEmail}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label>
              Phone Number <span className="text-error-500">*</span>
            </Label>
            <Input
              placeholder="+91-9876543210"
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
            />
            {errors.studentPhone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.studentPhone}
              </p>
            )}
          </div>

          {/* API Error */}
          {errors.general && (
            <p className="text-sm text-red-500 text-center">
              {errors.general}
            </p>
          )}

          {/* Submit */}
          <Button className="w-full" size="sm">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
