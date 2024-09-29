import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  coursecode: {
    type: String,
    required: true,
    trim: true,
  },
  coursename: {
    type: String,
    required: true,
    trim: true,
  },
  courseimage: {
    type: String,
    required: true,
  },
  coursefees: {
    type: Number,
    required: true,
    trim: true,
  },
  courseduration: {
    type: Number,
    required: true,
    trim: true,
  },
  coursedesc: {
    type: String,
    required: true,
    trim: true,
  },
  courseCommencement: {
    type: String,
    required: true,
    trim: true,
  },
});

const Course = mongoose.model("course", courseSchema);

export default Course;
