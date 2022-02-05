class Sensor {
    constructor(id) {
        this.id = id;
        this.powerStatus = 'off';
        this.reportingInterval = 10000;
    }

    turn(buttons) {
        if (this.powerStatus === buttons) {
            throw new sameButtonTypeError();
        }

        if (buttons === "on") {
            this.powerStatus = buttons;
            this.status = "idle";


            setTimeout(() => this.status = "sensingDistance", this.reportingInterval);
            setTimeout(() => this.status = "reportingData", this.reportingInterval + 500);
            setTimeout(() => this.status = "idle", this.reportingInterval + 1000);

        }
        else if (buttons === "off") {
            this.powerStatus = buttons;
        }
        else throw new otherButtonTypeError();


    }










}

class IotServer {
    constructor() {
        this.running_sensors = [];
    }

    start(sensor) {
        this.running_sensors.push(...sensor);
    }

    publish(sensor) {

        for (const i of this.running_sensors) {
            if (i.id === sensor.deviceId) {
                if (i.powerStatus === "on") {
                    i.reportingInterval = sensor.payload;
                }
            }
        }


    }
}

module.exports = {
    Sensor,
    IotServer,
};
