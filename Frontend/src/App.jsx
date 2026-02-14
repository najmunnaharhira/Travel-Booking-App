import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Book from "./componenets/Book";
import Header from "./componenets/Header";
import Table from "./componenets/Table";
import bannerImg from "./assets/banner.jpg";
import { fetchBookings } from "./api";
import { setBookings } from "./redux/actions";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchBookings()
      .then((bookings) => dispatch(setBookings(bookings)))
      .catch(() => dispatch(setBookings([])));
  }, [dispatch]);
  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-center relative" style={{ backgroundImage: `url(${bannerImg})` }}>
      <div className="absolute inset-0 bg-slate-900/40" aria-hidden="true" />
      <Header />
      <section className="relative min-h-screen pb-12">
        <Book />
        <Table />
      </section>
    </div>
  );
}

export default App;
