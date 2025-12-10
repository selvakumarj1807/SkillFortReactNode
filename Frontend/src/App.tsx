import { BrowserRouter as Router, Routes, Route } from "react-router";
import AdminSignIn from "./pages/AuthPages/AdminSignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import FormElements from "./pages/Forms/FormElements";
import AddClasses from "./pages/Forms/AddClasses";
import AddStudents from "./pages/Forms/AddStudents";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import EnquiryListAppLAyOut from "./layout/EnquiryListAppLAyOut";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import TodayEnquiryList from "./pages/todayEnquiryList";
import EnquiryDetails from "./pages/EnquiryDetails";
import EnquiryListHome from "./pages/Dashboard/EnquiryListHome";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/enquiryForm" element={<Blank />} />
          </Route>

          {/* ENquiry List Layout */}
          <Route
            element={
              <ProtectedRoute>
                <EnquiryListAppLAyOut />
              </ProtectedRoute>
            }
          >            <Route index path="/admin" element={<EnquiryListHome />} />
            {/* Tables */}
            <Route path="/enquiryList" element={<UserProfiles />} />
            <Route path="/todayEnquiryList" element={<TodayEnquiryList />} />
            <Route path="/addRequiredCource" element={<FormElements />} />
            <Route path="/courseDetails/:id" element={<AddClasses />} />
            <Route path="/enquiryDetails/:id" element={<EnquiryDetails />} />
            <Route path="/addStudents/:id" element={<AddStudents />} />
          </Route>



          {/* Auth Layout */}
          <Route path="/adminSignin" element={<AdminSignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
