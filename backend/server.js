import express from "express";
import cors from "cors";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

const PORT = 5000;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure output directory exists
const ensureDirExists = (relativePath) => {
    const dirPath = path.join(__dirname, relativePath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};
ensureDirExists("output/jsons");

// Path to the Bash script
const scriptPath = "bash.sh"

// Multer setup (store files in the root directory)
const upload = multer({ dest: "../uploads" });

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Rename file to include .jpg extension
    const newImagePath = path.join(__dirname, `../uploads/${req.file.filename}.jpg`);
    fs.renameSync(req.file.path, newImagePath);

    console.log("✅ Uploaded Image Path:", newImagePath);

    if (!fs.existsSync(newImagePath)) {
        return res.status(500).json({ error: "Uploaded file not found" });
    }

    // Run the Bash script
    const command = `bash "${scriptPath}" "${newImagePath}"`;
    console.log("🔹 Running Bash Script:", command);

    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: error.message });
        if (stderr) return res.status(500).json({ error: stderr });

        res.json({ message: "Image processed successfully", output: stdout });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
