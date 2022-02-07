const { Server } = require('http');
const { addListener } = require('process');

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
        IotServer.std_output(this.status);
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

        process.on('CHANGE_REPORTING_INTERVAL', function (deviceId, interval, that) {
            let sensor = that.running_sensors.find(x => x.id == deviceId);
            if (sensor.powerStatus === "on" && interval >= 0 && interval <= 10000) {
                sensor.reportingInterval = interval;
            }
        })
    }

    start(sensor) {
        this.running_sensors.push(...sensor);
    }

    publish(eventObj) {
        let sensor = this.running_sensors.find(x => x.id === eventObj.deviceId);
        if (sensor.powerStatus === "on") {
            process.emit(eventObj.actionId, eventObj.deviceId, eventObj.payload, this);
            // if (eventObj.actionId === 'CHANGE_REPORTING_INTERVAL') {
            //     sensor.reportingInterval = eventObj.payload;
            // }
        }
    }

    static std_output(reportingData) {
        console.log(reportingData);
    }

    std_input() {
        let readlineSync = require('readline-sync');
        let deviceId = readlineSync.questionInt('id:');
        let interval = readlineSync.questionInt('interval:');
        //if (!isNaN(deviceId) && !isNaN(interval)) {
        deviceId = `id${deviceId}`;
        this.publish({
            deviceId: deviceId,
            actionId: 'CHANGE_REPORTING_INTERVAL',
            payload: interval
        });
        //this.user_input();
        // this.publish({
        //     deviceId: `id${deviceId}`,
        //     actionId: 'CHANGE_REPORTING_INTERVAL',
        //     payload: interval,
        // })
        //}
    };
}
// const sensor = new Sensor('id1');

// sensor.turn('on');

// const server = new IotServer();
// server.start([sensor]);
// server.std_input();

module.exports = {
    Sensor,
    IotServer,
};
