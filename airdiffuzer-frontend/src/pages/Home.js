import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import './Home.css';
 
function Home() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null); // State for the product data
 
  // Fetch product data from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get('https://aromaairdiffuserbackend-4.onrender.com/api/product');
        setProduct(response.data[0]); // Assuming you want the first product as the main display
      } catch (error) {
        console.error('Failed to fetch product data:', error);
      }
    };
 
    fetchProduct();
  }, []);
 
  // Redirect to product detail page on card click
  const handleCardClick = () => {
    navigate('/product-detail');
  };
 
  if (!product) {
    return <p>Loading...</p>;
  }
 
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
                <Link to="/cart">
                  <Button className="btn-pulse" variant="primary">Добави в кошницата</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
 
export default Home;
