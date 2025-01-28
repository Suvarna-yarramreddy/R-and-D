const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is running! Access the /signup endpoint with a POST request.");
});

// API Endpoint for Signup
app.post("/signup", async (req, res) => {
  const {
    faculty_id,
    institute_name,
    faculty_name,
    department,
    designation,
    research_domain,
    major_specialization,
    research_skills,
    qualification,
    phd_status,
    phd_registration_date,
    phd_university,
    phd_completed_year,
    guide_name,
    guide_phone_number,
    guide_mail_id,
    guide_department,
    date_of_joining_svecw,
    experience_in_svecw,
    previous_teaching_experience,
    total_experience,
    industry_experience,
    ratified,
    official_mail_id,
    phone_number,
    course_network_id,
    faculty_profile_weblink,
    scopus_id,
    orcid,
    google_scholar_id,
    vidwan_portal,
    password1
  } = req.body;

  try {
    if (!faculty_id || !faculty_name || !official_mail_id || !department) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const facultyRef = db.collection("faculty").doc(faculty_id);

    const doc = await facultyRef.get();

    if (doc.exists) {
      return res
        .status(400)
        .json({ message: "Faculty ID or Official Mail ID already exists." });
    }

    await facultyRef.set({
      faculty_id,
      institute_name,
      faculty_name,
      department,
      designation,
      research_domain,
      major_specialization,
      research_skills,
      qualification,
      phd_status,
      phd_registration_date: phd_registration_date || null,
      phd_university: phd_university || null,
      phd_completed_year: phd_completed_year || null,
      guide_name,
      guide_phone_number,
      guide_mail_id,
      guide_department,
      date_of_joining_svecw,
      experience_in_svecw,
      previous_teaching_experience,
      total_experience,
      industry_experience,
      ratified,
      official_mail_id,
      phone_number,
      course_network_id,
      faculty_profile_weblink,
      scopus_id,
      orcid,
      google_scholar_id,
      vidwan_portal,
      password1,
    });

    res.status(201).json({
      message: "Signup successful!",
      faculty_name,
      faculty_id,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// API Endpoint for Login
app.post("/login", async (req, res) => {
  const { faculty_id, password1 } = req.body;

  try {
    if (!faculty_id || !password1) {
      return res
        .status(400)
        .json({ message: "Faculty ID and password are required." });
    }

    const facultyRef = db.collection("faculty").doc(faculty_id);
    const doc = await facultyRef.get();

    if (!doc.exists) {
      return res
        .status(400)
        .json({ message: "Faculty ID not found. You must register to login." });
    }

    const facultyData = doc.data();

    if (facultyData.password1 === password1) {
      return res.status(200).json({
        message: "Login successful.",
        faculty_name: facultyData.faculty_name,
        faculty_id,
      });
    } else {
      return res.status(400).json({ message: "Incorrect password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
