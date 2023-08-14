import emailSchema from "../models/email.models.js";
import jobsSchema from "../models/jobs.models.js";
import nodemailer from "nodemailer";


function generateHTMLContent(jobsList) {

  let html = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
            
              body, h1, h2, p, div {
                margin: 0;
                padding: 0;
              }
              body {
                font-family: Arial, sans-serif;
              }
              
             
              h1 {
                color: #333;
                text-align: center;
                margin: 20px 0;
              }
              h2 {
                color: #007BFF;
                margin-bottom: 5px;
              }
              p {
                color: #666;
                line-height: 1.6;
              }
              .dis-test{
                height: 64px;
                overflow: hidden;
              }
              
              .inner-div {
                border: 1px solid #ddd;
                padding: 15px;
                margin-bottom: 20px;
              }
              
              
              div + div {
                margin-top: 20px;
              }
              
              
              .inner-div {
                background-color: #f9f9f9;
                border-radius: 5px;
              }
              
             
              .inner-div:hover {
                background-color: #f0f0f0;
              }
              .container {
                max-width: 1140px; 
                margin-left: auto;
                margin-right: auto;
                padding-left: 15px;
                padding-right: 15px;
              }
              
             
              @media (max-width: 576px) {
                .container {
                  max-width: 100%;
                }
              }
              
              @media (min-width: 768px) {
                .container {
                  max-width: 720px;
                }
              }
              
              @media (min-width: 992px) {
                .container {
                  max-width: 960px;
                }
              }
              
              @media (min-width: 1200px) {
                .container {
                  max-width: 1140px;
                }
              }
            </style>
          </head>
          <body>
          <div class="container">
            <h1>New Job Openings</h1>
            
            <div class='inner-div'>`;

  for (const job of jobsList) {
    html += `
              <div class='inner-div'>
              <a href="https://sandbox.bepoj.com/job-portal/job-discription/${job._id}"> <h2>${job.title}</h2></a>
              <p class="dis-test"> ${job.desc}</p>
              <p>Posted by: ${job.employerName}</p>
              </div>`;
  }
  html += `
            </div>
            </div>
            </body>
            </html>`;
  return html;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "developer.rajneeshshukla@gmail.com",
    pass: "uvfjiflvyqvuekos",
  },
});

// Function to send the email
export async function sendEmail() {
  const UserList = await emailSchema.find({}, "email");
  const jobsList = await jobsSchema.find({}).sort({ timestamp: -1 }).limit(5);
  const usersMail = UserList?.map((data) => data.email);

  const mailOptions = {
    from: "developer.rajneeshshukla@gmail.com",
    bcc: usersMail.join(", "),
    subject: "Reminder: New Jobs Openings",
    html: generateHTMLContent(jobsList),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}
