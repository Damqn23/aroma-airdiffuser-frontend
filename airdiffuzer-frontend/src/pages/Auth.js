import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Tabs, Tab } from 'react-bootstrap';
import './Auth.css';
import { UserContext } from '../context/UserContext';

function Auth() {
  const { setUser } = useContext(UserContext);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '', // Changed from name to username
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Handle input changes for Login form
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle input changes for Register form
  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Login form submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login Data:', loginData);

    // Assuming successful login:
    const loggedInUser = {
      username: 'Иван Петров', // Mock data for demonstration
      email: loginData.email,
      phone: '0888123456', // Mock data
    };
    setUser(loggedInUser);
    alert('Успешно влязохте в системата!');
  };

  // Handle Register form submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log('Register Data:', registerData);
    // Implement registration logic here
  };

  return (
    <Container className="mt-5 auth-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <Tabs defaultActiveKey="login" id="auth-tabs" className="mb-4">
            {/* Login Tab */}
            <Tab eventKey="login" title="Вход">
              <Form onSubmit={handleLoginSubmit}>
                <Form.Group controlId="formLoginEmail" className="mb-3">
                  <Form.Label>Имейл адрес</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Въведете вашия имейл"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formLoginPassword" className="mb-3">
                  <Form.Label>Парола</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Въведете вашата парола"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  <Button variant="primary" type="submit">
                    Вход
                  </Button>
                </div>
              </Form>
            </Tab>

            {/* Register Tab */}
            <Tab eventKey="register" title="Регистрация">
              <Form onSubmit={handleRegisterSubmit}>
                <Form.Group controlId="formRegisterUsername" className="mb-3">
                  <Form.Label>Потребителско име</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Въведете вашето потребителско име"
                    name="username"
                    value={registerData.username} // Updated to username
                    onChange={handleRegisterInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formRegisterEmail" className="mb-3">
                  <Form.Label>Имейл адрес</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Въведете вашия имейл"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formRegisterPassword" className="mb-3">
                  <Form.Label>Парола</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Въведете вашата парола"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Потвърдете паролата</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Потвърдете вашата парола"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterInputChange}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  <Button variant="primary" type="submit">
                    Регистрация
                  </Button>
                </div>
              </Form>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default Auth;