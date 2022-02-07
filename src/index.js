class Sensor {
    constructor(id) {
        this.id = id;
        this.powerStatus = 'off';
        this.reportingInterval = 10000;
        this.status = '';
        this.running_settimeout_Id;
    }

    distance_determination() {
        this.status = "sensingDistance";
        this.running_settimeout_Id = setTimeout(() => this.data_reporting(), 500);
    }

    data_reporting() {
        this.status = "reportingData";
        this.running_settimeout_Id = setTimeout(() => this.switch_idle(), 1000);
    }

    switch_idle() {
        this.status = "idle"
        this.running_settimeout_Id = setTimeout(() => this.distance_determination(), this.reportingInterval);
    }

    turn(onoff) {
        if (this.powerStatus === "on" && onoff === "on") {
            throw new sameButtonTypeError('이미 켜져있는 센서입니다.');
        }

        if (onoff === "on") {
            this.powerStatus = onoff;
            this.status = "idle";
            setTimeout(() => this.distance_determination(), this.reportingInterval);
        }
        else if (onoff === "off") {
            this.powerStatus = onoff;
            clearTimeout(this.running_settimeout_Id);
            this.running_settimeout_Id = '';
        }
        else throw new otherButtonTypeError('on/off 에 해당하지 않는 값입니다.');
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
        let sensor = this.running_sensors.find(x => x.id === eventObj.deviceId);
        if (sensor.powerStatus === "on") {
            if (eventObj.actionId === 'CHANGE_REPORTING_INTERVAL') {
                sensor.reportingInterval = eventObj.payload;
            }
        }
    }
}

module.exports = {
    Sensor,
    IotServer,
};
