const Product = require("../models/product");

class ProductFactory {
  static createProduct(name, quantity, price) {
    return new Product(name, quantity, price);
  }
}

module.exports = ProductFactory;
