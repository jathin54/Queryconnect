import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Chats from "./components/Chats";
import Notifications from "./components/Notifications";
import RegistrationForm from "./components/Registration";
import DashboardTutor from "./components/DashboardTutor";
import DashboardStudent from "./components/DashboardStudent";
import LoginTutorForm from "./components/LoginTutor";
import LoginStudentForm from "./components/LoginStudent";
import Login from "./components/Login";
import MyConnections from "./components/MyConnections";
import EditProfileForm from "./components/StudentForm";
import TutorForm from "./components/TutorForm";
import TutorMoreDetails from "./components/TutorMoreDetails";
import PostsList from "./components/PostList";
//import TutorProfileDetails from "./components/TutorProfileDetails";
//import TutorDetails from "./components/TutorDetails";




const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard-tutor" element={<DashboardTutor />} />
      <Route path="/chats" element={<Chats />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/registration" element={<RegistrationForm />} />
      <Route path="/tutor/login" element={<LoginTutorForm />} />
      <Route path="/student/login" element={<LoginStudentForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-connections" element={<MyConnections />} />
      <Route path="/dashboard-student" element={<DashboardStudent />} />
      <Route path="/student-form" element={<EditProfileForm />} />
      <Route path="/tutor-form" element={<TutorForm />} />
      <Route path="/posts" element={<PostsList />} />
      <Route path="/tutor-details" element={<TutorMoreDetails />} />
    </Routes>
  </BrowserRouter>
);

export default App;
