import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'react-bootstrap';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import OrderConfirmation from './pages/OrderConfirmation';
import NavigationBar from './components/Navbar';

function AppRouter() {
  return (
    <ThemeProvider>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/product-detail" element={<ProductDetail />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default AppRouter;