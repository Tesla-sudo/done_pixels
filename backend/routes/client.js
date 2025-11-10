// routes/client.js
import express from "express";
import twilio from "twilio";

const router = express.Router();

// Twilio client setup
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// --- BOOKING ROUTE ---
router.post("/bookings", async (req, res) => {
  const { clientName, clientEmail, shootType, shootDate, description } = req.body;

  try {
    const smsMessage = `
📸 NEW BOOKING REQUEST
------------------------
Client: ${clientName}
Email: ${clientEmail}
Shoot Type: ${shootType}
Date: ${shootDate}
Details: ${description}
`;

    // Send SMS to your number
    await client.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.ADMIN_PHONE_NUMBER, // Your number +254717546693
    });

    console.log("✅ SMS sent successfully!");
    res.status(200).json({ message: "Booking received and SMS sent successfully." });
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
    res.status(500).json({ message: "Failed to send booking SMS." });
  }
});

// --- FEEDBACK ROUTE (optional, can just log or expand later) ---
router.post("/feedback", async (req, res) => {
  const { clientName, clientEmail, message } = req.body;

  try {
    console.log("💬 Feedback received from:", clientName, "-", message);
    res.status(200).json({ message: "Feedback received successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to process feedback." });
  }
});

export default router;





// // server/routes/client.js
// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');

// // Set up the transporter (NOTE: Use environment variables in a .env file)
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // 1. POST endpoint to handle the BOOKING request (MATCHES FRONTEND: /bookings)
// router.post('/bookings', async (req, res) => {
//   const { clientName, clientEmail, shootType, shootDate, description } = req.body;

//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: 'evansmuholo14@gmail.com', // Your target email
//       subject: `New Shoot Booking Request from ${clientName}`,
//       text: `
//         New Shoot Booking Received

//         Client: ${clientName || "Guest"}
//         Client Email: ${clientEmail || "Not provided"}
//         Shoot Type: ${shootType || "Not specified"}
//         Preferred Date: ${shootDate || "Not selected"}

//         Details:
//         ${description || "No description provided"}
//       `.trim(),
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Booking request sent successfully!' });
//   } catch (error) {
//     console.error('Error sending booking email:', error);
//     // Send a generic 500 status back to the client
//     res.status(500).json({ message: 'Server failed to send booking request.' });
//   }
// });


// // 2. POST endpoint to handle the FEEDBACK request (MATCHES FRONTEND: /feedback)
// router.post('/feedback', async (req, res) => {
//     const { clientName, clientEmail, message } = req.body;

//     // Basic validation
//     if (!message) {
//         return res.status(400).json({ message: 'Feedback message cannot be empty.' });
//     }

//     try {
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: 'evansmuholo14@gmail.com', // Your target email
//             subject: `New Client Feedback from ${clientName}`,
//             text: `
//                 New Client Feedback Received

//                 From: ${clientName || "Guest"}
//                 Client Email: ${clientEmail || "Not provided"}

//                 Message:
//                 ${message}
//             `.trim(),
//         };

//         await transporter.sendMail(mailOptions);
//         res.status(200).json({ message: 'Feedback sent successfully!' });
//     } catch (error) {
//         console.error('Error sending feedback email:', error);
//         res.status(500).json({ message: 'Server failed to send feedback.' });
//     }
// });


// module.exports = router;
