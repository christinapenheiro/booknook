# 📚 BookNook – Online Community Library

**BookNook** is an online community library platform where readers can explore books, share their favorite reads, borrow books, and manage their personal book collections. The platform provides a simple and user-friendly experience for discovering and borrowing books.

🌐 **Live Website:** [https://booknook-blond.vercel.app/]

---

## ✨ Key Features

- **User Authentication:** Secure registration and login system with email/password authentication and Google sign-in using Better Auth.
- **Explore Books:** Browse all available books and discover new arrivals with detailed information about each book.
- **Add & Manage Books:** Authenticated users can add new books, update their book information, and delete books from their collections.
- **Borrow Books:** Users can borrow available books and view their borrowing history.
- **Return Books:** Easily return borrowed books and keep the library's available copy count updated.
- **Personalized Dashboard:** Manage your added books and borrowed books from dedicated pages.
- **Book Availability:** Track available copies and prevent borrowing when a book is out of stock.
- **Responsive Design:** Enjoy a consistent browsing experience across desktop, tablet, and mobile devices.
- **Interactive Notifications:** Receive informative success and error notifications through toast messages.
- **Dynamic Content:** Book information is retrieved from MongoDB, keeping the displayed content up to date.

## 🛠️ Technologies Used

### Frontend
- Next.js (App Router)
- React
- TypeScript / JavaScript
- Tailwind CSS
- ShadCN
- Lucide React
- React Toastify

### Authentication
- Better Auth
- MongoDB Adapter
- JWT

### Backend & Database
- Express.js
- MongoDB

### Deployment
- Vercel

## 📂 Project Structure

```text
BookNook/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── .env.local
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

Follow these steps to run BookNook locally.

**1. Clone the repository**

```bash
git clone https://github.com/christinapenheiro/booknook
```

**2. Navigate to the project directory**

```bash
cd BookNook
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file in the root directory and add the required environment variables.

```env
NEXT_PUBLIC_SERVER_BASE_URL=YOUR_BACKEND_API_URL
```

Add any additional authentication and database environment variables required by your Better Auth configuration.

**5. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication & Authorization

BookNook uses Better Auth for user authentication and session management.

- Register with your name, email, profile photo URL, and password.
- Sign in using email and password.
- Google authentication is supported.
- Private pages require authentication.
- User-specific book collections and borrowing records are protected.

## 📖 Core Functionalities

| Feature | Description |
|---|---|
| All Books | Explore the complete book collection. |
| Add Book | Add new books to the library. |
| Book Details | View detailed information about individual books. |
| My Books | Manage books added by the logged-in user. |
| My Borrows | View and manage borrowed books. |
| Return Book | Return previously borrowed books. |

## 👨‍💻 Author

**Developer:** Christina Penheiro

**GitHub:** [https://github.com/christinapenheiro]

---

⭐ If you find BookNook interesting, feel free to explore the project!