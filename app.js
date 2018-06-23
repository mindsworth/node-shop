const express = require('express');
const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose
	.connect(
		'mongodb+srv://princegoziem:' +
			process.env.MONGO_ATLAS_PW +
			'@node-shop-okail.mongodb.net/test?retryWrites=true'
	)
	.then(() => {
		console.log('Database Connected!');
	})
	.catch(() => {
		console.log('Fail to connect to Database!');
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
