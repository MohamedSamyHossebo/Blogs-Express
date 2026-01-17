import { Router } from "express";
import connection from "../../DB/connection.js";
const router = Router();

router.post("/blogs/create", (req, res) => {
    const { title, content, user_id } = req.body;
    if (!title || !content || !user_id) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const checkQuery = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`;
    connection.execute(checkQuery, [user_id], (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });

        if (results.length === 0)
            return res.status(404).json({ message: "Author not found or deleted" });

    });
    const insertQuery = "INSERT INTO blogs (title, content, user_id) VALUES (?, ?, ?)";
    connection.execute(insertQuery, [title, content, user_id], (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });

        if (results.affectedRows === 0)
            return res.status(400).json({ message: "Blog creation failed" });

        return res.status(201).json({ message: "Blog created successfully", results });
    });
});

// Get all blogs
router.get("/blogs", (req, res) => {
    const selectQuery = `SELECT * FROM blogs WHERE deleted_at IS NULL`;
    connection.execute(selectQuery, (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });
        return res.status(200).json({ message: "Blogs retrieved successfully", results });
    });

})
// Get blog by id
router.get("/blogs/:blogId", (req, res) => {
    const blogId = req.params.blogId;
    const selectQuery = `SELECT * FROM blogs WHERE id = ? AND deleted_at IS NULL`;
    connection.execute(selectQuery, [blogId], (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });
        if (results.length === 0)
            return res.status(404).json({ message: "Blog not found" });
        return res.status(200).json({ message: "Blog retrieved successfully", results });
    });
});
// Update Blog
router.patch("/blogs/update/:blogId", (req, res) => {
    const blogId = req.params.blogId;
    const { title, content, user_id } = req.body;

    // Check if user Exists
    const checkUserQuery = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`;
    connection.execute(checkUserQuery, [user_id], (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });
        if (results.length === 0)
            return res.status(404).json({ message: "Author not found or deleted" });

        // Check if blog Exists
        const checkQuery = `SELECT * FROM blogs WHERE id = ? AND deleted_at IS NULL`;
        connection.execute(checkQuery, [blogId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Blog not found" });
            }
            // Authorization: Only the author can update the blog
            if (results[0].user_id !== user_id) {
                return res.status(403).json({ message: "Unauthorized: You can only update your own blogs" });
            }
            const updateQuery = `UPDATE blogs SET title = ?, content = ? WHERE id = ?`;
            connection.execute(updateQuery, [title, content, blogId], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                } else {
                    return res.status(200).json({ message: "Blog updated successfully", results });
                }
            });
        });
    });
});

// Soft Delete Blog
router.patch("/blogs/soft-delete/:blogId", (req, res) => {
    const blogId = req.params.blogId;
    const { user_id } = req.body;

    // Check if user Exists
    const checkUserQuery = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`;
    connection.execute(checkUserQuery, [user_id], (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });
        if (results.length === 0)
            return res.status(404).json({ message: "Author not found or deleted" });

        // Check if blog Exists
        const checkQuery = `SELECT * FROM blogs WHERE id = ? AND deleted_at IS NULL`;
        connection.execute(checkQuery, [blogId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Blog not found" });
            }
            // Authorization: Only the author can soft delete the blog
            if (results[0].user_id !== user_id) {
                return res.status(403).json({ message: "Unauthorized: You can only Soft Delete your own blogs" });
            }
            const softDeleteQuery = `UPDATE blogs SET deleted_at = NOW() WHERE id = ?`;
            connection.execute(softDeleteQuery, [blogId], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                } else {
                    return res.status(200).json({ message: "Blog soft deleted successfully", results });
                }
            });
        });
    });
});
// Restore Blog
router.patch("/blogs/restore/:blogId", (req, res) => {
    const blogId = req.params.blogId;
    const { user_id } = req.body;

    // Check if user Exists
    const checkUserQuery = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`;
    connection.execute(checkUserQuery, [user_id], (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });
        if (results.length === 0)
            return res.status(404).json({ message: "Author not found or deleted" });

        // Check if blog Exists
        const checkQuery = `SELECT * FROM blogs WHERE id = ? AND deleted_at IS NULL`;
        connection.execute(checkQuery, [blogId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Blog not found" });
            }
            // Authorization: Only the author can soft delete the blog
            if (results[0].user_id !== user_id) {
                return res.status(403).json({ message: "Unauthorized: You can only Soft Delete your own blogs" });
            }
            const softDeleteQuery = `UPDATE blogs SET deleted_at = NULL WHERE id = ?`;
            connection.execute(softDeleteQuery, [blogId], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                } else {
                    return res.status(200).json({ message: "Blog restored successfully", results });
                }
            });
        });
    });
});

// Hard Delete Blog
router.delete("/blogs/delete/:blogId", (req, res) => {
    const blogId = req.params.blogId;
});

export default router;