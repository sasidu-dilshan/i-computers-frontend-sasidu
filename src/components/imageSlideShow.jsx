import { useState } from "react";

export default function ImageSlideShow(props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = props.images || [];

  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-[500px] h-[350px] sm:h-[450px] bg-slate-900/60 rounded-3xl border border-white/10 backdrop-blur-xl flex items-center justify-center text-white/40 text-sm">
        No images available
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px] flex flex-col gap-4 p-3 sm:p-4 bg-slate-600/40 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl transition-all">

      <div className="relative w-full h-[320px] sm:h-[420px] rounded-2xl bg-slate-200/80 border border-white/5 overflow-hidden flex items-center justify-center group">
        
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-purple-500/10 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

        <img
          src={images[activeImageIndex]}
          alt={`Slide ${activeImageIndex + 1}`}
          className="w-full h-full object-contain p-4 transition-all duration-300 transform group-hover:scale-[1.02]"
        />

        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[11px] font-mono tracking-wider text-white/80 backdrop-blur-md shadow-lg">
          {activeImageIndex + 1} / {images.length}
        </div>
      </div>

      <div className="w-full flex justify-start sm:justify-center items-center gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
        {images.map((image, index) => {
          const isActive = index === activeImageIndex;
          return (
            <button
              key={index}
              onClick={() => setActiveImageIndex(index)}
              className={`relative flex-shrink-0 w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none ${
                isActive
                  ? "border-2 border-accent shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105 opacity-100 ring-2 ring-accent/30"
                  : "border border-white/10 opacity-50 hover:opacity-100 hover:border-white/30 hover:scale-95"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-contain p-1.5 bg-slate-900/60"
              />

              {isActive && (
                <span className="absolute inset-0 bg-accent/10 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}