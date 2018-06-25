const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/product');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/products/');
	},
	filename: (req, file, cb) => {
		const fileNameOrigin = file.originalname;
		const fileStr = fileNameOrigin.split('.', -1);
		const fileName = fileStr[0] + new Date().toISOString().replace(/:/g, '-') + '.' + fileStr[1];
		cb(null, fileName);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage,
	limit: {
		filesize: 1024 * 1024 * 5,
	},
	fileFilter,
});

router.get('/', (req, res, next) => {
	Product.find()
		.select('name productImage price _id')
		.exec()
		.then(docs => {
			res.status(200).json({ 'Number of Porduct': docs.length, Products: docs });
		})
		.catch(error => {
			res.status(500).json({ error });
		});
});

router.post('/', upload.single('productImage'), (req, res, next) => {
	console.log(req.file);

	const product = new Product({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path,
	});

	product
		.save()
		.then(result => {
			res.status(201).json({
				message: 'Product Created!',
				CreatedProduct: {
					name: result.name,
					price: result.price,
					_id: result._id,
					productImage: result.productImage,
				},
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/',
				},
			});
		})
		.catch(error => {
			res.status(500).json({ error });
		});
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;

	Product.findById(id)
		.select('name productImage price _id')
		.exec()
		.then(doc => {
			if (doc) {
				res.status(200).json({
					Product: doc,
					Request: {
						type: 'GET',
						url: 'http://localhost:3000/products/' + id,
					},
				});
			} else {
				res.status(404).json({
					message: 'No valid entry found for the provided ID',
				});
			}
		})
		.catch(error => {
			res.status(500).json({ error });
		});
});

router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId;
	const productOps = {};
	for (ops of req.body) {
		productOps[ops.propName] = ops.value;
	}

	Product.update({ _id: id }, { $set: productOps })
		.exec()
		.then(doc => {
			res.status(200).json({
				message: 'Updated successfully.',
				Request: 'http://localhost:3000/products/' + id,
			});
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.findOneAndRemove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Product deleted!',
				Request: {
					type: 'POST',
					url: 'http://localhost:3000/products/',
				},
			});
		})
		.catch(error => {
			res.status(500).json({ error });
		});
});

module.exports = router;
