const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');

const app = express();

mongoose
	.connect(keys.mongoURI)
	.then(() => {
		console.log('Database Connected!!!');
	})
	.catch(() => {
		console.log('Fail to connect the Database!');
	});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content- Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Headers', 'PUT, POST, PATCH, GET, DELETE');
		return res.status(200).json({});
	}
	next();
});

app.use('/products', productsRoute);
app.use('/orders', ordersRoute);

app.use((req, res, next) => {
	const error = new Error('Request Not Found!');
	error.status = 404;

	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500).json({
		error: {
			message: error.message,
		},
	});
});

module.exports = app;
