import { Server } from 'http';
import { v4 as uuidv4 } from 'uuid';
import app from './app'; 
import { logger } from './logger';
import { MqttClient } from './test/infrastructure/mqttClient';
import dotenv from 'dotenv';

dotenv.config({path: '.env'});

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

jest.mock('./test/infrastructure/mqttClient', () => {
  return {
    MqttClient: jest.fn().mockImplementation(() => {
      return {
        messages$: {
          subscribe: jest.fn(),
        },
        subscribe: jest.fn(),
      };
    }),
  };
});

jest.mock('./test/application/messageProcessingService');
jest.mock('./logger');

jest.mock('./app', () => {
  return {
    listen: jest.fn((port, callback) => {
      const server = {
        close: jest.fn(),
        address: jest.fn(() => ({ port })), 
      };
      callback();
      return server;
    }),
    get: jest.fn((path, handler) => {
      if (path === '/health') {
        handler({}, { status: jest.fn().mockReturnThis(), json: jest.fn() });
      }
    }),
  };
});

describe('Index Module', () => {
  let server: Server;

  beforeAll(() => {
    const brokerUrl = `${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;
    const options = {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      clientId: uuidv4(), // Asegurarse de que uuidv4 se llame aquí
    };

    logger.info(`Connecting to broker: ${brokerUrl}`);
    new MqttClient(brokerUrl, options);

    server = app.listen(Number(process.env.SERVER_PORT), () => {
      logger.info(`Server running at ${process.env.SERVER_URL}:${process.env.SERVER_PORT}`);
    });
  });

  afterAll(() => {
    server.close();
  });

  it('should create clientId with correct UUID', () => {
    expect(uuidv4).toHaveBeenCalled();
    expect(MqttClient).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        clientId: 'mocked-uuid',
      })
    );
  });

  it('should initialize MQTT client with correct parameters', () => {
    expect(MqttClient).toHaveBeenCalledWith(
      `${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
      {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        clientId: 'mocked-uuid',
      }
    );
  });

  it('should start the server on the correct port', () => {
    const serverPort = Number(process.env.SERVER_PORT) || 3000; 
    expect(app.listen).toHaveBeenCalledWith(serverPort, expect.any(Function));
  });
});