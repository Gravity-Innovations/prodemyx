const express = require("express");
const router = express.Router();
const db = require("../database");

// Add new course
router.post("/add", (req, res) => {
    const { 
        title, 
        short_description,
        short_description, 
        long_description, 
        category_id 
    } = req.body;

    if (!title || !category_id) {
        return res.status(400).json({ error: "Title and category are required" });
    }

    const sql = `
        INSERT INTO courses 
        (title, short_description, long_description, category_id)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [title, short_description || null, long_description || null, category_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Course added", courseId: this.lastID });
        }
    );
});


// Get all courses
router.get("/", (req, res) => {
    db.all(
        "SELECT id, title, short_description, long_description, category_id FROM courses",
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// Get all categories
router.get("/categories", (req, res) => {
    db.all("SELECT id, name FROM categories", [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
        } else {
            res.json(rows);
        }
    });
});
