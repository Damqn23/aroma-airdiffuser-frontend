import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Checkout.css';
import { UserContext } from '../context/UserContext'; // Import UserContext

function Checkout() {
  const { user } = useContext(UserContext); // Access user information from context
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    econt: '',
    paymentMethod: 'cashOnDelivery',
    cardDetails: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
  });

  // Prefill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle card details input changes
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      cardDetails: {
        ...prevData.cardDetails,
        [name]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Вашата поръчка е изпратена!');
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

        {/* Payment Method Section */}
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

        {/* Conditionally render card details form */}
        {formData.paymentMethod === 'card' && (
          <div className="card-details-section mb-4">
            <h5>Данни за картата</h5>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formCardholderName" className="mb-3">
                  <Form.Label>Име на картодържателя</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Въведете името на картодържателя"
                    name="cardholderName"
                    value={formData.cardDetails.cardholderName}
                    onChange={handleCardInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCardNumber" className="mb-3">
                  <Form.Label>Номер на картата</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Въведете номера на картата"
                    name="cardNumber"
                    value={formData.cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group controlId="formExpiryDate" className="mb-3">
                  <Form.Label>Валидност (MM/YY)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    name="expiryDate"
                    value={formData.cardDetails.expiryDate}
                    onChange={handleCardInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formCVC" className="mb-3">
                  <Form.Label>CVC</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="CVC"
                    name="cvc"
                    value={formData.cardDetails.cvc}
                    onChange={handleCardInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit">
            Потвърдете поръчката
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Checkout;
