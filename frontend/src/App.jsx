import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/* Context Providers */
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { UIProvider } from './context/UIContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

/* Route Protection */
import { ProtectedRoute } from './components/common/ProtectedRoute/ProtectedRoute.jsx';

/* Layout Components */
import { AnnouncementBar } from './components/layout/AnnouncementBar/AnnouncementBar.jsx';
import { Navbar } from './components/layout/Navbar/Navbar.jsx';
import { Footer } from './components/layout/Footer/Footer.jsx';
import { ToastContainer } from './components/common/Toast/Toast.jsx';
import { QuickViewModal } from './components/common/QuickViewModal/QuickViewModal.jsx';

/* Storefront Pages */
import { Home } from './pages/Home/Home.jsx';
import { Catalogue } from './pages/Catalogue/Catalogue.jsx';
import { ProductDetail } from './pages/ProductDetail/ProductDetail.jsx';
import { Search } from './pages/Search/Search.jsx';
import { Cart } from './pages/Cart/Cart.jsx';
import { Checkout } from './pages/Checkout/Checkout.jsx';
import { OrderSuccess } from './pages/OrderSuccess/OrderSuccess.jsx';
import { Wholesale } from './pages/Wholesale/Wholesale.jsx';
import { CircularMarket } from './pages/CircularMarket/CircularMarket.jsx';
import { PlayEarn } from './pages/PlayEarn/PlayEarn.jsx';
import { Wishlist } from './pages/Wishlist/Wishlist.jsx';

/* Authentication & Patron Pages */
import { Login } from './pages/Auth/Login.jsx';
import { Signup } from './pages/Auth/Signup.jsx';
import { ForgotPassword } from './pages/Auth/ForgotPassword.jsx';
import { Account } from './pages/Account/Account.jsx';
import { TrackOrder } from './pages/TrackOrder/TrackOrder.jsx';

import './App.css';

/**
 * AppContent encapsulates the application layout and route tree.
 * Only authenticated patrons see the Storefront Navigation, Announcement Bar,
 * Storefront Homepage, and Footer. Unauthenticated visitors are greeted directly
 * with the Login / Sign Up portal without distracting storefront elements.
 */
function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={`app-wrapper ${!isAuthenticated ? 'auth-mode' : ''}`}>
      {/* Top Announcement Ribbon - only shown after authentication */}
      {isAuthenticated && <AnnouncementBar />}

      {/* Sticky Header with Patron Profile Avatar - only shown after authentication */}
      {isAuthenticated && <Navbar />}

      {/* Core Route Switching */}
      <main className="main-content">
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Storefront Routes (Landing on Homepage requires authentication) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogue"
            element={
              <ProtectedRoute>
                <Catalogue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wholesale"
            element={
              <ProtectedRoute>
                <Wholesale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/circular-market"
            element={
              <ProtectedRoute>
                <CircularMarket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/play-earn"
            element={
              <ProtectedRoute>
                <PlayEarn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-order"
            element={
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            }
          />

          {/* Catch-all: Unauthenticated users are sent to /login; authenticated users to / */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
          />
        </Routes>
      </main>

      {/* Earthy Footer - only shown after authentication */}
      {isAuthenticated && <Footer />}

      {/* Global Overlays */}
      <ToastContainer />
      {isAuthenticated && <QuickViewModal />}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <WishlistProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </WishlistProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
