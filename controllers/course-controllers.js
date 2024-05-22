import Course from "../model/courses-schema.js";
import Student from "../model/student-schema.js";
import Teacher from "../model/teacher-schema.js";
import { sendNotification } from "./Notification.js";
// import {Logo} from '../../Client/src/assets/Logo.png'

export const addcourse = async (request, response) => {
  console.log("cameeeeeeeeeeeeeeee", request.body);
  try {
    const exists = await Course.findOne({
      coursename: request.body.coursename,
    });
    if (exists) {
      return response.status(401).json({ message: "course already exist" });
    }

    const { coursename, coursefees, courseduration, courseimage, coursedesc } =
      request.body;
    // Extract the first four letters of the course name
    const initials = coursename.substring(0, 4).toUpperCase();

    // Find the count of existing courses with the same initial letters
    const count = await Course.countDocuments({
      courseid: { $regex: `^${initials}` },
    });

    // Generate the unique course ID by concatenating initials and count
    const coursecode = `${initials}-${count + 1}`;
    const newCourse = new Course({
      coursename,
      coursefees,
      courseimage,
      courseduration,
      coursecode,
      coursedesc,
    });
    await newCourse.save();
  // const coursename="Deployment"
  // const newCourse=true;
    if(newCourse){
      const studentTeacherTokens=[];
      // const teacherTokens=[];
      const studentWithTokens=await Student.find();
      // console.log("studentWithTokens",studentWithTokens);
      studentWithTokens.map((item)=>{
        if(item.token){
          studentTeacherTokens.push(item.token)
        }
      })
      const teacherWithTOkens=await Teacher.find();
      teacherWithTOkens.map((item)=>{
        if(item.token){
          studentTeacherTokens.push(item.token)
        }
      })

      console.log("studentTeacherTokens",studentTeacherTokens);
      const data={
        "fcmTokens": studentTeacherTokens,
        "notification": {
          "title": "CMS APP",
          "body": `A new course ${coursename} has been added by the admin`,
          "icon": './Logo.png'
        }
      }
      const Notify=await sendNotification(data);
      console.log("notification Dataaa",Notify);
    }
    response.status(200).json({ message: newCourse, status: 200 });
  } catch (error) {
    console.log("errorrrrrrrrrrrrrrrrrrr while creating course", error);
    response.status(500).json({ message: error.message });
  }
};

export const allcourse = async (req, res) => {
  try {
    const coursedata = await Course.find({});
    console.log(coursedata);
    res.status(200).json({ data: coursedata });
  } catch (error) {
    console.log("errorrrrrrrrrrrrrrrrrrr while getting course", error);
    response.status(500).json({ message: error.message });
  }
};

export const courseById = async (req, res) => {
  const id=req.params.id;
  console.log("{{{{[",id);
  try {
    const coursedata = await Course.findById({_id: id});
    console.log(coursedata);
    res.status(200).json({ data: coursedata });
  } catch (error) {
    console.log("errorrrrrrrrrrrrrrrrrrr while getting course", error);
    response.status(500).json({ message: error.message });
  }
};
export const updatecourse = async (req, res) => {
  const id = req.params.id;
  console.log("iddddd", id,req.body);
  const coursee = await Course.findById({ _id: id });
  if (!coursee) {
    return res.status(404).json({ message: "course not found" });
  }
  const updatedCourse = await Course.findOneAndUpdate(
    { _id: req.params.id },
    req.body
  );
  console.log("updateeeeeeee dtaaaaaaaaa", updatedCourse);
  if (!updatedCourse) {
    return res.status(404).json({ message: "course not found for updating" });
  }
  res.status(200).json({
    
    message: updatedCourse, status: 200
  });
};

export const deletecourse = async (req, res) => {
  console.log("cameeeeeeeeeeeeeeeee for deleting");
  const id = req.params.id;
  const coursee = await Course.findById({ _id: id });
  if (!coursee) {
    return res.status(404).json({ message: "course not found" });
  }
  try {
    const deleteData = await Course.findByIdAndDelete({ _id: id });
    if (deleteData) res.status(200).json({ message: "course deleted" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
