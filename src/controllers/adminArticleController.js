const Article = require('../models/article');

// Create Article
exports.createArticle = async (req, res) => {
    try {
        const article = await Article.create({
            ...req.body,
            author: req.user.userId
        });
        
        res.status(201).json({
            message: 'Artikel berhasil dibuat',
            article
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Articles (with filter & pagination)
exports.getAllArticles = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};
        
        if (status) query.status = status;
        
        const articles = await Article.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
            
        const total = await Article.countDocuments(query);
        
        res.json({
            message: 'Berhasil mendapatkan daftar artikel',
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            articles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Article
exports.updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!article) {
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        }
        
        res.json({
            message: 'Artikel berhasil diupdate',
            article
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Article
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        
        if (!article) {
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        }
        
        res.json({
            message: 'Artikel berhasil dihapus',
            article
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};