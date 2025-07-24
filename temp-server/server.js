import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebHooks from "./controllers/clerkWebHooks.js";

const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // First: Connect to DB
        await connectDB();

        // Then: Set up middlewares & routes
        app.use(cors());

        // Clerk webhook must use raw body parser
        
        app.use(express.json());
        app.use(clerkMiddleware());
        
        app.use("/api/clerk", clerkWebHooks);
        app.get("/", (req, res) => {
            res.send("✅ API is working");
        });

        // Finally: Start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1); // Exit process to signal failure
    }
};

startServer();
