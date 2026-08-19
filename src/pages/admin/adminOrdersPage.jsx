import { useEffect, useState, useRef } from "react";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadingAnimation";
import getFormattedPrice from "../../lib/price-format";
import formatTimestamp from "../../lib/date-format";
import AdminOrderDetailsModal from "../../components/adminOrderDetailsModal";
import { 
  FiRefreshCw, 
  FiShoppingBag, 
  FiPackage, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCalendar, 
  FiMapPin, 
  FiUser, 
  FiChevronDown, 
  FiCheck 
} from "react-icons/fi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

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
    if (!isLoading) return;

    const token = localStorage.getItem("token");
    api.get(`/orders/${pageSize}/${currentPage}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log(response.data);
      setOrders(response.data.orders || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalOrders(response.data.totalCount || 0);
      setIsLoading(false);
    }).catch((err) => {
      console.error(err);
      setIsLoading(false);
    });
  }, [isLoading, pageSize, currentPage]);

  const getStatusBadge = (status) => {
    const lower = status?.toLowerCase() || "";
    if (lower.includes("deliver") || lower.includes("complet")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    } else if (lower.includes("pend") || lower.includes("process")) {
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    } else if (lower.includes("cancel") || lower.includes("reject")) {
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
    return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  };

  const handlePageSizeChange = (size) => {
    setPageSize(Number(size));
    setCurrentPage(1);
    setIsPageSizeOpen(false);
    setIsLoading(true);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 flex flex-col gap-6 relative font-sans">

      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <FiShoppingBag className="text-2xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              Orders Management
              {isLoading && <LoadingAnimation />}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Monitor, review, and handle all customer purchases
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs sm:text-sm font-mono text-cyan-400">
            Total: <span className="text-white font-bold">{totalOrders}</span>
          </span>

          <button
            onClick={() => setIsLoading(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs sm:text-sm font-semibold rounded-xl text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <FiRefreshCw className={`text-base ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="hidden lg:block w-full overflow-hidden bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800/80 text-xs font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-4 px-4 text-center">Order ID</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4 text-center">Items</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Total</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((item) => (
                <tr key={item.orderId} className="hover:bg-slate-800/40 transition-colors duration-200">
                  <td className="py-4 px-4 text-center font-mono font-medium text-cyan-400">
                    #{item.orderId}
                  </td>
                  <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                    {formatTimestamp(item.date)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-white">{item.firstName} {item.lastName}</div>
                    <div className="text-xs text-slate-500 font-mono">{item.email}</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-slate-300">{item.city}</div>
                    <div className="text-xs text-slate-500">{item.phone}</div>
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-white">
                    {item.items?.length || 0}
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-white whitespace-nowrap">
                    {getFormattedPrice(item.totalAmount)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <AdminOrderDetailsModal order={item} refresh={() => setIsLoading(true)} />
                  </td>
                </tr>
              ))}

              {orders.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
          {orders.map((item) => (
            <div 
              key={item.orderId} 
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Order ID</span>
                  <span className="font-mono font-bold text-cyan-400 text-base">#{item.orderId}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1.5"><FiCalendar className="text-cyan-400" /> Date</span>
                  <span className="font-medium text-slate-200">{formatTimestamp(item.date)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1.5"><FiUser className="text-cyan-400" /> Customer</span>
                  <span className="font-medium text-slate-200">{item.firstName} {item.lastName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1.5"><FiMapPin className="text-cyan-400" /> Location</span>
                  <span className="font-medium text-slate-200">{item.city} ({item.phone})</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1.5"><FiPackage className="text-cyan-400" /> Items</span>
                  <span className="font-semibold text-white">{item.items?.length || 0} items</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Amount</span>
                  <span className="text-base font-bold text-white">{getFormattedPrice(item.totalAmount)}</span>
                </div>
                <AdminOrderDetailsModal order={item} refresh={() => setIsLoading(true)} />
              </div>
            </div>
          ))}

          {orders.length === 0 && !isLoading && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
              No orders found.
            </div>
          )}
        </div>
      </div>

      <div className="h-32 w-full pointer-events-none" />

      <div className="fixed bottom-6 right-6 -translate-x-1/2 z-30 w-[92%] max-w-xl">
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
                <FiChevronDown className={`text-slate-400 text-sm transition-transform duration-200 ${isPageSizeOpen ? "rotate-180 text-cyan-400" : ""}`} />
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
              Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
            </span>
          </div>

          <button
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
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
