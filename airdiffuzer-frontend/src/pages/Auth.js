import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Tabs, Tab } from 'react-bootstrap';
import './Auth.css';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
 
function Auth() {
  const { setUser } = useContext(UserContext);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
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
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const response = await axios.post('https://aromaairdiffuserbackend-4.onrender.com/api/Auth/login', loginData);
      if (response.status === 200) {
        const loggedInUser = response.data;
        setUser(loggedInUser);
        alert('Успешно влязохте в системата!');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: Invalid credentials');
    }
  };
 
  // Handle Register form submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
 
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
 
    try {
      const response = await axios.post('https://aromaairdiffuserbackend-4.onrender.com/api/Auth/register', {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
      });
      if (response.status === 200) {
        alert('Registration successful! You can now log in.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: Please try again.');
    }
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
                    value={registerData.username}
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