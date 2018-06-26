const mongoose = require('mongoose');
const fs = require('fs');

const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
	Product.find()
		.select('name productImage price _id')
		.exec()
		.then(docs => {
			res.status(200).json({ 'Number of Porduct': docs.length, Products: docs });
		})
		.catch(error => {
			res.status(500).json({ error });
		});
};

exports.products_add_product = (req, res, next) => {
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
			fs.unlink(req.file.path, error => {
				if (error) throw err;
				console.log('successfully deleted /tmp/hello');
			});
		});
};

exports.products_get_one = (req, res, next) => {
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
};

exports.products_edit = (req, res, next) => {
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
};

exports.products_delete = (req, res, next) => {
	const id = req.params.productId;
	Product.findOneAndRemove({ _id: id })
		.exec()
		.then(result => {
			fs.unlink(result.productImage, error => {
				if (error) throw err;
				console.log('successfully deleted /tmp/hello');
			});
			res.status(200).json({
				message: 'Product deleted!',
				Request: {
					type: 'POST',
					url: 'http://localhost:3000/products/',
				},
			});
		})
		.catch(error => {
			res.status(500).json({
				message: 'Product Not Found!',
				error,
			});
		});
};
