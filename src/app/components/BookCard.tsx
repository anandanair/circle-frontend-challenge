// BookCard.tsx
import Link from "next/link";
import { Book } from "../../../types/book";
import { motion } from "framer-motion";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const colorSeed = book.title.charCodeAt(0) % 5;
  const colorClasses = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
    "from-teal-500 to-teal-600",
  ];

  const colorClass = colorClasses[colorSeed];

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={item}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
      className="h-full"
    >
      <Link href={`/book/${book.id}`} className="block h-full">
        <div className="rounded-xl shadow-lg overflow-hidden h-full flex flex-col bg-white hover:shadow-xl transition-all duration-300 ease-in-out">
          {/* Colorful banner instead of image */}
          <div className={`h-24 bg-gradient-to-r ${colorClass} relative`}>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>

            {/* Price tag floating on the banner */}
            <div className="absolute -bottom-4 right-4">
              <div className="bg-white rounded-full px-4 py-1 shadow-md flex items-center justify-center">
                <span className="font-bold text-lg text-blue-500">
                  ${book.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-grow flex flex-col">
            <h2 className="text-xl font-bold mb-2 leading-tight text-gray-800 line-clamp-2">
              {book.title}
            </h2>

            <p className="text-gray-600 mb-2 italic">by {book.author}</p>

            <div className="mt-3 mb-6 flex items-center">
              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-md">
                ISBN: {book.isbn}
              </span>
            </div>

            {/* Stock indicator */}
            <div className="mt-auto">
              {book.availableStock > 0 ? (
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">
                    {book.availableStock}{" "}
                    {book.availableStock === 1 ? "copy" : "copies"} in stock
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                  <span className="text-sm font-medium text-red-600">
                    Out of stock
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
