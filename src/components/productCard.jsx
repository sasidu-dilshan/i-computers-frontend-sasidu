import { Link } from "react-router-dom";
import getFormattedPrice from "../lib/price-format";

export default function ProductCard(props) {
  const product = props.product;

  return (
    <Link
      to={"/overview/" + product.productId}
      state={product}
      className="group relative w-full max-w-sm h-[480px] bg-white/90 backdrop-blur-md border border-accent/10 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5"
    >
      {/* Discount Badge Overlay */}
      {product.labelledPrice > product.price && (
        <span className="absolute top-3 left-3 z-20 px-2.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase bg-accent/90 backdrop-blur-md rounded-lg shadow-sm border border-white/20">
          Save {getFormattedPrice(product.labelledPrice - product.price)}
        </span>
      )}

      {/* Interactive Dual-Image Frame */}
      <div className="w-full h-[280px] sm:h-[300px] relative overflow-hidden bg-gray-50 border-b border-accent/5">
        {/* Secondary Image (Revealed on Hover) */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Primary Image (Fades out on Hover) */}
        <img
          src={product.images[1]}
          alt={product.name}
          className="primary-image w-full h-full object-cover absolute top-0 left-0 bg-white transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-105"
        />

        {/* Subtle Tech Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Product Details Area */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          {/* Product ID Tag */}
          <span className="inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider text-accent/80 bg-accent/5 rounded border border-accent/10 mb-1.5">
            #{product.productId}
          </span>

          {/* Product Name */}
          <h1 className="text-base font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-accent transition-colors duration-200">
            {product.name}
          </h1>
        </div>

        {/* Price Section */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            {product.labelledPrice > product.price && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {getFormattedPrice(product.labelledPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-accent tracking-tight">
              {getFormattedPrice(product.price)}
            </span>
          </div>

          {/* Action Arrow Icon */}
          <div className="w-8 h-8 rounded-xl bg-accent/5 group-hover:bg-accent text-accent group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
            <svg
              className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
