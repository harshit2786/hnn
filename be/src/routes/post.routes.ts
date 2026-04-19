import { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  reorderPosts,
  getAllTags,
} from "../controllers/post.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";

const router = Router();

// Public or author-aware routes
router.get("/", optionalAuth, getAllPosts);
router.get("/tags", getAllTags);
router.get("/:slug", optionalAuth, getPost);

// Protected routes (author only)
router.post("/", authenticate, createPost);
router.put("/reorder", authenticate, reorderPosts);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);

export default router;
