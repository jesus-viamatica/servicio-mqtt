"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttClient = void 0;
const mqtt_1 = require("mqtt");
const rxjs_1 = require("rxjs");
class MqttClient {
    constructor(brokerUrl, options) {
        this.messageSubject = new rxjs_1.Subject();
        this.client = (0, mqtt_1.connect)(brokerUrl, options);
        this.client.on('message', (topic, message) => {
            console.log(`Received message on ${topic}:`, message.toString());
            this.messageSubject.next(message.toString());
        });
        this.client.on('connect', () => console.log('Connected to MQTT Broker.'));
        this.client.on('error', (error) => console.error('Connection error:', error));
        this.client.on('reconnect', () => console.log('Reconnecting...'));
    }
    subscribe(topic) {
        this.client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Failed to subscribe to ${topic}:`, err);
            }
            else {
                console.log(`Subscribed to ${topic}`);
            }
        });
    }
    get messages$() {
        return this.messageSubject.asObservable();
    }
}
exports.MqttClient = MqttClient;
