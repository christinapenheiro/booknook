"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, ArrowRight, BookCheck, Users } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  tag: string;
  title: string;
  highlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/slider/v2-storytelling-books-featured-image.png",
    tag: "Welcome to BookNook",
    title: "Add a book, borrow a book,",
    highlight: "return a book.",
    description: "Your friendly online community library. Explore thousands of captivating titles, borrow easily for your reading week, and return at your own pace.",
    primaryCtaText: "Browse All Books",
    primaryCtaLink: "/all-books",
    secondaryCtaText: "Add a Book",
    secondaryCtaLink: "/add-book",
  },
  {
    id: 2,
    image: "/slider/Essential-Books.jpg",
    tag: "Curated Collections",
    title: "Discover Stories That",
    highlight: "Inspire Your World.",
    description: "From gripping fiction and classic literature to groundbreaking science and histories, find books tailored to curious minds.",
    primaryCtaText: "Explore New Arrivals",
    primaryCtaLink: "#new-arrivals",
    secondaryCtaText: "Join BookNook",
    secondaryCtaLink: "/register",
  },
  {
    id: 3,
    image: "/slider/Orhan-Pamuk-Books-credit-Yeshen-Venema10.jpg",
    tag: "Seamless Borrowing",
    title: "A Cozy Sanctuary For",
    highlight: "Passionate Readers.",
    description: "Reserve your next literary adventure in seconds. Keep track of your borrowed books and return them with a single click.",
    primaryCtaText: "View My Borrows",
    primaryCtaLink: "/my-borrows",
    secondaryCtaText: "Browse Collection",
    secondaryCtaLink: "/all-books",
  },
  {
    id: 4,
    image: "/slider/jessica-ruscello-OQSCtabGkSY-unsplash-1.webp",
    tag: "Community Driven",
    title: "Share Knowledge,",
    highlight: "Expand Horizons.",
    description: "Contribute to our collective shelves by adding your favorite books. Build a brighter reading circle for everyone.",
    primaryCtaText: "Contribute a Book",
    primaryCtaLink: "/add-book",
    secondaryCtaText: "Explore Library",
    secondaryCtaLink: "/all-books",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <section
      className="relative w-full h-[580px] sm:h-[620px] lg:h-[680px] overflow-hidden bg-neutral-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Library Highlights Carousel"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className={`object-cover object-center filter brightness-[0.42] transition-transform duration-10000 ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                sizes="100vw"
              />
              {/* Rich warm gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent" />
              {/* Subtle brand tint */}
              <div className="absolute inset-0 bg-[#D99950]/10 mix-blend-color" />
            </div>

            {/* Slide Content */}
            <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D99950]/20 border border-[#D99950]/40 text-[#D99950] text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{slide.tag}</span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] font-serif">
                  {slide.title}{" "}
                  <span className="text-[#D99950] underline decoration-[#D99950]/40 underline-offset-8">
                    {slide.highlight}
                  </span>
                </h1>

                {/* Subtitle / Description */}
                <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-xl">
                  {slide.description}
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.primaryCtaLink}
                    className="px-6 py-3.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white font-semibold text-sm sm:text-base transition-all shadow-lg shadow-[#D99950]/30 hover:shadow-xl hover:shadow-[#D99950]/40 flex items-center gap-2 group"
                  >
                    <span>{slide.primaryCtaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={slide.secondaryCtaLink}
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all hover:border-white/40"
                  >
                    {slide.secondaryCtaText}
                  </Link>
                </div>

                {/* Highlights Counter */}
                <div className="pt-4 grid grid-cols-3 gap-6 max-w-md border-t border-white/15">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-[#D99950]">30+</p>
                    <p className="text-xs text-neutral-400">Available Titles</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white">100%</p>
                    <p className="text-xs text-neutral-400">Free to Borrow</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-[#D99950]">24/7</p>
                    <p className="text-xs text-neutral-400">Digital Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 right-6 sm:right-12 z-30 flex items-center gap-3">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="p-3 rounded-full bg-white/10 hover:bg-[#D99950] text-white border border-white/20 hover:border-[#D99950] backdrop-blur-md transition-all active:scale-95 shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="p-3 rounded-full bg-white/10 hover:bg-[#D99950] text-white border border-white/20 hover:border-[#D99950] backdrop-blur-md transition-all active:scale-95 shadow-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 h-2.5 bg-[#D99950]"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
