import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isEmployer: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    formStage: {
      type: Number,
      required: true,
    },
    formCompleteStatus: {
      type: Boolean,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    document: {
      type: String,
      default: "N/A",
    },
    skills: {
      type: [String],
    },
    industry: {
      type: String,
      default: "N/A",
    },
    function: {
      type: String,
      default: "N/A",
    },
    location: {
      type: String,
      default: "N/A",
    },
    experinced: {
      type: String,
      default: "N/A",
    },
    highestEducation: {
      type: String,
      default: "N/A",
    },
    major: {
      type: String,
      default: "N/A",
    },
    university: {
      type: String,
      default: "N/A",
    },
    yearGraduate: {
      type: String,
      default: "N/A",
    },
    educationType: {
      type: String,
      default: "N/A",
    },
    currentlocation: {
      type: String,
      default: "N/A",
    },
    currentlocation: {
      type: String,
      default: "N/A",
    },
    currentCompanyName:{
      type: String,
      default: "N/A",
    },
    
    currentDesignation: {
      type: String,
      default: "N/A",
    },
    address: {
      type: String,
      default: "N/A",
    },
    from: {
      type: String,
      default: "N/A",
    },
    to: {
      type: String,
      default: "N/A",
    },
    createdJobs: [],
    savedJobs: [],
    appliedJobs: [],
    recentJobs:[],
    employments:[],
    educations:[],

  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
