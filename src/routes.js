const express = require('express');
const { nanoid } = require('nanoid');
const { urlDB, reverseDB } = require('./store');

const router = express.Router();
const PORT = 3000;

router.post('/shorten', (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    if (reverseDB.has(originalUrl)) {
        return res.json({
            shortUrl: `http://localhost:${PORT}/${reverseDB.get(originalUrl)}`
        });
    }

    const shortId = nanoid(6);
    urlDB.set(shortId, originalUrl);
    reverseDB.set(originalUrl, shortId);

    res.json({
        shortUrl: `http://localhost:${PORT}/${shortId}`
    });
});

router.get('/:shortId', (req, res) => {
    const { shortId } = req.params;

    if (!urlDB.has(shortId)) {
        return res.status(404).send("URL not found.");
    }

    res.redirect(urlDB.get(shortId));
});

module.exports = router;