import User from "../models/user.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
    console.log("📥 Webhook received:", JSON.stringify(req.body, null, 2)); // Add this
    try {

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        await whook.verify(JSON.stringify(req.body), headers);

        const { data, type } = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
            recentSearchedCities: [],
        };

        switch (type) {
            case "user.created":
                console.log("👤 Creating user:", userData);
                await User.create(userData);
                break;
            case "user.updated":
                await User.findByIdAndUpdate(data.id, userData);
                break;
            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                break;
            default:
                console.log("ℹ️ Unknown webhook type:", type);
                break;
        }

        res.json({ success: true, message: "Webhook received" });
    } catch (error) {
        console.error("❌ Webhook error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};


export default clerkWebHooks