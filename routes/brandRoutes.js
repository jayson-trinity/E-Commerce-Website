const express = require ('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { getaBrand, getAllBrands, createBrand, updateBrand, deleteBrand } = require('../controller/brandCtrl');
const router = express.Router();

router.get('/:id', getaBrand);
router.get('/', getAllBrands);
router.post('/',authMiddleware, isAdmin, createBrand);
router.put('/:id',authMiddleware, isAdmin, updateBrand);
router.delete('/:id',authMiddleware, isAdmin, deleteBrand);

module.exports = router;