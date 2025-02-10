const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { v4: uuidv4 } = require("uuid"); // For generating unique patent IDs

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

/**
 * Route to add a patent under a faculty's document
 */
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

    const proofOfPatent = req.file ? req.file.path.replace(/\\/g, "/") : null;

    if (!proofOfPatent) {
        return res.status(400).send("Proof of patent file is required.");
    }

    // Parse inventors JSON if provided
    let parsedInventors = null;
    if (inventors) {
        try {
            parsedInventors = JSON.parse(inventors);
        } catch (error) {
            return res.status(400).send("Invalid JSON format for inventors.");
        }
    }

    const patentId = uuidv4(); // Generate a unique ID for the patent

    const newPatent = {
        patentId,
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
        const facultyDocRef = db.collection("patents").doc(faculty_id);
        const doc = await facultyDocRef.get();

        if (doc.exists) {
            // Update existing faculty document by adding a new patent to the array
            await facultyDocRef.update({
                patents: [...doc.data().patents, newPatent],
            });
        } else {
            // Create a new faculty document with the first patent
            await facultyDocRef.set({ patents: [newPatent] });
        }

        res.status(200).send("Patent added successfully");
    } catch (error) {
        console.error("Error adding patent:", error);
        res.status(500).send("Error while adding patent");
    }
});

/**
 * Route to get patents by faculty_id
 */
app.get("/getPatents/:faculty_id", async (req, res) => {
    const faculty_id = req.params.faculty_id;

    try {
        const docRef = db.collection("patents").doc(faculty_id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).send("No patents found for this faculty.");
        }

        res.json(doc.data().patents || []);
    } catch (error) {
        console.error("Error fetching patents:", error);
        res.status(500).send("Error fetching patents.");
    }
});

/**
 * Route to update a specific patent by ID inside a faculty document
 */
app.put("/update-patent/:faculty_id/:patentId", upload.single("proofOfPatent"), async (req, res) => {
    const { faculty_id, patentId } = req.params;

    try {
        const docRef = db.collection("patents").doc(faculty_id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).send("Faculty not found.");
        }

        let patents = doc.data().patents;
        const patentIndex = patents.findIndex((p) => p.patentId === patentId);

        if (patentIndex === -1) {
            return res.status(404).send("Patent not found.");
        }

        const existingPatent = patents[patentIndex];

        // Update fields
        patents[patentIndex] = {
            ...existingPatent,
            category: req.body.category || existingPatent.category,
            iprType: req.body.iprType || existingPatent.iprType,
            applicationNumber: req.body.applicationNumber || existingPatent.applicationNumber,
            applicantName: req.body.applicantName || existingPatent.applicantName,
            department: req.body.department || existingPatent.department,
            filingDate: req.body.filingDate || existingPatent.filingDate,
            inventionTitle: req.body.inventionTitle || existingPatent.inventionTitle,
            numOfInventors: req.body.numOfInventors || existingPatent.numOfInventors,
            inventors: req.body.inventors ? JSON.parse(req.body.inventors) : existingPatent.inventors,
            status: req.body.status || existingPatent.status,
            dateOfPublished: req.body.dateOfPublished || existingPatent.dateOfPublished,
            dateOfGranted: req.body.dateOfGranted || existingPatent.dateOfGranted,
            proofOfPatent: req.file ? req.file.path.replace(/\\/g, "/") : existingPatent.proofOfPatent,
        };

        await docRef.update({ patents });

        res.status(200).send("Patent updated successfully");
    } catch (error) {
        console.error("Error updating patent:", error);
        res.status(500).send("Error while updating patent.");
    }
});

/**
 * Start the server
 */
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
