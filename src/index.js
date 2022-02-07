class Sensor {
    constructor(id) {
        this.id = id;
        this.powerStatus = 'off';
        this.reportingInterval = 10000;
    }

    turn(onoff) {
        if (this.powerStatus === onoff) {
            throw new sameButtonTypeError();
        }

        if (onoff === "on") {
            this.powerStatus = onoff;
            this.status = "idle";


            setTimeout(() => this.status = "sensingDistance", this.reportingInterval);
            setTimeout(() => this.status = "reportingData", this.reportingInterval + 500);
            setTimeout(() => this.status = "idle", this.reportingInterval + 1000);

        }
        else if (onoff === "off") {
            this.powerStatus = onoff;
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

    publish(eventObj) {

        for (const sensor of this.running_sensors) {
            if (sensor.id === eventObj.deviceId) {
                if (sensor.powerStatus === "on") {
                    if (eventObj.actionId === 'CHANGE_REPORTING_INTERVAL') {
                        sensor.reportingInterval = eventObj.payload;
                    }
                }
            }
        }


    }
}

module.exports = {
    Sensor,
    IotServer,
};
