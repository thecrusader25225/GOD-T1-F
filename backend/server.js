import express from "express";
import cors from "cors";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import archiver from "archiver";

const app = express();
app.use(cors({
    origin: '*', // Allows all origins (change this to specific origin if needed)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure output directories exist
const ensureDirExists = (relativePath) => {
    const dirPath = path.join(__dirname, relativePath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};
ensureDirExists("../uploads");
ensureDirExists("../output/jsons");
ensureDirExists("../output/images");

// Path to the Bash script
const scriptPath = "bash.sh";

// Multer setup for multiple files
const upload = multer({ dest: "../uploads" });

// Function to execute Bash script and log output
const runBashScript = (imagePath, callback) => {
    console.log(`🔹 Running Bash Script: bash ${scriptPath} ${imagePath}`);

    const process = spawn("bash", [scriptPath, imagePath]);

    let stdoutData = "";
    let stderrData = "";

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

const original_image_path = path.join(__dirname, "../uploads");
const output_image_path=path.join(__dirname, '../output/images')

app.use("/output-images", express.static(output_image_path));
app.use("/original-images", express.static(original_image_path))

app.get("/list", (req, res) => {

    const getFiles = (folder) => {
        return new Promise((resolve, reject) => {
            fs.readdir(folder, (err, files) => {
                if (err) reject(err);
                else resolve(files);
            });
        });
    };

    Promise.all([getFiles(output_image_path), getFiles(original_image_path)])
        .then(([outputImages, originalImages]) => {
            res.json({
                outputImages,   // 🖼️ Processed images
                originalImages  // 📷 Uploaded images
            });
        })
        .catch((error) => {
            res.status(500).json({ error: "Error reading directories" });
        });
});

//download images
app.get('/download', (req, res) => {
    const zipFilePath = path.join(__dirname, '../zip/output_images.zip');
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        res.download(zipFilePath, '../zip/output_images.zip', (err) => {
            if (err) console.error(err);
            fs.unlinkSync(zipFilePath); // Delete zip after download
        });
    });

    archive.pipe(output);
    archive.directory(path.join(__dirname, '../output/images'), false);
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
        const newImagePath = path.join(__dirname, `../uploads/${file.filename}.jpg`).replace(/\\/g, "/");
        fs.renameSync(file.path, newImagePath);

        console.log("✅ Uploaded Image Path:", newImagePath);

        if (!fs.existsSync(newImagePath)) {
            return res.status(500).json({ error: `Uploaded file not found: ${file.originalname}` });
        }

        // Execute Bash script
        runBashScript(newImagePath, (error, stdout, stderr) => {
            processedCount++;

            if (error) {
                results.push({ file: file.originalname, error: error.message });
            } else if (stderr) {
                results.push({ file: file.originalname, error: stderr });
            } else {
                results.push({ file: file.originalname, message: "Processed successfully", output: stdout });
            }

            // Send response only when all files are processed
            if (processedCount === req.files.length) {
                res.json({ message: "All files processed", results });
            }
        });
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
