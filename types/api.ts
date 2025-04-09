import { Book } from "./book";

export interface BookListResponse {
  books: Book[];
}

export interface BookDetailResponse {
  book: Book;
}

export interface PurchaseSuccessResponse {
  message: string;
  book: Book;
}

export interface ErrorResponse {
  message: string;
}
