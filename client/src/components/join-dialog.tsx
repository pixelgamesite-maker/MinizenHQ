import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import popupBg from "@assets/junck.jpg";

interface JoinDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinDialog({ isOpen, onClose }: JoinDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20, rotate: 2 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl cartoon-border cartoon-shadow-lg"
          >
            {/* Background Image Layer */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${popupBg})` }}
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center justify-center p-8 sm:p-12 text-center h-full min-h-[400px]">
              <h2
                className="mb-4 font-display text-4xl sm:text-5xl font-extrabold leading-tight tracking-wider text-white"
                style={{
                  textShadow:
                    "2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 0px 4px 12px rgba(0,0,0,0.8)",
                }}
              >
                Registration Closed
              </h2>

              <p
                className="mb-8 text-lg sm:text-xl font-bold text-white/90"
                style={{
                  textShadow: "1px 1px 0px #000, -1px -1px 0px #000",
                }}
              >
                Junklist registration is now officially closed
              </p>
              
              <div className="mt-auto w-full">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={onClose}
                  className="w-full text-lg py-6 bg-white/90 hover:bg-white backdrop-blur-md"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
