import { Router } from "express";
import * as authService from "./auth.service.js";
const router = Router();

router.post("/create", (req, res) => {
    authService.signUp(req.body, res);
});
// Login

router.post("/login", (req, res) => {
    authService.login(req.body, res);
});

export default router;