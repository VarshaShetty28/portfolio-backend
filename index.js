require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend is running successfully! 🚀");
});


// Email Sending Route
app.post("/send-email", async (req, res) => {
  const { username, email, phoneNumber, subject, message } = req.body;

  if (!username || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions = {
      from: `"${username}" <your-email@gmail.com>`, // Shows sender's name but keeps your email
      replyTo: email, // Clicking "Reply" goes to the sender
      to: "varshashetty289@gmail.com",
      subject: `New Contact Form Submission: ${subject}`,
      html: `
                <h2>You received a new message:</h2>
                <p><strong>Name:</strong> ${username}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phoneNumber || "Not provided"}</p>
                <h3>Message:</h3>
                <p>${message}</p>
            `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on port ${PORT}`);
});
