
import { processMessage } from "./test/application/messageProcessingService";

import { MqttClient } from "./test/infrastructure/mqttClient";
import app from './app';

import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === 'dev' ? '.env' : '.env.prod';
dotenv.config({ path: envFile });

const brokerUrl = `${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;
const options = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clientId: process.env.MQTT_CLIENT_ID
};
const topics = (process.env.MQTT_TOPICS || "").split(",");

console.log(`Connecting to broker: ${brokerUrl}`);
const mqttClient = new MqttClient(brokerUrl, options);

mqttClient.messages$.subscribe(({ topic, message }) => processMessage(message, topic));

topics.forEach(topic => mqttClient.subscribe(topic));

const serverUrl = process.env.SERVER_URL || 'http://localhost';
const serverPort = process.env.SERVER_PORT || 3000;

app.listen(serverPort, () => {
  console.log(`Server running at ${serverUrl}:${serverPort}`);
});