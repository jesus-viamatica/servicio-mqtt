import winston from 'winston';
import { LogstashTransport } from "winston-logstash-ts";
import dotenv from "dotenv";
dotenv.config();

const logger = LogstashTransport.createLogger('mqtt_app', {
    
    host:  process.env.SERVER_URL || 'localhost',
    port: process.env.LOG_PORT ? parseInt(process.env.LOG_PORT) : 12201,

    protocol: 'udp', 
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.logstash()
    )
}
);

logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
}));


export { logger };