import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken, uploadVoiceMessage } from "../controllers/chat.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set up multer storage for voice message uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "voice-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only audio files
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"));
    }
  },
});

router.get("/token", protectRoute, getStreamToken);
router.post("/voice-message", protectRoute, upload.single("audio"), uploadVoiceMessage);

export default router;
