function initAlpine() {
  // Exc
  const cartItemsKey = 'lwnUserCartItems';

  return {
    cartItems:
      JSON.parse(
        localStorage.getItem(cartItemsKey) === null
          ? '[]'
          : localStorage.getItem(cartItemsKey)
      ) || [],

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
      this.cartItems = this.cartItems.filter((pId) => pId != productId);
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
