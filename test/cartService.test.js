const CartService = require("../src/services/cartService");
const Cart = require("../src/models/cart");


const priceServiceMock = {
  getPrice: jest.fn(),
};

describe("CartService Unit Tests", () => {
  let cartService;

  beforeEach(() => {
    Cart.instance = null;
    cartService = new CartService(priceServiceMock);
    priceServiceMock.getPrice.mockReset();
  });

  test("should correctly update quantity when adding the same product multiple times", async () => {
    priceServiceMock.getPrice.mockResolvedValue(3.45);

    await cartService.addProductToCart("cheerios", 2);
    await cartService.addProductToCart("cheerios", 3);

    const result = cartService.getCartDetails();

    expect(result.items.length).toBe(1);
    expect(result.items[0].quantity).toBe(5);
    expect(result.subtotal).toBe(17.25);
    expect(result.tax).toBe(2.16);
    expect(result.total).toBe(19.41);
  });

  test("should return correct tax calculations", async () => {
    priceServiceMock.getPrice.mockResolvedValue(3.90);

    await cartService.addProductToCart("shreddies", 3);

    const result = cartService.getCartDetails();

    expect(result.subtotal).toBe(11.70);
    expect(result.tax).toBe(1.46);
    expect(result.total).toBe(13.16);
  });

  test("should return zero for totals when no products are added", () => {
    const result = cartService.getCartDetails();

    expect(result.subtotal).toBe(0);
    expect(result.tax).toBe(0);
    expect(result.total).toBe(0);
  });

  test("should correctly handle multiple different products", async () => {
    priceServiceMock.getPrice
      .mockResolvedValueOnce(2.52)
      .mockResolvedValueOnce(4.10);

    await cartService.addProductToCart("cornflakes", 3);
    await cartService.addProductToCart("frosties", 2);

    const result = cartService.getCartDetails();

    expect(result.items.length).toBe(2);
    expect(result.subtotal).toBe(15.76);
    expect(result.tax).toBe(1.97);
    expect(result.total).toBe(17.73);
  });

  test("should handle rounding correctly", async () => {
    priceServiceMock.getPrice.mockResolvedValue(2.51);

    await cartService.addProductToCart("cornflakes", 1);

    const result = cartService.getCartDetails();

    expect(result.subtotal).toBe(2.51);
    expect(result.tax).toBe(0.31);
    expect(result.total).toBe(2.82);
  });
});
