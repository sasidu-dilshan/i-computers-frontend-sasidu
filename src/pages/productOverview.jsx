import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import LoadingAnimation from "../components/loadingAnimation";
import toast from "react-hot-toast";
import ImageSlideShow from "../components/imageSlideShow";
import { BiCategory } from "react-icons/bi";
import { FaAngleRight, FaShoppingBag, FaBolt, FaStar, FaRegStar } from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import getFormattedPrice from "../lib/price-format";
import { addToCart } from "../lib/cart";

export default function ProductOverview() {
  const params = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state);
  const [loading, setLoading] = useState(!location.state);
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (loading) {
      api
        .get("/products/" + params.productId)
        .then((response) => {
          setProduct(response.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error fetching product details");
          setProduct(null);
          setLoading(false);
        });
    }
  }, [loading, params.productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !userName.trim()) {
      toast.error("Please fill in your name and review content.");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await api.post(`/products/${params.productId}/reviews`, {
        rating,
        comment,
        userName,
      });

      toast.success("Review submitted successfully!");

      setComment("");
      setUserName("");
      setRating(5);

      if (response.data) {
        setProduct(response.data);
      } else {
        setLoading(true);
      }
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-12 flex flex-col items-center overflow-hidden font-sans">
      {/* Background Tech Ambient Glows */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {loading && (
        <div className="min-h-[60vh] flex items-center justify-center relative z-10">
          <LoadingAnimation />
        </div>
      )}

      {product != null && (
        <div className="relative z-10 w-full max-w-6xl flex flex-col gap-8">

          <div className="w-full backdrop-blur-2xl bg-slate-900/70 border border-slate-800/80 rounded-3xl shadow-[0_0_50px_-15px_rgba(0,0,0,0.8)] p-5 sm:p-8 lg:p-10 transition-all duration-300">

            <div className="lg:hidden mb-6">
              <span className="inline-block px-3 py-1 text-[11px] font-mono tracking-wider text-cyan-400 bg-cyan-500/10 rounded-lg border border-cyan-500/20 mb-3">
                #{product.productId}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 leading-tight">
                {product.name}
                {product.altNames?.map((name, index) => (
                  <span key={index} className="font-normal text-slate-400 text-base sm:text-lg">
                    {" "}| {name}
                  </span>
                ))}
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">

              <div className="w-full lg:w-1/2 flex justify-center items-center bg-slate-950/60 rounded-2xl p-4 sm:p-6 border border-slate-800/80 shadow-inner min-h-[300px] sm:min-h-[420px]">
                <ImageSlideShow images={product.images} />
              </div>

              <div className="w-full lg:w-1/2 flex flex-col justify-between">
                <div>

                  <div className="hidden lg:block mb-4">
                    <span className="inline-block px-3 py-1 text-[11px] font-mono tracking-wider text-cyan-400 bg-cyan-500/10 rounded-lg border border-cyan-500/20 mb-3">
                      #{product.productId}
                    </span>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 leading-tight">
                      {product.name}
                    </h1>
                    {product.altNames && product.altNames.length > 0 && (
                      <p className="text-slate-400 text-sm lg:text-base mt-2">
                        {product.altNames.join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 mb-6">
                    <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                      <BiCategory className="text-cyan-400 w-4 h-4" />
                      <span>{product.category}</span>
                    </div>
                    <FaAngleRight className="text-slate-600 text-xs" />
                    <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                      <HiOutlineBadgeCheck className="text-cyan-400 w-4 h-4" />
                      <span>{product.brand}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{product.model}</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-6 flex items-baseline gap-3">
                    <div>
                      {product.labelledPrice > product.price && (
                        <span className="text-sm sm:text-base text-slate-500 line-through font-medium block mb-0.5">
                          {getFormattedPrice(product.labelledPrice)}
                        </span>
                      )}
                      <span className="text-3xl sm:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
                        {getFormattedPrice(product.price)}
                      </span>
                    </div>
                    {product.labelledPrice > product.price && (
                      <span className="ml-auto px-3 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        Save {getFormattedPrice(product.labelledPrice - product.price)}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-6 border-t border-slate-800/80">
                  <button
                    className="flex-1 h-13 lg:h-14 bg-slate-950/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-semibold text-sm sm:text-base rounded-xl hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer flex justify-center items-center gap-2 active:scale-95 shadow-md shadow-cyan-500/5"
                    onClick={() => {
                      addToCart(product, 1);
                      toast.success("Product added to cart");
                    }}
                  >
                    <FaShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => {
                      navigate("/checkout", {
                        state: [
                          {
                            product: {
                              productId: product.productId,
                              name: product.name,
                              price: product.price,
                              labelledPrice: product.labelledPrice,
                              image: product.images[0],
                            },
                            qty: 1,
                          },
                        ],
                      });
                    }}
                    className="flex-1 h-13 lg:h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm sm:text-base rounded-xl transition-all duration-300 cursor-pointer flex justify-center items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95"
                  >
                    <FaBolt className="w-4 h-4" />
                    Buy Now
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div className="w-full backdrop-blur-2xl bg-slate-900/70 border border-slate-800/80 rounded-3xl shadow-xl p-5 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
              Customer Reviews
              <span className="text-sm font-mono font-normal text-cyan-400/80">
                ({product.reviews?.length || 0})
              </span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              <div className="lg:col-span-5 bg-slate-950/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80">
                <h3 className="text-base font-semibold text-slate-200 mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">

                  <div>
                    <label className="block text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-2xl focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          {star <= (hoverRating || rating) ? (
                            <FaStar className="text-amber-400" />
                          ) : (
                            <FaRegStar className="text-slate-700" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kasun Perera"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1.5">
                      Your Feedback
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Share your thoughts about this product..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-md shadow-cyan-500/20 active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, index) => (
                    <div
                      key={index}
                      className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-sm flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 text-sm">{rev.userName}</span>
                        <div className="flex text-amber-400 text-xs gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s}>
                              {s <= rev.rating ? <FaStar /> : <FaRegStar className="text-slate-700" />}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                      {rev.createdAt && (
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-sm">
                    No reviews yet. Be the first to review this product!
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

      {product == null && !loading && (
        <div className="relative z-10 min-h-[50vh] flex flex-col justify-center items-center text-center p-8 backdrop-blur-xl bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 max-w-md w-full shadow-2xl">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Product Not Found</h1>
          <p className="text-slate-400 text-sm mb-6">The requested item could not be retrieved or no longer exists.</p>
          <Link
            to="/products"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/20"
          >
            Return to Products
          </Link>
        </div>
      )}
    </div>
  );
}
