const Order = require('../models/order');
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
	Order.find()
		.select('product quantity _id')
		.populate('product', 'name price _id productImage')
		.exec()
		.then(result => {
			res.status(200).json({
				'Total Orders': result.length,
				Orders: result.map(order => {
					return {
						_id: order._id,
						product: order.product,
						quantity: order.quantity,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/orders/' + order._id,
						},
					};
				}),
			});
		})
		.catch(error => {
			res.status(500).json({ error });
		});
};

exports.Orders_add_order = (req, res, next) => {
	Product.findById({ _id: req.body.productId })
		.exec()
		.then(product => {
			if (!product) {
				return res.status(404).json({
					message: 'Product not found!!',
				});
			}
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				product: req.body.productId,
				quantity: req.body.quantity,
			});

			return order.save();
		})
		.then(result => {
			res.status(200).json({
				message: 'Order created.',
				CreatedOrder: {
					_id: result._id,
					product: result.product,
					quantity: result.quantity,
				},
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/' + result._id,
				},
			});
		})
		.catch(error => {
			res.status(500).json({
				message: 'Product not found!',
				error,
			});
		});
};

exports.orders_get_one = (req, res, next) => {
	const id = req.params.orderId;

	Order.findById({ _id: id })
		.select('product quantity _id')
		.populate('product', 'name price _id productImage')
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Your order',
				Order: result,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/',
				},
			});
		})
		.catch(error => {
			res.status(200).json(error);
		});
};

exports.orders_delete_order = (req, res, next) => {
	const id = req.params.orderId;

	Order.findByIdAndRemove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Order deleted.',
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/',
				},
			});
		})
		.catch(error => {
			res.status(200).json({ error });
		});
};
