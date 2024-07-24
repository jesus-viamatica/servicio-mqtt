import mqtt, { connect, IClientOptions, MqttClient as Client } from 'mqtt';
import { Subject } from 'rxjs';
import { logger } from '../../logger';

export class MqttClient {
  private client: Client;
  private messageSubject = new Subject<{ topic: string, message: string }>();

  constructor(brokerUrl: string, options: IClientOptions) {
    this.client = mqtt.connect(brokerUrl, options);

    this.client.on('message', (topic, message) => {
      logger.info(`Received message on ${topic}: ${message.toString()}`);
      this.messageSubject.next({ topic, message: message.toString() });
    });

    this.client.on('connect', () => logger.info('Connected to broker'));
    this.client.on('error', (error) => logger.error('Error:', error));
    this.client.on('reconnect', () => logger.info('Reconnecting to broker'));
  }

  subscribe(topic: string) {
    this.client.subscribe(topic, (err) => {
      if (err) {
        logger.error(`Failed to subscribe to ${topic}: ${err}`);
      } else {
        logger.info(`Subscribed to ${topic}`);
      }
    });
  }

  get messages$() {
    return this.messageSubject.asObservable();
  }
}