const axios = require('axios');

export const INTERVAL = 10000;

export class Generator {

    constructor() {
        this.status = false;
        this.doRequest();
    }

    get randomInterval() {
        return (Math.floor(Math.random() * 6) + 1) * INTERVAL;
    }

    doRequest() {
        let timer = setTimeout(() => {
            axios.post('/device', {
                status: this.status,
                id: '589e3bf575d52d722a3d2c08' // toi 1234
            })
                .then(() => {
                    this.status = !this.status;
                    clearTimeout(timer);
                    this.doRequest();
                    console.log('Generated random - success');
                })
                .catch(() => {
                    console.log('Generated random - fail');
                });
        }, this.randomInterval);
    }
}