// Single handler for /api/bookings and /api/bookings/:id - shared in-memory store
// Note: Data resets on cold start. Use Vercel KV or a database for production.
let bookings = [];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const slug = req.query.slug || [];
  const id = slug[0]; // for /api/bookings/123, slug is ['123']

  if (req.method === "GET") {
    return res.status(200).json(bookings);
  }

  if (req.method === "POST") {
    if (id) return res.status(404).json({ error: "Not found" });
    const { from, to, date, guests, ticketclassName } = req.body;
    if (!from || !to || !date || !guests || !ticketclassName) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (bookings.length >= 3) {
      return res.status(400).json({ error: "Maximum 3 bookings allowed" });
    }
    const newBooking = { id: Date.now().toString(), from, to, date, guests, ticketclassName };
    bookings.push(newBooking);
    return res.status(201).json(newBooking);
  }

  if (req.method === "DELETE") {
    if (!id) return res.status(400).json({ error: "Missing id" });
    const before = bookings.length;
    bookings = bookings.filter((b) => String(b.id) !== String(id));
    if (bookings.length === before) return res.status(404).json({ error: "Booking not found" });
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).end();
}
