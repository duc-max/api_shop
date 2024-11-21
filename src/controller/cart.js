import Cart from "../model/cart";
import Order from "../model/order";

import Stripe from "stripe";

const stripe = Stripe(
  "sk_test_51PzvPL2M4x62CqEYgogaCaB74oENPL4ex9zt06zBBQ4pg0glrakAtz4lxTiZgudRaeKxasPnSiffaPkUzsC2bEGa007i2hpR4M"
);

export const getCart = async (req, res) => {
  try {
    const cartList = await Cart.find();
    if (!cartList) {
      return res.status(500).json({ message: "No cart" });
    }

    return res.status(200).json(cartList);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const addToCart = async (req, res) => {
  try {
    let cartItem = await Cart.findOne({
      productId: req.body.productId,
      userId: req.body.userId,
    });

    if (!cartItem) {
      cartItem = new Cart({
        productName: req.body.productName,
        images: req.body.images,
        price: req.body.price,
        quantity: req.body.quantity,
        subTotal: req.body.subTotal,
        productId: req.body.productId,
        userId: req.body.userId,
      });
    } else {
      cartItem.quantity += req.body.quantity;
      cartItem.subTotal = cartItem.quantity * cartItem.price;
    }

    const savedCartItem = await cartItem.save();

    return res.status(200).json(savedCartItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    let cartItem = await Cart.findOne({
      productId: req.params.pid,
      userId: req.params.uid,
    });
    if (!cartItem) {
      return res
        .status(404)
        .json({ message: "The cart item with the given id is not found" });
    }

    const deleteItem = await Cart.findOneAndDelete({
      userId: req.params.uid,
      productId: req.params.pid,
    });

    if (!deleteItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const removeAll = async (req, res) => {
  try {
    const deleteItem = await Cart.deleteMany({
      userId: req.params.id,
    });

    if (!deleteItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updateCart = async (req, res) => {
  const cartList = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      productName: req.body.name,
      images: req.body.images,
      price: req.body.price,
      quantity: req.body.quantity,
      subTotal: req.body.subTotal,
      productId: req.body.productId,
      userId: req.body.userId,
    },
    { new: true }
  );
  if (!cartList) {
    return res.status(500).json({
      message: "Cart cannot be update",
    });
  }

  return res.status(200).json(cartList);
};

export const plusItem = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    // Tìm kiếm mặt hàng trong giỏ hàng
    let cartItem = await Cart.findOne({ productId, userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Tăng số lượng mặt hàng và cập nhật subTotal
    cartItem.quantity += 1;
    cartItem.subTotal = cartItem.quantity * cartItem.price;

    // Lưu thay đổi
    const savedCartItem = await cartItem.save();

    return res.status(200).json(savedCartItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const minusItem = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    let cartItem = await Cart.findOne({ productId, userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cartItem.subTotal = cartItem.quantity * cartItem.price;
    }
    const savedCartItem = await cartItem.save();
    return res.status(200).json(savedCartItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const payment = async (req, res) => {
  try {
    const { products } = req.body;

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.productName,
          images: [product.images],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/user/account/profile",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session", error);
    res.status(500).send("Internal Server Error");
  }
};

export const order = async (req, res) => {
  try {
    const order = req.body;
    const newOrder = new Order({
      customerName: order.customerName,
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
      address: order.address,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
    });
    await newOrder.save();
    return res.status(201).json({
      newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};
