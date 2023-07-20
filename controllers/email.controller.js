
import Email from "../models/email.models.js";


export const getAllEmail = async(req, res, next) =>{
    try {
        const saved = await Email.find();
        res.status(200).json(saved)
     } catch (err) {
        next(err)
    }
}


export const createEmail = async(req, res, next) =>{
    
        let data = req.body;
        const newemail = new Email({
            ...data
        })

        try {
            await newemail.save();
            res.status(201).json({message: "email is registered"})
       
     } catch (err) {
        next(err)
    }
}