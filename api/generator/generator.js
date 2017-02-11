const axios = require('axios');

export const INTERVAL = 10000;

export class Generator {

    constructor(id) {
        this.id = id;
        this.status = true;
        this.doRequest();
    }

    get randomInterval() {
        return (Math.floor(Math.random() * 6) + 1) * INTERVAL;
    }

    doRequest() {
        let timer = setTimeout(() => {
            axios.post(`http://${process.env.HOST}:${process.env.PORT}/wc/${this.id}/notify`, {
                status: this.status
            })
                .then(() => {
                    this.status = !this.status;
                    clearTimeout(timer);
                    console.log('Generated random - success');
                    this.doRequest();
                })
                .catch((e) => {
                    console.log('Generated random - fail');
                });
        }, this.randomInterval);
    }
}