import express from "express";
import { 
    register, 
    profile, 
    userToken, 
    authenticate, 
    forgotPassword, 
    checkPassToken, 
    newPassword, 
    updateProfile, 
    updatePassword 
} from "../controllers/veterinarianController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//public area
router.post("/", register);
router.get("/userToken/:token", userToken);
router.post("/login", authenticate);
router.post("/forgot-password", forgotPassword);
router.route("/forgot-password/:token").get(checkPassToken).post(newPassword);


//private area
router.get("/profile", checkAuth, profile);
router.put("/profile/:id", checkAuth, updateProfile);
router.put("/update-password", checkAuth, updatePassword);




export default router;