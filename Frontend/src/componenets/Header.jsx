import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiRocketFlight } from "react-icons/gi";
import { FaSignOutAlt } from "react-icons/fa";
import { login, logout } from "../redux/actions";
import LoginModal from "./LoginModal";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("travelUser");
    if (saved) {
      try {
        dispatch(login(JSON.parse(saved)));
      } catch {
        localStorage.removeItem("travelUser");
      }
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("travelUser");
  };

  return (
    <header className="w-full p-4 bg-slate-50">
      <nav className="flex items-center justify-between max-w-6xl mx-auto">
        <a href="/" className="text-lg font-bold flex items-center">
          <GiRocketFlight className="text-2xl mr-1 text-indigo-600" /> Flight Booking
        </a>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-slate-700 font-medium">{user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-1.5 rounded font-medium"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-1.5 rounded font-medium cursor-pointer transition-colors"
          >
            Login
          </button>
        )}
      </nav>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </header>
  );
};

export default Header;
