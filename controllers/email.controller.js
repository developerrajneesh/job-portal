import Email from "../models/email.models.js";
import User from "../models/user.models.js";

export const getAllEmail = async (req, res, next) => {

  try {
    console.log(req.userId);
    const saved = await Email.find();
    res.status(200).json(saved);
   
  } catch (err) {
    next(err);
  }
};

export const createEmail = async (req, res, next) => {
  let data = req.body;
  let { email } = req.body;

  const newemail = new Email({
    ...data,
  });
  try {
    const existdata = await Email.findOne({ email: email });
    if (existdata) {
      return res
        .status(409)
        .json({ success: true, msg: "Email is Already registered" });
    }

    await newemail.save();
    const  user = await User.findOne({ email:req.userId})
    user.isSubscribed = true
    await user.save();
    res.status(201).json({ success: true, msg: "Email is registered" ,user:user});
  } catch (err) {
    next(err);
  }
};
