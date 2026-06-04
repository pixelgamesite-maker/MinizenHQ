import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import bgSrc from "@assets/Background.png";

interface StatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

async function checkStatus(wallet: string): Promise<boolean> {
  try {
    const response = await fetch("/api/check-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });
    const data = await response.json();
    return data.found;
  } catch {
    return false;
  }
}

export function StatusDialog({ isOpen, onClose }: StatusDialogProps) {
  const [wallet, setWallet] = useState("");
  const [result, setResult] = useState<"idle" | "loading" | "found" | "notfound">("idle");

  const handleCheck = async () => {
    if (!wallet.trim()) return;
    setResult("loading");
    const found = await checkStatus(wallet.trim());
    setResult(found ? "found" : "notfound");
  };

  const handleClose = () => {
    setWallet("");
    setResult("idle");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl cartoon-border cartoon-shadow-lg text-center"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bgSrc})` }}
            />
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>

              <h2 className="font-display text-3xl font-bold text-white mb-2">Check Status</h2>
              <p className="text-white/70 font-medium mb-6">
                Enter your EVM wallet to see if you're Junklisted!
              </p>

              {/* Wallet input */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="0x..."
                  value={wallet}
                  onChange={(e) => {
                    setWallet(e.target.value);
                    setResult("idle");
                  }}
                  className="font-mono bg-white/90"
                />
                <Button
                  onClick={handleCheck}
                  size="icon"
                  className="flex-shrink-0 bg-white text-foreground hover:bg-white/80"
                  disabled={result === "loading"}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              {/* Result */}
              <AnimatePresence mode="wait">
                {result === "loading" && (
                  <motion.p
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-white font-bold py-4"
                  >
                    Checking...
                  </motion.p>
                )}

                {result === "found" && (
                  <motion.div
                    key="found"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-green-500/20 backdrop-blur-sm border border-green-400/40"
                  >
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                    <p className="font-display text-2xl font-bold text-white">
                      Congratulations! 🎉
                    </p>
                    <p className="font-bold text-green-300 text-lg">
                      You're Junklisted!
                    </p>
                    <img
                      src={bgSrc}
                      alt="Junklisted"
                      className="h-24 w-24 rounded-2xl cartoon-border object-cover mt-2"
                    />
                  </motion.div>
                )}

                {result === "notfound" && (
                  <motion.div
                    key="notfound"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-red-500/20 backdrop-blur-sm border border-red-400/40"
                  >
                    <XCircle className="h-10 w-10 text-red-400" />
                    <p className="font-display text-xl font-bold text-white">Not found</p>
                    <p className="text-white/70 font-medium text-sm">
                      This wallet isn't Junklisted yet. Keep grinding!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}