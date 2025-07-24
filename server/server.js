import express from "express";
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebHooks from "./controllers/clerkWebHooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();

(async () => {
  try {
    await connectDB();  // Wait for DB connection before continuing

    app.use(cors());
    app.use(express.json());

    connectCloudinary(); // Cloudinary setup

    app.use(clerkMiddleware());

    // Clerk Webhook route
    app.use("/api/clerk", clerkWebHooks);

    // All other routes
    app.get('/', (req, res) => res.send("API is working"))
    app.use("/api/users", userRouter);
    app.use("/api/hotels", hotelRouter);
    app.use("/api/rooms", roomRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
  }
})();
