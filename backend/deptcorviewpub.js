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

