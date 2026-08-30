const Cart = require('../models/cart');
const Product = require('../models/product');

const calculateTotalPrice = (items) =>
  items.reduce((total, item) => {
    const price = item.product && typeof item.product === 'object' ? item.product.price : 0;
    return total + price * item.quantity;
  }, 0);

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    cart.totalPrice = calculateTotalPrice(cart.items);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const requestedQuantity = Number(quantity);

    if (!productId || !Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ message: 'A product and a positive integer quantity are required' });
    }

    const product = await Product.findById(productId).select('price');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity: requestedQuantity }],
        totalPrice: product.price * requestedQuantity,
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += requestedQuantity;
      } else {
        cart.items.push({ product: productId, quantity: requestedQuantity });
      }
      await cart.populate('items.product');
      cart.totalPrice = calculateTotalPrice(cart.items);
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    await cart.populate('items.product');
    cart.totalPrice = calculateTotalPrice(cart.items);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
