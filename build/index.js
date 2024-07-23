"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageProcessingService_1 = require("./test/application/messageProcessingService");
const mqttClient_1 = require("./test/infrastructure/mqttClient");
const brokerUrl = 'mqtt://broker.emqx.io:1883';
const options = {
    username: 'mosquitto',
    password: 'mosquitto',
    clientId: 'mqttx_e9c7884d'
};
const mqttClient = new mqttClient_1.MqttClient(brokerUrl, options);
mqttClient.messages$.subscribe(message => (0, messageProcessingService_1.processMessage)(message));
mqttClient.subscribe('testtopic');
