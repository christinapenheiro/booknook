<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook Project Guidelines & Architecture

## 1. Project Overview
**BookNook** is a cozy, modern online community library.
- **Core Motto & Concept:** *“Add a book, borrow a book, return a book.”*
- **Primary Objective:** Provide a seamless, aesthetic experience for discovering books, borrowing them for a set duration, returning them, and contributing new titles.

---

## 2. Design System & Brand Identity
- **Primary Brand Color:** `#D99950` (Warm Amber / Golden Honey)
- **Palette Tokens:**
  - Brand Primary: `#D99950`
  - Brand Hover: `#c6853a`
  - Brand Light/Muted: `#fef7ef` / `#f6e6d2`
  - Brand Dark: `#975e23`
  - Surfaces: Clean white surfaces with warm neutral slate (`neutral-50` to `neutral-100`) and border accents (`#D99950/20` to `#D99950/50`).
- **Typography:**
  - Headings: Elegant serif (`font-serif`) for literary atmosphere.
  - Body: Modern sans-serif (Geist / Inter) for clarity and readability.
- **Aesthetic Principles:**
  - Warm, cozy, and inviting library sanctuary.
  - Glassmorphic top navigation with subtle shadows.
  - Micro-animations, responsive hover cards with image zoom and border glows.
  - Prominent badge tags for categories and stock status.

---

## 3. Tech Stack & Dependencies
- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"`)
- **Icons:** `lucide-react`
- **Animations:** `motion`
- **Component Primitives:** `@base-ui/react`, `class-variance-authority`, `cn`
- **Installed Dependencies Only:** Never introduce extra npm dependencies; use only those present in `package.json`.

---

## 4. Application Architecture & File Structure

```text
booknook/
├── public/
│   ├── api.txt             # Primary book catalog JSON data source
│   └── slider/             # High-resolution hero slider imagery
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with Suspense-wrapped Navbar and Footer
│   │   ├── globals.css     # Tailwind v4 theme definitions and brand tokens
│   │   ├── page.tsx        # Homepage (Hero Slider, Philosophy, 6 New Arrivals)
│   │   ├── all-books/
│   │   │   ├── page.tsx    # All Books Server Component
│   │   │   └── AllBooksClient.tsx # Search, category filters, and sorting
│   │   ├── books/[id]/
│   │   │   ├── page.tsx    # Book Details Server Component (statically generated)
│   │   │   └── BookDetailActions.tsx # Interactive 3/7/14-day borrowing dialog
│   │   ├── add-book/       # Add a new book to the library form
│   │   ├── my-books/       # Contributed books shelf
│   │   ├── my-borrows/     # Active borrowed books with "Return Book" action
│   │   ├── login/          # User sign-in page
│   │   ├── register/       # User sign-up page
│   │   └── api/books/      # GET /api/books API endpoint
│   ├── components/
│   │   ├── Navbar.tsx      # Sticky navbar with logo, links, and auth buttons
│   │   ├── HeroSlider.tsx  # Dynamic carousel with slider images & controls
│   │   ├── BookCard.tsx    # Card with Image, Title, Author, Category & View Details
│   │   └── Footer.tsx      # Library footer with categories & support info
│   ├── lib/
│   │   ├── books.ts        # Data loader for public/api.txt (getAllBooks, getFirstNBooks, etc.)
│   │   └── utils.ts        # cn helper utility
│   └── types/
│       └── book.ts         # Book TypeScript interface
└── AGENTS.md
```

---

## 5. Development Conventions & Rules
1. **Next.js 16 Prerender Compatibility:**
   - Any component reading dynamic URL data (`usePathname()`, `params`, etc.) must be wrapped in `<Suspense>` or use `generateStaticParams()` to avoid blocking prerender.
   - Do not use non-deterministic runtime functions (e.g. dynamic `new Date()` without caching) in static components.
2. **Theme Consistency:**
   - Always apply `#D99950` as the signature accent across buttons, badges, links, active navigation tabs, and highlights.
3. **Data Integrity:**
   - Book catalog is loaded from `public/api.txt` through `src/lib/books.ts`.
   - Each book card must display: Image, Title, Author, Category, and a “View Details” button.
4. **Interactive Flows:**
   - "Add a Book" contributes a book to the library collection.
   - "Borrow a Book" allows choosing loan durations (3, 7, or 14 days).
   - "Return a Book" releases the book back into the pool.
