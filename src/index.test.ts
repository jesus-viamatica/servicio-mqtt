
import { Server } from 'http';
import { v4 as uuidv4 } from 'uuid';
import app from './app'; 
import { logger } from './logger';
import { MqttClient } from './test/infrastructure/mqttClient';

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
    const brokerUrl = 'mqtt://broker.emqx.io:1883';
    const options = {
      username: 'mosquitto',
      password: 'mosquitto',
      clientId: `mqtt_${uuidv4()}`,
    };

    logger.info(`Connecting to broker: ${brokerUrl}`);
    new MqttClient(brokerUrl, options);

    server = app.listen(3000, () => {
      logger.info(`Server running at http://localhost:3000`);
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
        clientId: 'mqtt_mocked-uuid',
      })
    );
  });
  it('should initialize MQTT client with correct parameters', () => {
    expect(MqttClient).toHaveBeenCalledWith(
      'mqtt://broker.emqx.io:1883',
      {
        username: 'mosquitto',
        password: 'mosquitto',
        clientId: 'mqtt_mocked-uuid',
      }
    );
  });

  it('should start the server on the correct port', () => {
    expect(app.listen).toHaveBeenCalledWith(3000, expect.any(Function));
  });


});