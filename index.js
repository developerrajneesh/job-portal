import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";



import jobRoutes from "./routes/jobs.route.js"
import userRoutes from "./routes/user.route.js"
import emailRoutes from "./routes/email.route.js"
import jobsModels from "./models/jobs.models.js";

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
mongoose.set("strictQuery", true);


const connect = async () => {
    try {
      // eslint-disable-next-line no-undef
      await mongoose.connect(process.env.MONGO);
      console.log("Connected to mongoDB!");
    } catch (error) {
      console.log(error);
    }
};


app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
  

app.use("/api/jobs", jobRoutes)
app.use("/api/user", userRoutes)
app.use("/api/email", emailRoutes)


app.use((err, req, res, next) => {

    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).send(errorMessage);
  });

  
  
  

app.listen(8000, () => {
    connect();
    console.log("Backend server is running! on ",8000,"port");
});