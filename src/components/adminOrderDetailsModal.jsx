import { useState } from "react";
import { 
  FiEye, 
  FiX, 
  FiPackage, 
  FiMapPin, 
  FiClock, 
  FiFileText, 
  FiCheckCircle 
} from "react-icons/fi";
import Modal from 'react-modal';
import getFormattedPrice from "../lib/price-format";
import formatTimestamp from "../lib/date-format";
import toast from "react-hot-toast";
import api from "../lib/api";

export default function AdminOrderDetailsModal(props) {
  const refresh = props.refresh;
  const order = props.order;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateOrderStatus() {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");

      await api.put("/orders/" + order.orderId + "/" + status, {}, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      toast.success("Order status updated successfully");
      refresh();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  }

  const customModalStyles = {
    overlay: {
      backgroundColor: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    },
    content: {
      position: 'relative',
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
      width: '100%',
      maxWidth: '640px',
      padding: '0px',
      backgroundColor: 'transparent',
      border: 'none',
      overflow: 'visible'
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 rounded-lg bg-slate-800/80 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/60 transition-all cursor-pointer flex items-center justify-center"
        title="View Order Details"
      >
        <FiEye className="text-base" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customModalStyles}
      >
        <div className="w-full max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">

          <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
                <FiPackage className="text-xl" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  Order Summary
                  <span className="font-mono text-xs text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    #{order.orderId}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {formatTimestamp(order.date)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">

            <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-slate-500">Total Price</span>
                <span className="text-sm sm:text-base font-bold text-cyan-400">{getFormattedPrice(order.totalAmount)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-slate-500">Item Count</span>
                <span className="text-sm sm:text-base font-bold text-white">{order.items?.length || 0} Items</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-slate-500">Current Status</span>
                <span className="text-xs font-semibold text-slate-300 font-mono mt-0.5">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono flex items-center gap-1.5 border-b border-slate-800/60 pb-2">
                <FiMapPin className="text-cyan-400" /> Customer & Shipping Info
              </div>
              
              <div className="space-y-1 text-slate-300 pt-1">
                <div className="font-semibold text-white text-sm">
                  {order.firstName} {order.lastName}
                </div>
                <div className="text-slate-400 leading-relaxed">
                  {order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}, {order.city}, {order.postalCode}, {order.country}
                </div>
                <div className="text-xs font-mono text-cyan-400/90 pt-1">
                  Contact: {order.phone} {order.secondaryPhone ? ` / ${order.secondaryPhone}` : ""}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label htmlFor="order-status-select" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                <FiClock className="text-cyan-400" /> Change Order Status:
              </label>

              <select
                id="order-status-select"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-cyan-500 cursor-pointer transition-colors"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {order.customerNotes && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5 font-semibold">
                  <FiFileText /> Customer Notes
                </div>
                <p className="text-xs text-amber-200/90 italic">
                  "{order.customerNotes}"
                </p>
              </div>
            )}

            <div className="space-y-2.5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono flex items-center gap-1.5">
                <FiPackage className="text-cyan-400" /> Ordered Items ({order.items?.length || 0})
              </div>

              <div className="divide-y divide-slate-800/60 border border-slate-800/60 rounded-xl overflow-hidden bg-slate-950/40">
                {order.items?.map((item, index) => (
                  <div key={index} className="p-3 flex items-center gap-3 hover:bg-slate-800/30 transition-colors">
                    <img
                      src={item.product?.image || item.product?.images?.[0]}
                      alt={item.product?.name || "Product"}
                      className="w-12 h-12 object-cover rounded-xl bg-slate-950 border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate text-xs sm:text-sm">
                        {item.product?.name}
                      </h4>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {getFormattedPrice(item.product?.price)} x {item.qty}
                      </div>
                    </div>
                    <div className="text-right font-bold text-cyan-400 font-mono text-xs sm:text-sm">
                      {getFormattedPrice((item.product?.price || 0) * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {status !== order.status && (
            <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex justify-end">
              <button
                onClick={updateOrderStatus}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <FiCheckCircle className="text-base" />
                <span>{isUpdating ? "Updating..." : "Update Status"}</span>
              </button>
            </div>
          )}

        </div>
      </Modal>
    </>
  );
}