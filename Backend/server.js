import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, "data", "bookings.json");
const USERS_FILE = path.join(__dirname, "data", "users.json");

app.use(cors());
app.use(express.json());

// Ensure data directory and file exist
function ensureDataFile() {
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]), "utf8");
  }
}

function readBookings() {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, "utf8");
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeBookings(bookings) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), "utf8");
}

// Demo users + persisted users
function readUsers() {
  ensureDataFile();
  const demo = [
    { email: "demo@test.com", password: "demo123", name: "Demo User" },
    { email: "admin@test.com", password: "admin123", name: "Admin" },
  ];
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(demo, null, 2), "utf8");
    return demo;
  }
  try {
    const saved = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    const merged = [...demo];
    saved.forEach((u) => {
      if (!merged.some((d) => d.email.toLowerCase() === u.email.toLowerCase())) {
        merged.push(u);
      }
    });
    return merged;
  } catch {
    return demo;
  }
}

function writeUsers(users) {
  ensureDataFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

// GET all bookings
app.get("/api/bookings", (req, res) => {
  try {
    const bookings = readBookings();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// POST create booking
app.post("/api/bookings", (req, res) => {
  try {
    const { from, to, date, guests, ticketclassName } = req.body;

    if (!from || !to || !date || !guests || !ticketclassName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const bookings = readBookings();
    if (bookings.length >= 3) {
      return res.status(400).json({ error: "Maximum 3 bookings allowed" });
    }

    const newBooking = {
      id: Date.now().toString(),
      from,
      to,
      date,
      guests,
      ticketclassName,
    };

    bookings.push(newBooking);
    writeBookings(bookings);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// POST login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  const users = readUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json({ user: { email: user.email, name: user.name } });
});

// POST signup
app.post("/api/auth/signup", (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password and name required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: "Email already registered" });
  }
  const newUser = { email: email.trim().toLowerCase(), password, name: name.trim() };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json({ user: { email: newUser.email, name: newUser.name } });
});

// DELETE booking
app.delete("/api/bookings/:id", (req, res) => {
  try {
    const { id } = req.params;
    const bookings = readBookings();
    const filtered = bookings.filter((b) => String(b.id) !== String(id));

    if (filtered.length === bookings.length) {
      return res.status(404).json({ error: "Booking not found" });
    }

    writeBookings(filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
