class Cart {
    constructor() {
      if (Cart.instance) {
        return Cart.instance;
      }
      this.items = [];
      Cart.instance = this;
    }
  
    addProduct(product) {
      const existingProduct = this.items.find((item) => item.name === product.name);
      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        this.items.push(product);
      }
    }
  
    calculateSubtotal() {
      return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  
    calculateTax() {
      return parseFloat((this.calculateSubtotal() * 0.125).toFixed(2));
    }
  
    calculateTotal() {
      return parseFloat((this.calculateSubtotal() + this.calculateTax()).toFixed(2));
    }
  
    getCartDetails() {
      return {
        items: this.items,
        subtotal: this.calculateSubtotal(),
        tax: this.calculateTax(),
        total: this.calculateTotal(),
      };
    }
  }
  
  module.exports = Cart;
  