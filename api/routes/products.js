const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'handling GET request to /products',
	});
});

router.post('/', (req, res, next) => {
	const product = {
		productId: req.body.productId,
		quantity: req.body.quantity,
	};
	res.status(201).json({
		message: 'handling POST request to /products',
		product,
	});
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;

	if (id === 'special') {
		res.status(200).json({
			message: 'You have discover the special ID',
			id: id,
		});
	} else {
		res.status(200).json({
			message: 'You have discover another ID',
			id: id,
		});
	}
});

router.patch('/:productId', (req, res, next) => {
	res.status(200).json({
		message: 'handling PATCH request to update products',
	});
});

router.delete('/:productId', (req, res, next) => {
	res.status(200).json({
		message: 'handling DELETE request to delete product',
	});
});

module.exports = router;
