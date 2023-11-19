const express = require ('express');
const { createCategory, updatedCategory, deleteCategory, getaCategory, getAllCategories } = require('../controller/blogCategoryCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:id',getaCategory);
router.get('/', getAllCategories);
router.post('/',authMiddleware, isAdmin, createCategory);
router.put('/:id',authMiddleware, isAdmin, updatedCategory);
router.delete('/:id',authMiddleware, isAdmin, deleteCategory);

module.exports = router;