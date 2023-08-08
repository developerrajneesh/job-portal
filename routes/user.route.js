import express from "express"
import { signUp, verify,resendOtp,signIn,addEducation,sendForgotOtp, addEmployement,setNewPassword,loggedInData,userUpdate} from "../controllers/user.controller.js"
import auth from "../utils/auth.js"
import multerUpload from "../utils/multerUpload.js"

const router = express.Router()

router.post("/signup",multerUpload.single('resume'), signUp)
router.post("/signin", signIn)
router.post("/send-forgot-otp", sendForgotOtp)
router.post("/add-employment",auth, addEmployement)
router.post("/add-education",auth, addEducation)
router.post("/set-new-password", setNewPassword)
router.post("/user-update",multerUpload.single('document'), userUpdate)
router.post("/verify", verify)
router.post("/resend-otp", resendOtp)
router.get("/get-loggedIn-data", auth, loggedInData)


export default router