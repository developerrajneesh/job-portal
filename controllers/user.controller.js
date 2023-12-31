import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();


export const loggedInData = async (req, res, next) => {
  try {
   const userId = req.userId;
   console.log(req.userId);
    const user = await User.findById(userId).select('-password');
    res.send(user);
  } catch (error) {
    // console(error)
    res.status(500).send('Some error occurrds');
  }
};

export const addEmployement = async (req, res, next) => {
  try {
       console.log(req.body);

       const userId = req.userId;
       console.log(req.userId);
       const user = await User.findOne({_id: userId});
       user.employments.push(req.body);
       user.save();
       res.status(200).send({success:true,msg:"Employments added successfully",user:user});
  } catch (error) {
    // console(error)
    res.status(500).send('Some error occurrds');
  }
};

export const addEducation = async (req, res, next) => {
  try {
       console.log(req.body);

       const userId = req.userId;
      
       const user = await User.findOne({_id: userId});
       user.educations.push(req.body);
       user.save();
       res.status(200).send({success:true,msg:"Education added successfully",user:user});
  } catch (error) {
    // console(error)
    res.status(500).send('Some error occurrds');
  }
};

export const signUp = async (req, res, next) => {
  const { email, name,formStage, formCompleteStatus,mobile ,isEmployer} = req.body;
  
  // console.log(req.file.filename);
 

  // console.log(req.body);
  const otp = generateOTP();

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({
        message: "User is already exists"
    })
 
    const hash = await  bcrypt.hashSync(req.body.password, 10);
      
    const { password, ...remainingBody } = req.body;
   
    const newObj = { ...remainingBody };

    
    const newUser = new User({
        otp: otp,
        password: hash,
        document:req.file?req.file.filename:'N/A',
        ...newObj
    })

    await newUser.save();

    const type = 'Registration'
    sendEmailOTP(email, otp,type);

    console.log(newUser);
    delete newUser.password
    res
      .status(201)
      .send({
        msg: "Registration successful. OTP sent to email.",
        userEmail: email,
        id:newUser._id,
        user: newUser
      });
  } catch (err) {
    next(err);
  }
};

export const resendOtp = async (req, res, next) => {

  const {email} =req.body;
  console.log(email);
  const otp = generateOTP();

  try {
    const user = await User.findOne({ email })

    user.otp = otp
  
    await user.save();

    const type = 'Registration'
    sendEmailOTP(email, otp,type);


    delete user.password
    res
      .status(201)
      .send({
        msg: "Registration successful. OTP sent to email.",
      });
  } catch (err) {
    // next(err);
    console.log(err);
  }
};

export const userUpdate = async (req, res, next) => {
  var { id } = req.body;
  try {
const existEnail = await User.findOne({email:req.body?.email})
if (existEnail){
  return res.status(201).send({success:false, msg: "Email is Allready Registerd",  });
 }
const existPhone = await User.findOne({mobile:req.body?.mobile})

if (existPhone){
  return res.status(201).send({success:false, msg: "Phone number is Allready Registerd",  });
 }

    const user = await User.findByIdAndUpdate(
      id,
      {
        ...req.body,document:req.file?.filename,
      },
      { new: true }
    );
  if (!user){
   return res.status(201).send({success:false, msg: "No User Found",  });
  }

  let token = ''
  if (user.formCompleteStatus) {
    token = jwt.sign({
      email: user.email,
      id : user._id
  }, process.env.JWT_KEY,
  //  {expiresIn: "10h"}
   )
  }
    res.status(201).send({success:true, msg: "Updates successfully", user: user,token:`Bearer ${token}`, });
  } catch (err) {
    next(err);
  }
};

export const sendForgotOtp = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  const otp = generateOTP();

  // console.log(user);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  user.otp = otp
  await user.save()
  const type = 'Forgot Password'
  await sendEmailOTP(email, otp,type);
  res.status(200).json({otp:otp, msg: "OTP sent successfully on your email" ,});

}

export const setNewPassword = async (req, res, next) => {
try {
  const { otp,newPassword } = req.body;

  const hash = await  bcrypt.hashSync(newPassword, 10);
  const user = await User.findOne({ otp: otp });

  if (!user) {
    return res.status(200).json({ success:false ,msg: "OTP Not Matched" });
  }
    user.password = hash;
    user.password = hash;
    user.otp = ''
    await user.save()

    res.status(200).json({ success:true, msg: "Password  Changed Successfully!" });
} catch (error) {
  res.status(200).json({ msg: "internal server error " });
}


}

export const verify = async (req, res) => {
  console.log(req.body);
  try {
    const { email, otp } = req.body;
    // Retrieve user details from the database (replace with your database code)
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }
    // Mark user as verified in the database (replace with your database code)
    user.isVerified = true;
     user.formStage = 3
    // Update user in the database
    user
      .save()
      .then(() => {
        res.status(200).json({ message: "OTP verification successful." ,user:user});
      })
      .catch((error) => {
        console.error("Error saving user:", error);
        res.status(500).json({ error: "Internal server error." });
      });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res,next) =>{
  const { email, password} = req.body
  try {
      const existingUser = await User.findOne({email})  
      if(!existingUser) return res.status(404).send({
          message : "No user found with this email address",login: false
      })  
      // console.log(12356);
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password) 
      if(!isPasswordCorrect) return res.status(440).send({
        message : "Invalid credentials",login: false
      })
      console.log(existingUser.email);
      const token = jwt.sign({
          email: existingUser.email,
          id : existingUser._id
      }, process.env.JWT_KEY,
      //  {expiresIn: "10h"}
       )
    
  
      res.status(200).json({
          result : existingUser,  
          token:`Bearer ${token}`,
          login: true
      })

  } catch (err) {
      // next(err)
      console.log("err",process.env.JWT_KEY);
  }
  }
export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};

// Generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}


function sendEmailOTP(email, otp,type) {
 
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
    user: 'developer.rajneeshshukla@gmail.com',
    pass: 'uvfjiflvyqvuekos'
  }
  });

  const mailOptions = {
    from: "developer.rajneeshshukla@gmail.com",
    to: email,
    subject: type + " OTP ",
    text: `Your OTP is: ${otp}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}
