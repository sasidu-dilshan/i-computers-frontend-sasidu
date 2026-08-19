import React, { useEffect, useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import LoadingAnimation from "../components/loadingAnimation";
import { 
  FiCpu, 
  FiShield, 
  FiTruck, 
  FiHeadphones, 
  FiAward, 
  FiUsers, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock,
  FiZap,
  FiCheckCircle
} from "react-icons/fi";

export default function AboutPage() {
  const stats = [
    { label: "Happy Gamers & Pros", value: "10K+", icon: FiUsers },
    { label: "Custom Rigs Built", value: "3,500+", icon: FiCpu },
    { label: "Years Experience", value: "8+", icon: FiAward },
    { label: "Genuine Warranty", value: "100%", icon: FiShield },
  ];

  const features = [
    {
      icon: FiCpu,
      title: "Custom PC Building",
      description: "Tailor-made high-performance gaming rigs, editing workstations, and office setups crafted to your exact budget and performance needs.",
    },
    {
      icon: FiShield,
      title: "100% Genuine Warranty",
      description: "Direct official agent warranty for all hardware components including GPUs, CPUs, Motherboards, and Peripherals.",
    },
    {
      icon: FiTruck,
      title: "Islandwide Express Delivery",
      description: "Safe, insured, and fast delivery right to your doorstep with customized shock-proof protective packaging.",
    },
    {
      icon: FiHeadphones,
      title: "Expert Technical Support",
      description: "Dedicated tech support team available for hardware troubleshooting, BIOS updates, driver setups, and upgrade advice.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-10 flex flex-col gap-12 font-sans overflow-x-hidden">
      
      <section className="relative w-full rounded-3xl bg-slate-900/60 border border-white/10 p-6 sm:p-12 md:p-16 backdrop-blur-2xl overflow-hidden shadow-2xl flex flex-col items-center text-center gap-6">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/50 border border-accent/30 text-white text-xs font-mono font-medium tracking-wide">
          <FiZap className="text-sm animate-pulse" /> NEXT-GEN HARDWARE & RIGS
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          Empowering Your Tech Experience with Precision & Power
        </h1>

        <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
          We are your ultimate tech destination, specializing in high-performance custom gaming PCs, genuine computer components, laptop solutions, and professional workstation hardware.
        </p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-xl flex flex-col items-center text-center gap-2 hover:border-accent/40 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-slate-800/80 border border-white/5 text-white group-hover:scale-110 transition-transform duration-300">
                <Icon className="text-xl sm:text-2xl" />
              </div>
              <span className="text-2xl sm:text-4xl font-extrabold font-mono text-white mt-1">
                {item.value}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium">
                {item.label}
              </span>
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why Choose Us?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            We don't just sell hardware — we craft high-performance experiences tailored to your passionate gaming and professional workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between hover:border-accent/50 hover:bg-slate-900/90 transition-all duration-300 shadow-lg group"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-white text-xl group-hover:bg-accent transition-all duration-300">
                    <Icon />
                  </div>
                  <h3 className="text-lg font-bold text-white transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 backdrop-blur-xl flex flex-col items-center justify-center text-center w-full shadow-2xl">
        <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
    
          <span className="text-xs font-mono uppercase text-white tracking-widest">
            Our Mission
          </span>

        <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
          Built by Tech Enthusiasts, for Tech Enthusiasts.
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
          Founded with a passion for extreme hardware performance, we started as a small team of gamers and PC modders. Today, we have grown into a premier computer store trusted by thousands of gamers, content creators, and corporate clients across Sri Lanka.
        </p>

        <div className="flex flex-col gap-3 w-full mt-4">
          {[
            "Official brand warranty & direct replacement support",
            "Stress-tested PC builds with clean cable management",
            "Unmatched prices for genuine tech products"
          ].map((text, i) => (
            <div 
              key={i} 
              className="w-full py-3 px-4 rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-center gap-2.5 text-xs sm:text-sm text-slate-200"
            >
              <FiCheckCircle className="text-white shrink-0 text-base" />
              <span>{text}</span>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-xl text-white text-xl border border-white/5">
            <FiMapPin />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase font-mono">Store Address</h4>
            <p className="text-xs sm:text-sm font-medium text-white mt-0.5">123, Colombo 03</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-xl text-white text-xl border border-white/5">
            <FiPhone />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase font-mono">Hotline</h4>
            <p className="text-xs sm:text-sm font-medium text-white mt-0.5">+94 77 123 4567</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-xl text-white text-xl border border-white/5">
            <FiMail />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase font-mono">Email Us</h4>
            <p className="text-xs sm:text-sm font-medium text-white mt-0.5">support@icomputers.lk</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-xl text-white text-xl border border-white/5">
            <FiClock />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase font-mono">Working Hours</h4>
            <p className="text-xs sm:text-sm font-medium text-white mt-0.5">Mon - Sat: 9:00 AM - 7:00 PM</p>
          </div>
        </div>
      </section>

    </div>
  );
}