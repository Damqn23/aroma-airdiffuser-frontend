const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const sgMail = require('@sendgrid/mail');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// POST endpoint to create a Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  const { totalAmount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
      currency: 'bgn',
      payment_method_types: ['card'],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST endpoint to submit an order and send notification email
app.post('/api/submit-order', async (req, res) => {
  const { name, email, phone, econt, paymentMethod, totalAmount } = req.body;

  if (!name || !email || !phone || !econt || !paymentMethod || !totalAmount) {
    return res.status(400).send({
      message: 'All order details must be provided',
    });
  }

  const finalAmount = paymentMethod === 'cashOnDelivery' ? parseFloat(totalAmount) : parseFloat(totalAmount);

  const msg = {
    to: process.env.ORDER_NOTIFICATION_EMAIL,
    from: 'damandimov225@gmail.com',
    subject: 'New Order Confirmation',
    text: `A new order has been placed:
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Delivery Location: ${econt}
      Payment Method: ${paymentMethod === 'card' ? 'Paid by card' : 'Cash on delivery'}
      Total Amount (incl. delivery): ${finalAmount.toFixed(2)} BGN
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');

    res.status(200).send({
      message: 'Order submitted and email sent successfully',
      orderDetails: {
        name,
        email,
        phone,
        econt,
        paymentMethod,
        totalAmount: finalAmount.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error.message);
    res.status(500).send({
      message: 'Error submitting order. Please try again later.',
      error: error.response ? error.response.body : error.message,
    });
  }
});

// Start the server on the defined port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
