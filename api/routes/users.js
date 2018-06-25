const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
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
});

router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email })
		.exec()
		.then(user => {
			// console.log(user);
			// res.status(200).json({ user });
			bcrypt.compare(req.body.password, user.password, (error, result) => {
				if (error) {
					res.status(409).json({
						message: 'Auth failed!!',
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
			});
		})
		.catch(error => {
			res.status(401).json({
				message: 'Auth failed',
			});
		});
});

router.delete('/:userId', (req, res, next) => {
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
});

module.exports = router;
