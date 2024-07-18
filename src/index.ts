
import { processMessage } from "./test/application/messageProcessingService";

import { MqttClient } from "./test/infrastructure/mqttClient";

const brokerUrl = 'mqtt://broker.emqx.io:1883';
const options = {
  username: 'mosquitto',
  password: 'mosquitto',
  clientId: 'mqttx_e9c7884d'
};
const mqttClient = new MqttClient(brokerUrl, options);

mqttClient.messages$.subscribe(message => processMessage(message));
mqttClient.subscribe('testtopic');
