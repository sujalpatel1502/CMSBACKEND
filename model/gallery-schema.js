import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  desc: {
    type: String,
    // required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    // required: true,
  },
  uploadedByStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },
  uploadedByTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
  },
  taggedStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
  isApproved: {
    type: Boolean,
    default: false,
  },
});

const Gallery = mongoose.model("gallery", gallerySchema);

export default Gallery;
