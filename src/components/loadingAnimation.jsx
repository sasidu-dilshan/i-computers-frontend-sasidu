export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-secondary/60 backdrop-blur-md transition-all duration-300">

      <div className="relative flex items-center justify-center">
        <div className="absolute w-44 h-44 rounded-full bg-white/15 blur-2xl animate-pulse" />

        <div className="w-28 h-28 rounded-full border-2 border-dashed border-white/25 animate-[spin_10s_linear_infinite]" />

        <div className="absolute w-20 h-20 rounded-full border-2 border-transparent border-t-white border-b-white/40 animate-[spin_2s_linear_infinite_reverse]" />

        <div className="absolute w-12 h-12 rounded-full border-[3px] border-white/10 border-t-white animate-[spin_1s_ease-in-out_infinite]" />

        <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.8)] animate-pulse" />
      </div>

      <div className="mt-8 flex flex-col items-center gap-1">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/90 drop-shadow-sm">
          Processing
        </span>
        
        <div className="w-20 h-[2px] bg-white/20 rounded-full overflow-hidden mt-1">
          <div className="w-1/2 h-full bg-white animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </div>
      </div>
    </div>
  );
}