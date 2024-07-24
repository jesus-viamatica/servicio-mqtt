"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttClient = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const rxjs_1 = require("rxjs");
const logger_1 = require("../../logger");
class MqttClient {
    constructor(brokerUrl, options) {
        this.messageSubject = new rxjs_1.Subject();
        this.client = mqtt_1.default.connect(brokerUrl, options);
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
