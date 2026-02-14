const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function fetchBookings() {
  const res = await fetch(`${API_BASE}/bookings`);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export async function createBooking(booking) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create booking");
  return data;
}

export async function deleteBooking(id) {
  const res = await fetch(`${API_BASE}/bookings/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete booking");
  }
}
