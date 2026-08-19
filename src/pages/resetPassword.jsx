import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingAnimation from "../components/loadingAnimation";
import toast from "react-hot-toast";
import api from "../lib/api";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  async function handleOTPRequest() {
    setIsLoading(true);
    try {
      await api.post("/users/otp", { email: email });
      setIsOtpSent(true);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  }

  async function handlePasswordReset() {
    setIsLoading(true);
    try {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        setIsLoading(false);
        return;
      }

      await api.post("/users/reset-password", {
        email: email,
        otp: otp,
        newPassword: newPassword,
      });
      navigate("/login");
      toast.success("Password reset successful");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 bg-[url('/bg.jpg')] bg-cover bg-center flex justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Dark Overlay with Blur */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-0" />

      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 flex flex-col items-center gap-6">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="p-2 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            <img src="logo-white.png" alt="Logo" className="w-28 h-12 object-contain" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isOtpSent ? (
                <span>
                  Enter code sent to <span className="text-slate-200 font-mono">{email}</span>
                </span>
              ) : (
                "Enter your email address to receive a verification code"
              )}
            </p>
          </div>
        </div>

        {/* Dynamic Form Sections */}
        {isOtpSent ? (
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp" className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                OTP Code
              </label>
              <input
                type="text"
                name="otp"
                id="otp"
                placeholder="Enter 6-digit OTP"
                className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="••••••••"
                className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="••••••••"
                className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handlePasswordReset}
              className="w-full h-11 bg-accent hover:opacity-90 active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-accent/20 cursor-pointer mt-2"
            >
              Reset Password
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="user@gmail.com"
                className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={handleOTPRequest}
              className="w-full h-11 bg-accent hover:opacity-90 active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-accent/20 cursor-pointer mt-2"
            >
              Send Reset Code
            </button>
          </div>
        )}

        {/* Back to Login Link */}
        <p className="text-xs text-slate-400 text-center mt-1">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-white hover:underline font-semibold transition-colors ml-1"
          >
            Back to Login
          </Link>
        </p>

      </div>

      {isLoading && <LoadingAnimation />}
    </div>
  );
}