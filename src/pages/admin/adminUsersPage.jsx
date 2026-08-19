import { useEffect, useState, useRef } from "react";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadingAnimation";
import BlockUserModal from "../../components/blockUserModal";
import ChangeRoleOfUserModal from "../../components/changeRoleOfUserModal";
import {
  FiUsers,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiCheck,
  FiShield,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiLock,
  FiMail,
} from "react-icons/fi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPageSizeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const token = localStorage.getItem("token");
      api
        .get(`/users/${pageSize}/${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data.users || []);
          setTotalPages(response.data.totalPages || 1);
          setTotalUsers(response.data.totalCount || 0);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [isLoading, pageSize, currentPage]);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setIsPageSizeOpen(false);
    setIsLoading(true);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-2 sm:p-4 md:p-6 flex flex-col gap-6 relative pb-28 font-sans">
      {isLoading && <LoadingAnimation />}

      <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <FiUsers className="text-2xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              User Management
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Manage registered users, roles, and access statuses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold">{totalUsers}</span> Total Users
          </span>

          <button
            onClick={() => {
              setIsLoading(true);
              setCurrentPage(1);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold rounded-xl text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <FiRefreshCw className={`text-xs ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800/80 text-xs font-mono uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4 text-center">User</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Full Name</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Email Status</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {users.map((item) => (
                <tr
                  key={item.email}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4 text-center">
                    <div className="w-10 h-10 mx-auto rounded-full overflow-hidden bg-slate-950 border border-slate-800 group-hover:border-cyan-500/40 transition-colors">
                      <img
                        src={item.image}
                        alt={item.firstName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-400/90 font-medium">
                    <div className="flex items-center gap-2">
                      <FiMail className="text-slate-500" />
                      {item.email}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {item.firstName} {item.lastName}
                  </td>
                  <td className="py-3 px-4">
                    {item.isAdmin ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                        <FiShield /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border bg-slate-800 text-slate-400 border-slate-700">
                        <FiUser /> User
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {item.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <FiCheckCircle /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400/90 font-medium">
                        <FiXCircle /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        item.isBlocked
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.isBlocked ? "bg-rose-400" : "bg-emerald-400"
                        }`}
                      />
                      {item.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <BlockUserModal
                        refresh={() => setIsLoading(true)}
                        user={item}
                      />
                      <ChangeRoleOfUserModal
                        refresh={() => setIsLoading(true)}
                        user={item}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="h-25 w-full pointer-events-none" />

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-xl">
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl backdrop-blur-2xl p-2.5 sm:p-3 shadow-2xl flex items-center justify-between gap-2 text-xs sm:text-sm">
          
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
              setIsLoading(true);
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:hover:bg-white/5 transition-all cursor-pointer border border-white/5 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="text-base" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 rounded-xl px-3 py-1.5 text-slate-200 transition-all cursor-pointer text-xs font-medium"
              >
                <span className="text-slate-400 hidden sm:inline">Show:</span>
                <span className="font-bold text-white">{pageSize}</span>
                <FiChevronDown
                  className={`text-slate-400 text-sm transition-transform duration-200 ${
                    isPageSizeOpen ? "rotate-180 text-cyan-400" : ""
                  }`}
                />
              </button>

              {isPageSizeOpen && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-28 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="text-[10px] uppercase font-mono text-slate-500 px-2.5 py-1">
                    Rows per page
                  </div>
                  {[5, 10, 15, 20].map((size) => (
                    <button
                      key={size}
                      onClick={() => handlePageSizeChange(size)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        pageSize === size
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{size} Items</span>
                      {pageSize === size && <FiCheck className="text-sm" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-4 w-[1px] bg-white/10" />

            <span className="font-mono text-slate-300 text-xs sm:text-sm">
              Page <span className="text-white font-bold">{currentPage}</span> of{" "}
              {totalPages}
            </span>
          </div>

          <button
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              setIsLoading(true);
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:hover:bg-white/5 transition-all cursor-pointer border border-white/5 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}