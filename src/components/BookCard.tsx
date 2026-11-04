import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types/book";
import { Star, BookOpen, Layers, ArrowRight } from "lucide-react";

interface BookCardProps {
  _id: string;
  book_title: string;
  author_name: string;
  category: string;
  book_image: string;
  short_description: string;
  rating: number;
  copies_left: number;
  added_by: string;
}

export default function BookCard({ book }: {book : BookCardProps}) {
  // const [imgError, setImgError] = useState(false);
  const url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const imageSrc = book.book_image.startsWith("http")
    ? book.book_image
    : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${book.book_image}`;

  return (
    <div className="group relative bg-white rounded-2xl border border-neutral-200/80 hover:border-[#D99950]/50 shadow-xs hover:shadow-xl hover:shadow-[#D99950]/10 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Book Cover Image Container */}
      <div className="relative w-full pt-[135%] bg-neutral-100 overflow-hidden">
        <Image
          src={
            imageSrc
            // book.book_image.startsWith("http")
            //   ? book.book_image
            //   : `/${url}${book.book_image}`
          }
          alt={book.book_title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-neutral-800 border border-[#D99950]/30 shadow-xs backdrop-blur-md">
            {book.category}
          </span>
        </div>

        {/* Rating or Copies Left badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-900/85 text-[#D99950] backdrop-blur-md shadow-xs">
            <Star className="w-3.5 h-3.5 fill-[#D99950] text-[#D99950]" />
            <span>{book.rating ? Number(book.rating).toFixed(1) : "4.5"}</span>
          </div>
        </div>

        {/* Copies status overlay on hover */}
        {/* <div className="absolute bottom-2 right-2 z-10">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-950/70 text-white backdrop-blur-xs">
            <Layers className="w-3 h-3 text-[#D99950]" />
            {book.copies_left > 0
              ? `${book.copies_left} copies left`
              : "Out of stock"}
          </span>
        </div> */}
      </div>

      {/* Book Metadata */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div className="space-y-2">
          {/* Author Name */}
          <p className="text-xs font-medium text-[#D99950] tracking-wide uppercase">
            {book.author_name}
          </p>

          {/* Book Title */}
          <h3 className="font-serif text-lg font-bold text-neutral-900 group-hover:text-[#D99950] transition-colors line-clamp-1">
            {book.book_title}
          </h3>

          {/* Short Description */}
          {book.short_description && (
            <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
              {book.short_description}
            </p>
          )}
        </div>

        {/* Actions / View Details Button */}
        <div className="pt-4 mt-3 border-t border-neutral-100 flex items-center justify-between">
          <Link
            href={`/books/${book._id}`}
            prefetch={false}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-50 hover:bg-[#D99950] text-neutral-800 hover:text-white font-medium text-sm transition-all border border-neutral-200/70 hover:border-[#D99950] shadow-2xs hover:shadow-md hover:shadow-[#D99950]/20 group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 text-[#D99950] group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
