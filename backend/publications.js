const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // Import the uuid library

// Initialize Firebase Admin (Firestore only)
const admin = require("firebase-admin");
const serviceAccount = require("./key.json"); // Path to your service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'publications'); // Create publications folder inside uploads
    
    // Check if the 'publications' directory exists, if not create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Specify the 'publications' directory for file storage
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Default route
app.get("/", (req, res) => {
  res.send("Server is running! Access the /addPublication and /getPublications endpoints.");
});

// Add Publication Endpoint
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

    let proofOfPublicationUrl = null;

    // Store file locally and get its path
    if (req.file) {
      const filePath = path.join(__dirname, "uploads", req.file.filename); // Absolute path of the uploaded file
      proofOfPublicationUrl = `http://localhost:5002/uploads/${req.file.filename}`; // URL to access the file locally
    }

    // Generate a unique ID for the publication
    const publicationId = uuidv4(); // Use uuid to generate a unique ID

    // Save publication data to Firestore with custom document ID
    const publication = {
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
      proofOfPublication: proofOfPublicationUrl,
      status: "Applied", // Default status
    };

    // Add the publication document with the custom ID
    await db.collection("publications").doc(publicationId).set(publication);

    res.status(200).send("Publication added successfully");
  } catch (error) {
    console.error("Error while adding publication:", error);
    res.status(500).send("Error while adding publication");
  }
});

// Get Publications Endpoint
app.get("/getPublications/:faculty_id", async (req, res) => {
  try {
    const faculty_id = req.params.faculty_id;

    const publicationsSnapshot = await db
      .collection("publications")
      .where("faculty_id", "==", faculty_id)
      .get();

    if (publicationsSnapshot.empty) {
      return res.status(404).json({ message: "No publications found" });
    }

    const publications = publicationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(publications);
  } catch (error) {
    console.error("Error fetching publications:", error);
    res.status(500).json({ message: "Error fetching publications", error });
  }
});

// Serve static files (uploaded files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
