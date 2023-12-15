require("dotenv").config();
const nodemailer = require("nodemailer");
const Queue = require("bull");

const emailQueue = new Queue("email", {
  limiter: {
    max: 10,
    duration: 1000,
  },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mh408800@gmail.com",
    pass: "fqplkcnwytbhzjjc",
  },
});

emailQueue.process(async (job) => {
  const { to, subject, text,html } = job.data;
  const mainOptions = {
    from: "mh408800@gmail.com",
    to,
    subject,
    text,
    html,
  };

  try {
    // Process the job (send email)
    await transporter.sendMail(mainOptions);
    console.log(`Email sent to ${to}`);
    // Close the transport connection after processing
    transporter.close();
  } catch (error) {
    console.error("Error processing email job:", error.message);
  }
});

// Handle completed jobs
emailQueue.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed`);
});

// Handle errors
emailQueue.on("failed", (job, error) => {
  console.error(`Job ${job.id} failed:`, error.message);
});

module.exports = { emailQueue };
