import { useState } from "react";
import { FiTrash2, FiAlertTriangle, FiX } from "react-icons/fi";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function DeleteProductModal(props) {
  const [showModal, setShowModal] = useState(false);
  const refresh = props.refresh;
  const product = props.product;

  async function handleDelete() {
    const token = localStorage.getItem("token");

    try {
      await api.delete(`/products/${product.productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Product deleted successfully");
      refresh();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    } finally {
      setShowModal(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20 cursor-pointer"
        title="Delete Product"
      >
        <FiTrash2 className="w-5 h-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col gap-5 p-5 md:p-6 animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                  <FiAlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Delete Confirmation
                  </h3>
                  <p className="text-xs text-slate-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-300">
                Are you sure you want to permanently delete this product?
              </p>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col gap-1.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Product ID:</span>
                  <span className="text-indigo-400 font-semibold">{product?.productId}</span>
                </div>
                {product?.name && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Name:</span>
                    <span className="text-slate-200 font-sans font-medium truncate max-w-[200px]">
                      {product?.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-all duration-200 hover:border-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}