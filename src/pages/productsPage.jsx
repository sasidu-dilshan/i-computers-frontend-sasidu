import { useEffect, useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import LoadingAnimation from "../components/loadingAnimation";
import ProductCard from "../components/productCard";
import { FiRefreshCcw, FiSearch } from "react-icons/fi";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (loading) {
      api
        .get("/products")
        .then((response) => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error fetching products");
          setLoading(false);
        });
    }
  }, [loading]);

  async function handleSearch() {
    if (!query.trim()) {
      setLoading(true);
      return;
    }
    setSearching(true);
    try {
      const response = await api.get(`/products/search/` + query);
      setProducts(response.data);
    } catch {
      toast.error("Error searching products");
    }
    setSearching(false);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center overflow-hidden font-sans">

      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mb-12 flex flex-col items-center">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center backdrop-blur-2xl bg-slate-900/70 p-3 sm:p-4 rounded-2xl border border-slate-800/80 shadow-[0_0_40px_-15px_rgba(0,0,0,0.7)]">

          <div className="relative w-full sm:w-[450px] flex items-center">
            <FiSearch className="absolute left-4 w-5 h-5 text-slate-500 pointer-events-none transition-colors group-focus-within:text-cyan-400" />
            <input
              type="text"
              placeholder="Search in IComputers"
              className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 font-medium text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleSearch}
              disabled={searching || loading}
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:cursor-pointer hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>

            <button
              onClick={() => {
                setQuery("");
                setLoading(true);
              }}
              title="Refresh Catalog"
              className="p-3 bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 active:scale-95 group"
            >
              <FiRefreshCcw className="w-5 h-5 group-hover:text-cyan-400 group-hover:rotate-180 hover:cursor-pointer transition-all duration-500" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl px-2">
        {loading || searching ? (
          <div className="py-24 flex justify-center items-center">
            <LoadingAnimation />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {products.map((product) => (
              <div key={product.productId} className="flex justify-center">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Card */
          <div className="py-16 text-center flex flex-col items-center backdrop-blur-xl bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 px-8 mx-auto max-w-md shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center mb-4 border border-slate-700/50">
              <FiSearch className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-300 font-medium mb-4 text-sm">
              No products matched your criteria.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setLoading(true);
              }}
              className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold uppercase tracking-wider underline underline-offset-4 transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}