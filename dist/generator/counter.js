'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Report = require('../schemas/report');
var ObjectId = require('mongoose').Types.ObjectId;
var Date = require('mongoose').Types.Date;

var Counter = exports.Counter = function () {
    function Counter() {
        _classCallCheck(this, Counter);

        this.counter = new Map();
        this.notificationFunction = null;
    }

    _createClass(Counter, [{
        key: 'dbWrite',
        value: function dbWrite(wcId) {
            var _this = this;

            var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            return Report.create({
                wcId: new ObjectId(wcId),
                status: status
            }).then(function () {
                if (status === false) {
                    var value = 1;
                    if (_this.counter.has(wcId)) {
                        value = _this.counter.get(wcId) + 1;
                    }

                    _this.counter.set(wcId, value);

                    _this.callNotification(value);
                }
            });
        }
    }, {
        key: 'callNotification',
        value: function callNotification(value) {
            if (typeof this.notificationFunction === 'function') {
                this.notificationFunction(value);
            }
        }
    }, {
        key: 'clear',
        value: function clear(wcId) {
            this.counter.remove(wcId);
        }
    }]);

    return Counter;
}();