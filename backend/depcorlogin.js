const bodyParser = require("body-parser");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const express = require('express');
const cors = require('cors'); // Import CORS middleware

const serviceAccount = require("./key.json"); // Replace with your Firebase Admin SDK JSON file

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.post('/coordinatorlogin', async (req, res) => {
  const { coordinatorid, password1, department } = req.body; // Form field names

  // Validate input
  if (!coordinatorid || !password1 || !department) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Query Firestore for the matching document
    const snapshot = await db.collection('coordinators')
      .where('coordinatorid', '==', coordinatorid) // Map 'coordinatorid' to 'corid'
      .where('department', '==', department)
      .get();

    if (snapshot.empty) {
      // No matching document found
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Extract the matching document
    const coordinator = snapshot.docs[0].data();

    // Compare the password
    if (coordinator.password === password1) {
      // Login successful
      return res.status(200).json({ success: true, coordinatorid: coordinator.coordinatorid });
    } else {
      // Password doesn't match
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
