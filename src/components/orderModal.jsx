import { useContext, useState } from 'react';
import Modal from 'react-modal';
import { getCartTotal, clearCart } from '../lib/cart';
import getFormattedPrice from '../lib/price-format';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';
import UserContext from '../context/userContext';
import { IoClose, IoBagCheckOutline } from 'react-icons/io5';
import { FiUser, FiMapPin, FiPhone, FiFileText, FiShoppingBag } from 'react-icons/fi';

export default function OrderModal(props) {
  const userData = useContext(UserContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [firstName, setFirstName] = useState(userData.user?.firstName || "");
  const [lastName, setLastName] = useState(userData.user?.lastName || "");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  
  const navigate = useNavigate();

  async function handleConfirmOrder() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    const orderData = {
      firstName: firstName,
      lastName: lastName,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      postalCode: postalCode,
      phone: phoneNumber,
      secondaryPhone: secondaryPhoneNumber,
      customerNotes: specialNotes,
      items: []
    };

    for (let i = 0; i < props.cart.length; i++) {
      orderData.items.push({
        productId: props.cart[i].product.productId,
        qty: props.cart[i].qty
      });
    }

    try {
      await api.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      clearCart();

      toast.success("Order placed successfully");
      setModalIsOpen(false);

      navigate("/checkout", { state: [] });

    } catch (err) {
      console.log(err);
      toast.error("Failed to place order");
    }
  }

  return (
    <>
      <button
        onClick={() => setModalIsOpen(true)}
        className="px-5 py-2.5 rounded-xl bg-gray-700 text-white font-medium hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
      >
        <IoBagCheckOutline className="text-lg" />
        <span>Order Now</span>
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        className="outline-none border-none"
        style={{
          overlay: {
            backgroundColor: "rgba(3, 7, 18, 0.82)",
            backdropFilter: "blur(12px)",
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
            maxWidth: "580px",
            maxHeight: "90vh",
            margin: "0 auto",
            padding: "0",
            backgroundColor: "transparent",
            border: "none",
            overflow: "visible",
          },
        }}
      >
        <div className="w-full max-h-[90vh] bg-slate-950/90 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden">

          <div className="sticky top-0 z-20 px-6 py-4 bg-slate-900/80 border-b border-white/10 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent border border-accent/20 text-white">
                <FiShoppingBag className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white tracking-wide">
                  Checkout
                </h2>
                <p className="text-xs text-white/50">
                  Provide your delivery & contact information
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalIsOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 no-scrollbar">

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-900/60 rounded-2xl border border-white/5 text-center">
              <div>
                <span className="block text-[11px] text-white/40 uppercase tracking-wider font-mono">
                  Total Amount
                </span>
                <span className="text-base sm:text-lg font-bold text-white">
                  {getFormattedPrice(getCartTotal(props.cart))}
                </span>
              </div>
              <div className="border-l border-white/5">
                <span className="block text-[11px] text-white/40 uppercase tracking-wider font-mono">
                  Total Items
                </span>
                <span className="text-base sm:text-lg font-semibold text-white">
                  {props.cart.length} {props.cart.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FiUser className="text-white" /> First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FiUser className="text-white" /> Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FiMapPin className="text-white" /> Address Line 1
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FiMapPin className="text-white" /> Address Line 2
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apt 4B / Suite 100"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Colombo"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10100"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FiPhone className="text-white" /> Phone
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FiPhone className="text-white" /> Secondary Phone
                  </label>
                  <input
                    type="text"
                    value={secondaryPhoneNumber}
                    onChange={(e) => setSecondaryPhoneNumber(e.target.value)}
                    placeholder="+94 71 987 6543"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FiFileText className="text-white" /> Special Notes
                </label>
                <textarea
                  rows={3}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Any special instructions for delivery..."
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                />
              </div>

            </form>

          </div>

          <div className="px-6 py-4 bg-slate-900/80 border-t border-white/10 backdrop-blur-xl flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalIsOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-all cursor-pointer border border-white/5"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmOrder}
              className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/50 text-white text-xs font-semibold shadow-lg shadow-accent/25 transition-all cursor-pointer active:scale-95"
            >
              Confirm Order
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
}