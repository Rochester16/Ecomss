import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/UserNavbar.css";

export default function UserNavbar() {
  const [cartCount, setCartCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Load cart count
  useEffect(() => {
    if (!token) return;

    axios
      .get("/api/cart/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const items = res.data.items || [];
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
      })
      .catch(() => setCartCount(0));
  }, [location]);

  // Dark mode
  useEffect(() => {
    if (localStorage.getItem("darkMode") === "enabled") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDark = () => {
    const enabled = !darkMode;
    setDarkMode(enabled);

    document.body.classList.toggle("dark-mode", enabled);
    localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/user/login");
  };

  return (
    <nav className="user-navbar">
      <div className="nav-left">
        <Link to="/home" className="brand">
          <img src="/logo.png" alt="Aurevra Logo" className="logo" />
          <span>AUREVRA JEWELRY</span>
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>
          HOME
        </Link>
        <Link to="/shop" className={`nav-link ${isActive("/shop") ? "active" : ""}`}>
          SHOP
        </Link>
        <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>
          ABOUT US
        </Link>
        <Link to="/wishlist" className={`nav-link ${isActive("/wishlist") ? "active" : ""}`}>
          WISHLIST
        </Link>
        <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>
          CONTACT US
        </Link>

        {/* User Icon */}
        {user ? (
          <div className="dropdown">
            <i className="fas fa-user-circle dropdown-toggle profile-icon" data-bs-toggle="dropdown"></i>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><Link className="dropdown-item" to="/account">My Account</Link></li>
              <li><Link className="dropdown-item" to="/purchases">My Purchase</Link></li>
              <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="user-icon">
            <i className="fas fa-user-circle"></i>
          </Link>
        )}

        {/* Cart */}
        <Link to="/cart" className="cart-icon">
          <i className="fas fa-shopping-cart"></i>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}