import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Modules
import CopywritingModule from "./pages/modules/CopywritingModule";
import GraphicDesignModule from "./pages/modules/GraphicDesignModule";
import Design3DModule from "./pages/modules/Design3DModule";
import DramaModule from "./pages/modules/DramaModule";
import CanvasModule from "./pages/modules/CanvasModule";
import MusicModule from "./pages/modules/MusicModule";

// Teacher - 教学管理
import CourseList from "./pages/courses/CourseList";
import CourseDetail from "./pages/courses/CourseDetail";
import AssignmentList from "./pages/courses/AssignmentList";
import TeacherStudents from "./pages/courses/TeacherStudents";

// Student - 我的学习
import StudentCourseList from "./pages/courses/StudentCourseList";
import StudentAssignments from "./pages/courses/StudentAssignments";

// Gallery
import Gallery from "./pages/gallery/Gallery";

// Tasks
import TaskCenter from "./pages/TaskCenter";

// Recharge
import RechargeCenter from "./pages/recharge/RechargeCenter";
import Transactions from "./pages/recharge/Transactions";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Creation Modules - 老师和学生都可以用 */}
      <Route path="/module/copywriting" element={<CopywritingModule />} />
      <Route path="/module/graphic" element={<GraphicDesignModule />} />
      <Route path="/module/3d" element={<Design3DModule />} />
      <Route path="/module/drama" element={<DramaModule />} />
      <Route path="/module/canvas" element={<CanvasModule />} />
      <Route path="/module/music" element={<MusicModule />} />

      {/* Teacher Routes - 教学管理（老师专用） */}
      <Route path="/teacher/courses" element={<CourseList />} />
      <Route path="/teacher/courses/:id" element={<CourseDetail />} />
      <Route path="/teacher/assignments" element={<AssignmentList />} />
      <Route path="/teacher/students" element={<TeacherStudents />} />

      {/* Student Routes - 我的学习（学生视角） */}
      <Route path="/my/courses" element={<StudentCourseList />} />
      <Route path="/my/assignments" element={<StudentAssignments />} />

      {/* Legacy redirects - 兼容旧路由 */}
      <Route path="/courses" element={<StudentCourseList />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/assignments" element={<StudentAssignments />} />
      <Route path="/students" element={<TeacherStudents />} />

      {/* Gallery */}
      <Route path="/gallery" element={<Gallery />} />

      {/* Tasks */}
      <Route path="/tasks" element={<TaskCenter />} />

      {/* Recharge */}
      <Route path="/recharge" element={<RechargeCenter />} />
      <Route path="/transactions" element={<Transactions />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
