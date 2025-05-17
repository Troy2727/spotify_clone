import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong } from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// This route is only protected by authentication, not admin check
// It's used to check if the user is an admin
router.get("/check", protectRoute, checkAdmin);

// All other admin routes require admin privileges
router.use(protectRoute, requireAdmin);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;
