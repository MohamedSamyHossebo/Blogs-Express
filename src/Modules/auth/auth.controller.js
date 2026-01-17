import { Router } from "express";
import connection from "../../DB/connection.js";
const router = Router();

router.post("/users/create", (req, res) => {
    const { first_name, last_name, email, password, confirm_password, DOB, phone, gender } = req.body;

    // 1. Validation
    if (!first_name || !last_name || !email || !password || !confirm_password || !DOB || !phone || !gender) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 5) {
        return res.status(400).json({ message: "Password must be at least 5 characters long" });
    }
    if (password !== confirm_password) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    // 2. Check if user already exists
    connection.execute("SELECT email FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: "User already exists (Email taken)" });
        }

        // 3. Create user
        const insertQuery = "INSERT INTO users (first_name, last_name, email, password, DOB, phone, gender) VALUES (?, ?, ?, ?, ?, ?, ?)";
        connection.execute(insertQuery, [first_name, last_name, email, password, DOB, phone, gender], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            } else {
                return res.status(201).json({ message: "User created successfully", results });
            }
        });
    });
});
// Login

router.post("/users/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    connection.execute("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: "invalid email or password" });
        }
        return res.status(200).json({ message: "Login successful", results });
    });
});

export default router;