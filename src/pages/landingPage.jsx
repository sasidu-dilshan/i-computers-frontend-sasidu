import { Link } from "react-router-dom";
import { FiShoppingBag, FiCpu, FiShield, FiTruck, FiArrowRight } from "react-icons/fi";

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center overflow-hidden font-sans">

      <video
        src="/bg-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover absolute top-0 left-0 z-0 scale-105 filter"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950 z-10" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-10" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center my-auto">

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md mb-6 shadow-lg shadow-cyan-500/10">
          <FiCpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-medium text-cyan-300 tracking-wider uppercase">
            Next-Gen Hardware & Computing
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-100 leading-tight sm:leading-none mb-6">
          Welcome to Isuri Computers
        </h1>

        <p className="text-white text-base sm:text-xl max-w-2xl font-normal leading-relaxed mb-10 text-balance">
          Your one-stop destination for high-performance PC components, custom gaming gear, and cutting-edge tech solutions.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <Link
            to="/products"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-base rounded-2xl shadow-xl shadow-cyan-500/25 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 group"
          >
            <FiShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Shop Now</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-8 border-t border-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <FiShield className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-300">Genuine Brand Warranty</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <FiTruck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-300">Islandwide Express Delivery</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <FiCpu className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-300">Custom PC Building</span>
        </div>
        </div>

      </div>

    </div>
  );
}