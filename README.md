# ShopSphere - MERN E-Commerce

ShopSphere is a full-stack e-commerce application built with the MERN stack.

## Features

- User registration and login
- JWT authentication
- Password hashing with bcrypt
- Product listing
- Product search
- Category filtering
- Shopping cart
- Local cart persistence
- Checkout
- Cash on Delivery
- Order history
- Stock management
- Admin product management
- Admin order management
- REST API
- MongoDB database

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Vite
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
mern-ecommerce/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Requirements

- Node.js 18+
- npm
- MongoDB local installation or MongoDB Atlas

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_ecommerce
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get products |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/myorders` | Get user's orders |
| GET | `/api/orders` | Get all orders |
| PUT | `/api/orders/:id/status` | Update order status |

## Admin

To make a user an admin, update the user's MongoDB document:

```json
{
  "isAdmin": true
}
```

After logging in again, the Admin link will appear.

## Future Improvements

- Razorpay or Stripe payments
- Product reviews
- Wishlist
- Image upload with Cloudinary
- Pagination
- Advanced product filtering
- Admin analytics dashboard
- Email order notifications
- Deployment with Vercel and Render
- Automated tests
- Docker support

## Author

Uday Kiran

Built as a full-stack development portfolio project.
