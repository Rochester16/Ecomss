import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ToastProvider.jsx";

// USER PAGES
import LoginPage from "./pages/User/LoginPage.jsx";
import LandingPage from "./pages/User/LandingPage.jsx";
import RegisterPage from "./pages/User/RegisterPage.jsx";
import HomePage from "./pages/User/HomePage.jsx";
import ForgotPasswordPage from "./pages/User/ForgotPassword.jsx";
import ShopPage from "./pages/User/shop.jsx";
import Cart from "./pages/User/cart.jsx";
import Checkout from "./pages/User/checkout.jsx";
import Success from "./pages/User/success.jsx";
import Wishlist from "./pages/User/Wishlist.jsx";
import AboutUs from "./pages/User/aboutus.jsx";
import ProductDetail from "./pages/User/ProductDetail.jsx";
import ContactUs from "./pages/User/contact.jsx";
import MyPurchase from "./pages/User/Purchase.jsx";
import MyAccount from "./pages/User/MyAccount.jsx";
import MyPurchases from "./pages/User/MyPurchases.jsx";

// ADMIN PAGES
import AddProductPage from "./pages/Admin/AddProductPage.jsx";
import DashboardPage from "./pages/Admin/DashboardPage.jsx";
import ProductHistory from "./pages/Admin/ProductHistory.jsx";
import ProductsPage from "./pages/Admin/ProductsPage.jsx";
import PurchaseHistory from "./pages/Admin/PurchaseHistory.jsx";
import UserCreatedHistory from "./pages/Admin/UserCreatedHistory.jsx";
import EditProductPage from "./pages/Admin/EditProductPage.jsx";

// LAYOUT
import UserLayout from "./components/UserLayout.jsx";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;

/* ==============================
    HELPER — GET USER
================================*/
function getUser() {
  try {
    const data = JSON.parse(localStorage.getItem("user"));
    return data || null;
  } catch {
    return null;
  }
}

/* ==============================
    ROUTE PROTECTORS
================================*/
function UserRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/user/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function AdminRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/user/login" replace />;
  if (user.role !== "admin") return <Navigate to="/home" replace />;
  return children;
}

/* ==============================
    MAIN ROUTE LAYOUT
================================*/
function Layout() {
  return (
    <Routes>

      {/* PUBLIC LANDING PAGE */}
      <Route path="/" element={<LandingPage />} />

      {/* AUTH ROUTES */}
      <Route path="/user/login" element={<LoginPage />} />
      <Route path="/user/register" element={<RegisterPage />} />
      <Route path="/user/forgot-password" element={<ForgotPasswordPage />} />

      {/* USER PAGES (PROTECTED) */}
      <Route
        path="/home"
        element={
          <UserRoute>
            <UserLayout><HomePage /></UserLayout>
          </UserRoute>
        }
      />
 <Route
        path="/purchases"
        element={
          <UserRoute>
            <UserLayout><MyPurchases /></UserLayout>
          </UserRoute>
        }
      />
      <Route
        path="/shop"
        element={
          <UserRoute>
            <UserLayout><ShopPage /></UserLayout>
          </UserRoute>
        }
      />

<Route
        path="/account"
        element={
          <UserRoute>
            <UserLayout><MyAccount /></UserLayout>
          </UserRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <UserRoute>
            <UserLayout><ContactUs /></UserLayout>
          </UserRoute>
        }
      />

      <Route
        path="/product/:id"
        element={
          <UserRoute>
            <UserLayout><ProductDetail /></UserLayout>
          </UserRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <UserRoute>
            <UserLayout><Cart /></UserLayout>
          </UserRoute>
        }
      />

      {/* ✔ CHECKOUT PAGE */}
      <Route
        path="/checkout"
        element={
          <UserRoute>
            <UserLayout><Checkout /></UserLayout>
          </UserRoute>
        }
      />

      {/* ✔ NEW: USER PURCHASE PAGE */}
      <Route
        path="/purchase"
        element={
          <UserRoute>
            <UserLayout><MyPurchase /></UserLayout>
          </UserRoute>
        }
      />

      <Route
        path="/success"
        element={
          <UserRoute>
            <UserLayout><Success /></UserLayout>
          </UserRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <UserRoute>
            <UserLayout><Wishlist /></UserLayout>
          </UserRoute>
        }
      />

      <Route
        path="/about"
        element={
          <UserRoute>
            <UserLayout><AboutUs /></UserLayout>
          </UserRoute>
        }
      />

      {/* ADMIN PAGES (PROTECTED) */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <ProductsPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products/add"
        element={
          <AdminRoute>
            <AddProductPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products/history"
        element={
          <AdminRoute>
            <ProductHistory />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/purchase-history"
        element={
          <AdminRoute>
            <PurchaseHistory />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products/edit/:id"
        element={
          <AdminRoute>
            <AddProductPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users-created"
        element={
          <AdminRoute>
            <UserCreatedHistory />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
