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
