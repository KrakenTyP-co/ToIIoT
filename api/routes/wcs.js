const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();

const Wc = require('../schemas/wc');

router.get('/', (req, res) => {
    const params = req.query;
    if('category' in params) {
        Wc.find({ categoryId: new ObjectId(params.category) }, (err, item) => {
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
            if (err) {
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
        if (!item) {
            res.status(404);
            return res.json({
                status: 'error',
                message: 'Wc not found'
            });
        }
        if (err) {
            console.error(err);
        }
        res.json({
            status: 'success',
            data: item
        });
    });
});

module.exports = router;