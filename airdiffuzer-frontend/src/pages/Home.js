import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './Home.css';
import AromaDiffuserImage from '../assets/1718432686293-e450d807b038497aa468be57c503904d-goods.webp';

function Home() {
  const navigate = useNavigate();
  const [product] = useState({
    id: 1,
    name: 'Aroma Air Diffuser',
    description: 'A high-quality aroma air diffuser for a calming atmosphere.',
    originalPrice: 59.99,
    price: 39.99,
    imageUrl: AromaDiffuserImage,
  });

  const handleCardClick = () => {
    navigate('/product-detail');
  };

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);
    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/cart');
  };

  return (
    <Container className="mt-5">
      <div className="moving-circle circle-1"></div>
      <div className="moving-circle circle-2"></div>
      <div className="moving-circle circle-3"></div>

      <h1 className="main-heading">Добре дошли в магазина за арома дифузери</h1>
      <p className="sub-heading">Открийте най-добрите арома дифузери за спокойна атмосфера.</p>

      <Row className="d-flex justify-content-center">
        <Col md={6} lg={4}>
          <Card
            className="card-hover position-relative"
            style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0px 4px 15px rgba(0,0,0,0.2)' }}
            onClick={handleCardClick}
          >
            <div className="sale-sticker">РАЗПРОДАЖБА</div>
            <Card.Img variant="top" src={product.imageUrl} alt={product.name} />
            <Card.Body style={{ background: 'linear-gradient(135deg, #e3f2fd, #fff)' }}>
              <Card.Title className="text-center" style={{ color: '#004d99' }}>{product.name}</Card.Title>
              <Card.Text className="text-center">
                {product.description}
              </Card.Text>
              <div className="text-center price-section">
                <span className="original-price">{product.originalPrice} лв</span>
                <span className="discount-price">{product.price} лв</span>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Button className="btn-pulse" variant="primary" onClick={handleAddToCart}>
                  Добави в кошницата
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
