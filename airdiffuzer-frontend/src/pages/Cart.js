import React, { useState, useContext } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Import UserContext
import AromaDiffuserImage from '../assets/1718432686293-e450d807b038497aa468be57c503904d-goods.webp';
import './Cart.css';

function Cart() {
  const { user } = useContext(UserContext); // Get user from context
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Арома дифузер',
      price: 39.99,
      originalPrice: 59.99,
      quantity: 1,
      image: AromaDiffuserImage,
    },
  ]);

  const incrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const proceedToCheckout = () => {
    if (!user) {
      navigate('/auth'); // Redirect to Auth if not logged in
    } else {
      navigate('/checkout'); // Proceed to checkout if logged in
    }
  };

  return (
    <Container className="mt-5 cart-container">
      <h2 className="text-center mb-4">Вашата количка</h2>
      {cartItems.length === 0 ? (
        <p className="text-center">Вашата количка е празна.</p>
      ) : (
        <>
          <Table bordered responsive className="cart-table">
            <thead>
              <tr>
                <th>Продукт</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Обща сума</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="cart-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <span>{item.name}</span>
                    </div>
                    <div className="text-muted small">
                      Прогнозна доставка: 3-5 дни
                    </div>
                  </td>
                  <td>{item.price.toFixed(2)} лв</td>
                  <td>
                    <div className="quantity-controls">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => decrementQuantity(item.id)}
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => incrementQuantity(item.id)}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>{(item.price * item.quantity).toFixed(2)} лв</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Премахни
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="cart-total text-right">
            <h4>
              Обща сума: <span className="discount-price">{totalPrice.toFixed(2)} лв</span>
            </h4>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" onClick={proceedToCheckout}>
              Премини към плащане
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default Cart;