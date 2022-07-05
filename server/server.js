const express = require("express");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

// Routers
const userRouter = require("./routes/User");
const barangayRouter = require("./routes/Barangay");
const submissionRouter = require("./routes/Submission");

const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.ORIGIN,
        optionsSuccessStatus: 200,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

// Upload Endpoint
app.post("/upload", (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: "No file uploaded" });
    }

    const file = req.files.file;

    file.mv(`./public/submissions/${file.name}`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.json({
            fileName: file.name,
            filePath: `/submissions/${file.name}`,
        });
    });
});

// Download Endpoint
app.get("/download", (req, res) => {
    const fileName = req.body.fileName;
    res.download(`../server/public/submissions/${fileName}`);
});

app.use("/user", userRouter);
app.use("/barangay", barangayRouter);
app.use("/submission", submissionRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});
