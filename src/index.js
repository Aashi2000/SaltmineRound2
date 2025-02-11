const CartService = require("./services/cartService");
const Logger = require("./utils/logger");

(async () => {
  const cartService = new CartService();

  await cartService.addProductToCart("cornflakes", 1);
  await cartService.addProductToCart("cornflakes", 1);
  await cartService.addProductToCart("weetabix", 1);
  Logger.info("Cart Details: ");
  Logger.info(JSON.stringify(cartService.getCartDetails(), null, 2));
})();
