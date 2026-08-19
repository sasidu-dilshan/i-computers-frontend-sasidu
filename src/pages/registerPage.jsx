import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  function handleRegister() {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    api
      .post("/users/", {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      })
      .then(() => {
        toast.success("Registration successful");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Registration failed");
      });
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex justify-center items-center p-4 overflow-hidden font-sans">

      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4ms_4ms] pointer-events-none" />

      <div className="relative w-full max-w-md backdrop-blur-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] rounded-2xl p-8 flex flex-col items-center z-10 transition-all duration-300">

        <div className="relative group mb-2">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <img
            src="logo-white.png"
            alt="Logo"
            className="relative w-[155px] h-[65px] object-cover rounded-lg"
          />
        </div>

        <h2 className="text-2xl font-bold text-white tracking-wide mt-2">
          Create Account
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Join us and experience the next-gen platform
        </p>

        <div className="w-full mb-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full h-11 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 px-3.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
            placeholder="user@gmail.com"
          />
        </div>

        <div className="w-full flex gap-3 mb-4">
          <div className="w-1/2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              First Name
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              className="w-full h-11 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 px-3.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              placeholder="John"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Last Name
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              className="w-full h-11 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 px-3.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="w-full mb-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full h-11 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 px-3.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
            placeholder="••••••••"
          />
        </div>

        <div className="w-full mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            className="w-full h-11 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 px-3.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:cursor-pointer text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all duration-200"
        >
          Register
        </button>

        <p className="w-full text-center text-xs text-slate-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 font-semibold hover:underline hover:text-cyan-300 transition-colors"
          >
            Log in here
          </Link>
        </p>

        <div className="w-full flex items-center my-5">
          <div className="flex-1 border-t border-slate-800"></div>
          <span className="px-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">
            OR
          </span>
          <div className="flex-1 border-t border-slate-800"></div>
        </div>

        <button className="w-full h-11 bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 hover:cursor-pointer text-slate-300 font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98]">
          <FcGoogle className="text-xl" />
          <span className="text-sm">Register with Google</span>
        </button>
      </div>
    </div>
  );
}