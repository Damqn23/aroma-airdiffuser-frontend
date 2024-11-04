const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/submit-order', async (req, res) => {
  const { name, email, phone, econt, paymentMethod, totalAmount } = req.body;
  const deliveryCost = 5;
  const finalAmount = totalAmount + deliveryCost;

  console.log(`Received order:
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Delivery Location: ${econt}
    Payment Method: ${paymentMethod === 'card' ? 'Paid by card' : 'Cash on delivery'}
    Total Amount (incl. delivery): ${finalAmount} BGN
  `);

  // Prepare email content
  const msg = {
    to: process.env.ORDER_NOTIFICATION_EMAIL, // Your recipient email from .env
    from: 'damandimov225@gmail.com', // Verified sender email
    subject: 'New Order Confirmation',
    text: `A new order has been placed:
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Delivery Location: ${econt}
      Payment Method: ${paymentMethod === 'card' ? 'Paid by card' : 'Cash on delivery'}
      Total Amount (incl. delivery): ${finalAmount} BGN
    `,
  };

  try {
    // Send the email
    await sgMail.send(msg);
    console.log('Email sent successfully');
    res.send({
      message: 'Order submitted and email sent successfully',
      orderDetails: {
        name,
        email,
        phone,
        econt,
        paymentMethod,
        totalAmount: finalAmount,
      },
    });
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
    res.status(500).send({
      message: 'Error submitting order. Please try again later.',
      error: error.response ? error.response.body : error.message,
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
