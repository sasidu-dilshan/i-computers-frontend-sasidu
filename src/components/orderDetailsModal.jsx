import { useState } from "react";
import { IoEyeOutline, IoClose } from "react-icons/io5";
import { FiPackage, FiMapPin, FiCalendar, FiFileText, FiPhone } from "react-icons/fi";
import Modal from "react-modal";
import getFormattedPrice from "../lib/price-format";
import formatTimestamp from "../lib/date-format";

export default function OrderDetailsModal(props) {
  const order = props.order;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "pending":
      case "processing":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-accent text-white border-accent/30";
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-accent/40 shadow-sm cursor-pointer"
        title="View Order Details"
      >
        <IoEyeOutline className="text-xl" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        className="outline-none border-none"
        style={{
          overlay: {
            backgroundColor: "rgba(3, 7, 18, 0.8)",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          },
          content: {
            position: "relative",
            inset: "auto",
            width: "100%",
            maxWidth: "520px",
            maxHeight: "85vh",
            margin: "0 auto",
            padding: "0",
            backgroundColor: "transparent",
            border: "none",
            overflow: "visible",
          },
        }}
      >
        <div className="w-full max-h-[85vh] bg-slate-950/90 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden">

          <div className="sticky top-0 z-20 px-6 py-4 bg-slate-900/80 border-b border-white/10 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent border border-accent/20 text-white">
                <FiPackage className="text-xl" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white tracking-wide">
                  Order Details
                </h2>
                <p className="text-xs font-mono text-white/50">
                  ID: #{order?.orderId}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 no-scrollbar">

            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
              <div>
                <span className="block text-[10px] text-white/40 uppercase tracking-wider font-mono">
                  Total
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {getFormattedPrice(order?.totalAmount)}
                </span>
              </div>
              <div className="border-x border-white/5">
                <span className="block text-[10px] text-white/40 uppercase tracking-wider font-mono">
                  Items
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {order?.items?.length || 0}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-white/40 uppercase tracking-wider font-mono">
                  Status
                </span>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadgeStyle(
                    order?.status
                  )}`}
                >
                  {order?.status || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60 bg-white/[0.02] px-4 py-2.5 rounded-xl border border-white/5">
              <FiCalendar className="text-white text-sm flex-shrink-0" />
              <span>Placed on:</span>
              <span className="text-white font-medium">
                {formatTimestamp(order?.date)}
              </span>
            </div>

            <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                <FiMapPin className="text-sm" />
                <span>Shipping Address</span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
                <span className="font-semibold text-white">
                  {order?.firstName} {order?.lastName}
                </span>
                <br />
                {[
                  order?.addressLine1,
                  order?.addressLine2,
                  order?.city,
                  order?.postalCode,
                  order?.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {(order?.phone || order?.secondaryPhone) && (
                <div className="flex items-center gap-2 pt-2 text-xs text-white/60 border-t border-white/5">
                  <FiPhone className="text-white/40" />
                  <span>
                    {order?.phone}
                    {order?.secondaryPhone ? ` / ${order?.secondaryPhone}` : ""}
                  </span>
                </div>
              )}
            </div>

            {order?.customerNotes && (
              <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <FiFileText className="text-sm" />
                  <span>Customer Notes</span>
                </div>
                <p className="text-xs text-white/70 italic leading-relaxed">
                  "{order.customerNotes}"
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 px-1">
                Ordered Items
              </h3>

              <div className="space-y-2">
                {order?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all group"
                  >
                    <img
                      src={item?.product?.image}
                      alt={item?.product?.name || "Product"}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-slate-800 border border-white/10 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate transition-colors">
                        {item?.product?.name}
                      </h4>
                      <p className="text-xs text-white/50 mt-1">
                        {getFormattedPrice(item?.product?.price)} × {item?.qty}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {getFormattedPrice(item?.product?.price * item?.qty)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="px-6 py-3.5 bg-slate-900/80 border-t border-white/10 backdrop-blur-xl flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
}