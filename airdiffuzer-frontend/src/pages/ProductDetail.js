import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import AromaDiffuserImage from '../assets/1718432686293-e450d807b038497aa468be57c503904d-goods.webp';

function ProductDetail() {
  const navigate = useNavigate();
  const [product] = useState({
    id: 1,
    name: 'Арома дифузер за въздух',
    description: 'Насладете се на спокойна атмосфера с нашия висококачествен арома дифузер. Осигурява равномерно разпръскване на ароматите, като създава уют и комфорт във вашия дом или офис.',
    originalPrice: 59.99,
    price: 39.99,
    imageUrl: AromaDiffuserImage,
    features: [
      'Компактен и модерен дизайн, подходящ за всеки интериор',
      'Работи тихо и икономично',
      'Регулируем интензитет на ароматите и LED светлини за различни настроения',
      'Автоматично изключване при липса на вода за безопасност',
    ],
  });

  const [reviews] = useState([
    {
      id: 1,
      author: 'Мария Иванова',
      comment: 'Страхотен продукт! Помага за успокояване и приятна атмосфера.',
      rating: 5,
    },
    {
      id: 2,
      author: 'Георги Петров',
      comment: 'Много съм доволен от качеството, препоръчвам го на всеки!',
      rating: 5,
    },
    {
      id: 3,
      author: 'Елена Михайлова',
      comment: 'Харесва ми, но очаквах по-дълготраен аромат. Все пак работи чудесно.',
      rating: 4,
    },
    {
      id: 4,
      author: 'Димитър Стоянов',
      comment: 'Уникален дизайн и лесен за употреба. Купих го като подарък и беше много добре приет.',
      rating: 5,
    },
    {
      id: 5,
      author: 'Анна Георгиева',
      comment: 'Работи тихо и ароматът е приятен, но доставката отне малко повече време.',
      rating: 4,
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
              Вашият браузър не поддържа видео формата.
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
                  <strong>{review.author}</strong> <span className="review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
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
