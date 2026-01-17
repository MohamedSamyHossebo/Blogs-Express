import connection from "../../DB/connection.js";

export const getAllUsers = (res) => {
    connection.execute("SELECT * FROM users", (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        return res.status(200).json({ message: "success", results });
    });
};

export const getUserById = (userId, res) => {
    const checkQuery = `SELECT First_name, Last_name, email, DOB, phone, gender, YEAR(CURDATE())-YEAR(DOB) AS Age
    FROM users WHERE id = ?`;
    connection.execute(checkQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile fetched successfully", results });
    });
};

export const updateUser = (userId, data, res) => {
    const { first_name, last_name, email, DOB, phone, gender, password } = data;
    const checkQuery = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`;
    connection.execute(checkQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];

        const updateQuery = `
          UPDATE users 
          SET first_name = ?, last_name = ?, email = ?, DOB = ?, phone = ?, gender = ?, password = ?
          WHERE id = ?
        `;

        connection.execute(
            updateQuery,
            [
                first_name ?? user.first_name,
                last_name ?? user.last_name,
                email ?? user.email,
                DOB ?? user.DOB,
                phone ?? user.phone,
                gender ?? user.gender,
                password ?? user.password,
                userId
            ],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                return res.status(200).json({
                    message: "User updated successfully",
                    results
                });
            }
        );
    });
};

export const deleteUser = (user_Id, res) => {
    const userId = user_Id;
    const checkQuery = `SELECT * FROM users WHERE id = ?`;

    connection.execute(checkQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
    });
    const deleteQuery = `DELETE FROM users WHERE id = ?`;
    connection.execute(deleteQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json({ message: "User deleted successfully", results });
        }
    });
};

export const softDeleteUser = (user_Id, res) => {

    const userId = user_Id;
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

};

export const restoreUser = (user_Id, res) => {
    const userId = user_Id;
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
};

export const searchUsers = (query, res) => {
    const { search } = query;
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
}
