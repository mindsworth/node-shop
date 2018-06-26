const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const orders = require('../controllers/orders');

router.get('/', checkAuth, orders.orders_get_all);

router.post('/', checkAuth, orders.Orders_add_order);

router.get('/:orderId', checkAuth, orders.orders_get_one);

router.delete('/:orderId', checkAuth, orders.orders_delete_order);

module.exports = router;
