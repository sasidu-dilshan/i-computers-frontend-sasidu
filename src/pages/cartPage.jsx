import { useState } from "react";
import { addToCart, getCart, getCartTotal } from "../lib/cart";
import getFormattedPrice from "../lib/price-format";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiTrash2, FiMinus, FiPlus, FiArrowRight } from "react-icons/fi";

export default function CartPage() {
  const [cart, setCart] = useState(getCart());

  const handleQuantityChange = (product, delta) => {
    addToCart(product, delta);
    setCart(getCart());
  };

  const totalAmount = getCartTotal(cart);
  const isCartEmpty = cart.length === 0;

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center pb-32">
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66ZM28 100L0 84L0 50L28 66L56 50L56 84L28 100Z' fill='none' stroke='%23ffffff' stroke-width='1.2'/%3E%3C/svg%3E")`,
          backgroundSize: "56px 100px"
        }}
      />

      <div className="w-full max-w-2xl mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent border border-accent/20 text-white">
            <FiShoppingBag className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">Your Cart</h1>
            <p className="text-xs text-slate-400">Review your selected items</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300">
          {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {isCartEmpty ? (
        <div className="w-full max-w-2xl bg-slate-900/50 border border-white/10 rounded-3xl p-10 text-center backdrop-blur-xl flex flex-col items-center justify-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
            <FiShoppingBag className="text-3xl" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">Your cart is empty</h2>
            <p className="text-xs text-slate-400">Looks like you haven't added anything to your cart yet.</p>
          </div>
          <Link
            to="/products"
            className="mt-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-semibold shadow-lg shadow-accent/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Explore Products</span>
            <FiArrowRight />
          </Link>
        </div>
      ) : (

        <div className="w-full max-w-2xl space-y-4">
          {cart.map((item, index) => {
            const hasDiscount = item.product.labelledPrice > item.product.price;
            const itemSubtotal = item.product.price * item.qty;

            return (
              <div
                key={index}
                className="w-full bg-slate-900/60 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-4 hover:border-white/20 transition-all duration-300 shadow-xl"
              >
                <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-950 border border-white/5 flex-shrink-0 relative">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                  {/* {hasDiscount && (
                    <span className="absolute top-1.5 left-1.5 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Sale
                    </span>
                  )} */}
                </div>

                <div className="flex-1 w-full flex flex-col justify-between space-y-3 sm:space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-medium text-white text-sm sm:text-base line-clamp-1">
                        {item.product.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-white/80">
                          {getFormattedPrice(item.product.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs line-through text-slate-500">
                            {getFormattedPrice(item.product.labelledPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-mono text-slate-400 sm:hidden">
                      {getFormattedPrice(itemSubtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-xl overflow-hidden p-0.5">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.product, -1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {item.qty === 1 ? <FiTrash2 className="text-xs text-rose-400" /> : <FiMinus className="text-xs" />}
                      </button>
                      
                      <span className="w-9 text-center text-xs font-bold text-white font-mono">
                        {item.qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.product, 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <FiPlus className="text-xs" />
                      </button>
                    </div>

                    <div className="hidden sm:block text-right">
                      <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                        Subtotal
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {getFormattedPrice(itemSubtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    <div className="w-full h-24 sm:h-28 flex-shrink-0" />

      {!isCartEmpty && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-slate-900/90 border border-white/15 rounded-2xl p-3.5 sm:p-4 backdrop-blur-2xl shadow-2xl flex items-center justify-between gap-4 z-50">
          <div>
            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              Total Price
            </span>
            <span className="text-base sm:text-xl font-bold text-white">
              {getFormattedPrice(totalAmount)}
            </span>
          </div>

          <Link
            state={cart}
            to="/checkout"
            className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-accent/90 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-accent/25 transition-all active:scale-95 flex items-center gap-2 group"
          >
            <span>Checkout</span>
            <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}

    </div>
  );
}
