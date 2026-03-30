const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Manager = require("../models/Manager");
const Employee = require("../models/Employee");
const User = require("../models/User")
const Admin = require("../models/Admin")
const SuperAdmin = require("../models/SuperAdmin")
const auth = require("../middleware/auth");
const acl = require("../middleware/acl");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const FB = require('fb');
const router = express.Router();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


router.post("/register", async (req, res) => {

  try {
    const { name, email, city, phone, password } = req.body;

    const exist =
      (await User.findOne({ email })) ||
      //   (await Student.findOne({ email })) ||
      //   (await Employee.findOne({ email })) ||
      (await Admin.findOne({ email }))

    if (exist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      city,
      phone,
      password: hashed
    });

    await user.save();
    await transporter.sendMail({
      from: `"Employee Registration" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Registration Successful",
      html: `<h2 style="background-color: black;color:white;padding:25px 0px;text-align:center;">Welcome ${user.name}</h2>
    <p>Your registration was successful</p>`
    });

    res.json({ msg: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let account = null;
    let role = "";
    let model = "";

    account = await Admin.findOne({ email })
    if (account) {
      role = "admin";
      model = "Admin";

    }

    if (!account) {
      account = await SuperAdmin.findOne({ email }).populate("role");
      if (account) {
        role = "superAdmin";
        model = "Super Admin";
      }
    }

    if (!account) {
      account = await Manager.findOne({ email }).populate("role");
      if (account) {
        role = "manager";
        model = "Manager";
      }
    }

    if (!account) {
      account = await Employee.findOne({ email }).populate("role");
      if (account) {
        role = "employee";
        model = "Employee";
      }
    }

    if (!account) {
      account = await User.findOne({ email }).populate("role");
      if (account) {
        role = "user";
        model = "User";
      }
    }

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    if (!account.password) {
      return res.status(400).json({ msg: "Use Google login" })
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: account._id,
        role,
        model,
        name: account.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(token)

    res.json({
      token,
      role,
      id: account._id,
      model,
      name: account.name,
      email: account.email
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.post("/google", async (req, res) => {
  try {
    const { token } = req.body

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    const email = payload.email
    const name = payload.name
    const picture = payload.picture

    let user = await User.findOne({ email })

    if (!user) {
      user = new User({
        name,
        email,
        password: null,
        profile: picture
      })
      await user.save()
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        role: "user",
        model: "User",
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      token: jwtToken,
      role: "user",
      id: user._id,
      name: user.name,
      email: user.email,
      hasPassword: !!user.password,
      profile: user.profile
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Google login failed" })
  }
})


router.post("/facebook", async (req, res) => {
  try {
    const { accessToken } = req.body;

    FB.setAccessToken(accessToken);
    const fbRes = await FB.api('me', { fields: ['id', 'name', 'email', 'picture'] });

    if (!fbRes || fbRes.error) {
      return res.status(400).json({ msg: "Facebook token invalid" });
    }

    const { email, name, picture } = fbRes;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: null,
        profile: picture?.data?.url || "",
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: "user", model: "User", name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, name: user.name, email: user.email, role: "user", profile: user.profile });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Facebook login failed" });
  }
});


router.post("/forgot-password", async (req, res) => {
  
  try{
    console.log("EMAIL:", process.env.EMAIL_USER);
  console.log("PASS:", process.env.EMAIL_PASS);
  
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOtp = otp;
  user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  await transporter.sendMail({
  from: `"Reset Password" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "OTP for Password Reset",
  html: `
  <div style="font-family:Arial,sans-serif;text-align:center">
    
    <h2 style="background:#000;color:#fff;padding:20px">
      Password Reset OTP
    </h2>

    <p>Your One Time Password is</p>

    <div style="
      display:inline-block;
      background: #8131c3bb;
      border:1px solid #8131c3;
      color:white;
      padding:15px 25px;
      font-size:24px;
      font-weight:bold;
      border-radius:6px;
      letter-spacing:4px;
      margin:15px 0;
    ">
      ${otp}
    </div>

    <p>This OTP is valid for <b>10 minutes</b></p>

  </div>
  `
});

  res.json({ msg: "OTP sent to email" });
  }catch(err){
    console.log("MAIL ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});


router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });
  if (user.resetOtp !== otp || Date.now() > user.resetOtpExpire) {
    return res.status(400).json({ msg: "OTP invalid or expired" });
  }
  res.json({ msg: "OTP verified" });
});


router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  user.resetOtp = undefined;
  user.resetOtpExpire = undefined;
  await user.save();

  res.json({ msg: "Password reset successfully" });
});

router.get("/github", (req, res) => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_uri = "http://localhost:5000/api/auth/github/callback";

  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user:email`;

  res.redirect(url);
});


router.get("/github/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // 1. get access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenRes.json();
    const access_token = tokenData.access_token;

    // 2. get user
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const userData = await userRes.json();

    // 3. get email
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const emailData = await emailRes.json();
    const emailObj = emailData.find(e => e.primary);
    const email = emailObj?.email;

    const name = userData.name;
    const profile = userData.avatar_url;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: null,
        profile
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: "user", model: "User", name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // redirect frontend
    res.redirect(`http://localhost:3000/#/github-success?token=${token}`);

  } catch (err) {
    console.log(err);
    res.send("GitHub login failed");
  }
});

router.post("/set-password", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ msg: "Email & Password required" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    if (user.password) {
      return res.status(400).json({ msg: "Password already exists" })
    }

    const hashed = await bcrypt.hash(password, 10)

    user.password = hashed
    await user.save()

    res.json({ msg: "Password set successfully" })

  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})



router.get("/admin", auth, acl("admin"), (req, res) => {
  res.json({ msg: "Welcome Admin" });
});


module.exports = router;
