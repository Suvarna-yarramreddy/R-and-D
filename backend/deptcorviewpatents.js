const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Firebase Admin Setup
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://<your-database-name>.firebaseio.com',  // Replace with your Firebase DB URL
});

// Firestore Reference
const db = admin.firestore();

// Route to fetch all patents
app.get('/getAllPatents', async (req, res) => {
  const coordinatorId = req.query.coordinatorid;

  if (!coordinatorId) {
    return res.status(400).send('Coordinator ID is required.');
  }

  try {
    // Step 1: Fetch the coordinator's department
    const coordinatorSnapshot = await db.collection('depcorlogin')
      .where('coordinatorid', '==', coordinatorId)
      .get();

    if (coordinatorSnapshot.empty) {
      return res.status(404).send('Coordinator not found.');
    }

    const coordinatorDepartment = coordinatorSnapshot.docs[0].data().department;

    // Step 2: Fetch patents with status filed, granted, or published
    const patentsSnapshot = await db.collection('patents')
      .where('status', 'in', ['filed', 'granted', 'published'])
      .where('department', '==', coordinatorDepartment)
      .get();

    if (patentsSnapshot.empty) {
      return res.status(404).send('No patents applied for approval.');
    }

    // Modify the proofOfPatent path if it exists
    const patents = patentsSnapshot.docs.map(doc => {
      const patent = doc.data();
      if (patent.proofOfPatent) {
        patent.proofOfPatent = patent.proofOfPatent.replace(/\\/g, '/');
      }
      return patent;
    });

    // Send the patents as a JSON response
    res.json(patents);
  } catch (err) {
    console.error('Error fetching patents:', err);
    return res.status(500).send('Error fetching patents.');
  }
});

// Route to approve a patent
app.put('/approvePatent/:id', async (req, res) => {
  const patentId = req.params.id;

  try {
    const patentRef = db.collection('patents').doc(patentId);
    const patentSnapshot = await patentRef.get();

    if (!patentSnapshot.exists) {
      return res.status(404).json({ error: 'Patent not found' });
    }

    await patentRef.update({
      status: 'Approved by Department R&D Coordinator',
    });

    res.status(200).json({ message: 'Patent approved successfully' });
  } catch (err) {
    console.error('Error during approval:', err);
    return res.status(500).json({ error: 'Failed to approve patent' });
  }
});

// Route to reject a patent
app.put('/rejectPatent/:patentId', async (req, res) => {
  const patentId = req.params.patentId;
  const rejectionReason = req.body.rejectionReason;

  // Check if rejectionReason is provided
  if (!rejectionReason) {
    return res.status(400).json({ message: 'Rejection reason is required' });
  }

  try {
    const patentRef = db.collection('patents').doc(patentId);
    const patentSnapshot = await patentRef.get();

    if (!patentSnapshot.exists) {
      return res.status(404).json({ message: 'Patent not found' });
    }

    await patentRef.update({
      status: 'Rejected by Department R&D Coordinator',
      rejection_reason: rejectionReason,
    });

    res.status(200).json({ message: 'Patent rejected successfully' });
  } catch (err) {
    console.error('Error during rejection:', err);
    return res.status(500).json({ message: 'Failed to reject patent' });
  }
});

// Start the server
const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
