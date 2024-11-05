import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Checkout() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    econt: '',
    paymentMethod: 'cashOnDelivery',
    cardholderName: '',  // New field for cardholder's name
  });
  const [cartItems, setCartItems] = useState([]);
  const [clientSecret, setClientSecret] = useState('');

  const deliveryPrice = 5;

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0) +
    (formData.paymentMethod === 'cashOnDelivery' ? deliveryPrice : 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'paymentMethod' && value === 'card') {
      axios.post('http://localhost:5000/api/create-payment-intent', { totalAmount })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((error) => console.error('Error creating payment intent:', error));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/submit-order', {
        ...formData,
        totalAmount,
      });
      alert('Order placed successfully! You will receive an email confirmation shortly.');
      navigate('/order-confirmation');
    } catch (error) {
      console.error("Error submitting order:", error);
      alert('There was an error submitting your order. Please try again.');
    }
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: formData.cardholderName },
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      await axios.post('http://localhost:5000/api/submit-order', {
        ...formData,
        totalAmount,
      });
      alert('Payment successful! Order placed.');
      navigate('/order-confirmation');
    }
  };

  return (
    <Container className="mt-5 checkout-container">
      <h2 className="text-center mb-4">Плащане и Доставка</h2>

      {cartItems.map((item) => (
        <div key={item.id}>
          <p>{item.name} - {item.quantity} x {item.price.toFixed(2)} лв</p>
        </div>
      ))}

      <Form onSubmit={formData.paymentMethod === 'card' ? handleCardPayment : handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>Име и фамилия</Form.Label>
              <Form.Control
                type="text"
                placeholder="Въведете вашето име и фамилия"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formEmail">
              <Form.Label>Имейл адрес</Form.Label>
              <Form.Control
                type="email"
                placeholder="Въведете вашия имейл"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formPhone">
              <Form.Label>Телефонен номер</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Въведете вашия телефонен номер"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formEcont">
              <Form.Label>Офис на Еконт или адрес за доставка</Form.Label>
              <Form.Control
                type="text"
                placeholder="Въведете офис на Еконт или адрес"
                name="econt"
                value={formData.econt}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="total-amount">
          <h4>Обща сума: {totalAmount.toFixed(2)} лв</h4>
        </div>

        <Form.Group controlId="formPaymentMethod" className="mb-4 payment-method-section">
          <Form.Label>Метод на плащане</Form.Label>
          <div className="payment-method">
            <div className="payment-option card-payment-option">
              <Form.Check
                type="radio"
                label="Плащане с карта"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleInputChange}
                inline
              />
              <span className="free-delivery-highlight">Безплатна доставка при плащане с карта</span>
            </div>
            <Form.Check
              type="radio"
              label="Плащане при доставка (с наложен платеж)"
              name="paymentMethod"
              value="cashOnDelivery"
              checked={formData.paymentMethod === 'cashOnDelivery'}
              onChange={handleInputChange}
              inline
            />
          </div>
        </Form.Group>

        {formData.paymentMethod === 'card' && (
          <div className="card-details-section">
            <Form.Group controlId="formCardholderName">
              <Form.Label>Име на картодържателя</Form.Label>
              <Form.Control
                type="text"
                placeholder="Въведете името на картодържателя"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <div className="card-element">
              <CardElement />
            </div>
          </div>
        )}

        <Button variant="primary" type="submit" className="mt-3">
          Потвърдете поръчката
        </Button>
      </Form>
    </Container>
  );
}

export default () => (
  <Elements stripe={stripePromise}>
    <Checkout />
  </Elements>
);
