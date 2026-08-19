import { BsBox, BsCart2 } from "react-icons/bs";
import { LuUsersRound } from "react-icons/lu";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import AdminProductsPage from "./admin/adminProductsPage";
import AddProductForm from "./admin/adminAddProductForm";
import EditProductForm from "./admin/adminEditProductForm";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUsersPage from "./admin/adminUsersPage";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";
import { FiMenu, FiX, FiShield, FiLogOut } from "react-icons/fi";

export default function AdminPage() {
  const userData = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!userData.user || !userData.user.isAdmin) {
      navigate("/login");
    }
  }, [userData, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (userData?.setUser) {
      userData.setUser(null);
    }
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", label: "Orders", icon: BsCart2, exact: true },
    { path: "/admin/products", label: "Products", icon: BsBox, exact: false },
    { path: "/admin/users", label: "Users", icon: LuUsersRound, exact: false },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === "/admin" || location.pathname === "/admin/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-x-hidden font-sans">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="md:hidden relative z-20 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="h-8 object-contain" />
          <span className="text-lg font-bold tracking-wide text-slate-100 flex items-center gap-1.5">
            Admin <FiShield className="text-cyan-400 text-sm" />
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-cyan-400 bg-slate-800/60 rounded-xl border border-slate-700/60 transition-colors"
        >
          {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      <aside
        className={`
          fixed md:relative z-30 inset-y-0 left-0 w-72 lg:w-80 bg-slate-900/90 md:bg-slate-900/60 
          backdrop-blur-2xl border-r border-slate-800/80 p-5 flex flex-col justify-between 
          transition-transform duration-300 ease-in-out md:translate-x-0 shrink-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          <div className="flex justify-between m-5 md:flex items-center gap-3 pb-6 mb-6 border-b border-slate-800/80">
            <img src="/logo-white.png" alt="logo" className="h-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                Admin Panel
              </span>
              <span className="text-xs text-slate-500 font-mono">Control Dashboard</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2 mt-2 md:mt-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                    ${
                      active
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent"
                    }
                  `}
                >
                  <Icon className={`text-xl transition-transform group-hover:scale-110 ${active ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
              {userData.user?.name ? userData.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {userData.user?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-slate-500 truncate font-mono">
                {userData.user?.email || "admin@isuri.com"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-20 md:hidden"
        />
      )}

      <main className="relative z-10 flex-1 min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<AdminOrdersPage />} />
          <Route path="/products" element={<AdminProductsPage />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/add-product" element={<AddProductForm />} />
          <Route path="/edit-product" element={<EditProductForm />} />
        </Routes>
      </main>
    </div>
  );
}