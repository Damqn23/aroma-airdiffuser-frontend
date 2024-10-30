import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams to get product ID
import './ProductDetail.css';
import AromaDiffuserImage from '../assets/1718432686293-e450d807b038497aa468be57c503904d-goods.webp';

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from the route
  const [product, setProduct] = useState({
    id: 1,
    name: 'Aroma Air Diffuser',
    description: 'A high-quality aroma air diffuser for a calming atmosphere.',
    originalPrice: 59.99,
    price: 39.99,
    imageUrl: AromaDiffuserImage,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  });
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'John Doe',
      comment: 'Great product! Really loved it.',
    },
    {
      id: 2,
      author: 'Jane Smith',
      comment: 'Good quality, but delivery was a bit late.',
    },
  ]);

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
    <Container className="mt-5 product-detail-container">
      <Row>
        <Col md={6}>
          <div className="media-section">
            <img src={product.imageUrl} alt={product.name} className="product-image mb-4" />
            <video className="product-video" controls>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </Col>

        <Col md={6} className="product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>

          <ul className="feature-list">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          <div className="price-section">
            <span className="original-price">{product.originalPrice} лв</span>
            <span className="discount-price">{product.price} лв</span>
          </div>
          <Button className="btn-pulse mt-3" variant="primary" onClick={handleAddToCart}>
            Добави в кошницата
          </Button>

          <div className="customer-reviews mt-4">
            <h4>Отзиви от клиенти</h4>
            {reviews.length === 0 ? (
              <p>Няма налични отзиви за този продукт.</p>
            ) : (
              reviews.map((review) => (
                <div className="review" key={review.id}>
                  <strong>{review.author}</strong> <span className="review-rating">★★★★★</span>
                  <p>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;
