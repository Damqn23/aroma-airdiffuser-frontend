const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to fetch Econt locations
app.get('/api/locations', async (req, res) => {
  try {
    const response = await axios.get('https://api.econt.com/v1/locations', {
      headers: { Authorization: `Bearer ${process.env.ECONT_API_KEY}` },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching locations');
  }
});

// Endpoint to calculate delivery cost
app.post('/api/calculate-delivery', async (req, res) => {
  try {
    const { destination } = req.body; // receive destination from frontend
    const response = await axios.post(
      'https://api.econt.com/v1/calculate-delivery',
      {
        origin: 'default-origin', // replace as needed
        destination,
      },
      {
        headers: { Authorization: `Bearer ${process.env.ECONT_API_KEY}` },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error calculating delivery');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
