import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import doodsImg from "@assets/Doods.jpg";
import normiesImg from "@assets/Normies.jpg";
import blobaImg from "@assets/Bloba.jpg";
import supawcoolImg from "@assets/Supawcool.jpg";
import prismImg from "@assets/Prism.jpg";
import mundosImg from "@assets/Mundos.jpg";

interface FrensDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMUNITIES = [
  { name: "D00ds",      image: doodsImg,     greeting: "You're a D00d!" },
  { name: "Normies",    image: normiesImg,   greeting: "You're a Normie!" },
  { name: "Bloba",      image: blobaImg,     greeting: "Bloba's rule!" },
  { name: "Supawcool",  image: supawcoolImg, greeting: "You're Supawcool!" },
  { name: "PrismJolt",  image: prismImg,     greeting: "You're Jolted!" },
  { name: "DelMundos",  image: mundosImg,    greeting: "Junkies❤️Mundos!" },
];

// Google Sheet published as CSV
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvgXm6DGmZWmj-DIgT4VcdkOGMWrJ2C6E4ckf2S551sJpfXQ1VFJUA40lcKtYL5_UnrSpIFQZNSncs/pub?output=csv";

async function checkWalletInSheet(address: string): Promise<{ name: string; image: string; greeting: string } | null> {
  try {
    const response = await fetch(SHEET_CSV_URL);
    const text = await response.text();
    const rows = text.trim().split("\n").map(row => row.split(","));
    const lower = address.toLowerCase();

    for (const row of rows) {
      const wallet = row[0]?.trim().toLowerCase();
      const community = row[1]?.trim();
      if (wallet === lower) {
        const found = COMMUNITIES.find(c => c.name.toLowerCase() === community.toLowerCase());
        return found ?? null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function FrensDialog({ isOpen, onClose }: FrensDialogProps) {
  const [wallet, setWallet] = useState("");
  const [result, setResult] = useState<"idle" | "loading" | "found" | "notfound">("idle");
  const [match, setMatch] = useState<{ name: string; image: string; greeting: string } | null>(null);

  const handleCheck = async () => {
    if (!wallet.trim()) return;
    setResult("loading");
    const found = await checkWalletInSheet(wallet.trim());
    if (found) {
      setMatch(found);
      setResult("found");
    } else {
      setMatch(null);
      setResult("notfound");
    }
  };

  const handleClose = () => {
    setWallet("");
    setResult("idle");
    setMatch(null);
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
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card p-6 sm:p-8 cartoon-border cartoon-shadow-lg text-center"
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted transition-colors"
            >
              <X className="h-6 w-6 text-foreground" />
            </button>

            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Junkies Frens</h2>
            <p className="text-muted-foreground font-medium mb-6">
              Are you a holder of our whitelisted communities?
            </p>

            {/* Partner community images */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {COMMUNITIES.map((c) => (
                <div key={c.name} className="flex flex-col items-center gap-1">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-14 w-14 rounded-xl cartoon-border object-cover"
                  />
                  <span className="text-xs font-bold text-muted-foreground">{c.name}</span>
                </div>
              ))}
            </div>

            {/* Wallet input */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="0x..."
                value={wallet}
                onChange={(e) => {
                  setWallet(e.target.value);
                  setResult("idle");
                }}
                className="font-mono"
              />
              <Button onClick={handleCheck} size="icon" className="flex-shrink-0" disabled={result === "loading"}>
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Result */}
            <AnimatePresence mode="wait">
              {result === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 text-muted-foreground font-bold"
                >
                  Checking...
                </motion.div>
              )}

              {result === "found" && match && (
                <motion.div
                  key="found"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-green-50 cartoon-border"
                >
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <img
                    src={match.image}
                    alt={match.name}
                    className="h-20 w-20 rounded-2xl cartoon-border object-cover"
                  />
                  <p className="font-display text-2xl font-bold text-green-700">{match.greeting}</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Congratulations! You're verified as a Junkies Fren 🎉
                  </p>
                </motion.div>
              )}

              {result === "notfound" && (
                <motion.div
                  key="notfound"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-red-50 cartoon-border"
                >
                  <XCircle className="h-8 w-8 text-red-500" />
                  <p className="font-display text-xl font-bold text-red-600">Not found</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    This wallet isn't on our frens list yet. Check back soon!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}