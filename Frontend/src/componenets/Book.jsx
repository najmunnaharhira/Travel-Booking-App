/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeBooking } from "../redux/actions";
import { createBooking } from "../api";
import { FaPlus } from "react-icons/fa";

const Book = () => {
  const bookingsCount = useSelector((state) => state.booking?.data?.length ?? 0);
  const dispatch = useDispatch();
  const [bookingData, setBookingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const newBookingData = { ...bookingData };
    newBookingData[e.target.name] = e.target.value;
    setBookingData(newBookingData);
    setError(null);
  };

  const handleBook = async (e) => {
    e?.preventDefault?.();
    if (bookingsCount >= 3) {
      setError("Maximum 3 bookings allowed");
      return;
    }
    if (Object.keys(bookingData).length !== 5) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const created = await createBooking(bookingData);
      dispatch(makeBooking(created));
      setBookingData({});
    } catch (err) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[160px] mx-4 md:mt-[160px] relative">
      <div className="bg-white rounded-md max-w-6xl w-full mx-auto">
        <form className="flex flex-col md:flex-row">
          <div className="py-1.5 px-2.5 flex-1 border-r-2">
            <p>Destination From</p>
            <div className="flex flex-row">
              <select
                className="outline-none px-2 py-2 w-full"
                name="from"
                value={bookingData.from || ""}
                required
                onChange={handleChange}
              >
                <option value="" hidden>
                  Please Select
                </option>
                <option>New York</option>
                <option>London</option>
                <option>Paris</option>
                <option>Rome</option>
              </select>
            </div>
          </div>

          <div className="py-1.5 px-2.5 flex-1 border-r-2">
            <p>Destination To</p>
            <div className="flex flex-row">

              <select
                className="outline-none px-2 py-2 w-full"
                name="to"
                value={bookingData.to || ""}
                required
                onChange={handleChange}
              >
                <option value="" hidden>
                  Please Select
                </option>
                <option>New York</option>
                <option>London</option>
                <option>Paris</option>
                <option>Rome</option>
              </select>
            </div>
          </div>

          <div className="py-1.5 px-2.5 flex-1 border-r-2">
            <p>Journey Date</p>
            <input
              type="date"
              className="outline-none px-2 py-2 w-full"
              name="date"
              value={bookingData.date || ""}
              required
              onChange={handleChange}
            />
          </div>

          <div className="py-1.5 px-2.5 flex-1 border-r-2">
            <p>Guests</p>
            <div className="flex flex-row">
              <select
                className="outline-none px-2 py-2 w-full"
                name="guests"
                value={bookingData.guests || ""}
                required
                onChange={handleChange}
              >
                <option value="" hidden>
                  Please Select
                </option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4 Persons</option>
              </select>
            </div>
          </div>

          <div className="py-1.5 px-2.5 flex-1 border-r-2">
            <p>Class</p>
            <div className="flex flex-row">
              <select
                className="outline-none px-2 py-2 w-full"
                name="ticketclassName"
                value={bookingData.ticketclassName || ""}
                required
                onChange={handleChange}
              >
                <option value="" hidden>
                  Please Select
                </option>
                <option>Business</option>
                <option>Economy</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm px-2 py-1">{error}</p>}
          <button
            type="button"
            onClick={handleBook}
            disabled={loading || bookingsCount >= 3}
            className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2 rounded space-x-2 transition-colors"
          >
            <FaPlus />
            <span className="text-sm">{loading ? "Booking..." : "Book"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Book;
