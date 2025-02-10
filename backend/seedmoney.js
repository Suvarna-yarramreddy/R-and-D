const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");

const serviceAccount = require("./key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files (uploaded files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads", "seedMoney");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to add SeedMoney under a faculty document
app.post("/addSeedMoney", upload.array("proof", 5), async (req, res) => {
  try {
    const { faculty_id, financialYear, facultyName, department, numStudents, projectTitle, amountSanctioned, amountReceived, objectives, outcomes } = req.body;

    let proofUrls = [];
    if (req.files) {
      proofUrls = req.files.map(file => `uploads/seedMoney/${file.filename}`);
    }

    if (proofUrls.length === 0) {
      return res.status(400).send("Proof files are required.");
    }

    const seedMoneyId = uuidv4();

    const newSeedMoney = {
      seedMoneyId,
      financialYear,
      facultyName,
      department,
      numStudents,
      projectTitle,
      amountSanctioned,
      amountReceived,
      objectives,
      outcomes,
      proof: proofUrls,
      createdAt: new Date(),
    };

    const facultyDocRef = db.collection("seedMoney").doc(faculty_id);
    const facultyDoc = await facultyDocRef.get();

    if (facultyDoc.exists) {
      const facultyData = facultyDoc.data();
      const existingSeedMoney = facultyData.seedMoney || [];
      existingSeedMoney.push(newSeedMoney);
      await facultyDocRef.update({ seedMoney: existingSeedMoney });
    } else {
      await facultyDocRef.set({ seedMoney: [newSeedMoney] });
    }

    res.status(200).json({ message: "SeedMoney added successfully", seedMoneyId });
  } catch (error) {
    console.error("Error adding SeedMoney:", error);
    res.status(500).send("Error while adding SeedMoney");
  }
});

// Route to get all SeedMoney records for a faculty
app.get("/getSeedMoney/:faculty_id", async (req, res) => {
  try {
    const { faculty_id } = req.params;

    const facultyDoc = await db.collection("seedMoney").doc(faculty_id).get();

    if (!facultyDoc.exists) {
      return res.status(404).send("No SeedMoney records found for this faculty.");
    }

    const facultyData = facultyDoc.data();
    res.json(facultyData.seedMoney || []);
  } catch (error) {
    console.error("Error fetching SeedMoney records:", error);
    res.status(500).send("Error fetching SeedMoney records.");
  }
});

// Route to update SeedMoney by faculty_id and seedMoneyId
app.put("/update-seedMoney/:faculty_id/:seedMoneyId", upload.array("proof", 5), async (req, res) => {
  try {
    const { faculty_id, seedMoneyId } = req.params;

    const facultyDocRef = db.collection("seedMoney").doc(faculty_id);
    const facultyDoc = await facultyDocRef.get();

    if (!facultyDoc.exists) {
      return res.status(404).send("Faculty record not found.");
    }

    const facultyData = facultyDoc.data();
    let seedMoneyArray = facultyData.seedMoney || [];

    let updated = false;
    seedMoneyArray = seedMoneyArray.map(entry => {
      if (entry.seedMoneyId === seedMoneyId) {
        updated = true;
        return {
          ...entry,
          ...req.body,
          proof: req.files.length > 0 ? req.files.map(file => `uploads/seedMoney/${file.filename}`) : entry.proof,
          updatedAt: new Date(),
        };
      }
      return entry;
    });

    if (!updated) {
      return res.status(404).send("SeedMoney record not found.");
    }

    await facultyDocRef.update({ seedMoney: seedMoneyArray });

    res.status(200).send("SeedMoney updated successfully");
  } catch (error) {
    console.error("Error updating SeedMoney:", error);
    res.status(500).send("Error while updating SeedMoney.");
  }
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});