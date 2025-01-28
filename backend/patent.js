const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs for patents

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
        const dir = "./uploads/patents/";
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

// Route to add patent with file upload
app.post("/addPatent", upload.single("proofOfPatent"), async (req, res) => {
    const {
        faculty_id,
        category,
        iprType,
        applicationNumber,
        applicantName,
        department,
        filingDate,
        inventionTitle,
        numOfInventors,
        inventors,
        status,
        dateOfPublished,
        dateOfGranted,
    } = req.body;

    const proofOfPatent = req.file ? req.file.path : null;

    if (!proofOfPatent) {
        return res.status(400).send("Proof of patent file is required.");
    }

    // Handle invalid JSON in inventors field
    let parsedInventors = null;
    if (inventors) {
        try {
            parsedInventors = JSON.parse(inventors);
        } catch (error) {
            return res.status(400).send("Invalid JSON format for inventors.");
        }
    }

    const patentId = uuidv4(); // Generate a unique ID for the patent

    const patentData = {
        patentId,
        faculty_id,
        category,
        iprType,
        applicationNumber,
        applicantName,
        department,
        filingDate,
        inventionTitle,
        numOfInventors: numOfInventors || 0,
        inventors: parsedInventors,
        status,
        dateOfPublished: dateOfPublished || null,
        dateOfGranted: dateOfGranted || null,
        proofOfPatent,
    };

    try {
        await db.collection("patents").doc(patentId).set(patentData);
        res.status(200).send("Patent added successfully");
    } catch (error) {
        console.error("Error adding patent:", error);
        res.status(500).send("Error while adding patent");
    }
});

// Route to get patents by faculty_id
app.get("/getPatents/:faculty_id", async (req, res) => {
    const faculty_id = req.params.faculty_id;

    try {
        const snapshot = await db
            .collection("patents")
            .where("faculty_id", "==", faculty_id)
            .get();

        if (snapshot.empty) {
            return res.status(404).send("No patents found for this faculty.");
        }

        const patents = [];
        snapshot.forEach((doc) => {
            patents.push({ id: doc.id, ...doc.data() });
        });

        patents.forEach((patent) => {
            if (patent.proofOfPatent) {
                patent.proofOfPatent = `${patent.proofOfPatent.replace(/\\/g, "/")}`;
            }
        });

        res.json(patents);
    } catch (error) {
        console.error("Error fetching patents:", error);
        res.status(500).send("Error fetching patents.");
    }
});

// Route to update patent by ID
app.put("/update-patent/:id", upload.single("proofOfPatent"), async (req, res) => {
    const patentId = req.params.id;

    try {
        const docRef = db.collection("patents").doc(patentId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).send("Patent not found.");
        }

        const existingData = doc.data();

        const {
            faculty_id = existingData.faculty_id,
            category = existingData.category,
            iprType = existingData.iprType,
            applicationNumber = existingData.applicationNumber,
            applicantName = existingData.applicantName,
            department = existingData.department,
            filingDate = existingData.filingDate,
            inventionTitle = existingData.inventionTitle,
            numOfInventors = existingData.numOfInventors,
            inventors = existingData.inventors,
            status = existingData.status,
            dateOfPublished = existingData.dateOfPublished,
            dateOfGranted = existingData.dateOfGranted,
        } = req.body;

        let proofOfPatent = existingData.proofOfPatent;

        if (req.file) {
            proofOfPatent = req.file.path;
        }

        // Handle invalid JSON in inventors field
        let parsedInventors = inventors;
        if (typeof inventors === 'string') {
            try {
                parsedInventors = JSON.parse(inventors);
            } catch (error) {
                return res.status(400).send("Invalid JSON format for inventors.");
            }
        }

        const updatedData = {
            faculty_id,
            category,
            iprType,
            applicationNumber,
            applicantName,
            department,
            filingDate,
            inventionTitle,
            numOfInventors,
            inventors: parsedInventors,
            status,
            dateOfPublished,
            dateOfGranted,
            proofOfPatent,
        };

        await docRef.update(updatedData);
        res.status(200).send("Patent updated successfully");
    } catch (error) {
        console.error("Error updating patent:", error);
        res.status(500).send("Error while updating patent.");
    }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
