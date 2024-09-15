import express from "express";
import {
  adminsignup,
  adminlogin,
  admindata,
  teacherregistration,
} from "../controllers/admin-controllers.js";
import {
  enrollStudentInCourse,
  getStudentCourses,
  studentdata,
  studentlogin,
  studentregistraion,
  updateFeesPaidStatus,
  allStudent,
  studentById,
  addStudentAttendance,
  getStudentByCourse,
} from "../controllers/student-controllers.js";
import {
  teacherdata,
  teacherlogin,
} from "../controllers/teacher-controller.js";
import {
  addcourse,
  allcourse,
  updatecourse,
  deletecourse,
  courseById,
} from "../controllers/course-controllers.js";
import {
  addImageGallery,
  allImages,
  approveImage,
  getApprovedImages,
} from "../controllers/gallery-controllers.js";

const router = express.Router();

router.post("/adminSignup", adminsignup);
router.post("/addImageGallery", addImageGallery);
router.get("/allImages", allImages);
router.put("/approveImage/:imageId", approveImage);
router.get("/approvedImages", getApprovedImages);
router.post("/adminLogin", adminlogin);
router.post("/adminData", admindata);
router.post("/teacherRegistration", teacherregistration);
router.post("/teacherLogin", teacherlogin);
router.post("/teacherData", teacherdata);
router.post("/studentRegistration", studentregistraion);
router.post("/studentLogin", studentlogin);
router.post("/studentData", studentdata);
router.get("/allStudent", allStudent);
router.post("/student/:id", studentById);
router.post("/addCourse", addcourse);
router.get("/course/:id", courseById);
router.post("/updateCourse/:id", updatecourse);
router.delete("/deleteCourse/:id", deletecourse);
router.get("/allCourse", allcourse);
router.post("/enrollStudentInCourse", enrollStudentInCourse);
router.get("/getStudentCourses/:studentId", getStudentCourses);
router.put(
  "/studentAttendance/:studentId/:courseId/:Date",
  addStudentAttendance
);
router.get("/studentByCourses/:courseid", getStudentByCourse);
router.put(
  "/updateFeesPaidStatus/:studentId/:courseId/:AmountPaid/:Mode",
  updateFeesPaidStatus
);
export default router;
