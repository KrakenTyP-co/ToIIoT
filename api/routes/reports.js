const express = require('express');
const moment = require('moment')
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();

const Report = require('../schemas/report');

const generateFuckingData = (format, from, to, interval) => {
    const createTimeKey = (date) => {
        return date.format(format)
    }

    return new Promise((resolve, reject) => {
        Report.find({
            date: {
                $gte: from,
                $lt: to
            }
        }, (err, items) => {
            let lastOccupied = null;
            let stats = {};
            let firstDate = null;
            for (let item of items) {
                if (item.status === false && lastOccupied === null) {
                    lastOccupied = moment(item.date);
                }

                if (item.status === true && lastOccupied !== null) {
                    let timeKey = createTimeKey(lastOccupied);
                    if (!(timeKey in stats)) {
                        stats[timeKey] = 0;
                    }
                    let datetime = moment(item.date);
                    let elapsed = datetime - lastOccupied;
                    stats[timeKey] += 1;

                    lastOccupied = null;
                }
            }

            // Generate missing data
            const lastDate = to
            let date = moment(from);
            do {
                let timeKey = createTimeKey(date);
                if (!(timeKey in stats)) {
                    stats[timeKey] = 0;
                }
                date.add(1, interval);
            } while (date <= to);

            const statsArray = [];
            Object.keys(stats).map(timekey => {
                statsArray.push({
                    timestamp: timekey,
                    time: moment(timekey).format('X'),
                    value: stats[timekey]
                })
            });
            statsArray.sort((a, b) => {
                return a.time - b.time;
            });

            resolve(statsArray);
        });
    });
}

const generateFuckingSumData = (format, from, to, interval) => {
    const createTimeKey = (date) => {
        return date.format(format)
    }

    return new Promise((resolve, reject) => {
        Report.find({
            date: {
                $gte: from,
                $lt: to
            }
        }, (err, items) => {
            let lastOccupied = null;
            let stats = {};
            let firstDate = null;
            for (let item of items) {
                if (item.status === false && lastOccupied === null) {
                    lastOccupied = moment(item.date);
                }

                if (item.status === true && lastOccupied !== null) {
                    let timeKey = createTimeKey(lastOccupied);
                    if (!(timeKey in stats)) {
                        stats[timeKey] = 0;
                    }
                    let datetime = moment(item.date);
                    let elapsed = datetime - lastOccupied;
                    stats[timeKey] += elapsed / 1000;

                    lastOccupied = null;
                }
            }

            // Generate missing data
            const lastDate = to
            let date = moment(from);
            do {
                let timeKey = createTimeKey(date);
                if (!(timeKey in stats)) {
                    stats[timeKey] = 0;
                }
                date.add(1, interval);
            } while (date <= to);

            const statsArray = [];
            Object.keys(stats).map(timekey => {
                statsArray.push({
                    timestamp: timekey,
                    time: moment(timekey).format('X'),
                    value: stats[timekey]
                })
            });
            statsArray.sort((a, b) => {
                return a.time - b.time;
            });

            resolve(statsArray);
        });
    });
}

router.get('/monthly/sum', (req, res) => {
    const params = req.query;
    const from = moment(params.from);
    const to = moment(params.to);
    if ((to - from) / 1000 > 86400 * 366 * 10) {
        return res.status(400).json({
            status: "error",
            message: "Maximalny interval je 10 rokov kamarat."
        })
    }
    
    generateFuckingSumData('YYYY-MM-01 00:00:00', from, to, 'month').then(data => {
        res.json({
            status: 'success',
            data
        });
    })
});

router.get('/daily/sum', (req, res) => {
    const params = req.query;
    const from = moment(params.from);
    const to = moment(params.to);
    if ((to - from) / 1000 > 86400 * 366) {
        return res.status(400).json({
            status: "error",
            message: "Maximalny interval je 1 rok kamarat."
        })
    }
    
    generateFuckingSumData('YYYY-MM-DD 00:00:00', from, to, 'day').then(data => {
        res.json({
            status: 'success',
            data
        });
    })
});

router.get('/hourly/sum', (req, res) => {
    const params = req.query;
    const from = moment(params.from);
    const to = moment(params.to);
    if ((to - from) / 1000 > 86400 * 31) {
        return res.status(400).json({
            status: "error",
            message: "Maximalny interval je 31 dni kamarat."
        })
    }
    
    generateFuckingSumData('YYYY-MM-DD HH:00:00', from, to, 'hour').then(data => {
        res.json({
            status: 'success',
            data
        });
    })
});

router.get('/monthly/count', (req, res) => {
    const params = req.query;
    const from = moment(params.from);
    const to = moment(params.to);
    if ((to - from) / 1000 > 86400 * 366 * 10) {
        return res.status(400).json({
            status: "error",
            message: "Maximalny interval je 10 rokov kamarat."
        })
    }
    
    generateFuckingData('YYYY-MM-01 00:00:00', from, to, 'month').then(data => {
        res.json({
            status: 'success',
            data
        });
    })
});

router.get('/daily/count', (req, res) => {
    const params = req.query;
    const from = moment(params.from);
    const to = moment(params.to);
    if ((to - from) / 1000 > 86400 * 366) {
        return res.status(400).json({
            status: "error",
            message: "Maximalny interval je 1 rok kamarat."
        })
    }

    generateFuckingData('YYYY-MM-DD 00:00:00', from, to, 'day').then(data => {
        res.json({
            status: 'success',
            data
        });
    })
});

router.get('/hourly/count', (req, res) => {
    const params = req.query;
    const from = moment(params.from);
    const to = moment(params.to);
    if ((to - from) / 1000 > 86400 * 31) {
        return res.status(400).json({
            status: "error",
            message: "Maximalny interval je 31 dni kamarat."
        })
    }

    generateFuckingData('YYYY-MM-DD HH:00:00', from, to, 'hour').then(data => {
        res.json({
            status: 'success',
            data
        });
    })
});

module.exports = router;