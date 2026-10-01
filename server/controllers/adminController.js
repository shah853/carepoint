const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/doctor');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentStatuses = ['pending', 'paid', 'failed'];
const appointmentStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

const getAllOrders = async (req, res) => {
	try {
		const search = req.query.search?.trim();
		let orders;

		if (search) {
			const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
			orders = await Order.aggregate([
				{
					$lookup: {
						from: User.collection.name,
						localField: 'user',
						foreignField: '_id',
						pipeline: [{ $project: { name: 1, email: 1 } }],
						as: 'matchedUser',
					},
				},
				{
					$lookup: {
						from: Product.collection.name,
						localField: 'items.product',
						foreignField: '_id',
						pipeline: [{ $project: { name: 1, images: 1, price: 1 } }],
						as: 'matchedProducts',
					},
				},
				{
					$match: {
						$or: [
							{ fullName: searchRegex },
							{ 'matchedUser.name': searchRegex },
							{ 'matchedUser.email': searchRegex },
							{ 'matchedProducts.name': searchRegex },
						],
					},
				},
				{ $sort: { createdAt: -1 } },
				{
					$set: {
						user: { $arrayElemAt: ['$matchedUser', 0] },
						items: {
							$map: {
								input: '$items',
								as: 'item',
								in: {
									$mergeObjects: [
										'$$item',
										{
											product: {
												$arrayElemAt: [
													{
														$filter: {
															input: '$matchedProducts',
															as: 'product',
															cond: { $eq: ['$$product._id', '$$item.product'] },
														},
													},
													0,
												],
											},
										},
									],
								},
							},
						},
					},
				},
				{ $unset: ['matchedUser', 'matchedProducts'] },
			]);
		} else {
			orders = await Order.find()
				.populate('user', 'name email')
				.populate('items.product', 'name images price')
				.sort({ createdAt: -1 });
		}

		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateOrderStatus = async (req, res) => {
	try {
		if (!orderStatuses.includes(req.body.status)) {
			return res.status(400).json({ message: 'Invalid order status' });
		}

		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: 'Invalid order ID' });
		}

		const order = await Order.findByIdAndUpdate(
			req.params.id,
			{ status: req.body.status },
			{ new: true, runValidators: true }
		)
			.populate('user', 'name email')
			.populate('items.product', 'name images price');

		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}

		res.json(order);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updatePaymentStatus = async (req, res) => {
	try {
		if (!paymentStatuses.includes(req.body.status)) {
			return res.status(400).json({ message: 'Invalid payment status' });
		}

		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: 'Invalid order ID' });
		}

		const order = await Order.findByIdAndUpdate(
			req.params.id,
			{ paymentStatus: req.body.status },
			{ new: true, runValidators: true }
		)
			.populate('user', 'name email')
			.populate('items.product', 'name images price');

		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}

		res.json(order);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getDashboardStats = async (req, res) => {
	try {
		const [
			totalOrders,
			pendingOrders,
			deliveredOrders,
			totalProducts,
			totalDoctors,
			totalAppointments,
			totalUsers,
			revenueResult,
		] = await Promise.all([
			Order.countDocuments(),
			Order.countDocuments({ status: 'pending' }),
			Order.countDocuments({ status: 'delivered' }),
			Product.countDocuments(),
			Doctor.countDocuments(),
			Appointment.countDocuments(),
			User.countDocuments(),
			Order.aggregate([
				{ $match: { paymentStatus: 'paid' } },
				{ $group: { _id: null, total: { $sum: '$totalPrice' } } },
			]),
		]);

		res.json({
			totalOrders,
			pendingOrders,
			deliveredOrders,
			totalProducts,
			totalDoctors,
			totalAppointments,
			totalUsers,
			totalRevenue: revenueResult[0]?.total || 0,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllAppointments = async (req, res) => {
	try {
		const appointments = await Appointment.find()
			.populate('user', 'name email')
			.populate('doctor', 'name specialization')
			.sort({ date: 1 });

		res.json(appointments);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateAppointmentStatus = async (req, res) => {
	try {
		if (!appointmentStatuses.includes(req.body.status)) {
			return res.status(400).json({ message: 'Invalid appointment status' });
		}

		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: 'Invalid appointment ID' });
		}

		const appointment = await Appointment.findByIdAndUpdate(
			req.params.id,
			{ status: req.body.status },
			{ new: true, runValidators: true }
		)
			.populate('user', 'name email')
			.populate('doctor', 'name specialization image');

		if (!appointment) {
			return res.status(404).json({ message: 'Appointment not found' });
		}

		res.json(appointment);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getAllOrders,
	updateOrderStatus,
	updatePaymentStatus,
	getDashboardStats,
	getAllAppointments,
	updateAppointmentStatus,
};
