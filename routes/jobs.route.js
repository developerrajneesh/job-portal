import express from "express"
import { createJob, deleteJob,creteSavedJobs,getcompanyjobs,createApplyJobs,creacteRecentJobs, getEmployerCreatedJobs, getJobs, getOneJob, getSavedJobs, removedSaveJob, updateJob } from "../controllers/jobs.controller.js"
import auth from "../utils/auth.js"

const router = express.Router()



router.post("/create-jobs", auth, createJob) 
router.post("/create-recent-jobs", auth, creacteRecentJobs) 
router.get("/", getJobs) 
router.get("/find/:id", getOneJob) 
router.put("/:id", updateJob) 
router.delete("/:id", deleteJob) 
router.delete("/company-jobs/:companyName", getcompanyjobs) 


router.get("/get-employer-created-jobs/:id", getEmployerCreatedJobs)
router.post("/create-saved-jobs", creteSavedJobs)
router.post("/apply-jobs", createApplyJobs)
router.get("/saved-jobs", getSavedJobs)
router.put("/saved-jobs/:id", removedSaveJob)

export default router
 