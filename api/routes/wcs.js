const express = require('express')
const router = express.Router();

const Wc = require('../schemas/wc');

router.get('/', (req, res) => {
    const params = req.query;
    if('category' in params) {
        Wc.find({ categoryIda: params.category }, (err, item) => {
            if(err) {
                console.error(err);
            }
            res.json({
                status: 'success',
                data: item
            });
        });
    } else {
        Wc.find((err, items) => {
            if(err) {
                console.error(err);
            }
            res.json({
                status: 'success',
                data: items
            });
        });
    }
});

module.exports = router; 