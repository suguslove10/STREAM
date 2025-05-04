import { generateStreamToken } from "../lib/stream.js";
import StreamChat from "stream-chat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Stream chat client initialization
const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function uploadVoiceMessage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file provided" });
    }

    // Get file information
    const { path: filePath, mimetype, filename } = req.file;
    
    // Read the file as buffer
    const fileContent = fs.readFileSync(filePath);
    
    // Upload file to Stream
    const response = await serverClient.sendFile(
      'messaging',
      req.body.channelId,
      'voice-message',
      filename,
      fileContent,
      mimetype
    );
    
    // Delete temporary file
    fs.unlinkSync(filePath);

    res.status(200).json({ fileUrl: response.file });
  } catch (error) {
    console.log("Error in uploadVoiceMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
