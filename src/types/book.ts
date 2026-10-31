export interface Book {
  _id: string;
  book_title: string;
  author_name: string;
  category: string;
  book_image: globalThis.File | null | string;
  short_description: string;
  rating: number;
  copies_left: number;
  added_by: string;
}
