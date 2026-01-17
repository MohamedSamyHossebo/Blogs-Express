import connection from "../../DB/connection.js";

export const createBlog = (data, res) => {
    const { title, content, user_id } = data;
    if (!title || !content || !user_id) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const checkQuery = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`;
    connection.execute(checkQuery, [user_id], (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });

        if (results.length === 0)
            return res.status(404).json({ message: "Author not found or deleted" });

        const insertQuery = "INSERT INTO blogs (title, content, user_id) VALUES (?, ?, ?)";
        connection.execute(insertQuery, [title, content, user_id], (err, results) => {
            if (err)
                return res.status(500).json({ message: err.message });
            if (results.affectedRows === 0)
                return res.status(400).json({ message: "Blog creation failed" });

            return res.status(201).json({ message: "Blog created successfully", results });
        });
    });
};

export const getAllBlogs = (res) => {
    const selectQuery = `SELECT * FROM blogs WHERE deleted_at IS NULL`;
    connection.execute(selectQuery, (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });
        return res.status(200).json({ message: "Blogs retrieved successfully", results });
    });
}

export const getBlogById = (data, res) => {
    const { blogId } = data;
    const selectQuery = `SELECT * FROM blogs WHERE id = ? AND deleted_at IS NULL`;
    connection.execute(selectQuery, [blogId], (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });
        if (results.length === 0)
            return res.status(404).json({ message: "Blog not found" });
        return res.status(200).json({ message: "Blog retrieved successfully", results });
    });
}

export const updateBlog = (blog_Id, data, res) => {
    const blogId = blog_Id;
    const { title, content, user_id } = data;

    if (!title || !content || !user_id) {
        return res.status(400).json({ message: "All fields are required" });
    }
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
            connection.execute(updateQuery, [title, content, blogId], (err) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                return res.status(200).json({ message: "Blog updated successfully", results: data });
            });
        });
    });
};

export const softDeleteBlog = (blog_Id, data, res) => {
    const blogId = blog_Id;
    const user_id = data.user_id;
    if (!user_id) {
        console.log("Missing user_id in body");
        return res.status(400).json({ message: "User ID is required in request body" });
    }
    if (!blogId) {
        console.log("Missing blogId in params");
        return res.status(400).json({ message: "Blog ID is required in URL" });
    }
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
}
export const restoreBlog = (blog_Id, data, res) => {
    const blogId = blog_Id;
    const { user_id } = data;

    // Check if user Exists
    const checkUserQuery = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`;
    connection.execute(checkUserQuery, [user_id], (err, results) => {
        if (err)
            return res.status(500).json({ message: err.message });
        if (results.length === 0)
            return res.status(404).json({ message: "Author not found or deleted" });

        // Check if blog Exists (note: restoring a blog that is currently "live" is usually redundant, but here we check all blogs)
        const checkQuery = `SELECT * FROM blogs WHERE id = ?`;
        connection.execute(checkQuery, [blogId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Blog not found" });
            }
            // Authorization: Only the author can restore the blog
            if (results[0].user_id != user_id) {
                return res.status(403).json({ message: "Unauthorized: You can only restore your own blogs" });
            }
            const restoreQuery = `UPDATE blogs SET deleted_at = NULL WHERE id = ?`;
            connection.execute(restoreQuery, [blogId], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                } else {
                    return res.status(200).json({ message: "Blog restored successfully", results });
                }
            });
        });
    });
}

export const hardDeleteBlog = (blog_Id, data, res) => {
    const blogId = blog_Id;
    const { user_id } = data;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required in request body" });
    }
    
    const findQuery = `SELECT * FROM blogs WHERE id=? AND deleted_at IS NOT NULL`;
    connection.execute(findQuery, [blogId], (err, blogResults) => {
        if (err) return res.status(500).json({ message: err.message });
        if (blogResults.length === 0) return res.status(404).json({ message: "Blog not found or not soft-deleted" });

        const checkUserQuery = `SELECT * FROM users WHERE id=? AND deleted_at IS NULL`;
        connection.execute(checkUserQuery, [user_id], (err, userResults) => {
            if (err) return res.status(500).json({ message: err.message });
            if (userResults.length === 0) return res.status(404).json({ message: "Author not found or deleted" });

            if (blogResults[0].user_id != user_id) {
                return res.status(403).json({ message: "Unauthorized: You can only delete your own blogs" });
            }

            const deleteQuery = `DELETE FROM blogs WHERE id=?`;
            connection.execute(deleteQuery, [blogId], (err, results) => {
                if (err) return res.status(500).json({ message: err.message });
                return res.status(200).json({ message: "Blog deleted successfully", results });
            });
        });
    });
}