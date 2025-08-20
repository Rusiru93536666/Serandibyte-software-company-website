"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";

interface AlertProps {
  type: "success" | "error";
  message: string;
  duration?: number; // duration in ms
  onClose?: () => void;
}

export default function Alert({ type, message, duration = 3000, onClose }: AlertProps) {
  // Automatically close after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed right-5 z-50 flex flex-col items-start gap-2 px-6 py-4 rounded-xl shadow-lg text-white
      ${type === "success" ? "bg-[#00E5FF] border border-[#00E5FF]/50" : "bg-red-500"}
      top-[80px] md:top-5`} // top-80px for mobile, normal 5 for md+
      style={{ minWidth: "250px" }}
    >
      <div className="flex items-center gap-3 w-full">
        {type === "success" ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-auto font-bold hover:opacity-80">
          ×
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-1 rounded-full ${type === "success" ? "bg-white" : "bg-red-200"}`}
          style={{
            animation: `progressBar ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes slide-in {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progressBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        div:first-child {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
