import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css'; // Optional CSS file for styling

function OrderConfirmation() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/'); // Redirects back to the home page
  };

  return (
    <Container className="order-confirmation-container text-center mt-5">
      <h2>Благодарим за вашата поръчка!</h2>
      <p>Вашата поръчка беше успешно изпратена и ще бъде обработена скоро.</p>
      <p>Очаквайте потвърждение по имейл относно детайлите на поръчката и доставката.</p>

      {/* You can add additional order details here if available */}
      <div className="mt-4">
        <Button variant="primary" onClick={handleBackToHome}>
          Обратно към началната страница
        </Button>
      </div>
    </Container>
  );
}

export default OrderConfirmation;