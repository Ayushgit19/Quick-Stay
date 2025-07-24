import User from "../models/User.js";

// MiddleWare to check if user is authenticated

export const protect = async (req, res, next) => {
    const auth = req.auth?.(); // ← call it like a function


    const { userId } = auth || {};

    if (!userId) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const user = await User.findById(userId);
    req.user = user;
    next();
};
