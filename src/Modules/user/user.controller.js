import { Router } from "express";
import * as userService from "./user.service.js";
const router = Router();

router.get("/", (req, res) => {
    userService.getAllUsers(res);
});

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