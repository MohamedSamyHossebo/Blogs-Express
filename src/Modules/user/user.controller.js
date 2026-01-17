import { Router } from "express";
import connection from "../../DB/connection.js";
import * as userService from "./user.service.js";
const router = Router();

router.get("/", (req, res) => {
    userService.getAllUsers(res);
});

// router.get("/users/:id", (req, res) => {
//     const id = req.params.id;
//     try {
//         connection.execute(`SELECT * FROM users WHERE id = ?`, [id], (err, results) => {
//             if (err) {
//                 return res.status(500).json({ message: err.message });
//             } else {
//                 return res.status(200).json({ message: "user found", results });
//             }
//         });
//     } catch (err) {
//         console.log(err);
//     }
// });

router.get("/profile/:userId", (req, res) => {
    userService.getUserById(req.params.userId, res);
});
// Update USer 
router.patch("/update/:userId", (req, res) => {
    userService.updateUser(req.params.userId, req.body, res);
});
// Delete User
router.delete("/delete/:userId", (req, res) => {
    userService.deleteUser(req.params.userId, res);
});

// Sof Delete User
router.patch("/soft-delete/:userId", (req, res) => {
    const userId = req.params.userId;
    const checkQuery = `SELECT * FROM users WHERE id = ?`;
    connection.execute(checkQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
    });
    const softDeleteQuery = `UPDATE users SET deleted_at = NOW() WHERE id = ?`;
    connection.execute(softDeleteQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json({ message: "User soft deleted successfully", results });
        }
    }
    );

});
// Restore User 
router.patch("/restore/:userId", (req, res) => {
    const userId = req.params.userId;
    const checkQuery = `SELECT * FROM users WHERE id = ?`;
    connection.execute(checkQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
    });
    const restoreQuery = `UPDATE users SET deleted_at = NULL WHERE id = ?`;
    connection.execute(restoreQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json({ message: "User restored successfully", results });
        }
    });
});

// Search Users
router.get("/search", (req, res) => {
    const { search } = req.query;
    const searchQuery = `SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?`;
    const searchTerm = `%${search}%`;
    connection.execute(searchQuery, [searchTerm, searchTerm, searchTerm], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json({ message: "Users found", results });
    });
});


export default router;