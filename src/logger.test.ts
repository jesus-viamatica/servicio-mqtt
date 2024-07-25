import winston from 'winston';
import { LogstashTransport } from 'winston-logstash-ts';
import dotenv from 'dotenv';
import { logger } from './logger';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('winston', () => {
  const mWinston = {
    format: {
      combine: jest.fn((...args) => args),
      timestamp: jest.fn(),
      logstash: jest.fn(),
      colorize: jest.fn(),
      simple: jest.fn(),
    },
    transports: {
      Console: jest.fn(),
    },
    createLogger: jest.fn(() => ({
      add: jest.fn(),
    })),
  };
  return mWinston;
});

jest.mock('winston-logstash-ts', () => ({
  LogstashTransport: {
    createLogger: jest.fn(() => ({
      add: jest.fn(),
    })),
  },
}));

describe('Logger Module', () => {
  beforeAll(() => {
    process.env.LOG_URL = 'http://localhost';
    process.env.LOG_PORT = '12201';
  });

  it('should configure logger with correct parameters', () => {
    expect(LogstashTransport.createLogger).toHaveBeenCalledWith('mqtt_app', {
      host: 'localhost',
      port: 12201,
      protocol: 'udp',
      format: expect.any(Array), 
    });

    expect(winston.transports.Console).toHaveBeenCalledWith({
      format: expect.any(Array), 
    });

    expect(logger.add).toHaveBeenCalledWith(expect.any(winston.transports.Console));
  });

  it('should call dotenv.config', () => {
    expect(dotenv.config).toHaveBeenCalled();
  });
});