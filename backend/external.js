const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid"); // For generating unique project IDs
const serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(bodyParser.json());

/**
 * Route to add an externally funded project under a faculty's document
 */
app.post("/addFundedProject", async (req, res) => {
    try {
        const {
            faculty_id,
            financialYear,
            applicationNumber,
            agency,
            scheme,
            piName,
            piDept,
            piContact,
            piEmail,
            copiName,
            copiDept,
            copiContact,
            copiEmail,
            duration,
            title,
            status,
            startDate,
            objectives,
            outcomes,
            amountApplied,
            amountReceived,
            amountSanctioned,
        } = req.body;

        // Check for required fields
        if (!faculty_id || !title || !agency || !startDate || !status) {
            return res.status(400).send("Missing required fields.");
        }

        const projectId = uuidv4(); // Generate a unique ID for the project

        const newProject = {
            projectId,
            financialYear: financialYear ,
            applicationNumber: applicationNumber ,
            agency,
            scheme: scheme ,
            piName,
            piDept: piDept,
            piContact: piContact ,
            piEmail: piEmail ,
            copiName: copiName || null,
            copiDept: copiDept || null,
            copiContact: copiContact || null,
            copiEmail: copiEmail || null,
            duration: duration,
            title,
            status,
            startDate,
            objectives: objectives || null,
            outcomes: outcomes || null,
            amountApplied: amountApplied || null,
            amountReceived: amountReceived || null,
            amountSanctioned: amountSanctioned || null,
        };

        const facultyDocRef = db.collection("fundedProjects").doc(faculty_id);
        const doc = await facultyDocRef.get();

        if (doc.exists) {
            // Append the new project
            await facultyDocRef.update({
                projects: [...doc.data().projects, newProject],
            });
        } else {
            // Create a new faculty document
            await facultyDocRef.set({ projects: [newProject] });
        }

        res.status(200).send("Funded project added successfully.");
    } catch (error) {
        console.error("Error adding funded project:", error);
        res.status(500).send("Internal server error.");
    }
});

/**
 * Route to get externally funded projects by faculty_id
 */
app.get("/getFundedProjects/:faculty_id", async (req, res) => {
    try {
        const { faculty_id } = req.params;
        const docRef = db.collection("fundedProjects").doc(faculty_id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).send("No funded projects found for this faculty.");
        }

        res.json(doc.data().projects || []);
    } catch (error) {
        console.error("Error fetching funded projects:", error);
        res.status(500).send("Internal server error.");
    }
});

/**
 * Route to update a specific funded project by ID inside a faculty document
 */
app.put("/updateFundedProject/:faculty_id/:projectId", async (req, res) => {
    try {
        const { faculty_id, projectId } = req.params;
        const {
            financialYear,
            applicationNumber,
            agency,
            scheme,
            piName,
            piDept,
            piContact,
            piEmail,
            copiName,
            copiDept,
            copiContact,
            copiEmail,
            duration,
            title,
            status,
            startDate,
            objectives,
            outcomes,
            amountApplied,
            amountReceived,
            amountSanctioned,
        } = req.body;

        const docRef = db.collection("fundedProjects").doc(faculty_id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).send("Faculty not found.");
        }

        let projects = doc.data().projects;
        const projectIndex = projects.findIndex((p) => p.projectId === projectId);

        if (projectIndex === -1) {
            return res.status(404).send("Project not found.");
        }

        // Update fields while keeping existing values if no new data is provided
        projects[projectIndex] = {
            ...projects[projectIndex],
            financialYear: financialYear || projects[projectIndex].financialYear,
            applicationNumber: applicationNumber || projects[projectIndex].applicationNumber,
            agency: agency || projects[projectIndex].agency,
            scheme: scheme || projects[projectIndex].scheme,
            piName: piName || projects[projectIndex].piName,
            piDept: piDept || projects[projectIndex].piDept,
            piContact: piContact || projects[projectIndex].piContact,
            piEmail: piEmail || projects[projectIndex].piEmail,
            copiName: copiName || projects[projectIndex].copiName,
            copiDept: copiDept || projects[projectIndex].copiDept,
            copiContact: copiContact || projects[projectIndex].copiContact,
            copiEmail: copiEmail || projects[projectIndex].copiEmail,
            duration: duration || projects[projectIndex].duration,
            title: title || projects[projectIndex].title,
            status: status || projects[projectIndex].status,
            startDate: startDate || projects[projectIndex].startDate,
            objectives: objectives || projects[projectIndex].objectives,
            outcomes: outcomes || projects[projectIndex].outcomes,
            amountApplied: amountApplied || projects[projectIndex].amountApplied,
            amountReceived: amountReceived || projects[projectIndex].amountReceived,
            amountSanctioned: amountSanctioned || projects[projectIndex].amountSanctioned,
        };

        await docRef.update({ projects });

        res.status(200).send("Funded project updated successfully.");
    } catch (error) {
        console.error("Error updating funded project:", error);
        res.status(500).send("Internal server error.");
    }
});

/**
 * Start the server
 */
const PORT = 5003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
