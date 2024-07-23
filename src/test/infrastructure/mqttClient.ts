import { connect, IClientOptions, MqttClient as Client } from 'mqtt';
import { Subject } from 'rxjs';

export class MqttClient {
  private client: Client;
  private messageSubject = new Subject<{ topic: string, message: string }>();

  constructor(brokerUrl: string, options: IClientOptions) {
    this.client = connect(brokerUrl, options);

    this.client.on('message', (topic, message) => {
      console.log(`Received message on ${topic}:`, message.toString());
      this.messageSubject.next({ topic, message: message.toString() });
    });

    this.client.on('connect', () => console.log('Connected to MQTT Broker.'));
    this.client.on('error', (error) => console.error('Connection error:', error));
    this.client.on('reconnect', () => console.log('Reconnecting...'));
  }

  subscribe(topic: string) {
    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to ${topic}:`, err);
      } else {
        console.log(`Subscribed to ${topic}`);
      }
    });
  }

  get messages$() {
    return this.messageSubject.asObservable();
  }
}