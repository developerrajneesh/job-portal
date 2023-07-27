import Job from "../models/jobs.models.js";
import User from "../models/user.models.js";
import mongoose from "mongoose";

export const createJob = async (req, res, next) => {
  let data = req.body;
  const newJob = new Job({
    ...data,
  });
  try {
    await newJob.save();
    const jobs = await User.findByIdAndUpdate(
      newJob.employerId,
      {
        $push: { createdJobs: { $each: [newJob._id] } },
      },
      { new: true }
    );
    res.status(201).json({ message: "new job is created" });
  } catch (err) {
    next(err);
    console.log(err);
    res.send({ error: err.message });
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const { title, location, jobType, jobCategory, salaryRange } = req.query;

    console.log(req.query);
    try {
      // Build the search query based on the provided query parameters
      const query = {};

      if (title) {
        query.title = { $regex: new RegExp(title, "i") };
      }
      if (location) {
        query.location = { $regex: new RegExp(location, "i") };
      }
      if (jobType) {
        query.jobType = { $regex: new RegExp(jobType, "i") };
      }

      if (jobCategory) {
        query.jobCategory = { $regex: new RegExp(jobCategory, "i") };
      }

      if (salaryRange) {
        const [minSalary, maxSalary] = salaryRange.split("-").map(Number);
        query.salary = { $gte: minSalary, $lte: maxSalary };
      }
      const results = await Job.find(query);
      res.json(results);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while searching for jobs" });
    }
  } catch (err) {
    next(err);
  }
};

export const getOneJob = async (req, res, next) => {
  const { id } = req.params;
  try {
    const jobData = await Job.findById(id);
    const companyJobs = await Job.find({ companyName: jobData.companyName });
    res.status(200).send({ jobData, companyJobs: companyJobs.length });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  const { id: _id } = req.params;
  const job = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("No Job with that id");
    const updateJob = await Job.findByIdAndUpdate(
      _id,
      { ...job, _id },
      { new: true }
    );
    res.status(200).json(updateJob);
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("No Job with that id");

    await Job.findByIdAndRemove(id);

    res.status(200).json({
      message: "Job Deleted successfully ",
    });
  } catch (err) {
    next(err);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await Job.find({ isSaved: true });
    res.status(200).json(saved);
  } catch (err) {
    next(err);
  }
};
export const getcompanyjobs = async (req, res, next) => {
  const companyName = req.params.companyName;
  console.log("clase");
  try {
    const saved = await Job.find({ companyName: companyName });
    res.status(200).json(saved);
  } catch (err) {
    next(err);
  }
};

export const creteSavedJobs = async (req, res, next) => {
  const { savedJobId, userId } = req.body;

  try {
    const userData = await User.findOne({ _id: userId });
    const existJobsId = await userData.savedJobs.includes(savedJobId);
    if (existJobsId) {
      const index = userData.savedJobs.indexOf(savedJobId);
      console.log(index);
      userData.savedJobs.splice(index, 1);
      userData.save();
      return res
        .status(200)
        .json({
          user: userData,
          success: true,
          msg: "Job Unsaved successfully",
        });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { savedJobs: { $each: [savedJobId] } },
      },
      { new: true }
    );
    const Alljob = await Job.find();
    res
      .status(200)
      .json({ user: user, success: true, msg: "Job saved successfully" });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

export const createApplyJobs = async (req, res, next) => {
  const { jobId, userID } = req.body;
  console.log( req.body.userID);
  console.log( req.body.employerId);
  console.log( req.body.jobId);
  console.log( req.file?req.file.filename: req.body.document);
  const newData ={
    userName: req.body.userName,
    userID: req.body.userID,
    document:req.file?req.file.filename: req.body.document
  }
  // console.log( req.file.filename);
  try {
    const userData = await User.findOne({ _id: userID });
    const existJobsId = await userData.appliedJobs.includes(jobId);
    if (existJobsId) {
      return res
        .status(200)
        .json({ success: false, msg: "You have already applied for this job" });
    }

     const jobData = await Job.findOne({ _id: jobId });
     jobData.appliedJobs.push(newData)
     await jobData.save()

    // employerData
    const user = await User.findByIdAndUpdate(
      userID,
      {
        $push: { appliedJobs: { $each: [jobId] } },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ user: user, success: true, msg: "Job Applied successfully" });
  } catch (err) {
    next(err);
    console.log(err);
  }
};
export const creacteRecentJobs = async (req, res, next) => {
  const { recentJobId, userId } = req.body;
  console.log(recentJobId, userId, req.body);
  try {
    const recentJobData = await User.findOne({ _id: userId });
    if (recentJobData.recentJobs.includes(recentJobId)) {
      console.log(true);
    } else {
      const jobs = await User.findByIdAndUpdate(
        userId,
        {
          $push: { recentJobs: { $each: [recentJobId] } },
        },
        { new: true }
      );
      const Alljob = await Job.find();
      res
        .status(200)
        .json({ jobs: Alljob, success: true, msg: "Job saved successfully" });
    }
  } catch (err) {
    next(err);
    console.log(err);
  }
};

export const getEmployerCreatedJobs = async (req, res, next) => {
  try {
    console.log(33);
    const saved = await Job.find({ employerId: req.params.id });
    res.status(200).json(saved);
  } catch (err) {
    next(err);
  }
};

export const removedSaveJob = async (req, res, next) => {
  const { id: _id } = req.params;
  const job = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("No Job with that id");
    const updateJob = await Job.findByIdAndUpdate(
      _id,
      { ...job, _id },
      { new: true }
    );
    res.status(200).json(updateJob);
  } catch (err) {
    next(err);
  }
};
