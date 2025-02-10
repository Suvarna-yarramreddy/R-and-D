const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Firebase setup
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'publications');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Add Publication (Without Subcollection)
app.post("/addPublication", upload.single("proofOfPublication"), async (req, res) => {
  try {
    const {
      faculty_id,
      natureOfPublication,
      typeOfPublication,
      titleOfPaper,
      nameOfJournalConference,
      titleofChapter,
      nameofbook,
      nameOfPublisher,
      issnIsbn,
      authorStatus,
      firstAuthorName,
      firstAuthorAffiliation,
      coAuthors,
      indexed,
      quartile,
      impactFactor,
      doi,
      linkOfPaper,
      scopusLink,
      volume,
      pageNo,
      monthYear,
      citeAs,
    } = req.body;

    if (!faculty_id) {
      return res.status(400).send("Faculty ID is required");
    }

    let proofOfPublicationUrl = null;
    if (req.file) {
      proofOfPublicationUrl = `/uploads/publications/${req.file.filename}`;
    }

    // Generate a unique ID for each publication
    const publicationId = `pub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Construct the publication object
    const newPublication = {
      publicationId,
      natureOfPublication,
      typeOfPublication,
      titleOfPaper,
      nameOfJournalConference,
      titleofChapter,
      nameofbook,
      nameOfPublisher,
      issnIsbn,
      authorStatus,
      firstAuthorName,
      firstAuthorAffiliation,
      coAuthors,
      indexed,
      quartile,
      impactFactor,
      doi,
      linkOfPaper,
      scopusLink,
      volume,
      pageNo,
      monthYear,
      citeAs,
      proofOfPublication: proofOfPublicationUrl,
      status: "Applied",
    };

    // Store publication inside the faculty document (as an array)
    const facultyRef = db.collection("publications").doc(faculty_id);
    const facultyDoc = await facultyRef.get();

    if (facultyDoc.exists) {
      // Append new publication to the existing array
      await facultyRef.update({
        publications: admin.firestore.FieldValue.arrayUnion(newPublication),
      });
    } else {
      // Create a new document with the publication array
      await facultyRef.set({
        faculty_id,
        publications: [newPublication],
      });
    }

    res.status(200).json({ message: "Publication added successfully", publicationId });
  } catch (error) {
    console.error("Error adding publication:", error);
    res.status(500).send("Error adding publication");
  }
});

// Get Publications by Faculty ID (Without Subcollection)
app.get("/getPublications/:faculty_id", async (req, res) => {
  try {
    const { faculty_id } = req.params;

    const facultyRef = db.collection("publications").doc(faculty_id);
    const facultyDoc = await facultyRef.get();

    if (!facultyDoc.exists) {
      return res.status(404).json({ message: "No publications found" });
    }

    const facultyData = facultyDoc.data();
    const publications = facultyData.publications || [];

    res.json(publications);
  } catch (error) {
    console.error("Error fetching publications:", error);
    res.status(500).json({ message: "Error fetching publications", error });
  }
});

// Update Publication (Without Subcollection)
app.put("/update-publication/:faculty_id/:publicationId", async (req, res) => {
  try {
    const { faculty_id, publicationId } = req.params;
    const updatedPublication = req.body;

    if (Object.keys(updatedPublication).length === 0) {
      return res.status(400).json({ message: "Invalid data. Please provide fields to update." });
    }

    const facultyRef = db.collection("publications").doc(faculty_id);
    const facultyDoc = await facultyRef.get();

    if (!facultyDoc.exists) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    let publications = facultyDoc.data().publications || [];

    // Find and update the publication in the array
    const index = publications.findIndex(pub => pub.publicationId === publicationId);
    if (index === -1) {
      return res.status(404).json({ message: "Publication not found" });
    }

    publications[index] = { ...publications[index], ...updatedPublication };

    // Update the faculty document with the modified publications array
    await facultyRef.update({ publications });

    res.json({ message: "Publication updated successfully" });
  } catch (error) {
    console.error("Error updating publication:", error);
    res.status(500).json({ message: "Error updating publication", error });
  }
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
