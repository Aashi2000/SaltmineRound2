const CartService = require("./services/cartService");

const priceService = require("./services/priceService");
const cartService = new CartService(priceService);

(async () => {
  await cartService.addProductToCart("cornflakes", 1);
  await cartService.addProductToCart("cornflakes", 1);
  await cartService.addProductToCart("weetabix", 1);

  cartService.logCartDetails();
})();
