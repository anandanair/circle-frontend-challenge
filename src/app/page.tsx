"use client";

import { useState, useEffect } from "react";
import { Book } from "../../types/book";
import { BookListResponse } from "../../types/api";
import { BookCard } from "./components/BookCard";
import { motion } from "framer-motion";
import { BookCardSkeleton } from "./components/BookCardSkeleton";

// --- Data Fetching Function ---
async function getBooks(): Promise<Book[]> {
  try {
    const res = await fetch("http://localhost:8000/books", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Error fetching books: ${res.status} ${res.statusText}`);
      throw new Error("Failed to fetch books");
    }

    const data: BookListResponse = await res.json();

    // Basic validation:
    if (!data || !Array.isArray(data.books)) {
      console.error("Invalid data structure received from API:", data);
      throw new Error("Invalid data format received");
    }

    return data.books;
  } catch (error) {
    console.error("An error occurred in getBooks:", error);
    throw error;
  }
}

// --- Page Component (Client Component for animations) ---
export default function HomePage() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const bookData = await getBooks();
        setBooks(bookData);
      } catch (err) {
        setError("Failed to load books. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Book Collection
          </h1>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Explore our carefully curated library of titles from renowned
            authors around the world
          </p>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">Oops!</h2>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && books && books.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">No Books Available</h2>
              <p>Our collection is currently empty. Please check back later.</p>
            </div>
          </motion.div>
        )}

        {/* Books grid */}
        {!isLoading && books && books.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
