// import express, { json } from 'express';
// import { createTransport } from 'nodemailer';
// import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors()); 
// app.use(json()); 

// // Nodemailer Transporter Configuration
// const transporter = createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, 
//     pass: process.env.EMAIL_PASS, 
//   },
// });

// // Verify connection configuration on startup
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("Transporter error:", error);
//   } else {
//     console.log("Server is ready to send emails");
//   }
// });

// app.post('/send-email', (req, res) => {
//   const { to, subject, text } = req.body;

//   // Basic validation
//   if (!to || !subject || !text) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: to,
//     subject: subject,
//     text: text,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Mail Error:", error);
//       return res.status(500).json({ success: false, error: error.message });
//     }

//     console.log("Email sent:", info.response);
//     res.status(200).json({ success: true, message: "Email sent successfully!" });
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Backend server running on http://localhost:${PORT}`);
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://sridharini.netlify.app" // change after deployment
}));
app.use(express.json());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log("Transporter error:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

// Route
app.post("/send-email", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Message from ${name}`,

      html: `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background:#4f46e5; color:white; padding:20px; text-align:center;">
        <h2 style="margin:0;">📬 New Portfolio Message</h2>
      </div>

      <!-- Body -->
      <div style="padding:20px; color:#333;">
        
        <p style="font-size:16px;">You have received a new message from your portfolio:</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px;">
          <tr>
            <td style="padding:10px; font-weight:bold;">👤 Name:</td>
            <td style="padding:10px;">${name}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="padding:10px; font-weight:bold;">📧 Email:</td>
            <td style="padding:10px;">${email}</td>
          </tr>
          <tr>
            <td style="padding:10px; font-weight:bold; vertical-align:top;">💬 Message:</td>
            <td style="padding:10px;">${message}</td>
          </tr>
        </table>

      </div>

      <!-- Footer -->
      <div style="background:#f1f5f9; text-align:center; padding:15px; font-size:12px; color:#666;">
        © ${new Date().getFullYear()} Portfolio | Sri Dharini
      </div>

    </div>
  </div>
  `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📨 Email sent:", info.response);

    res.status(200).json({
      success: true,
      message: "Email sent successfully!"
    });

  } catch (error) {
    console.error("❌ Mail Error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});