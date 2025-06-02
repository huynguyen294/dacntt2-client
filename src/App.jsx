import { Route, Routes, useHref } from "react-router";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

import { useInitialization, useNavigate, useVerifyUser } from "./hooks";
import { Login, Register } from "./pages/auth";
import {
  AddCertificate,
  AddClass,
  AddCourse,
  AddExam,
  AddUser,
  Admin,
  AdmissionManagement,
  CertificateManagement,
  ClassManagement,
  CourseManagement,
  EditCertificate,
  EditClass,
  EditCourse,
  EditExam,
  EditUser,
  ExamManagement,
  RegisterStudent,
  TrainingSettings,
  UserManagement,
  Teacher,
  Student,
  NotFound,
  Profile,
  Consultant,
  ClassRoom,
  TimeTablePage,
  ClassExercisePage,
  ClassStudentExercises,
} from "./pages";

import "./App.css";

const App = () => {
  const navigate = useNavigate();
  useVerifyUser();
  useInitialization();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider />

      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path=":role/profile" element={<Profile />} />

        <Route path="admin">
          <Route index element={<Admin />} />
          <Route path="user-management/:role" element={<UserManagement />} />
          <Route path="user-management/:role/add" element={<AddUser />} />
          <Route path="user-management/:role/edit/:userId" element={<EditUser />} />

          <Route path="admissions" element={<AdmissionManagement />} />
          <Route path="register-admission" element={<RegisterStudent />} />

          <Route path="certificates" element={<CertificateManagement />} />
          <Route path="certificates/add" element={<AddCertificate />} />
          <Route path="certificates/edit/:id" element={<EditCertificate />} />

          <Route path="courses" element={<CourseManagement />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path="courses/edit/:id" element={<EditCourse />} />

          <Route path="classes" element={<ClassManagement />} />
          <Route path="classes/add" element={<AddClass />} />
          <Route path="classes/:id" element={<ClassRoom />} />
          <Route path="classes/:id/exercise/:exerciseId" element={<ClassExercisePage />} />
          <Route path="classes/:id/student/:studentId" element={<ClassStudentExercises />} />
          <Route path="classes/edit/:id" element={<EditClass />} />

          <Route path="exams" element={<ExamManagement />} />
          <Route path="exams/add" element={<AddExam />} />
          <Route path="exams/edit/:id" element={<EditExam />} />

          <Route path="training-settings" element={<TrainingSettings />} />
          <Route path="timetable" element={<TimeTablePage />} />
        </Route>

        <Route path="teacher">
          <Route index element={<Teacher />} />
        </Route>

        <Route path="consultant">
          <Route index element={<Consultant />} />
          <Route path="register-admission" element={<RegisterStudent />} />
          <Route path="admissions" element={<AdmissionManagement />} />
          <Route path="classes" element={<ClassManagement />} />
        </Route>

        <Route path="/">
          <Route index element={<Student />} />
          <Route path="test" element={<Student />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HeroUIProvider>
  );
};

export default App;
