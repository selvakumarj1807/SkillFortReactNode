import React from "react";
import { Navigate } from "react-router-dom";

interface StudentProtectedRouteProps {
  children: React.ReactNode;
}

const StudentProtectedRoute: React.FC<StudentProtectedRouteProps> = ({
  children,
}) => {
  const studentToken = localStorage.getItem("studentToken");
  const student = localStorage.getItem("student");

  // ❌ Not logged in → redirect to student sign in
  if (!studentToken || !student) {
    return <Navigate to="/studentSignin" replace />;
  }

  // ✅ Authorized → render page
  return <>{children}</>;
};

export default StudentProtectedRoute;
