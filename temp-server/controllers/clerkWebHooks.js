import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        const payload = req.body;

        // Verify signature
        whook.verify(JSON.stringify(payload), headers);

        const { data, type } = payload;
        console.log("📥 Webhook Event:", type);

        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address || "",
            username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            image: data.image_url || "",
            recentSearchedCities: [],
        };

        switch (type) {
            case "user.created":
                console.log("✅ Creating user:", userData);
                await User.create(userData);
                break;

            case "user.updated":
                console.log("🔁 Updating user:", userData);
                await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true });
                break;

            case "user.deleted":
                console.log("🗑 Deleting user with ID:", data.id);
                await User.findByIdAndDelete(data.id);
                break;

            default:
                console.log("ℹ️ Unknown webhook type:", type);
        }

        return res.status(200).json({ success: true, message: "Webhook received." });

    } catch (error) {
        console.error("❌ Webhook error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
};

export default clerkWebHooks;
