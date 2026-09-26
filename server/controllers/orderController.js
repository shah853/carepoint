const Order = require('../models/order');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, fullName, mobileNumber, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    if (!/^03[0-9]{9}$/.test(mobileNumber || '')) {
      return res.status(400).json({ message: 'Enter a valid Pakistani mobile number, for example 03001234567' });
    }

    const order = await Order.create({
      user: req.user.id,
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    try {
      const adminEmail = process.env.ADMIN_EMAIL;

      if (adminEmail) {
        const orderForAdmin = await Order.findById(order._id)
          .populate('user', 'name email')
          .populate('items.product', 'name');
        const itemRows = orderForAdmin.items.map((item) => `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(item.product?.name || 'Product')}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center">${escapeHtml(item.quantity)}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">Rs. ${Number(item.price || 0).toLocaleString()} each</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">Rs. ${(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}</td>
          </tr>
        `).join('');

        await sendEmail({
          to: adminEmail,
          subject: 'New Order Received - CarePoint',
          html: `
            <div style="font-family:Arial,sans-serif;color:#1e293b;line-height:1.5;max-width:680px;margin:0 auto">
              <h1 style="color:#0f766e">New order received</h1>
              <p><strong>Order ID:</strong> ${escapeHtml(orderForAdmin._id)}</p>
              <p><strong>Customer:</strong> ${escapeHtml(orderForAdmin.user?.name || fullName.trim())} (${escapeHtml(orderForAdmin.user?.email || 'Unavailable')})</p>
              <table style="width:100%;border-collapse:collapse;text-align:left">
                <thead><tr><th style="padding:10px;border-bottom:2px solid #cbd5e1">Item</th><th style="padding:10px;border-bottom:2px solid #cbd5e1">Quantity</th><th style="padding:10px;border-bottom:2px solid #cbd5e1;text-align:right">Unit price</th><th style="padding:10px;border-bottom:2px solid #cbd5e1;text-align:right">Line total</th></tr></thead>
                <tbody>${itemRows}</tbody>
              </table>
              <p><strong>Total:</strong> Rs. ${Number(orderForAdmin.totalPrice || 0).toLocaleString()}</p>
              <p><strong>Payment method:</strong> ${escapeHtml(orderForAdmin.paymentMethod)}</p>
              <p><strong>Payment status:</strong> ${escapeHtml(orderForAdmin.paymentStatus)}</p>
              <p><strong>Shipping address:</strong> ${escapeHtml(orderForAdmin.shippingAddress)}</p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error('Failed to send admin order notification:', emailError);
    }

    try {
      const [customer, orderForCustomer] = await Promise.all([
        User.findById(req.user.id).select('name email'),
        Order.findById(order._id).populate('items.product', 'name'),
      ]);

      if (customer?.email) {
        const itemList = orderForCustomer.items.map((item) => `
          <li>${escapeHtml(item.product?.name || 'Product')} x ${escapeHtml(item.quantity)}</li>
        `).join('');

        await sendEmail({
          to: customer.email,
          subject: 'Order Confirmed - CarePoint',
          html: `
            <div style="font-family:Arial,sans-serif;color:#1e293b;line-height:1.5;max-width:600px;margin:0 auto">
              <h1 style="color:#0f766e">Your order is confirmed</h1>
              <p><strong>Order ID:</strong> ${escapeHtml(orderForCustomer._id)}</p>
              <p><strong>Total:</strong> Rs. ${Number(orderForCustomer.totalPrice || 0).toLocaleString()}</p>
              <h2 style="font-size:18px">Items</h2>
              <ul>${itemList}</ul>
              <p>We'll notify you when it ships.</p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error('Failed to send customer order confirmation:', emailError);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user.id };
    const order = await Order.findOne(query).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};