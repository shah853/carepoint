const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/doctor');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentStatuses = ['pending', 'paid', 'failed'];
const appointmentStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getPhoneSearch = (value) => {
	const digits = value.replace(/\D/g, '');
	const datePattern = /^\d{1,4}[-/]\d{1,2}([-/]\d{1,4})?$/;

	if (!/^[+\d\s().-]+$/.test(value) || digits.length < 3 || datePattern.test(value)) {
		return '';
	}

	return digits.startsWith('92') && digits.length > 2
		? `0${digits.slice(2)}`
		: digits;
};

const getAllOrders = async (req, res) => {
	try {
		const search = req.query.search?.trim();
		let orders;

		if (search) {
			const searchRegex = new RegExp(escapeRegex(search), 'i');
			const phoneSearch = getPhoneSearch(search);
			const searchConditions = [
				{ fullName: searchRegex },
				{ 'matchedUser.name': searchRegex },
				{ 'matchedUser.email': searchRegex },
				{ shippingAddress: searchRegex },
				{ 'matchedProducts.name': searchRegex },
				{ status: searchRegex },
				{ orderIdText: searchRegex },
				{ orderDateISO: searchRegex },
				{ orderDateUS: searchRegex },
				{ orderDateLocal: searchRegex },
			];

			if (phoneSearch) {
				searchConditions.push({ mobileNumber: new RegExp(escapeRegex(phoneSearch), 'i') });
			}

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
					$addFields: {
						orderIdText: { $toString: '$_id' },
						orderDateISO: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
						orderDateUS: { $dateToString: { format: '%m/%d/%Y', date: '$createdAt' } },
						orderDateLocal: {
							$concat: [
								{ $toString: { $month: '$createdAt' } },
								'/',
								{ $toString: { $dayOfMonth: '$createdAt' } },
								'/',
								{ $toString: { $year: '$createdAt' } },
							],
						},
					},
				},
				{
					$match: {
						$or: searchConditions,
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
				{ $unset: ['matchedUser', 'matchedProducts', 'orderIdText', 'orderDateISO', 'orderDateUS', 'orderDateLocal'] },
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
		const search = req.query.search?.trim();

		if (search) {
			const searchRegex = new RegExp(escapeRegex(search), 'i');
			const phoneSearch = getPhoneSearch(search);
			const searchConditions = [
				{ appointmentIdText: searchRegex },
				{ 'matchedUser.name': searchRegex },
				{ appointmentDateISO: searchRegex },
				{ appointmentDateUS: searchRegex },
				{ appointmentDateLocal: searchRegex },
			];

			if (phoneSearch) {
				const phoneRegex = new RegExp(escapeRegex(phoneSearch), 'i');
				searchConditions.push(
					{ contactNumber: phoneRegex },
					{ 'matchedOrders.mobileNumber': phoneRegex }
				);
			}

			const appointments = await Appointment.aggregate([
				{
					$lookup: {
						from: User.collection.name,
						localField: 'user',
						foreignField: '_id',
						pipeline: [{ $project: { name: 1 } }],
						as: 'matchedUser',
					},
				},
				...(phoneSearch ? [{
					$lookup: {
						from: Order.collection.name,
						localField: 'user',
						foreignField: 'user',
						pipeline: [{ $project: { mobileNumber: 1 } }],
						as: 'matchedOrders',
					},
				}] : []),
				{
					$addFields: {
						appointmentIdText: { $toString: '$_id' },
						contactNumber: {
							$ifNull: ['$contactNumber', { $arrayElemAt: ['$matchedOrders.mobileNumber', 0] }],
						},
						appointmentDateISO: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
						appointmentDateUS: { $dateToString: { format: '%m/%d/%Y', date: '$date' } },
						appointmentDateLocal: {
							$concat: [
								{ $toString: { $month: '$date' } },
								'/',
								{ $toString: { $dayOfMonth: '$date' } },
								'/',
								{ $toString: { $year: '$date' } },
							],
						},
					},
				},
				{ $match: { $or: searchConditions } },
				{ $sort: { date: 1 } },
				{ $unset: ['matchedUser', 'matchedOrders', 'appointmentIdText', 'appointmentDateISO', 'appointmentDateUS', 'appointmentDateLocal'] },
			]);

			await Appointment.populate(appointments, [
				{ path: 'user', select: 'name email' },
				{ path: 'doctor', select: 'name specialization image' },
			]);

			return res.json(appointments);
		}

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
