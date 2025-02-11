const Cart = require("../models/cart");
const ProductFactory = require("../factories/productFactory");
const Logger = require("../utils/logger");

class CartService {
  constructor(priceService) {
    this.cart = new Cart();
    this.priceService = priceService;
  }

  async addProductToCart(productName, quantity) {
    const price = await this.priceService.getPrice(productName);
    const product = ProductFactory.createProduct(productName, quantity, price);
    this.cart.addProduct(product);

    Logger.info(`Added ${quantity} x ${productName} @ ${price} each`);
  }

  logCartDetails() {
    const cartDetails = this.cart.getCartDetails();
    Logger.info("Cart Details:");
    Logger.info(JSON.stringify(cartDetails, null, 2));
  }

  getCartDetails() {
    return this.cart.getCartDetails();
  }
}

module.exports = CartService;
