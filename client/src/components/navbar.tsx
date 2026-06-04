import React from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
// Ensure this import name matches what you use below
import logoPng from "@assets/Logo.png";

const navItems = [
  { href: "/apply", label: "APPLY WL" },
  { href: "/customize", label: "DRESS UP" },
  { href: "/race", label: "RACE" },
];

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: "rgba(10,6,3,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(200,120,40,0.2)",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <Link href="/">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500/60">
            {/* CHANGED logoSrc to logoPng to match the import above */}
            <img src={logoPng} alt="Slogs" className="w-full h-full object-cover" />
          </div>
          <span
            className="text-xl font-black tracking-widest text-orange-400"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            SLOGS
          </span>
        </motion.div>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-lg text-sm font-bold tracking-widest cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-white/70 hover:text-orange-400 hover:bg-orange-500/10"
                }`}
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="flex md:hidden items-center gap-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`px-2 py-1 rounded text-xs font-bold tracking-wider cursor-pointer transition-all ${
                  isActive ? "bg-orange-500 text-white" : "text-white/60 hover:text-orange-400"
                }`}
              >
                {item.label.split(" ")[0]}
              </div>
            </Link>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 rounded-lg text-sm font-bold tracking-wider transition-all hover:bg-orange-500/20"
        style={{
          border: "1px solid rgba(200,120,40,0.4)",
          color: "#f97316",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        CONNECT
      </motion.button>
    </nav>
  );
}
