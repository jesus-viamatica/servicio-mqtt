"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageProcessingService_1 = require("./test/application/messageProcessingService");
const mqttClient_1 = require("./test/infrastructure/mqttClient");
const dotenv_1 = __importDefault(require("dotenv"));
const envFile = process.env.NODE_ENV === 'dev' ? '.env' : '.env.prod';
dotenv_1.default.config({ path: envFile });
const brokerUrl = `${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;
const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: process.env.MQTT_CLIENT_ID
};
console.log(`Connecting to broker: ${brokerUrl}`);
const mqttClient = new mqttClient_1.MqttClient(brokerUrl, options);
mqttClient.messages$.subscribe(message => (0, messageProcessingService_1.processMessage)(message));
mqttClient.subscribe('testtopic');
