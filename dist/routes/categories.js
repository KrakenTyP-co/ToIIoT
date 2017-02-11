'use strict';

var express = require('express');
var router = express.Router();

var Category = require('../schemas/category');

router.get('/', function (req, res) {
    Category.find(function (err, items) {
        if (err) {
            res.send(err);
        }
        res.json({
            status: 'success',
            data: items
        });
    });
});

module.exports = router;