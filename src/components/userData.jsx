import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/userContext";
import { CiUser } from "react-icons/ci";
import { FiChevronDown, FiShoppingBag, FiSettings, FiLogOut } from "react-icons/fi";

export default function UserData() {
  const userData = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    userData.setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const user = userData?.user;

  return (
    <>
      {!user ? (
        <>
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary/90 bg-white/5 p-1.5 px-3 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
            <Link
              to="/login"
              className="px-2.5 py-1 rounded-lg hover:bg-white/15 hover:text-white transition-all duration-200"
            >
              Login
            </Link>
            <span className="text-white/30 font-light">|</span>
            <Link
              to="/register"
              className="px-2.5 py-1 rounded-lg hover:bg-white/15 hover:text-white transition-all duration-200"
            >
              Register
            </Link>
          </div>

          <Link
            className="flex-1 lg:hidden h-full flex flex-col items-center justify-center gap-1 rounded-xl text-accent hover:bg-accent/5 transition-all"
            to="/login"
          >
            <CiUser className="text-2xl stroke-[0.5]" />
            <span className="text-[11px] font-semibold tracking-wider">Login</span>
          </Link>
        </>
      ) : (

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-white/10 transition-all duration-200 focus:outline-none"
          >
            <div className="relative">
             <img src={userData.user.image} alt="Avatar" className="w-[40px] h-[40px] rounded-full border border-white"/>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            <div className="hidden lg:flex flex-col text-left">
              <span className="text-sm font-semibold text-white leading-tight">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[11px] text-white/60 truncate max-w-[120px]">
                {user.email}
              </span>
            </div>

            <FiChevronDown
              className={`text-white/70 text-sm transition-transform duration-200 hidden lg:block ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-white/10 lg:hidden">
                <p className="text-sm font-semibold text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-white/50 truncate">{user.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate("/my-orders");
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <FiShoppingBag className="text-base text-white" />
                  My Orders
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <FiSettings className="text-base text-white" />
                  Settings
                </button>

                <hr className="my-1 border-white/10" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <FiLogOut className="text-base" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
