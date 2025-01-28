const express = require('express');
const cors = require('cors'); // Import CORS middleware
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Create an express app
const app = express();

// Enable CORS for all origins (or specify only your frontend origin if needed)
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// API endpoint to fetch overall statistics
app.get('/api/stats/:facultyId', async (req, res) => {
  const { facultyId } = req.params;

  try {
    // Firestore queries to fetch statistics
    const facultyRef = db.collection('faculty').doc(facultyId);
    const publicationsRef = db.collection('publications').where('faculty_id', '==', facultyId);
    const patentsRef = db.collection('patents').where('faculty_id', '==', facultyId);

    // Fetch faculty data
    const facultySnapshot = await facultyRef.get();
    const facultyExists = facultySnapshot.exists ? 1 : 0;

    // Fetch publications count
    const publicationsSnapshot = await publicationsRef.get();
    const publicationsCount = publicationsSnapshot.size;

    // Fetch patents count
    const patentsSnapshot = await patentsRef.get();
    const patentsCount = patentsSnapshot.size;

    // Prepare the response
    const response = {
      total_faculty: facultyExists,
      total_publications: publicationsCount,
      total_patents: patentsCount,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
const PORT = 5009;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
