const express = require('express')
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const Wc = require('../schemas/wc');
const Report = require('../schemas/report');

router.get('/', (req, res) => {
    const params = req.query;
    if ('category' in params) {
        Wc.find({ categoryId: params.category }, (err, item) => {
            if (err) {
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


/**
 * Report generator
 */
// const data = require('./data');
// const moment = require('moment');
// router.get('/gen', (req, res) => {
//     for (let item of data) {
//         if (item.status === 'occupied' || item.status === 'vacant') {
//             let report = new Report();
//             report.date = moment(item.date);
//             report.status = item.status === 'occupied' ? true : false;
//             report.wcId = new ObjectId('589e3bf575d52d722a3d2c08');
//             report.save();

//             let report2 = new Report();
//             report2.date = moment(item.date);
//             report2.status = item.status === 'occupied' ? false : true;
//             report2.wcId = new ObjectId('589e3cda75d52d722a3d2cda');
//             report2.save();
//         }
//     }
//     res.json({});
// });

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