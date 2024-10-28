// src/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import OrderConfirmation from './pages/OrderConfirmation';

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/auth" component={Auth} />
        <Route path="/order-confirmation" component={OrderConfirmation} />
      </Switch>
    </Router>
  );
}

export default AppRouter;
