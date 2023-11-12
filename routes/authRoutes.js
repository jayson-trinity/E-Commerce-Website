const express = require('express');
const { createUser, loginUserCtrl, getAllUsers, getSingleUser, deleteaUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword,  forgotPasswordToken, resetPassword } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/all-users',getAllUsers);
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout);
router.get('/:id',authMiddleware, isAdmin , getSingleUser);
router.delete('/:id', deleteaUser);
router.post ('/forgot-password-token', forgotPasswordToken);
router.put ('/reset-password/:token', resetPassword);
router.put('/edit-user',authMiddleware, updateaUser);
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser);
router.put('/password',authMiddleware, updatePassword);


module.exports = router;