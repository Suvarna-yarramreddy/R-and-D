const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs for Seed Money

// Firebase Admin SDK initialization
const serviceAccount = require("./key.json"); // Replace with your Firebase Admin SDK JSON file

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up multer storage configuration for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "./uploads/seedMoney/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Route to add SeedMoney with file upload
app.post("/addSeedMoney", upload.array("proof", 5), async (req, res) => {
    const {
        faculty_id,
        financialYear,
        facultyName,
        department,
        numStudents,
        projectTitle,
        amountSanctioned,
        amountReceived,
        objectives,
        outcomes,
    } = req.body;

    const proof = req.files ? req.files.map(file => file.path) : []; // Map the file paths

    if (proof.length === 0) {
        return res.status(400).send("Proof files are required.");
    }

    const seedMoneyId = uuidv4(); // Generate a unique ID for SeedMoney

    const seedMoneyData = {
        seedMoneyId,
        faculty_id,
        financialYear,
        facultyName,
        department,
        numStudents,
        projectTitle,
        amountSanctioned,
        amountReceived,
        objectives,
        outcomes,
        proof,
        createdAt: new Date(),
    };

    try {
        await db.collection("seedMoney").doc(seedMoneyId).set(seedMoneyData);
        res.status(200).send("SeedMoney added successfully");
    } catch (error) {
        console.error("Error adding SeedMoney:", error);
        res.status(500).send("Error while adding SeedMoney");
    }
});

// Route to get SeedMoney records by faculty_id
app.get("/getSeedMoney/:faculty_id", async (req, res) => {
    const faculty_id = req.params.faculty_id;

    try {
        const snapshot = await db
            .collection("seedMoney")
            .where("faculty_id", "==", faculty_id)
            .get();

        if (snapshot.empty) {
            return res.status(404).send("No SeedMoney records found for this faculty.");
        }

        const seedMoneyRecords = [];
        snapshot.forEach((doc) => {
            seedMoneyRecords.push({ id: doc.id, ...doc.data() });
        });

        // Update proof file paths to replace backslashes with forward slashes (for URL compatibility)
        seedMoneyRecords.forEach((record) => {
            record.proof = record.proof.map((file) => file.replace(/\\/g, "/"));
        });

        res.json(seedMoneyRecords);
    } catch (error) {
        console.error("Error fetching SeedMoney records:", error);
        res.status(500).send("Error fetching SeedMoney records.");
    }
});

// Route to update SeedMoney by ID
app.put("/update-seedMoney/:id", upload.array("proof", 5), async (req, res) => {
    const seedMoneyId = req.params.id;

    try {
        const docRef = db.collection("seedMoney").doc(seedMoneyId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).send("SeedMoney record not found.");
        }

        const existingData = doc.data();

        const {
            faculty_id = existingData.faculty_id,
            financialYear = existingData.financialYear,
            facultyName = existingData.facultyName,
            department = existingData.department,
            numStudents = existingData.numStudents,
            projectTitle = existingData.projectTitle,
            amountSanctioned = existingData.amountSanctioned,
            amountReceived = existingData.amountReceived,
            objectives = existingData.objectives,
            outcomes = existingData.outcomes,
        } = req.body;

        // Handle new files if uploaded
        let proof = existingData.proof;
        if (req.files && req.files.length > 0) {
            proof = req.files.map(file => file.path);
        }

        const updatedData = {
            faculty_id,
            financialYear,
            facultyName,
            department,
            numStudents,
            projectTitle,
            amountSanctioned,
            amountReceived,
            objectives,
            outcomes,
            proof,
            updatedAt: new Date(),
        };

        await docRef.update(updatedData);
        res.status(200).send("SeedMoney updated successfully");
    } catch (error) {
        console.error("Error updating SeedMoney:", error);
        res.status(500).send("Error while updating SeedMoney.");
    }
});

// Start the server
const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
