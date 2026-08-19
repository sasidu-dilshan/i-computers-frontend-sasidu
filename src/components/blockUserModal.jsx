import { useState } from "react";
import Modal from "react-modal";
import api from "../lib/api";
import toast from "react-hot-toast";
import {
  FiLock,
  FiUnlock,
  FiX,
  FiAlertTriangle,
  FiUser,
  FiMail,
} from "react-icons/fi";

export default function BlockUserModal(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = props.user;
  const refresh = props.refresh;

  async function changeUserStatus() {
    const token = localStorage.getItem("token");
    try {
      await api.put(
        "/users/status",
        {
          email: user.email,
          isBlocked: !user.isBlocked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `User ${user.isBlocked ? "unblocked" : "blocked"} successfully`
      );
      refresh();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to change user status");
      setIsModalOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
          user.isBlocked
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50"
            : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50"
        }`}
        title={user.isBlocked ? "Unblock User" : "Block User"}
      >
        {user.isBlocked ? (
          <FiUnlock className="text-base" />
        ) : (
          <FiLock className="text-base" />
        )}
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(2, 6, 23, 0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          },
          content: {
            position: "relative",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            background: "transparent",
            border: "none",
            padding: 0,
            maxWidth: "28rem",
            width: "100%",
          },
        }}
      >
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-200">

          <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border ${
                  user.isBlocked
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {user.isBlocked ? (
                  <FiUnlock className="text-xl" />
                ) : (
                  <FiLock className="text-xl" />
                )}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  {user.isBlocked ? "Unblock User" : "Block User"}
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Change security status
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-4">

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-700 overflow-hidden bg-slate-900 flex-shrink-0">
                <img
                  src={user.image}
                  alt={user.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-200 truncate flex items-center gap-1.5">
                  <FiUser className="text-slate-500 text-xs flex-shrink-0" />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono truncate flex items-center gap-1.5 mt-0.5">
                  <FiMail className="text-cyan-400 text-xs flex-shrink-0" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                user.isBlocked
                  ? "bg-emerald-500/5 text-emerald-300/90 border-emerald-500/20"
                  : "bg-rose-500/5 text-rose-300/90 border-rose-500/20"
              }`}
            >
              <FiAlertTriangle className="text-lg flex-shrink-0 mt-0.5" />
              <p>
                Are you sure you want to{" "}
                <span className="font-bold underline uppercase tracking-wide">
                  {user.isBlocked ? "unblock" : "block"}
                </span>{" "}
                this account?{" "}
                {user.isBlocked
                  ? "The user will regain full access to the portal."
                  : "This will restrict the user's access to all services immediately."}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={changeUserStatus}
              className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all cursor-pointer active:scale-95 flex items-center gap-2 ${
                user.isBlocked
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                  : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
              }`}
            >
              {user.isBlocked ? (
                <>
                  <FiUnlock className="text-sm" />
                  <span>Confirm Unblock</span>
                </>
              ) : (
                <>
                  <FiLock className="text-sm" />
                  <span>Confirm Block</span>
                </>
              )}
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
}
