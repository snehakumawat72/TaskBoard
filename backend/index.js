import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import routes from "./routes/index.js";
import http from "http";
import { initializeSocket } from './socket/socket-server.js';
import deadlineScheduler from './libs/deadline-scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("✅ Environment loaded - Server starting...");

const app = express();
const server = http.createServer(app); // 👈 Important: use http server

// Initialize Socket.IO with authentication
const io = initializeSocket(server);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5175",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));
app.use(express.json());

// ✅ CONNECT TO DB with retry logic
const connectDB = async () => {
  try {
    const mongoOptions = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      heartbeatFrequencyMS: 10000, // Send a ping to check server status every 10 seconds
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    };

    console.log('🔄 Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    console.log("✅ DB Connected successfully.");
    
    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully.');
    });
    
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err.message);
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

// Start DB connection
connectDB();

// ROUTES
app.use('/uploads/avatars', express.static(path.join(process.cwd(), 'uploads/avatars')));
app.use("/api-v1", routes);

// Test route
app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to TaskBoard API" });
});

// Test API connectivity without auth
app.get("/api-v1/test", async (req, res) => {
  res.status(200).json({ 
    message: "Backend API is working!", 
    timestamp: new Date().toISOString(),
    cors: "enabled"
  });
});

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// 404 middleware
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// 👇 Start server with http server (for Socket.IO support)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Start the deadline scheduler
  deadlineScheduler.start();
});
