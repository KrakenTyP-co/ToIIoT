const Report = require('../schemas/report');
const ObjectId = require('mongoose').Types.ObjectId;
const Date = require('mongoose').Types.Date;

export class Counter {

    constructor() {
        this.counter = new Map();
        this.notificationFunction = null;
    }

    dbWrite(wcId, status = false) {
        return Report.create({
            wcId: new ObjectId(wcId),
            status: status
        }).then(() => {
            if (status === false) {
                let value = 1;
                if (this.counter.has(wcId)) {
                    value = this.counter.get(wcId) + 1;
                }

                this.counter.set(wcId, value);

                this.callNotification(wcId, value);
            }
        });
    }

    callNotification(wcId, value) {
        if (typeof this.notificationFunction === 'function') {
            this.notificationFunction(wcId, value);
        }
    }

    clear(wcId) {
        this.counter.remove(wcId);
    }
}