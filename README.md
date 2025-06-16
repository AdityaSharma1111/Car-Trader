#🚗 Car Trader – MERN Stack + AI-Powered Car Marketplace  
An advanced full-stack platform for listing, discovering, and booking used cars — now enhanced with a content-based recommendation system trained on real-world car data.

🔗 Live Demo: 

---

✨ Key Features  
📤 Post & manage car listings (CRUD operations for sellers)  
🔍 Filter cars by price, year, fuel type, and more  
📌 Add cars to wishlist/favorites  
📅 Book test drives / viewings with one-click booking  
📦 View your bookings and received bookings  
🔒 Role-based JWT auth (Buyer/Seller)  
🤖 AI-powered “Similar Cars” suggestion system  
🖼️ Car image uploads via Cloudinary  
📱 Fully responsive mobile-friendly UI  

---

🛠️ Tech Stack

**Frontend**  
- React.js – Component-driven UI  
- Tailwind CSS – Utility-first styling  
- React Router – SPA routing  
- Context API + LocalStorage – Global session state  

**Backend**  
- Node.js + Express.js – Secure and scalable REST APIs  
- JWT Authentication – Role-based access control  
- Cloudinary – Car image management  

**Database**  
- MongoDB – Flexible document storage for cars, users, bookings, favorites  

---

🧠 AI-Powered Insight  
A content-based recommender system using:

- Scikit-learn + Flask API  
- CountVectorizer for text vectorization  
- Cosine Similarity for computing similar cars  
- Pretrained on 1000+ real car listings (CarDekho Kaggle Dataset)  
- Hosted as a microservice (Flask API via Render)
