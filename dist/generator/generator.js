'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axios = require('axios');

var INTERVAL = exports.INTERVAL = 10000;

var Generator = exports.Generator = function () {
    function Generator() {
        _classCallCheck(this, Generator);

        this.status = false;
        this.doRequest();
    }

    _createClass(Generator, [{
        key: 'doRequest',
        value: function doRequest() {
            var _this = this;

            var timer = setTimeout(function () {
                axios.post('/device', {
                    status: _this.status,
                    id: '589e3bf575d52d722a3d2c08' // toi 1234
                }).then(function () {
                    _this.status = !_this.status;
                    clearTimeout(timer);
                    _this.doRequest();
                    console.log('Generated random - success');
                }).catch(function () {
                    console.log('Generated random - fail');
                });
            }, this.randomInterval);
        }
    }, {
        key: 'randomInterval',
        get: function get() {
            return (Math.floor(Math.random() * 6) + 1) * INTERVAL;
        }
    }]);

    return Generator;
}();