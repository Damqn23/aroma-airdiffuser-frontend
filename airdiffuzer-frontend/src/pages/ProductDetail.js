import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
// Импортиране на изображението
import AromaDiffuserImage from '../assets/1718432686293-e450d807b038497aa468be57c503904d-goods.webp';
// Импортиране на CSS за стилизиране
import './ProductDetail.css';

function ProductDetail() {
  return (
    <Container className="mt-5 product-detail-container">
      <Row>
        {/* Медийна секция (Снимки/Видео) */}
        <Col md={6}>
          <div className="media-section">
            <img src={AromaDiffuserImage} alt="Арома дифузер" className="product-image mb-4" />
            {/* Плейсхолдър за видео съдържание */}
            <video className="product-video" controls>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Вашият браузър не поддържа видео таг.
            </video>
          </div>
        </Col>

        {/* Секция Описание на продукта */}
        <Col md={6} className="product-info">
          <h2>Арома дифузер</h2>
          <p>Създайте спокойна атмосфера с нашия нов арома дифузер. Идеален за подобряване на вашия дом или работно място със свежи аромати и релаксираща атмосфера. Ароматерапията може значително да подобри настроението и да намали стреса, правейки средата по-приятна и продуктивна.</p>

          {/* Списък с ключови характеристики */}
          <ul className="feature-list">
            <li>Напреднала нано атомизация за по-фина мъгла.</li>
            <li>Тиха работа – идеална за работа и сън.</li>
            <li>До 12 часа непрекъсната мъгла.</li>
            <li>Автоматично изключване за безопасност.</li>
            <li>Съвместим с различни етерични масла.</li>
          </ul>

          {/* Секция Цена */}
          <div className="price-section">
            <span className="original-price">59.99 лв</span> <span className="discount-price">39.99 лв</span>
          </div>
          <Button className="btn-pulse mt-3" variant="primary">Добави в кошницата</Button>

          {/* Отзиви на клиенти */}
          <div className="customer-reviews mt-4">
            <h4>Отзиви на клиенти</h4>
            <div className="review">
              <strong>Жана Д.</strong> <span className="review-rating">★★★★★</span>
              <p>“Обожавам този дифузер! Ароматът е невероятен и наистина ми помага да се отпусна след дълъг ден. Силно препоръчвам!”</p>
            </div>
            <div className="review">
              <strong>Петър М.</strong> <span className="review-rating">★★★★☆</span>
              <p>“Дифузерът работи много добре и е много тих. Единственото, което бих искал, е малко по-дълго време на работа без презареждане.”</p>
            </div>
            <div className="review">
              <strong>Мария К.</strong> <span className="review-rating">★★★★★</span>
              <p>“Чудесен продукт! Използвам го всеки ден и атмосферата вкъщи е невероятно успокояваща. Силно препоръчвам на всички!”</p>
            </div>
            <div className="review">
              <strong>Иван Г.</strong> <span className="review-rating">★★★★☆</span>
              <p>“Много съм доволен от качеството и дизайна на този дифузер. Мъглата е фина и ароматът се разпространява равномерно в стаята.”</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;