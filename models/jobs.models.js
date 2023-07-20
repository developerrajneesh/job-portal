import mongoose from "mongoose";

const { Schema } = mongoose;


const JobSchema = new Schema({
    employerName:{
        type: String,
        required: true
    },
    employerId:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    aboutCompany: {
        type: String,
        default: "N/A",
      },
      companywebsite: {
        type: String,
        default: "N/A",
      },
    isSaved: {
        type: Boolean,
        default: false
    },
    jobType: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    vacancy: {
        type:  Number,
        required: true
    },
    timeType: {
        type: String,
        // required: true
    },
    jobCategory: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    applyBefore: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        required: true
    },
    qualification: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true
    },
    responsibilities: {
        type: [String],
        required: true
    }
}, {timestamps: true})


export default mongoose.model("Job", JobSchema)