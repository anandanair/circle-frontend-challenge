"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorResponse, PurchaseSuccessResponse } from "../../../types/api";

interface PurchaseButtonProps {
  bookId: number;
  initialStock: number;
}

export default function PurchaseButton({
  bookId,
  initialStock,
}: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentStock, setCurrentStock] = useState(initialStock);

  // Reset message after some time
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handlePurchase = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `https://circle-frontend-backend.onrender.com/books/${bookId}/purchase`,
        {
          method: "POST",
          headers: {},
        }
      );

      if (!res.ok) {
        const errorData: ErrorResponse = await res
          .json()
          .catch(() => ({ message: "An unknown error occurred." }));
        throw new Error(
          errorData.message || `Failed to purchase: ${res.statusText}`
        );
      }

      // --- Purchase Successful ---
      const successData: PurchaseSuccessResponse = await res.json();
      setMessage(successData.message || "Purchase successful!");
      setCurrentStock(successData.book.availableStock);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Purchase error:", error.message);
        setMessage(`Error: ${error.message}`);
      } else {
        console.error("An unknown purchase error occurred:", error);
        setMessage("An unexpected error occurred during purchase.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || currentStock <= 0;

  return (
    <div className="relative w-full">
      {/* Purchase button area */}
      <AnimatePresence mode="wait">
        {currentStock > 0 ? (
          <motion.div
            key="purchase-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <button
              onClick={handlePurchase}
              disabled={isDisabled}
              className="relative w-full overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 group-hover:from-emerald-600 group-hover:to-green-700 transition-all duration-300 ease-out rounded-lg"></div>

              {/* Button content */}
              <div className="relative flex items-center justify-center py-3 px-6 rounded-lg shadow-lg overflow-hidden">
                {/* Ripple effect on click */}
                {isLoading && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.3 }}
                    animate={{
                      scale: [0, 1.5],
                      opacity: [0.7, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    className="absolute w-10 h-10 bg-white rounded-full"
                  />
                )}

                {/* Button text */}
                <div className="flex items-center">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 mr-3"
                      >
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </motion.div>
                      <span className="text-white font-semibold text-lg">
                        Processing...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-semibold text-lg">
                        Buy Now
                      </span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "loop",
                          repeatDelay: 2,
                        }}
                        className="ml-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </motion.span>
                    </>
                  )}
                </div>
              </div>
            </button>
          </motion.div>
        ) : initialStock > 0 && currentStock <= 0 ? (
          <motion.div
            key="now-out-of-stock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full py-3 px-4 rounded-lg bg-orange-100 border border-orange-300"
          >
            <div className="flex items-center justify-center text-orange-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="font-medium">Now Out of Stock</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="out-of-stock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full py-3 px-4 rounded-lg bg-red-100 border border-red-300"
          >
            <div className="flex items-center justify-center text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium">Currently Out of Stock</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentStock > 0 ? 1 : 0.6 }}
        className="mt-3 flex items-center justify-center"
      >
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{
                scale: index < Math.min(currentStock, 5) ? 1 : 0.4,
                backgroundColor:
                  index < Math.min(currentStock, 5)
                    ? "rgb(34 197 94)" // green-500
                    : "rgb(229 231 235)", // gray-200
              }}
              className="w-2 h-2 rounded-full bg-gray-200"
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-2">
          {currentStock} {currentStock === 1 ? "copy" : "copies"} available
        </span>
      </motion.div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-3 rounded-lg ${
              message.startsWith("Error:")
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <div
              className={`flex items-center ${
                message.startsWith("Error:") ? "text-red-700" : "text-green-700"
              }`}
            >
              {message.startsWith("Error:") ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
