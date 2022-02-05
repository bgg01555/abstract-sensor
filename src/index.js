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
        this.sensors = [];
    }

    start(sensor) {
        this.sensors.push(sensor.shift());
    }

    publish(obj) {
        if (this.sensors[0].powerStatus === "on") {
            this.deviceId = obj.deviceId;
            this.actionId = obj.actionId;
            this.payload = obj.payload;
            this.sensors[0].reportingInterval = obj.payload;
        }
    }
}

module.exports = {
    Sensor,
    IotServer,
};
