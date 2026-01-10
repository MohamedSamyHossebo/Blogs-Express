const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "blog_app"
});

connection.connect((err) => {
    if (err) {
        console.log(`Error: ${err.message}`);
    } else {
        console.log("Connected! to  mysql database");
    }
});



app.get("/", (req, res) => {
    connection.query("SELECT * FROM users", (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json({ message: "success", results });
        }
    });
});



app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});