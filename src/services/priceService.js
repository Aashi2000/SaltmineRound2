const axios = require("axios");

const API_URL = "http://localhost:3001/products/";

const getPrice = async (productName) => {
  try {
    const response = await axios.get(`${API_URL}${productName}`);
    return response.data.price;
  } catch (error) {
    throw new Error(`Error fetching price for ${productName}: ${error.message}`);
  }
};

module.exports = { getPrice };
