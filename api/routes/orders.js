const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
	Order.find()
		.select('product quantity _id')
		.exec()
		.then(result => {
			res.status(200).json({
				'Total Orders': result.length,
				Orders: result,
			});
		})
		.catch(error => {
			res.status(500).json({ error });
		});
});

router.post('/', (req, res, next) => {
	const order = new Order({
		_id: mongoose.Types.ObjectId(),
		product: req.body.productId,
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
		.select('product quantity _id')
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
	res.status(200).json({
		message: 'Order deleted.',
		id: id,
	});
});

module.exports = router;
