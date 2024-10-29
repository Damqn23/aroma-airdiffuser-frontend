import React, { useState, useEffect, useContext } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import AromaDiffuserImage from '../assets/1718432686293-e450d807b038497aa468be57c503904d-goods.webp';
import axios from 'axios';
import './Cart.css';

function Cart() {
  const { user } = useContext(UserContext); // Get user from context
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('https://aromaairdiffuserbackend-4.onrender.com/api/cart');
        setCartItems(response.data);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  // Increment quantity of an item
  const incrementQuantity = async (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      try {
        await axios.post('https://aromaairdiffuserbackend-4.onrender.com/api/cart', {
          productId: item.productId,
          quantity: 1,
        });
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } catch (error) {
        console.error('Failed to increment quantity:', error);
      }
    }
  };

  // Decrement quantity of an item
  const decrementQuantity = async (id) => {
    const item = cartItems.find((item) => item.id === id && item.quantity > 1);
    if (item) {
      try {
        await axios.put(`https://aromaairdiffuserbackend-4.onrender.com/api/cart/${id}`, {
          quantity: item.quantity - 1,
        });
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
      } catch (error) {
        console.error('Failed to decrement quantity:', error);
      }
    }
  };

  // Remove item from cart
  const removeItem = async (id) => {
    try {
      await axios.delete(`https://aromaairdiffuserbackend-4.onrender.com/api/cart/${id}`);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const proceedToCheckout = async () => {
    if (!user) {
      navigate('/auth'); // Redirect to Auth if not logged in
    } else {
      try {
        const response = await axios.post('https://aromaairdiffuserbackend-4.onrender.com/api/cart/checkout');
        if (response.status === 200) {
          alert('Order placed successfully!');
          setCartItems([]); // Clear cart items on frontend after checkout
        }
      } catch (error) {
        console.error('Checkout failed:', error);
        alert('Failed to place order. Please try again.');
      }
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
                        src={AromaDiffuserImage}
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
