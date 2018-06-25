const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
	Order.find()
		.select('productId quantity _id')
		.exec()
		.then(result => {
			res.status(200).json({
				'Total Orders': result.length,
				Orders: result.map(order => {
					return {
						_id: order._id,
						productId: order.productId,
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
});

router.post('/', (req, res, next) => {
	const order = new Order({
		_id: mongoose.Types.ObjectId(),
		productId: req.body.productId,
		quantity: req.body.quantity,
	});

	order
		.save()
		.then(result => {
			res.status(200).json({
				message: 'Order created.',
				Order: {
					_id: result._id,
					productId: result.productId,
					quantity: result.quantity,
				},
			});
		})
		.catch(error => {
			res.status(500).json({ error });
		});
});

router.get('/:orderId', (req, res, next) => {
	const id = req.params.orderId;

	Order.findById({ _id: id })
		.select('productId quantity _id')
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Your order',
				Order: result,
			});
		})
		.catch(error => {
			res.status(200).json(error);
		});
});

router.delete('/:orderId', (req, res, next) => {
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
});

module.exports = router;
