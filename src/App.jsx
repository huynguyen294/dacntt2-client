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
  NotFound,
  Profile,
  ClassRoom,
  TimeTablePage,
  ClassExercisePage,
  ClassStudentExercises,
  Dashboard,
  StudentSchedule,
  StudentClass,
  StudentExam,
  StudentScore,
  StudentTuition,
  StudentLetter,
  StudentClassRoom,
  ClassExerciseDetail,
  TeacherClass,
  Assessment,
  AttendanceCheck,
  TuitionManagement,
  TuitionDiscount,
  ClassTuition,
  AddTuition,
  EditTuition,
  AddTuitionDiscount,
  EditTuitionDiscount,
  StudentTuitionPayment,
  TuitionPayment,
  AdmissionReport,
  FinanceReport,
  EduReport,
} from "./pages";

import "./App.css";
import { teacherScheduleBreadcrumbItems } from "./pages/training/constants";

const App = () => {
  useVerifyUser();
  useInitialization();
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider />

      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path=":role/profile" element={<Profile />} />

        <Route path="admin">
          <Route index element={<Admin />} />
          <Route path="information-sheet" element={<Dashboard />} />
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

          <Route path="tuition-management" element={<TuitionManagement />} />
          <Route path="tuition-management/add" element={<AddTuition />} />
          <Route path="tuition-management/edit/:id" element={<EditTuition />} />
          <Route path="class-tuition" element={<ClassTuition />} />
          <Route path="class-tuition/add" element={<AddTuition />} />
          <Route path="class-tuition/edit/:id" element={<EditTuition />} />
          <Route path="tuition-discount" element={<TuitionDiscount />} />
          <Route path="tuition-discount/add" element={<AddTuitionDiscount />} />
          <Route path="tuition-discount/edit/:id" element={<EditTuitionDiscount />} />
          <Route path="tuition-payment" element={<TuitionPayment />} />

          <Route path="admission-report" element={<AdmissionReport />} />
          <Route path="finance-report" element={<FinanceReport />} />
          <Route path="edu-report" element={<EduReport />} />
        </Route>

        <Route path="teacher">
          <Route index element={<Dashboard />} />
          <Route path="classes" element={<TeacherClass />} />
          <Route path="classes/:id" element={<ClassRoom />} />
          <Route path="classes/:id/exercise/:exerciseId" element={<ClassExercisePage />} />
          <Route path="classes/:id/student/:studentId" element={<ClassStudentExercises />} />
          <Route path="timetable" element={<TimeTablePage breadcrumbItems={teacherScheduleBreadcrumbItems} />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="attendance-check" element={<AttendanceCheck />} />
        </Route>

        <Route path="consultant">
          <Route index element={<Dashboard />} />
          <Route path="register-admission" element={<RegisterStudent />} />
          <Route path="admissions" element={<AdmissionManagement />} />
          <Route path="classes" element={<ClassManagement />} />
        </Route>

        <Route path="finance-officer">
          <Route path="user-management/:role" element={<UserManagement />} />
          <Route path="user-management/:role/add" element={<AddUser />} />
          <Route path="user-management/:role/edit/:userId" element={<EditUser />} />

          <Route index element={<Dashboard />} />
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

          <Route path="tuition-management" element={<TuitionManagement />} />
          <Route path="tuition-management/add" element={<AddTuition />} />
          <Route path="tuition-management/edit/:id" element={<EditTuition />} />
          <Route path="tuition-discount" element={<TuitionDiscount />} />
          <Route path="class-tuition" element={<ClassTuition />} />
          <Route path="class-tuition/add" element={<AddTuition />} />
          <Route path="class-tuition/edit/:id" element={<EditTuition />} />
          <Route path="tuition-discount" element={<TuitionDiscount />} />
          <Route path="tuition-discount/add" element={<AddTuitionDiscount />} />
          <Route path="tuition-discount/edit/:id" element={<EditTuitionDiscount />} />
          <Route path="tuition-payment" element={<TuitionPayment />} />
        </Route>

        <Route path="/">
          <Route index element={<Dashboard />} />
          <Route path="classes" element={<StudentClass />} />
          <Route path="classes/:classId" element={<StudentClassRoom />} />
          <Route path="classes/:classId/exercise/:exerciseId" element={<ClassExerciseDetail />} />
          <Route path="timetable" element={<StudentSchedule />} />
          <Route path="exam-schedule" element={<StudentExam />} />
          <Route path="scores" element={<StudentScore />} />
          <Route path="tuition" element={<StudentTuition />} />
          <Route path="tuition/payment/:classId" element={<StudentTuitionPayment />} />
          <Route path="letter" element={<StudentLetter />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HeroUIProvider>
  );
};

export default App;
