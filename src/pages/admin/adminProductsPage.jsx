import { useEffect, useState, useRef } from "react";
import { FaPlus, FaSync } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { CiEdit } from "react-icons/ci";
import LoadingAnimation from "../../components/loadingAnimation";
import DeleteProductModal from "../../components/deleteProductModal";
import getFormattedPrice from "../../lib/price-format";
import { 
  FiBox, 
  FiTag, 
  FiChevronLeft, 
  FiChevronRight, 
  FiChevronDown, 
  FiCheck 
} from "react-icons/fi";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
      api.get("/products").then((response) => {
        setProducts(response.data || []);
        setIsLoading(false);
      });
    }
  }, [isLoading]);

  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setIsPageSizeOpen(false);
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-6 p-2 sm:p-4 md:p-6 text-slate-100 font-sans relative pb-28">

      <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {isLoading && <LoadingAnimation />}

        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <FiBox className="text-2xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              Product Inventory
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Manage and monitor all items in your store
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-2">
            <FiTag className="text-sm" />
            <span className="font-bold">{products.length}</span> Total Items
          </span>

          <button
            onClick={() => {
              setIsLoading(true);
              setCurrentPage(1);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold rounded-xl text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <FaSync className={`text-xs ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800/80 text-xs font-mono uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4 text-center">Image</th>
                <th className="py-4 px-4">Product ID</th>
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Pricing</th>
                <th className="py-4 px-4 text-center">Stock</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Brand / Model</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {currentProducts.map((item) => (
                <tr
                  key={item.productId}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4 text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group-hover:border-cyan-500/40 transition-colors">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-400/90 font-medium">
                    #{item.productId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200 max-w-[200px] truncate">
                    {item.name}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-100">
                        {getFormattedPrice(item.price)}
                      </span>
                      {item.labelledPrice && (
                        <span className="text-[11px] text-slate-500 line-through font-mono">
                          {getFormattedPrice(item.labelledPrice)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium text-slate-300">
                    {item.stock}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border ${
                        item.isAvailable
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.isAvailable ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                      />
                      {item.isAvailable ? "Available" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-medium">
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 text-[11px] text-slate-300 border border-slate-700/50">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-medium">
                        {item.brand}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {item.model}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        state={item}
                        to="/admin/edit-product"
                        className="p-2 rounded-lg bg-slate-800/80 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/60 transition-all text-base"
                        title="Edit Product"
                      >
                        <CiEdit />
                      </Link>

                      <DeleteProductModal
                        product={item}
                        refresh={() => {
                          setIsLoading(true);
                        }}
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

      <div className="fixed bottom-6 right-6 -translate-x-1/2 z-30 w-[92%] max-w-xl">
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl backdrop-blur-2xl p-2.5 sm:p-3 shadow-2xl flex items-center justify-between gap-2 text-xs sm:text-sm">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:hover:bg-white/5 transition-all cursor-pointer border border-white/5 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight className="text-base" />
          </button>
        </div>
      </div>

      <Link
        to="/admin/add-product"
        className="fixed right-6 bottom-6 z-40 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full text-xl flex justify-center items-center shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-300 active:scale-95 border border-cyan-400/30 group"
        title="Add New Product"
      >
        <FaPlus className="transition-transform group-hover:rotate-90 duration-300" />
      </Link>
    </div>
  );
}