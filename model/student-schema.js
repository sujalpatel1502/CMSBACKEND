import mongoose from "mongoose";
const courseEnrollmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
    feesPaid: {
      type: Boolean,
      default: false,
    },
    feesAmountPaid: {
      type: Number,
    },
    Balance: {
      type: Number,
    },
    DateOfEnrollment: {
      type: String,
    },
    fees: {
      type: Number,
    },
    courseAttendance: {
      type: [String],
      default: [],
    },
    payments: [
      {
        amountPaid: {
          type: Number,
        },
        modeOfPayment: {
          type: String,
        },
      },
    ],
  },
  { _id: false }
);
const studentSchema = new mongoose.Schema({
  formno: {
    type: Number,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  parentname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  token: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  profileImage: {
    type: String,
    // required:true
  },
  dob: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    trim: true,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  },
  standard: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  watsappcontact: {
    type: Number,
    trim: true,
    required: true,
  },
  normalcontact: {
    type: Number,
    trim: true,
    required: true,
  },
  courseEnrollments: [courseEnrollmentSchema],
});

const Student = mongoose.model("student", studentSchema);

export default Student;
