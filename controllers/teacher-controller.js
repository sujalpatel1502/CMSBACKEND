import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../model/admin-schema.js";
import Teacher from "../model/teacher-schema.js";
import nodemailer from "nodemailer";
import Student from "../model/student-schema.js";
const JWT_SECRET = "ndfvgtdyurhdvfgtioylgkevchopfitnjrhfnjhsawiuhggyy";

export const teacherlogin = async (request, response) => {
  console.log("reqqqq of teacherrr", request.body);
  try {
    const email = request.body.email;
    const fcmToken = request.body.fcmToken;
    const password = request.body.password;
    let existingUser;
    try {
      existingUser = await Teacher.findOne({ email });
    } catch (error) {
      return console.log(error);
    }
    // const ispassword=await bcrypt.compare(password,existingUser.password);
    // console.log("ispassword",ispassword);
    // if(!ispassword){
    //      return response.status(401).json({message:"incorrect password"});
    // }
    let user = await Teacher.findOne({ email: email });
    console.log("userrrrr-r-r-r-r-", user);
    if (user.password == password) {
      // return response.status(200).json(`${email} login sucessfull`)
      const token = Jwt.sign({ email: email }, JWT_SECRET);
      await Teacher.findOneAndUpdate({ token: fcmToken });
      if (response.status(201)) {
        return response.send({ status: 201, data: token });
      } else {
        return response.send({ error: "error" });
      }
    } else {
      console.log("wrong pass or invalid request");
      return response.status(401).json("invalid request");
    }
  } catch (error) {
    console.log("errorrrrrrrrrrrrrrrrrrr whil login", error);
    response.status(500).json({ message: error.message });
  }
  console.log("hiiii");
};

export const teacherdata = async (request, response) => {
  const { token } = request.body;
  try {
    const user = Jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    Teacher.findOne({ email: useremail }).then((data) => {
      return response.send({ status: "ok", data: data });
    });
  } catch (error) {
    return response.send({ error: error });
  }
};
