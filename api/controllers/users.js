const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

exports.users_signup = (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length >= 1) {
				return res.status(500).json({
					message: 'Mail exist',
				});
			} else {
				bcrypt.hash(req.body.password, 10, (error, hash) => {
					if (error) {
						console.log(error);
						res.status(500).json({ error });
					} else {
						console.log(hash);
						const user = new User({
							_id: mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
						});
						user.save()
							.then(result => {
								res.status(201).json({
									message: 'User Created successfully.',
								});
							})
							.catch(error => {
								res.status(500).json({ error });
							});
					}
				});
			}
		})
		.catch(error => {
			res.status(500).json({
				message: 'User Existing',
				error,
			});
		});
};

exports.users_login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.exec()
		.then(user => {
			bcrypt.compare(req.body.password, user.password, (error, result) => {
				if (error) {
					return res.status(401).json({
						message: 'Auth failed!!',
						error,
					});
				}

				if (result) {
					const token = jwt.sign(
						{
							email: user.email,
							password: user.password,
						},
						process.env.JWT_KEY,
						{
							expiresIn: '1hr',
						}
					);

					return res.status(200).json({
						message: 'Auth successful',
						token,
					});
				}

				return res.status(500).json({
					message: 'Auth failed...',
				});
			});
		})
		.catch(error => {
			res.status(401).json({
				message: 'Auth failed',
				error,
			});
		});
};

exports.users_delete = (req, res, next) => {
	const id = req.params.userId;

	User.findOneAndRemove({ _id: id })
		.exec()
		.then(user => {
			res.status(200).json({
				message: 'User Deleted successfully!',
				user,
			});
		})
		.catch();
};
