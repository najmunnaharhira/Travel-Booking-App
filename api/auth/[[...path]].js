// Single handler for /api/auth/login and /api/auth/signup - shared in-memory users
// Vercel: data resets on cold start. Use a database for production.
const USERS = [
  { email: "demo@test.com", password: "demo123", name: "Demo User" },
  { email: "admin@test.com", password: "admin123", name: "Admin" },
];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const path = req.query.path || [];
  const action = path[0] || "";

  if (action === "login") {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    const user = USERS.find(
      (u) => u.email.toLowerCase() === (email || "").toLowerCase() && u.password === password
    );
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    return res.status(200).json({ user: { email: user.email, name: user.name } });
  }

  if (action === "signup") {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password and name required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const lower = (email || "").trim().toLowerCase();
    if (USERS.some((u) => u.email.toLowerCase() === lower)) {
      return res.status(409).json({ error: "Email already registered" });
    }
    USERS.push({ email: lower, password, name: (name || "").trim() });
    return res.status(201).json({ user: { email: lower, name: (name || "").trim() } });
  }

  return res.status(404).json({ error: "Not found" });
}
