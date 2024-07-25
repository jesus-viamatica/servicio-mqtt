"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageProcessingService_1 = require("./test/application/messageProcessingService");
const mqttClient_1 = require("./test/infrastructure/mqttClient");
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./logger");
const uuid_1 = require("uuid");
const envFile = process.env.NODE_ENV === 'dev' ? '.env' : '.env.prod';
dotenv_1.default.config({ path: envFile });
const brokerUrl = `${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;
const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: `mqtt_${(0, uuid_1.v4)()}`,
};
const topics = (process.env.MQTT_TOPICS || "").split(",");
logger_1.logger.info(`Connecting to broker: ${brokerUrl}`);
const mqttClient = new mqttClient_1.MqttClient(brokerUrl, options);
mqttClient.messages$.subscribe(({ topic, message }) => (0, messageProcessingService_1.processMessage)(message, topic));
topics.forEach(topic => mqttClient.subscribe(topic));
const serverUrl = process.env.SERVER_URL || 'http://localhost';
const serverPort = process.env.SERVER_PORT || 3000;
app_1.default.listen(serverPort, () => {
    logger_1.logger.info(`Server running at ${serverUrl}:${serverPort}`);
});
