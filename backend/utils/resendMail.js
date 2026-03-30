const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
      reply_to: process.env.EMAIL_USER
    });

    console.log("MAIL SENT");
  } catch (error) {
    console.log("MAIL ERROR", error);
  }
};

module.exports = sendMail;