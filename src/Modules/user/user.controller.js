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

// Soft Delete User
router.patch("/soft-delete/:userId", (req, res) => {
    userService.softDeleteUser(req.params.userId, res);
});
// Restore User 
router.patch("/restore/:userId", (req, res) => {
    userService.restoreUser(req.params.userId, res);
});

// Search Users
router.get("/search", (req, res) => {
    userService.searchUsers(req.query, res);
});


export default router;