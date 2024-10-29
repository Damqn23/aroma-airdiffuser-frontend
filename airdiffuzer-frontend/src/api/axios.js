import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl, // Set the base URL for all requests
  // You can add other configuration options here if needed
});

export default axiosInstance;
