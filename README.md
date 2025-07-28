# 📝 Feedback Board

A simple, modern feedback board built using **Next.js**, **MongoDB**, and **Prisma ORM**. Users can submit feedback, which is stored in a MongoDB database and displayed on the frontend in real-time.

---

## 🚀 Features

* ✅ Add feedback with name and message
* 📦 MongoDB integration with Prisma ORM
* ⚡ Fast and modern UI with Next.js App Router
* 🔄 Live feedback list with timestamps
* 🛠 Easily configurable and extendable

---

## 📁 Folder Structure

```
/
├── app/                  # Next.js App Router pages
├── components/           # Reusable UI components
├── lib/                  # Prisma client and database utilities
├── prisma/               # Prisma schema and config
├── public/               # Static assets
├── styles/               # CSS/SCSS styles
├── .env                  # Environment variables
├── README.md             # Project documentation
```

---

## 🧰 Tech Stack

* **Frontend:** Next.js (App Router)
* **Database:** MongoDB
* **ORM:** Prisma
* **Styling:** Tailwind CSS (optional)
* **Hosting:** Vercel

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/feedback-board.git
cd feedback-board
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_mongodb_connection_string"
```

Make sure your connection string includes the **database name**, like:

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/<database_name>?retryWrites=true&w=majority
```

### 4. Set Up Prisma

```bash
npx prisma db push
npx prisma generate
```

This will push the schema to MongoDB and generate the Prisma client.

### 5. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` to see your Feedback Board in action!

---

## 💡 Inspiration

Built as a starter project for learning modern full-stack development using **Next.js + MongoDB + Prisma**.