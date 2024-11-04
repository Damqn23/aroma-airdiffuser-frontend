const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');

// Load environment variables from .env file
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// POST endpoint to submit an order
app.post('/api/submit-order', async (req, res) => {
  // Destructure order details from the request body
  const { name, email, phone, econt, paymentMethod, totalAmount } = req.body;

  // Validate input data
  if (!name || !email || !phone || !econt || !paymentMethod || !totalAmount) {
    return res.status(400).send({
      message: 'All order details must be provided',
    });
  }

  // Define delivery cost and calculate the final amount
  const deliveryCost = 5;
  const finalAmount = parseFloat(totalAmount) + deliveryCost;

  // Log the received order details
  console.log(`Received order:
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Delivery Location: ${econt}
    Payment Method: ${paymentMethod === 'card' ? 'Paid by card' : 'Cash on delivery'}
    Total Amount (incl. delivery): ${finalAmount.toFixed(2)} BGN
  `);

  // Prepare email content for the order notification
  const msg = {
    to: process.env.ORDER_NOTIFICATION_EMAIL, // Recipient email address from .env
    from: 'damandimov225@gmail.com', // Verified sender email
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
    // Attempt to send the email
    await sgMail.send(msg);
    console.log('Email sent successfully');

    // Send a response back to the client
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
