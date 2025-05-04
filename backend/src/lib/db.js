import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Handle the URI parsing more explicitly
    let mongoUri = process.env.MONGO_URI;
    
    // Check if we're in production (Render environment)
    if (process.env.NODE_ENV === 'production') {
      // Hardcode the URI with proper encoding for Render deployment
      mongoUri = "mongodb+srv://suguresh:Suguresh%40810@cluster0.jkxb0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    }
    
    // Set explicit connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    };
    
    console.log(`Connecting to MongoDB...`);
    
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
    // Don't exit process in production - let the server keep running
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1); // 1 means failure
    }
  }
};
