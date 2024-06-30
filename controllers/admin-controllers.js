import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../model/admin-schema.js";
import Teacher from "../model/teacher-schema.js";
import nodemailer from "nodemailer";
const JWT_SECRET = "ndfvgtdyurhdvfgtioylgkevchopfitnjrhfnjhsawiuhggyy";
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
      from: '"CMS App" <manav8424@gmail.com>',
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const adminsignup = async (request, response) => {
  try {
    if (request.file) {
      const base64Image = request.file.buffer.toString("base64");

      const exists = await Admin.findOne({ email: request.body.email });
      if (exists) {
        return response.status(401).json({ message: "username already exist" });
      }
      const { email, password, name } = request.body;
      const hashpassword = await bcrypt.hash(password, 10);
      const admin = request.body;
      console.log(admin);
      const newAdmin = new Admin({
        name,
        email,
        password: hashpassword,
        profileImage: base64Image,
      });
      await newAdmin.save();
      response.status(200).json({ message: admin });
    } else {
      response.status(404).json({ message: "image not found" });
    }
  } catch (error) {
    console.log("errorrrrrrrrrrrrrrrrrrr whil signup", error);
    response.status(500).json({ message: error.message });
  }
};

export const adminlogin = async (request, response) => {
  console.log("reqqq of adminLogin", request.body);
  try {
    const email = request.body.email;
    const password = request.body.password;
    let existingUser;
    try {
      existingUser = await Admin.findOne({ email });
      if (!existingUser) {
        return response.status(401).json({ message: "Admin not found" });
      }
    } catch (error) {
      return console.log(error);
    }
    const ispassword = await bcrypt.compare(password, existingUser.password);
    console.log("ispassword", ispassword);
    if (!ispassword) {
      return response.status(401).json({ message: "incorrect password" });
    }
    let user = await Admin.findOne({ email: email });
    if (user) {
      // return response.status(200).json(`${email} login sucessfull`)
      const token = Jwt.sign({ email: email }, JWT_SECRET);
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

export const admindata = async (request, response) => {
  const { token } = request.body;
  try {
    const user = Jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    Admin.findOne({ email: useremail }).then((data) => {
      return response.send({ status: 200, data: data });
    });
  } catch (error) {
    return response.send({ error: error });
  }
};

export const teacherregistration = async (request, response) => {
  console.log("request bodyyyyy", request.body);
  console.log("cameeeee----------");
  try {
    const exists = await Teacher.findOne({ email: request.body.email });
    if (exists) {
      return response.status(401).json({ message: "username already exist" });
    }
    const {
      email,
      name,
      dob,
      age,
      gender,
      experience,
      qualification,
      address,
      aadharcardno,
      pancardno,
      watsappcontact,
      normalcontact,
      profileImage,
    } = request.body;
    // const hashpassword=await bcrypt.hash(password,10);
    const teacher = request.body;
    console.log(teacher);
    const password = pancardno.substring(0, 3) + watsappcontact.slice(-3);
    const newTeacher = new Teacher({
      name,
      email,
      password: password,
      profileImage,
      dob,
      age,
      gender,
      experience,
      qualification,
      address,
      aadharcardno,
      pancardno,
      watsappcontact,
      normalcontact,
    });

    const emaill = email;
    const subject = "Your login credentials for the App";
    const text = `Dear Teacher,\n\nYour login credentials for the App are as follows:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease use these credentials to log in to the App.\n\nBest regards,\nYour App Team`;
    sendEmail(emaill, subject, text);
    await newTeacher.save();
    response.status(200).json({ message: teacher, status: 200 });
  } catch (error) {
    console.log("errorrrrrrrrrrrrrrrrrrr whil signup", error);
    response.status(500).json({ message: error.message, status: 500 });
  }
};
