import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import api, { authHeader } from "./api";

function Navbar({ user, setUser, cartCount }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link className="logo" to="/">ShopSphere</Link>

      <nav>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart ({cartCount})</Link>

        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            <span className="welcome">Hi, {user.name}</span>
            {user.isAdmin && <Link to="/admin">Admin</Link>}
            <button className="nav-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="container">
      <section className="hero">
        <div>
          <p className="eyebrow">MERN E-COMMERCE</p>
          <h1>Everything you need, in one place.</h1>
          <p>Discover quality products with a clean, modern shopping experience.</p>
        </div>
      </section>

      <div className="toolbar">
        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <h2>No products found</h2>
          <p>Add products through the admin API or seed your database.</p>
        </div>
      ) : (
        <section className="grid">
          {filtered.map(product => (
            <article className="card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <div className="card-body">
                <span className="category">{product.category}</span>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <div className="card-bottom">
                  <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                  <button
                    disabled={product.countInStock === 0}
                    onClick={() => addToCart(product)}
                  >
                    {product.countInStock ? "Add to cart" : "Out of stock"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      button="Login"
      form={form}
      setForm={setForm}
      onSubmit={submit}
      error={error}
      showName={false}
    />
  );
}

function Register({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthForm
      title="Create account"
      button="Register"
      form={form}
      setForm={setForm}
      onSubmit={submit}
      error={error}
      showName={true}
    />
  );
}

function AuthForm({ title, button, form, setForm, onSubmit, error, showName }) {
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>{title}</h1>

        {showName && (
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          minLength="6"
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">{button}</button>
      </form>
    </main>
  );
}

function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCart(cart.map(item =>
      item._id === id ? { ...item, quantity } : item
    ));
  };

  const remove = id => setCart(cart.filter(item => item._id !== id));

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="container">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate("/")}>Continue shopping</button>
        </div>
      ) : (
        <div className="cart-layout">
          <section>
            {cart.map(item => (
              <div className="cart-item" key={item._id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h2>{item.name}</h2>
                  <p>₹{item.price.toLocaleString("en-IN")}</p>
                  <input
                    type="number"
                    min="1"
                    max={item.countInStock}
                    value={item.quantity}
                    onChange={e => updateQuantity(item._id, Number(e.target.value))}
                  />
                  <button className="danger" onClick={() => remove(item._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </section>

          <aside className="summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>
            <button onClick={() => navigate("/checkout")}>Checkout</button>
          </aside>
        </div>
      )}
    </main>
  );
}

function Checkout({ cart, setCart, user }) {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India"
  });
  const [error, setError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submit = async e => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/orders",
        {
          items: cart.map(item => ({
            product: item._id,
            quantity: item.quantity
          })),
          shippingAddress: address,
          paymentMethod: "COD"
        },
        authHeader()
      );

      setCart([]);
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    }
  };

  if (!cart.length) {
    return (
      <main className="container empty">
        <h2>Your cart is empty</h2>
      </main>
    );
  }

  return (
    <main className="container checkout">
      <form className="checkout-card" onSubmit={submit}>
        <h1>Checkout</h1>

        <input
          placeholder="Address"
          value={address.address}
          onChange={e => setAddress({ ...address, address: e.target.value })}
          required
        />

        <input
          placeholder="City"
          value={address.city}
          onChange={e => setAddress({ ...address, city: e.target.value })}
          required
        />

        <input
          placeholder="Postal code"
          value={address.postalCode}
          onChange={e => setAddress({ ...address, postalCode: e.target.value })}
          required
        />

        <input
          value="India"
          readOnly
        />

        <p>Payment method: Cash on Delivery</p>

        {error && <p className="error">{error}</p>}

        <button type="submit">
          Place order · ₹{total.toLocaleString("en-IN")}
        </button>
      </form>
    </main>
  );
}

function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    api.get("/orders/myorders", authHeader())
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));
  }, [user]);

  if (!user) {
    return <main className="container empty"><h2>Please login first</h2></main>;
  }

  return (
    <main className="container">
      <h1>My Orders</h1>

      {!orders.length ? (
        <div className="empty">
          <h2>No orders yet</h2>
        </div>
      ) : (
        <section className="orders">
          {orders.map(order => (
            <article className="order-card" key={order._id}>
              <div>
                <strong>Order #{order._id.slice(-8)}</strong>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <span className="status">{order.status}</span>

              <div>
                <strong>₹{order.totalPrice.toLocaleString("en-IN")}</strong>
                <p>{order.items.length} product(s)</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function Admin({ user }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    countInStock: ""
  });
  const [message, setMessage] = useState("");

  const load = async () => {
    const [productsRes, ordersRes] = await Promise.all([
      api.get("/products"),
      api.get("/orders", authHeader())
    ]);

    setProducts(productsRes.data);
    setOrders(ordersRes.data);
  };

  useEffect(() => {
    if (user?.isAdmin) {
      load().catch(() => {});
    }
  }, [user]);

  const createProduct = async e => {
    e.preventDefault();

    try {
      await api.post(
        "/products",
        {
          ...form,
          price: Number(form.price),
          countInStock: Number(form.countInStock)
        },
        authHeader()
      );

      setForm({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        countInStock: ""
      });

      setMessage("Product created");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not create product");
    }
  };

  const deleteProduct = async id => {
    await api.delete(`/products/${id}`, authHeader());
    load();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status }, authHeader());
    load();
  };

  if (!user?.isAdmin) {
    return <main className="container empty"><h2>Admin access required</h2></main>;
  }

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>

      <section className="admin-grid">
        <form className="admin-card" onSubmit={createProduct}>
          <h2>Add Product</h2>

          <input placeholder="Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />

          <textarea placeholder="Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} required />

          <input type="number" placeholder="Price" value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })} required />

          <input placeholder="Image URL" value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })} required />

          <input placeholder="Category" value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })} required />

          <input type="number" placeholder="Stock" value={form.countInStock}
            onChange={e => setForm({ ...form, countInStock: e.target.value })} required />

          <button type="submit">Add Product</button>

          {message && <p>{message}</p>}
        </form>

        <section className="admin-card">
          <h2>Products</h2>

          {products.map(product => (
            <div className="admin-row" key={product._id}>
              <span>{product.name}</span>
              <span>₹{product.price}</span>
              <button className="danger" onClick={() => deleteProduct(product._id)}>
                Delete
              </button>
            </div>
          ))}
        </section>
      </section>

      <section className="admin-card">
        <h2>Orders</h2>

        {orders.map(order => (
          <div className="admin-row order-row" key={order._id}>
            <span>#{order._id.slice(-8)} · {order.user?.email}</span>
            <span>₹{order.totalPrice}</span>
            <select
              value={order.status}
              onChange={e => updateStatus(order._id, e.target.value)}
            >
              <option>Placed</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = product => {
    setCart(current => {
      const existing = current.find(item => item._id === product._id);

      if (existing) {
        return current.map(item =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.countInStock) }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar user={user} setUser={setUser} cartCount={cartCount} />

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route
          path="/checkout"
          element={<Checkout cart={cart} setCart={setCart} user={user} />}
        />
        <Route path="/orders" element={<Orders user={user} />} />
        <Route path="/admin" element={<Admin user={user} />} />
      </Routes>
    </>
  );
}
