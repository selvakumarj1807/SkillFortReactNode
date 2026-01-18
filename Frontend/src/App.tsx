import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import AdminSignIn from "./pages/AuthPages/AdminSignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import EnquiryList from "./pages/EnquiryList";
import AddRequiredCource from "./pages/Forms/AddRequiredCource";
import AddClasses from "./pages/Forms/AddClasses";
import AddStudents from "./pages/Forms/AddStudents";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import AdminAppLAyOut from "./layout/AdminAppLAyOut";
import { ScrollToTop } from "./components/common/ScrollToTop";
//import Home from "./pages/Dashboard/Home";
import TodayEnquiryList from "./pages/todayEnquiryList";
import EnquiryDetails from "./pages/EnquiryDetails";
import AdminHome from "./pages/Dashboard/AdminHome";
import ProtectedRoute from "./components/ProtectedRoute";
import Interviews from "./pages/Forms/Interviews";
import StudentAppLayOut from "./layout/StudentAppLayOut";
import StudentHome from "./pages/Dashboard/StudentHome";
import StudentSignIn from "./pages/AuthPages/StudentSignIn";

import StudentProtectedRoute from "./components/StudentProtectedRoute";
import EnquiryForm from "./pages/EnquiryForm";
import CandidateInformation from "./pages/candidateInformation";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Enquiry Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Navigate to="/portal" replace />} />
            <Route path="/portal" element={<Blank />} />
            <Route path="/enquiryForm" element={<EnquiryForm />} />
          </Route>

          {/* Admin Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AdminAppLAyOut />
              </ProtectedRoute>
            }
          >
            <Route index path="/admin" element={<AdminHome />} />
            {/* Tables */}
            <Route path="/enquiryList" element={<EnquiryList />} />
            <Route path="/todayEnquiryList" element={<TodayEnquiryList />} />
            <Route path="/addRequiredCource" element={<AddRequiredCource />} />
            <Route path="/courseDetails/:id" element={<AddClasses />} />
            <Route path="/enquiryDetails/:id" element={<EnquiryDetails />} />
            <Route path="/addStudents/:id" element={<AddStudents />} />
            <Route path="/interviews" element={<Interviews />} />
          </Route>

          {/* Student Layout */}
          <Route element={
            <StudentProtectedRoute>
            <StudentAppLayOut />
            </StudentProtectedRoute>    
            }>
            <Route index path="/student" element={<StudentHome />} />
            <Route path="/candidateInformation" element={<CandidateInformation />} />
          </Route>



          {/* Auth Layout */}
          <Route path="/adminSignin" element={<AdminSignIn />} />
          <Route path="/studentSignin" element={<StudentSignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
