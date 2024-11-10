function initAlpine() {
  // Exc
  const cartItemsKey = 'lwnUserCartItems';

  return {
    cartItems: [],
    cartItemsCount: [],
    cartProducts: [],

    // init
    init() {
      const storedItems = localStorage.getItem(cartItemsKey);
      this.cartItems = storedItems ? JSON.parse(storedItems) : [];
      this.cartProducts = this.cartItems.map((itemId) =>
        this.products.find((p) => p.id == itemId)
      );
      this.cartItemsCount = this.cartItems.map((itemId) => ({
        id: itemId,
        count: 1,
      }));
    },
    // Compute Price
    formattedComputedPrice(productId, unitPrice) {
      const count = this.getCartItemCount(productId);
      return `${unitPrice * count} USD`;
    },

    // get cart Item Count
    getCartItemCount(productId) {
      const item = this.cartItemsCount.find((i) => i.id == productId);
      return item ? item.count : 0;
    },

    // update cart count
    updateCartItemCount(productId, newCount) {
      newCount = parseInt(newCount, 10);
      this.cartItemsCount = this.cartItemsCount.map((i) =>
        i.id == productId ? { ...i, count: newCount } : i
      );
    },

    // Save to localStorage
    saveToLocalStorage() {
      localStorage.setItem(cartItemsKey, JSON.stringify(this.cartItems));
    },
    // Does this product exist in cart?
    isInCart(productId) {
      return !!this.cartItems.find((pId) => pId == productId);
    },
    // Add to cart
    addToCart(productId) {
      this.cartItems.push(productId);
      this.saveToLocalStorage();
    },
    // remove from cart
    removeFromCart(productId) {
      console.log(productId);
      this.cartItems = this.cartItems.filter((pId) => pId != productId);
      this.cartProducts = this.cartProducts.filter((p) => p.id != productId);
      this.saveToLocalStorage();
    },
    // Format Price
    formattedPrice(price) {
      return price + ' USD';
    },
    // Product List
    products: [
      {
        id: 1,
        title: 'Hat',
        thumbnail: './images/hat.png',
        price: 5,
      },
      {
        id: 2,
        title: 'Pants',
        thumbnail: './images/pants.jpg',
        price: 10,
      },
      {
        id: 3,
        title: 'Shoes',
        thumbnail: './images/shoes.jpg',
        price: 25,
      },
      {
        id: 4,
        title: 'Socks',
        thumbnail: './images/socks.jpg',
        price: 2,
      },
      {
        id: 5,
        title: 'Watch',
        thumbnail: './images/watch.jpg',
        price: 55,
      },
      {
        id: 6,
        title: 'Shirt',
        thumbnail: './images/shirt.jpg',
        price: 15,
      },
    ],
  };
}
