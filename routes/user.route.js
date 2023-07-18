import express from "express"
import { signUp, verify,signIn,sendForgotOtp ,setNewPassword,loggedInData,userUpdate} from "../controllers/user.controller.js"
import auth from "../utils/auth.js"

const router = express.Router()

router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/send-forgot-otp", sendForgotOtp)
router.post("/set-new-password", setNewPassword)
router.post("/user-update", userUpdate)
router.post("/verify", verify)
router.get("/get-loggedIn-data",auth, loggedInData)


export default router