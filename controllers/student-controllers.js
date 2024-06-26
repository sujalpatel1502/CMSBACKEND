import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../model/admin-schema.js";
import Teacher from "../model/teacher-schema.js";
import nodemailer from "nodemailer";
import Student from "../model/student-schema.js";
const JWT_SECRET = "ndfvgtdyurhdvfgtioylgkevchopfitnjrhfnjhsawiuhggyy";
import NodeGeocoder from "node-geocoder";

const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_TRANSPORT_HOST,
      port: process.env.EMAIL_TRANSPORT_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_TRANSPORT_HOST_USER,
        pass: process.env.EMAIL_TRANSPORT_HOST_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: '"CMS App" <sujalpatel1502@gmail.com>',
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const studentregistraion = async (request, response) => {
  console.log("request bodyyyyy", request.body);
  try {
    const exists = await Student.findOne({ email: request.body.email });
    if (exists) {
      return response.status(401).json({ message: "username already exist" });
    }
    const {
      email,
      name,
      dob,
      age,
      gender,
      address,
      parentname,
      standard,
      watsappcontact,
      normalcontact,
      profileImage,
    } = request.body;
    // const hashpassword=await bcrypt.hash(password,10);
    const student = request.body;
    console.log(student);

    let formno = 1;
    const existss = await Student.findOne({}).sort({ formno: -1 }).limit(1);
    console.log("existssss", existss);

    if (existss) {
      formno = existss.formno + 1;
    }
    const password = "1234";
    const newStudent = new Student({
      formno,
      name,
      email,
      parentname,
      standard,
      password: password,
      profileImage,
      dob,
      age,
      gender,
      address,
      watsappcontact,
      normalcontact,
    });
    const emaill = "sujalpatel1502@gmail.com";
    const subject = "Your login credentials for the App";
    const text = `Dear Student,\n\nYour login credentials for the App are as follows:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease use these credentials to log in to the App.\n\nBest regards,\n Team CMS`;
    sendEmail(emaill, subject, text);
    await newStudent.save();
    response.status(200).json({ message: student, status: 200 });
  } catch (error) {
    console.log("errorrrrrrrrrrrrrrrrrrr whil signup", error);
    response.status(500).json({ message: error.message });
  }
};

export const studentlogin = async (request, response) => {
  console.log("reqqq", request.body);
  try {
    const email = request.body.email;
    const fcmToken = request.body.fcmToken;
    const password = request.body.password;
    let existingUser;
    try {
      existingUser = await Student.findOne({ email });
    } catch (error) {
      return console.log(error);
    }
    // const ispassword=await bcrypt.compare(password,existingUser.password);
    // console.log("ispassword",ispassword);
    // if(!ispassword){
    //      return response.status(401).json({message:"incorrect password"});
    // }
    let user = await Student.findOne({ email: email });
    if (user) {
      // return response.status(200).json(`${email} login sucessfull`)
      const token = Jwt.sign({ email: email }, JWT_SECRET);
      await Student.findOneAndUpdate({ token: fcmToken });
      console.log("doneeee");
      if (response.status(201)) {
        return response.send({ status: 201, data: token });
      } else {
        return response.send({ error: "error" });
      }
    } else {
      return response.status(401).json("invalid request");
    }
  } catch (error) {
    console.log("errorrrrrrrrrrrrrrrrrrr whil login", error);
    response.status(500).json({ message: error.message });
  }
  console.log("hiiii");
};

export const studentdata = async (request, response) => {
  const { token } = request.body;
  try {
    const user = Jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    Student.findOne({ email: useremail }).then((data) => {
      return response.send({ status: 201, data: data });
    });
  } catch (error) {
    return response.send({ error: error });
  }
};

export const enrollStudentInCourse = async (request, response) => {
  const { studentId, courseId, DateOfEnrollment, UpdatedFees } = request.body;
  const feesPaid = false;
  const feesAmountPaid = 0;
  const Balance = UpdatedFees;
  const fees = UpdatedFees;

  try {
    const student = await Student.findById({ _id: studentId });
    console.log("====================================");
    console.log("student", student);
    console.log("====================================");

    console.log("studnettttt", student.courseEnrollments[0]);

    const isEnrolled = student.courseEnrollments.some(
      (item) => item.courseId == courseId
    );

    if (isEnrolled) {
      return response.status(401).json({
        message: "Student is already registered in this course",
        status: 401,
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $push: {
          courseEnrollments: {
            courseId,
            feesPaid,
            feesAmountPaid,
            Balance,
            DateOfEnrollment,
            fees,
          },
        },
      },
      { new: true }
    );

    if (!updatedStudent) {
      return response
        .status(404)
        .json({ message: "failed to update", status: "404" });
    }
    const mail = student.email;
    const emaill = mail;
    console.log("====================================");
    console.log("emaillll", emaill);
    console.log("====================================");
    const subject = "hurrayyyy you registered to the course";
    const text = `Dear Student,you have registered\n\n for the course Team CMS`;
    sendEmail(emaill, subject, text);

    return response.status(200).json({
      message: "Student enrollment updated",
      student: updatedStudent,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating student enrollment:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentCourses = async (request, response) => {
  const { studentId } = request.params;
  const { paid } = request.query;

  try {
    const student = await Student.findById(studentId).populate(
      "courseEnrollments.courseId"
    );
    if (!student) {
      return response.status(404).json({ message: "Student not found" });
    }
    const courses = student.courseEnrollments.map(
      (enrollment) => enrollment.courseId
    );
    const filtercoursespaid = student.courseEnrollments.filter(
      (enrollment) => enrollment.feesPaid == true
    );
    const filtercoursesnotpaid = student.courseEnrollments.filter(
      (enrollment) => enrollment.feesPaid == !true
    );
    if (paid !== undefined) {
      if (paid == "true") {
        return response.status(200).json({ filtercoursespaid });
      } else if (paid == "false") {
        return response.status(200).json({ filtercoursesnotpaid });
      }
    } else {
      return response.status(200).json({ studentId, courses });
    }
  } catch (error) {
    console.error("Error retrieving student courses:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export const updateFeesPaidStatus = async (request, response) => {
  console.log("cameeee-----", request.params.Mode);
  const { studentId, courseId, AmountPaid, Mode } = request.params;
  console.log("amtttt", AmountPaid);
  // const bal=3000;
  const student = await Student.findById({ _id: studentId });
  console.log("studenttttt", student);
  const course = student.courseEnrollments.find(
    (item) => item.courseId == courseId
  );
  console.log("courseeeee", course);
  const Balance = course.Balance - AmountPaid;

  console.log("balanceeee", Balance);

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: studentId, "courseEnrollments.courseId": courseId },
      {
        $set: {
          "courseEnrollments.$.feesAmountPaid": AmountPaid,
          "courseEnrollments.$.Balance": Balance,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedStudent) {
      return response
        .status(404)
        .json({ message: "Student or course not found", status: 404 });
    }
    course.payments.push({
      amountPaid: parseFloat(AmountPaid),
      modeOfPayment: Mode,
    });

    await student.save();

    return response.status(200).json({
      message: "FeesPaid status updated successfully",
      student: updatedStudent,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating feesPaid status:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
  // return response.status(200).json({ message: 'FeesPaid check' });
};

export const addStudentAttendance = async (req, res) => {
  // console.log("cameeee");
  const { studentId, courseId, Date } = req.params;
  console.log("studenidcourseiddate", studentId, courseId, Date);
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: studentId, "courseEnrollments.courseId": courseId },
      { $addToSet: { "courseEnrollments.$.courseAttendance": Date } },
      { new: true }
    );

    if (!updatedStudent) {
      return res
        .status(404)
        .json({ message: "Student or course not found", status: 404 });
    }

    return res.status(200).json({
      message: "Attendance updated successfully",
      student: updatedStudent,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating feesPaid status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentByCourse = async (req, res) => {
  try {
    console.log("req params", req.params.courseid);
    const getStudent = await Student.find({
      "courseEnrollments.courseId": req.params.courseid,
    });

    console.log("studentssss", getStudent);
    if (!getStudent) {
      return res
        .status(404)
        .json({ message: "Student or course not found", status: 404 });
    }
    return res.status(200).json({
      message: "fetched data sucessfully",
      student: getStudent,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const allStudent = async (req, res) => {
  try {
    const studentData = await Student.find({});
    res.status(200).json({ data: studentData });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const studentById = async (req, res) => {
  const id = req.params.id;
  try {
    const studentData = await Student.findById(id).populate(
      "courseEnrollments.courseId"
    );
    // console.log('====================================');
    // console.log(studentData.courseEnrollments[0].courseId);
    // console.log('====================================');

    if (!studentData) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ data: studentData });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
