import { Router } from "express";
import * as blogService from "./blog.service.js";
const router = Router();

router.post("/create", (req, res) => {
    blogService.createBlog(req.body, res);
});

// Get all blogs
router.get("/", (req, res) => {
    blogService.getAllBlogs(res);
})
// Get blog by id
router.get("/:blogId", (req, res) => {
    blogService.getBlogById(req.params, res);
});
// Update Blog
router.patch("/update/:blogId", (req, res) => {
    blogService.updateBlog(req.params.blogId, req.body, res);
});

// Soft Delete Blog
router.patch("/soft-delete/:blogId", (req, res) => {
    blogService.softDeleteBlog(req.params.blogId, req.body, res);
});
// Restore Blog
router.patch("/restore/:blogId", (req, res) => {
    blogService.restoreBlog(req.params.blogId, req.body, res);
});

// Hard Delete Blog
router.delete("/delete/:blogId", (req, res) => {
    blogService.hardDeleteBlog(req.params.blogId, req.body, res);
});

export default router;