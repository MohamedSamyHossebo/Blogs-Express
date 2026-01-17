import mysql from "mysql2";


const getConnection = () => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    connection.connect((err) => {
        if (err) {
            console.log(`Error: ${err.message}`);
        } else {
            console.log("Connected! to  mysql database");
        }
    });

    return connection;
}

export default getConnection();