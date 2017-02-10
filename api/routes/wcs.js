const express = require('express')
const router = express.Router();

const Wc = require('../schemas/wc');

router.get('/', (req, res) => {
    const params = req.query;
    if('category' in params) {
        Wc.find({ categoryId: params.category }, (err, item) => {
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

router.get('/:token', (req, res) => {
    Wc.findById(req.params.token, (err, item) => {
        if(item === null) {
            return res.sendStatus(404);
        }
        if(err) {
            console.error(err);
        }
        res.json({
            status: 'success',
            data: item
        });
    });
});

module.exports = router; 