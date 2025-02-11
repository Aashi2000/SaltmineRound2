const Cart = require("../models/cart");
const Product = require("../models/product");
const { getPrice } = require("./priceService");
const Logger = require("../utils/logger"); 

class CartService {
  constructor() {
    this.cart = new Cart();
  }

  async addProductToCart(productName, quantity) {
    const price = await getPrice(productName);
    this.cart.addProduct(new Product(productName, quantity, price));
    Logger.info(`Added ${quantity} x ${productName} @ ${price} each`);
  }

  getCartDetails() {
    return {
      items: this.cart.items,
      subtotal: this.cart.calculateSubtotal(),
      tax: this.cart.calculateTax(),
      total: this.cart.calculateTotal(),
    };
  }
}

module.exports = CartService;
