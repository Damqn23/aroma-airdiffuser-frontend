import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams to get product ID
import axios from 'axios';
import './ProductDetail.css';
 
function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from the route
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
 
  // Fetch product details and reviews from backend
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const productResponse = await axios.get(`https://aromaairdiffuserbackend-4.onrender.com/api/productdetail/${id}`);
        setProduct(productResponse.data);
 
        const reviewsResponse = await axios.get(`https://aromaairdiffuserbackend-4.onrender.com/api/productdetail/${id}/reviews`);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Failed to fetch product details or reviews:', error);
      }
    };
 
    fetchProductDetail();
  }, [id]);
 
  const handleAddToCart = () => {
    // Logic to add the product to the cart
    navigate('/cart');
  };
 
  if (!product) {
    return <p>Loading...</p>;
  }
 
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
            Add to Cart
          </Button>
 
          <div className="customer-reviews mt-4">
            <h4>Customer Reviews</h4>
            {reviews.length === 0 ? (
              <p>No reviews available for this product.</p>
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