import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/UserNavbar.css";

export default function UserNavbar() {
  const [cartCount, setCartCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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
  }, [location, token]);

  // Load products for search autocomplete
  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) setAllProducts(data);
        else if (Array.isArray(data.products)) setAllProducts(data.products);
        else setAllProducts([]);
      })
      .catch(() => setAllProducts([]));
  }, []);

  // Search live suggestions
  const handleSearch = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  };

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
    setShowDropdown(false);
    navigate("/user/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
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

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search jewelry..."
            className="search-input"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                navigate(`/shop?search=${query}`);
                setSuggestions([]);
              }
            }}
          />

          <i
            className="fas fa-search search-icon"
            onClick={() => {
              if (query.trim()) {
                navigate(`/shop?search=${query}`);
                setSuggestions([]);
              }
            }}
          ></i>

          {suggestions.length > 0 && (
            <ul className="search-dropdown">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  className="search-item"
                  onClick={() => {
                    setQuery(item.name);
                    setSuggestions([]);
                    navigate(`/shop?search=${item.name}`);
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User Icon */}
        {user ? (
          <div className="dropdown">
            <i 
              className="fas fa-user-circle profile-icon" 
              onClick={toggleDropdown}
              role="button"
              aria-expanded={showDropdown}
            ></i>
            {showDropdown && (
              <ul className="dropdown-menu dropdown-menu-end show">
                <li>
                  <Link 
                    className="dropdown-item" 
                    to="/account"
                    onClick={closeDropdown}
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    to="/purchases"
                    onClick={closeDropdown}
                  >
                    My Purchase
                  </Link>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link to="/login" className="profile-icon">
            <i className="fas fa-user-circle"></i>
          </Link>
        )}

        {/* Cart */}
        <Link to="/cart" className="cart-icon">
          <i className="fas fa-shopping-cart"></i>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {/* Dark Mode Toggle */}
        <div 
          className="dark-toggle" 
          onClick={toggleDark} 
          role="button" 
          aria-label="Toggle dark mode"
        >
          <i className={darkMode ? "fas fa-moon" : "far fa-moon"}></i>
        </div>
      </div>
    </nav>
  );
}