const bodyParser = require("body-parser");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const express = require("express");
const cors = require("cors"); // Import CORS middleware

const serviceAccount = require("./key.json"); // Replace with your Firebase Admin SDK JSON file

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint to get the department of a coordinator
app.get("/getCoordinatorDepartment", async (req, res) => {
  try {
    const { coordinatorid } = req.query;

    if (!coordinatorid) {
      return res.status(400).send("Coordinator ID is required");
    }

    const coordinatorDoc = await db.collection("coordinators").doc(coordinatorid).get();

    if (!coordinatorDoc.exists) {
      return res.status(404).send("Coordinator not found");
    }

    const coordinatorData = coordinatorDoc.data();
    res.status(200).json({ department: coordinatorData.department });
  } catch (error) {
    console.error("Error fetching coordinator department:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to get publications by department
app.get("/getPublicationsByDepartment", async (req, res) => {
    try {
      const { department } = req.query;
  
      // Validate department input
      if (!department) {
        return res.status(400).send("Department is required");
      }
  
      // Step 1: Find all faculty in the specified department
      const facultySnapshot = await db
        .collection("faculty")
        .where("department", "==", department)
        .get();
  
      if (facultySnapshot.empty) {
        return res.status(404).send("No faculty found in the department");
      }
  
      // Step 2: Collect all faculty IDs
      const facultyIds = facultySnapshot.docs.map((doc) => doc.id);
  
      // Step 3: Fetch all publications for the faculty IDs
      const publicationsSnapshot = await db
        .collection("publications")
        .where("faculty_id", "in", facultyIds) // Filter publications by faculty IDs
        .where("status", "==", "Applied")
        .get();
  
      if (publicationsSnapshot.empty) {
        return res.status(200).json([]); // No publications found
      }
  
      // Step 4: Format the publication data
      const publications = publicationsSnapshot.docs.map((doc) => ({
        documentid: doc.id,
        ...doc.data(),
      }));
  
      // Send the list of publications as the response
      res.status(200).json(publications);
    } catch (error) {
      console.error("Error fetching publications:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
// Endpoint to approve a publication
app.put("/approvePublication/:documentid", async (req, res) => {
  try {
    const { documentid } = req.params;

    const publicationRef = db.collection("publications").doc(documentid);
    const publicationDoc = await publicationRef.get();

    if (!publicationDoc.exists) {
      return res.status(404).send("Publication not found");
    }

    await publicationRef.update({ status: "Approved by department RandD Coordinator" });
    res.status(200).send("Publication approved successfully");
  } catch (error) {
    console.error("Error approving publication:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to reject a publication
app.put("/rejectPublication/:documentid", async (req, res) => {
  try {
    const { documentid } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).send("Rejection reason is required");
    }

    const publicationRef = db.collection("publications").doc(documentid);
    const publicationDoc = await publicationRef.get();

    if (!publicationDoc.exists) {
      return res.status(404).send("Publication not found");
    }

    await publicationRef.update({ status: "Rejected by department RandD Coordinator", rejectionReason });
    res.status(200).send("Publication rejected successfully");
  } catch (error) {
    console.error("Error rejecting publication:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Start the server
const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
