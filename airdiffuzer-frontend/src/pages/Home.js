import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Импортиране на Link и useNavigate
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
// Импортиране на изображението
import AromaDiffuserImage from '../assets/1718432686293-e450d807b038497aa468be57c503904d-goods.webp';
// Импортиране на CSS за компонента Home
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/product-detail');
  };

  return (
    <Container className="mt-5">
      {/* Множество движещи се декоративни елементи */}
      <div className="moving-circle circle-1"></div>
      <div className="moving-circle circle-2"></div>
      <div className="moving-circle circle-3"></div>

      {/* Основно заглавие и подзаглавие */}
      <h1 className="main-heading">Добре дошли в магазина за арома дифузери</h1>
      <p className="sub-heading">Открийте най-добрите арома дифузери за спокойна атмосфера.</p>

      {/* Секция с продуктовата карта */}
      <Row className="d-flex justify-content-center">
        <Col md={6} lg={4}>
          <Card
            className="card-hover position-relative"
            style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0px 4px 15px rgba(0,0,0,0.2)' }}
            onClick={handleCardClick} // Добавяне на onClick обработчик за пренасочване
          >
            {/* Етикет за разпродажба */}
            <div className="sale-sticker">РАЗПРОДАЖБА</div>

            <Card.Img variant="top" src={AromaDiffuserImage} alt="Арома дифузер" />
            <Card.Body style={{ background: 'linear-gradient(135deg, #e3f2fd, #fff)' }}>
              <Card.Title className="text-center" style={{ color: '#004d99' }}>Арома дифузер</Card.Title>
              <Card.Text className="text-center">
                Създайте спокойна атмосфера с нашия нов арома дифузер.
              </Card.Text>

              {/* Секция с цена */}
              <div className="text-center price-section">
                <span className="original-price">59.99 лв</span> <span className="discount-price">39.99 лв</span>
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
