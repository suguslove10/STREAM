import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Handle the URI parsing more explicitly
    let mongoUri = process.env.MONGO_URI;
    
    // Check if we're in production (Render environment)
    if (process.env.NODE_ENV === 'production') {
      // Define each part of the connection string
      const username = "suguresh";
      const password = encodeURIComponent("Suguresh@810"); // Properly encode the password
      const cluster = "cluster0.jkxb0.mongodb.net";
      const database = "streamify";
      
      // Build the connection string in the format expected by MongoDB Atlas
      mongoUri = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;
      
      // Log a masked version of the URI for debugging
      console.log(`Using production MongoDB URI: ${mongoUri.replace(/:([^@]+)@/, ':****@')}`);
    }
    
    // Remove deprecated options
    const options = {
      serverSelectionTimeoutMS: 30000, // Longer timeout for connection attempts
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
