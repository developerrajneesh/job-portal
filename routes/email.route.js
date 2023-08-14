import express from "express"
import { getAllEmail,createEmail} from "../controllers/email.controller.js"


const router = express.Router()

router.post("/register", createEmail)
router.get("/get-all", getAllEmail)

export default router