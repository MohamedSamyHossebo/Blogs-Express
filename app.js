const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "blogs"
});

connection.connect((err) => {
    if (err) {
        console.log(`Error: ${err.message}`);
    } else {
        console.log("Connected! to  mysql database");
    }
});

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Hello From Database!" });
});



app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});