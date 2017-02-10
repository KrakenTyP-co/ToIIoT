const express = require('express')
const router = express.Router();

const Category = require('../schemas/category');

router.get('/', function(req, res) {
    Category.find((err, items) => {
        if(err) {
            res.send(err);
        }
        res.json({
            status: 'success',
            data: items
        });
    }); 
});

module.exports = router;