import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:7140/api', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
