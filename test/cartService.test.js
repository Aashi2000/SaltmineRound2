const CartService = require("../src/services/cartService");
const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");

const API_URL = "http://localhost:3001/products/";

describe("CartService Unit Tests", () => {
  let cartService;
  let axiosMock;

  beforeEach(() => {
    cartService = new CartService();
    axiosMock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  test("should add products and calculate totals correctly", async () => {
    axiosMock.onGet(`${API_URL}cornflakes`).reply(200, { price: 2.52 });
    axiosMock.onGet(`${API_URL}weetabix`).reply(200, { price: 9.98 });

    await cartService.addProductToCart("cornflakes", 1);
    await cartService.addProductToCart("cornflakes", 1);
    await cartService.addProductToCart("weetabix", 1);

    const result = cartService.getCartDetails();

    expect(result.items.length).toBe(2);
    expect(result.items[0].name).toBe("cornflakes");
    expect(result.items[0].quantity).toBe(2);
    expect(result.items[1].name).toBe("weetabix");
    expect(result.items[1].quantity).toBe(1);
    expect(result.subtotal).toBe(15.02);
    expect(result.tax).toBe(1.88);
    expect(result.total).toBe(16.90);
  });

  test("should correctly update quantity when adding the same product multiple times", async () => {
    axiosMock.onGet(`${API_URL}cheerios`).reply(200, { price: 3.45 });

    await cartService.addProductToCart("cheerios", 2);
    await cartService.addProductToCart("cheerios", 3);

    const result = cartService.getCartDetails();

    expect(result.items.length).toBe(1);
    expect(result.items[0].quantity).toBe(5);
    expect(result.subtotal).toBe(17.25);
    expect(result.tax).toBe(2.16);
    expect(result.total).toBe(19.41);
  });

  test("should handle API errors when a product does not exist", async () => {
    axiosMock.onGet(`${API_URL}nonexistent`).reply(404);

    await expect(cartService.addProductToCart("nonexistent", 1)).rejects.toThrow(
      "Error fetching price for nonexistent"
    );
  });

  test("should return correct tax calculations", async () => {
    axiosMock.onGet(`${API_URL}shreddies`).reply(200, { price: 3.90 });

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
    axiosMock.onGet(`${API_URL}cornflakes`).reply(200, { price: 2.52 });
    axiosMock.onGet(`${API_URL}frosties`).reply(200, { price: 4.10 });

    await cartService.addProductToCart("cornflakes", 3);
    await cartService.addProductToCart("frosties", 2);

    const result = cartService.getCartDetails();

    expect(result.items.length).toBe(2);
    expect(result.subtotal).toBe(15.76);
    expect(result.tax).toBe(1.97);
    expect(result.total).toBe(17.73);
  });

  test("should handle rounding correctly", async () => {
    axiosMock.onGet(`${API_URL}cornflakes`).reply(200, { price: 2.51 });

    await cartService.addProductToCart("cornflakes", 1);

    const result = cartService.getCartDetails();

    expect(result.subtotal).toBe(2.51);
    expect(result.tax).toBe(0.31);
    expect(result.total).toBe(2.82);
  });
});
