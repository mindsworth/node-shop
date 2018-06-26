const express = require('express');
const multer = require('multer');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const products = require('../controllers/products');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/products/');
	},
	filename: (req, file, cb) => {
		const fileNameOrigin = file.originalname;
		const rest = fileNameOrigin.substring(0, fileNameOrigin.lastIndexOf('/') + 1);
		const last = fileNameOrigin.substring(fileNameOrigin.lastIndexOf('/') + 1, fileNameOrigin.length);
		const fileName = rest + new Date().toISOString().replace(/:/g, '-') + last;
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

router.get('/', products.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), products.products_add_product);

router.get('/:productId', checkAuth, products.products_get_one);

router.patch('/:productId', checkAuth, products.products_edit);

router.delete('/:productId', checkAuth, products.products_delete);

module.exports = router;
