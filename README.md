# 🚗 Car Trader – Full-Stack Car Marketplace with AI-Powered Recommendations

A full-stack MERN-based platform for buying and selling cars, enhanced with an AI-driven content-based recommendation system. Inspired by platforms like OLX and CarDekho, Car Trader enables seamless car listing, booking, and discovery.

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- **React.js** – Component-based architecture for fast UI rendering
- **Tailwind CSS** – Utility-first styling for responsive design
- **React Router** – For seamless SPA navigation
- **Context API + LocalStorage** – For global auth/session state management

### 🛠️ Backend
- **Node.js + Express.js** – RESTful API and server-side logic
- **JWT Authentication** – Secure, role-based access control (Buyer/Seller)
- **MongoDB** – NoSQL database for users, cars, bookings, and favorites
- **Cloudinary** – For uploading and serving car images

### 🧠 AI/ML Microservice
- **Flask + Scikit-learn** – Lightweight Python API using Flask
- **Content-Based Filtering** – Bag-of-Words + Cosine Similarity on car metadata
- **ML API** hosted as a microservice (via Render or PythonAnywhere)
- **Vectorization** – Preprocessed with `CountVectorizer`
- **Model I/O** – Stored with `joblib` as `vector_matrix.pkl` and `vectorizer.pkl`

---

## 🔑 Core Features

### 👤 User Access
- JWT-based Login/Register flow
- Role-Based Access Control: Buyer or Seller

### 🚗 Car Listings
- Full **CRUD** (Create, Read, Update, Delete) operations for sellers
- Image upload via Cloudinary
- View car details and specs

### 🔍 Discovery & Search
- Filter cars by price, model, year, fuel type, etc.
- Save cars to **Favorites**
- Book test drives or purchase viewings

### 🔄 Recommender System
- ML model trained on 1000+ car instances (CarDekho Kaggle dataset)
- Shows **“Similar Cars You Might Like”** on each car detail page
- AI model accessed via REST API from backend and consumed in frontend

### 📦 Additional
- View all your bookings and received bookings
- Responsive UI optimized for mobile and desktop
- Proper error handling with 404/500 fallback routes
