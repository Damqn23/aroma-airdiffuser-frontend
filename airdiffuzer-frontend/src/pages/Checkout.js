import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    econt: '',
    paymentMethod: 'cashOnDelivery',
  });

  const productPrice = 39.99;
  const deliveryPrice = 5; // Fixed delivery cost
  const totalAmount = formData.paymentMethod === 'cashOnDelivery'
    ? productPrice + deliveryPrice
    : productPrice;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/submit-order', {
        ...formData,
        totalAmount: productPrice, // Pass only the product price here; backend will add the delivery cost
      });
      alert('Order placed successfully! You will receive an email confirmation shortly.');
      navigate('/order-confirmation');
    } catch (error) {
      console.error("Error submitting order:", error);
      alert('There was an error submitting your order. Please try again.');
    }
  };

  return (
    <Container className="mt-5 checkout-container">
      <h2 className="text-center mb-4">Плащане и Доставка</h2>
      <Form onSubmit={handleSubmit}>
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

        <Form.Group controlId="formPaymentMethod" className="mb-4">
          <Form.Label>Метод на плащане</Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="Плащане с карта"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={handleInputChange}
              inline
            />
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

        <Button variant="primary" type="submit">
          Потвърдете поръчката
        </Button>
      </Form>
    </Container>
  );
}

export default Checkout;
