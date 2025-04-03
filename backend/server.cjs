const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

const app = express();
app.use(cors());

const PORT = 5000;

// Define absolute paths
const UPLOADS_DIR = path.join(process.cwd(), "..","uploads");
const OUTPUT_JSONS_DIR = path.join(process.cwd(), "..","output", "jsons");
const OUTPUT_IMAGES_DIR = path.join(process.cwd(), "..","output", "images");
const FRONTEND_DIST_DIR = path.join(process.cwd(),  "..","frontend", "dist");
// Path to the Bash script
const SCRIPT_PATH = path.join(process.cwd(),"bash.sh")

// Multer setup for file uploads
const upload = multer({ dest: UPLOADS_DIR });

// Function to execute Bash script
const runBashScript = (imagePath, callback) => {
    console.log(`🔹 Running Bash Script: bash ${SCRIPT_PATH} ${imagePath}`);

    const process = spawn("bash", [SCRIPT_PATH, imagePath]);

    let stdoutData = "", stderrData = "";

    process.stdout.on("data", (data) => {
        stdoutData += data.toString();
        console.log(`📢 [BASH OUTPUT]: ${data.toString().trim()}`);
    });

    process.stderr.on("data", (data) => {
        stderrData += data.toString();
        console.error(`⚠️ [BASH ERROR]: ${data.toString().trim()}`);
    });

    process.on("close", (code) => {
        console.log(`✅ [BASH EXIT CODE]: ${code}`);
        callback(code === 0 ? null : new Error(`Exit code ${code}`), stdoutData, stderrData);
    });
};

// Serve static files
app.use("/output-images", express.static(OUTPUT_IMAGES_DIR));
app.use("/original-images", express.static(UPLOADS_DIR));

// List images
app.get("/list", async (req, res) => {
    try {
        const getFiles = (folder) => fs.promises.readdir(folder);
        const [outputImages, originalImages] = await Promise.all([
            getFiles(OUTPUT_IMAGES_DIR),
            getFiles(UPLOADS_DIR),
        ]);
        res.json({ outputImages, originalImages });
    } catch (error) {
        res.status(500).json({ error: "Error reading directories" });
    }
});

// Download images
app.get('/download', (req, res) => {
    const zipFilePath = path.resolve(__dirname, "..", "zip", "output_images.zip");

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
        res.download(zipFilePath, "output_images.zip", (err) => {
            if (err) console.error(err);
            fs.unlinkSync(zipFilePath); // Delete zip after download
        });
    });

    archive.pipe(output);
    archive.directory(OUTPUT_IMAGES_DIR, false);
    archive.finalize();
});

// Handle file upload
app.post("/upload", upload.array("images"), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    let processedCount = 0;
    const results = [];

    req.files.forEach((file) => {
        const newImagePath = path.join(UPLOADS_DIR, `${file.filename}.jpg`);
        fs.renameSync(file.path, newImagePath);

        console.log("✅ Uploaded Image Path:", newImagePath);

        if (!fs.existsSync(newImagePath)) {
            return res.status(500).json({ error: `Uploaded file not found: ${file.originalname}` });
        }

        runBashScript(newImagePath, (error, stdout, stderr) => {
            processedCount++;

            if (error) {
                results.push({ file: file.originalname, error: error.message });
            } else if (stderr) {
                results.push({ file: file.originalname, error: stderr });
            } else {
                results.push({ file: file.originalname, message: "Processed successfully", output: stdout });
            }

            if (processedCount === req.files.length) {
                res.json({ message: "All files processed", results });
            }
        });
    });
});

// Serve static frontend files
if (fs.existsSync(FRONTEND_DIST_DIR)) {
    app.use(express.static(FRONTEND_DIST_DIR));

    app.get("*", (req, res) => {
        res.sendFile(path.join(FRONTEND_DIST_DIR, "index.html"));
    });
} else {
    console.error("❌ ERROR: Frontend build folder not found!", FRONTEND_DIST_DIR);
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
