import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/admin/AuthPages/SignIn";
import SignUp from "./pages/admin/AuthPages/SignUp";
import UserProfiles from "./pages/admin/UserProfiles";
import NotFound from "./pages/admin/OtherPage/NotFound";
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
import AppLayout from "./layout/admin/AppLayout";
import AppLayoutStudent from "./layout/student/AppLayout";

import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/admin/Dashboard/Home";
import FormElementsStuffStudent from "./pages/admin/Notice/FormElementsStuffStudent";
import Courses from "./pages/admin/Courses/Courses";
import CreateEmployee from "./pages/admin/CreateEmployee/CreateEmployee";
import InventoryManage from "./pages/admin/InventoryManage/InventoryManage";
import PurchaseRecord from "./pages/admin/PurchaseRecord/PurchaseRecord";
import MaintenanceRecord from "./pages/admin/MaintenanceRecord/MaintenanceRecord";
import Admission from "./pages/admin/Admission/Admission";
import StuffAttandance from "./pages/admin/StuffAttandance/StuffAttandance";
// student
import HomeStudent from "./pages/student/Dashboard/Home";
import FormElementsStudent from "./pages/student/Notice/FormElementsStudent";
import AdmissionStudent from "./pages/student/Admission/Admission";
import UserProfilesStudent from "./pages/student/UserProfiles";

import { useEffect, useState } from "react";
import CourseDetails from "./pages/student/CourseDetails/CourseDetails";
import Session from "./pages/admin/Session/Session";
import Batch from "./pages/admin/Batch/Batch";

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const category = query.get("category");

    setUser(category ? category : localStorage.getItem("category"));

    if (token) localStorage.setItem("token", token);
    if (category) localStorage.setItem("category", category);

    console.log("Token:", window.location.search);
    console.log("Category:", category);
  }, []);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          {user === "Admin" && (
            <Route element={<AppLayout />}>
              <Route index path="/Admin" element={<Home />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Notice */}
              <Route
                path="/form-elements-Stuff-Student"
                element={<FormElementsStuffStudent />}
              />
              {/* Courses */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/session" element={<Session />} />
              <Route path="/batch" element={<Batch />} />


              
              {/* Admission */}
              <Route path="/admission" element={<Admission />} />
              {/* CreateEmployee */}
              <Route path="/create-employee" element={<CreateEmployee />} />
              {/* InventoryManage */}
              <Route path="/inventory-manage" element={<InventoryManage />} />
              {/* PurchaseRecord */}
              <Route path="/purchase-record" element={<PurchaseRecord />} />
              {/* MaintenanceRecord */}
              <Route
                path="/maintenance-record"
                element={<MaintenanceRecord />}
              />
              {/* StuffAttandance */}
              <Route path="/stuff-attandance" element={<StuffAttandance />} />

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
          )}

          {user === "Student" && (
            <Route element={<AppLayoutStudent />}>
              <Route index path="/Student" element={<HomeStudent />} />

              <Route path="/projects/:id" element={<CourseDetails />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfilesStudent />} />

              {/* Notice */}
              <Route
                path="/form-elements-Student"
                element={<FormElementsStudent />}
              />
              {/* Admission  */}
              <Route path="/admission" element={<AdmissionStudent />} />
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
