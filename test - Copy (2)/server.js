const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads")); // Serve files from the "uploads" folder

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Files will be saved in the "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// Mock database to store assignment info
let assignmentData = {
    fileName: null,
    fileUrl: null,
    googleFormUrl: null,
};

// Endpoint to upload assignment files or Google Form URL
app.post("/upload", upload.single("file"), (req, res) => {
    const { googleFormUrl } = req.body;
    const file = req.file;

    if (file) {
        assignmentData.fileName = file.originalname;
        assignmentData.fileUrl = `http://localhost:${PORT}/${file.filename}`;
    }

    if (googleFormUrl) {
        assignmentData.googleFormUrl = googleFormUrl;
    }

    res.json({ message: "Upload successful", assignmentData });
});

// Endpoint to fetch assignment data (for students)
app.get("/getAssignment", (req, res) => {
    res.json(assignmentData);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
