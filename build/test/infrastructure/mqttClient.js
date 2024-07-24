"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttClient = void 0;
const mqtt_1 = require("mqtt");
const rxjs_1 = require("rxjs");
const logger_1 = require("../../logger");
class MqttClient {
    constructor(brokerUrl, options) {
        this.messageSubject = new rxjs_1.Subject();
        this.client = (0, mqtt_1.connect)(brokerUrl, options);
        this.client.on('message', (topic, message) => {
            logger_1.logger.info(`Received message on ${topic}: ${message.toString()}`);
            this.messageSubject.next({ topic, message: message.toString() });
        });
        this.client.on('connect', () => logger_1.logger.info('Connected to broker'));
        this.client.on('error', (error) => logger_1.logger.error('Error:', error));
        this.client.on('reconnect', () => logger_1.logger.info('Reconnecting to broker'));
    }
    subscribe(topic) {
        this.client.subscribe(topic, (err) => {
            if (err) {
                logger_1.logger.error(`Failed to subscribe to ${topic}: ${err}`);
            }
            else {
                logger_1.logger.info(`Subscribed to ${topic}`);
            }
        });
    }
    get messages$() {
        return this.messageSubject.asObservable();
    }
}
exports.MqttClient = MqttClient;
