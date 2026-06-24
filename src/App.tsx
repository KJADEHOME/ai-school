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

// Courses
import CourseList from "./pages/courses/CourseList";
import CourseDetail from "./pages/courses/CourseDetail";
import AssignmentList from "./pages/courses/AssignmentList";

// Gallery
import Gallery from "./pages/gallery/Gallery";

// Recharge
import RechargeCenter from "./pages/recharge/RechargeCenter";
import Transactions from "./pages/recharge/Transactions";

// Student management placeholder
import { Users } from "lucide-react";
import AppLayout from "./components/layout/AppLayout";

function StudentManagement() {
  return (
    <AppLayout title="学生管理">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-[#333] mx-auto mb-3" />
          <p className="text-sm text-[#666]">学生管理功能开发中</p>
          <p className="text-xs text-[#a0a0a0] mt-1">
            将在后续版本中上线
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Creation Modules */}
      <Route path="/module/copywriting" element={<CopywritingModule />} />
      <Route path="/module/graphic" element={<GraphicDesignModule />} />
      <Route path="/module/3d" element={<Design3DModule />} />
      <Route path="/module/drama" element={<DramaModule />} />
      <Route path="/module/canvas" element={<CanvasModule />} />

      {/* Course Management */}
      <Route path="/courses" element={<CourseList />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/assignments" element={<AssignmentList />} />
      <Route path="/students" element={<StudentManagement />} />

      {/* Gallery */}
      <Route path="/gallery" element={<Gallery />} />

      {/* Recharge */}
      <Route path="/recharge" element={<RechargeCenter />} />
      <Route path="/transactions" element={<Transactions />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
