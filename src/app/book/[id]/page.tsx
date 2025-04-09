// app/book/[id]/page.tsx
"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Book } from "../../../../types/book";
import { BookDetailResponse, ErrorResponse } from "../../../../types/api";
import PurchaseButton from "@/app/components/PurchaseButton";

// --- Data Fetching Function for a Single Book ---
async function getBookDetails(id: string): Promise<Book | null> {
  try {
    if (!id || isNaN(parseInt(id, 10))) {
      console.warn(`Invalid book ID requested: ${id}`);
      return null;
    }

    const res = await fetch(
      `https://circle-frontend-backend.onrender.com/books/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error(
        `Error fetching book ${id}: ${res.status} ${res.statusText}`
      );
      const errorData: ErrorResponse = await res
        .json()
        .catch(() => ({ message: "Failed to parse error response" }));
      throw new Error(
        `Failed to fetch book details: ${errorData.message || res.statusText}`
      );
    }

    const data: BookDetailResponse = await res.json();

    if (!data || !data.book || typeof data.book.id === "undefined") {
      console.error(
        "Invalid book data structure received from API for ID:",
        id,
        data
      );
      throw new Error("Invalid book data format received");
    }

    return data.book;
  } catch (error) {
    console.error(`An error occurred in getBookDetails for ID ${id}:`, error);
    throw error;
  }
}

// --- Page Component Props ---
interface BookDetailPageProps {
  params: {
    id: string;
  };
}

// --- BookDetailSkeleton Component ---
function BookDetailSkeleton() {
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex animate-pulse">
      <div className="md:w-1/3 bg-gray-200 h-96"></div>
      <div className="p-6 md:w-2/3 flex flex-col space-y-6">
        <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded-md w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
        </div>
        <div className="pt-4 border-t border-gray-200 mt-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 bg-gray-200 rounded-md w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-md w-full mt-4"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-md w-1/4 mt-6"></div>
      </div>
    </div>
  );
}

// --- Page Component (Client Component) ---
export default function BookDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setIsLoading(true);
        const bookData = await getBookDetails(id);

        if (!bookData) {
          router.push("/not-found");
          return;
        }

        setBook(bookData);
      } catch (err) {
        setError("Failed to load book details. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, router]);

  // Generate a color based on book title (if available)
  const getBookColor = () => {
    if (!book) return "from-blue-600 to-indigo-700";

    const colorSeed = book.title.charCodeAt(0) % 5;
    const colorClasses = [
      "from-blue-600 to-indigo-700",
      "from-purple-600 to-pink-600",
      "from-teal-600 to-emerald-600",
      "from-amber-600 to-orange-600",
      "from-rose-600 to-red-600",
    ];

    return colorClasses[colorSeed];
  };

  // Error state
  if (error) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Book List
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BookDetailSkeleton />
        </div>
      </main>
    );
  }

  // If book is somehow not available after loading completed
  if (!book) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back button with animation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md text-gray-700 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Collection
          </Link>
        </motion.div>

        {/* Book details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Hero banner with gradient */}
          <div
            className={`bg-gradient-to-r ${getBookColor()} h-64 relative flex items-end p-8`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]"></div>

            {/* Book title overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative z-10 w-full"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {book.title}
              </h1>
              <p className="text-xl text-white/90 font-medium">
                by {book.author}
              </p>
            </motion.div>
          </div>

          {/* Content section */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left section */}
              <motion.div
                className="md:w-2/3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    About this Book
                  </h2>
                  <p className="text-gray-600">
                    This is where a longer description of the book would go.
                  </p>
                </div>

                {/* Book metadata */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">ISBN</p>
                    <p className="font-mono text-gray-800">{book.isbn}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Stock Status</p>
                    <div className="flex items-center">
                      {book.availableStock > 0 ? (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse mr-2"></div>
                          <p className="font-medium text-green-600">
                            {book.availableStock}{" "}
                            {book.availableStock === 1 ? "copy" : "copies"}{" "}
                            available
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-red-400 mr-2"></div>
                          <p className="font-medium text-red-600">
                            Out of stock
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right section - Purchase area */}
              <motion.div
                className="md:w-1/3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
                  <div className="text-center mb-8">
                    <div className="text-sm text-gray-500 mb-1">Price</div>
                    <div className="text-4xl font-bold text-gray-800">
                      ${book.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Purchase button area */}
                  <PurchaseButton
                    bookId={book.id}
                    initialStock={book.availableStock}
                  />

                  {/* Additional info */}
                  <div className="mt-6 text-xs text-center text-gray-500">
                    Free shipping on orders over $35
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
