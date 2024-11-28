const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE learners (id INTEGER PRIMARY KEY, name TEXT, latitude REAL, longitude REAL, course TEXT)"
  );
});

// Helper function to calculate distance (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Register a learner
app.post("/register-learner", (req, res) => {
  const { name, latitude, longitude, course } = req.body;

  if (!name || !latitude || !longitude || !course) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `INSERT INTO learners (name, latitude, longitude, course) VALUES (?, ?, ?, ?)`;
  db.run(query, [name, latitude, longitude, course], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: "Learner registered successfully" });
  });
});

// Match buddies
app.get("/match-buddies", (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Learner ID is required" });
  }

  const query = `SELECT * FROM learners WHERE id = ?`;
  db.get(query, [id], (err, learner) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!learner) {
      return res.status(404).json({ error: "Learner not found" });
    }

    const matchesQuery = `SELECT * FROM learners WHERE id != ?`;
    db.all(matchesQuery, [id], (err, learners) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const matches = learners.filter((otherLearner) => {
        const distance = calculateDistance(
          learner.latitude,
          learner.longitude,
          otherLearner.latitude,
          otherLearner.longitude
        );
        return distance <= 10; // Match within 10 km
      });

      res.json({ matches });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
