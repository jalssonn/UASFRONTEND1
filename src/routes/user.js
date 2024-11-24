const express = require('express');
const router = express.Router();
const { 
    getProfile, 
    updateProfile, 
    changePassword 
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Semua route membutuhkan token
router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;