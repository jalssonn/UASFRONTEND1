const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.user.userId);

        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ message: 'Username sudah digunakan' });
            }
            user.username = username;
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email sudah digunakan' });
            }
            user.email = email;
        }

        await user.save();
        res.json({
            message: 'Profil berhasil diupdate',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Password saat ini salah' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password berhasil diubah' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};