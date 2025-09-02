import { BrowserRouter as Router } from "react-router";
import { Routes, Route } from "react-router-dom";

import SignIn from "./pages/admin/AuthPages/SignIn";
import SignUp from "./pages/admin/AuthPages/SignUp";
import UserProfiles from "./pages/admin/UserProfiles";
import Videos from "./pages/admin/UiElements/Videos";
import Images from "./pages/admin/UiElements/Images";
import Alerts from "./pages/admin/UiElements/Alerts";
import Badges from "./pages/admin/UiElements/Badges";
import Avatars from "./pages/admin/UiElements/Avatars";
import Buttons from "./pages/admin/UiElements/Buttons";
import LineChart from "./pages/admin/Charts/LineChart";
import BarChart from "./pages/admin/Charts/BarChart";
import Calendar from "./pages/admin/Calendar";
import BasicTables from "./pages/admin/Tables/BasicTables";
import Blank from "./pages/admin/Blank";
import AppLayout1 from "./layout/admin/AppLayout";
import AppLayout2 from "./layout/student/AppLayout";

import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/admin/Dashboard/Home";
import ManageHolidays from "./pages/admin/Holiday/ManageHolidays";
import Courses from "./pages/admin/Courses/Courses";
import CreateEmployee from "./pages/admin/CreateEmployee/CreateEmployee";
import InventoryManage from "./pages/admin/InventoryManage/InventoryManage";
import PurchaseRecord from "./pages/admin/PurchaseRecord/PurchaseRecord";
import Admission from "./pages/admin/AdmissionAdmin/AdmissionAdmin";
import StuffAttandance from "./pages/admin/StuffAttandance/StuffAttandance";
// student
import HomeStudent from "./pages/student/Dashboard/Home";
// import FormElementsStudent from "./pages/student/Notice/FormElementsStudent";
import UserProfilesStudent from "./pages/student/UserProfiles";

import { useEffect, useState } from "react";
import CourseDetails from "./pages/student/CourseDetails/CourseDetails";
import Session from "./pages/admin/Session/Session";
import Batch from "./pages/admin/Batch/Batch";
import FeeHead from "./pages/admin/FeeHead/FeeHead";
import CourseDetailsAdmin from "./pages/admin/CourseDetailsAdmin/CourseDetailsAdmin";
import StuffAttandancdDetails from "./pages/admin/StuffAttandance/StuffAttandancdDetails";
import TeacherAssignedClass from "./pages/admin/TacherAssingedClass/TacherAssingedClass";
import CreateLeave from "./pages/admin/Leave/CreateLeave";
import ManageLeave from "./pages/admin/ManageLeave/ManageLeave";
import VendorManage from "./pages/admin/VendorManage/VendorManage";
import StaffPayslip from "./pages/admin/StaffPayslip/StaffPayslip";
import AdvancePayment from "./pages/admin/AdvancePayment/AdvancePayment";
import Report from "./pages/admin/Report/Report";
import AmcRecord from "./pages/admin/AmcRecord/AmcRecord";

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const category = query.get("category");
    const permissions = query.get("permissions");
    // const id = query.get("id");

    if (category) {
      setUser(category);
    } else if (localStorage.getItem("category")) {
      setUser(localStorage.getItem("category"));
    } else {
      window.location.href = "http://localhost:3000/login";
      return;
    }
    if (token) {
      localStorage.setItem("token", token);
    }
    if (category) localStorage.setItem("category", category);
    if (permissions) localStorage.setItem("permissions", permissions);

    if (!localStorage.getItem("pageReloaded")) {
      localStorage.setItem("pageReloaded", "true");
      window.location.reload();
    }
  }, []);

  console.log("asdad", user);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          {user === "Admin" || user === "Stuff" || user === "Teacher" ? (
            <Route element={<AppLayout1 />}>
              <Route index path={`/home`} element={<Home />} />
              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              {/* Notice */}
              <Route path="/manageHolidays" element={<ManageHolidays />} />
              {/* Courses */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/session" element={<Session />} />
              <Route path="/batch" element={<Batch />} />
              <Route path="/feeHead" element={<FeeHead />} />
              {/* Admission */}
              <Route path="/admissionAdmin" element={<Admission />} />
              <Route path="/createLeave" element={<CreateLeave />} />
              <Route path="/manageLeave" element={<ManageLeave />} />
              <Route path="/report" element={<Report />} />

              Report
              <Route
                path="/courseDetailsAdmin/:id"
                element={<CourseDetailsAdmin />}
              />
              {/* CreateEmployee */}
              <Route path="/create-employee" element={<CreateEmployee />} />
              {/* InventoryManage */}
              <Route path="/inventory-manage" element={<InventoryManage />} />
              <Route path="/vendorManage" element={<VendorManage />} />
              {/* PurchaseRecord */}
              <Route path="/purchase-record" element={<PurchaseRecord />} />
              {/* MaintenanceRecord */}
              <Route
                path="/amc-record"
                element={<AmcRecord />}
              />
              {/* StuffAttandance */}
              <Route path="/stuff-attandance" element={<StuffAttandance />} />
              <Route path="/stuff-payslip" element={<StaffPayslip />} />
              <Route path="/advance-payment" element={<AdvancePayment />} />

              AdvancePayment
              <Route
                path="/teacher-assigned-class"
                element={<TeacherAssignedClass />}
              />
              <Route
                path="/stuffAttandancdDetails/:id"
                element={<StuffAttandancdDetails />}
              />
              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />
              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          ) : null}

          {user === "Student" && (
            <Route element={<AppLayout2 />}>
              <Route index path="/home" element={<HomeStudent />} />

              <Route path="/courseDetails/:id" element={<CourseDetails />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfilesStudent />} />

              {/* Notice */}
              {/* <Route
                path="/form-elements-Student"
                element={<FormElementsStudent />}
              /> */}
              {/* Admission  */}
              {/* <Route path="/admission" element={<AdmissionStudent />} /> */}
            </Route>
          )}

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Fallback Route */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </>
  );
}
