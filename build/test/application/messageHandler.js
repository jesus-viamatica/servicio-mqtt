"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const axios_1 = require("axios");
const dotenv_1 = __importDefault(require("dotenv"));
const httpClient_1 = require("../infrastructure/httpClient");
const messageError_1 = require("./messageError");
dotenv_1.default.config();
class MessageHandler {
    constructor() {
        this.httpClient = new httpClient_1.HttpClient();
        this.endPoint = process.env.MIDDLEWARE_ENDPOINT || "";
    }
    handle(message, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.sendHttpRequest(message.verb, `${this.endPoint}/${topic}`, message);
                return response;
            }
            catch (error) {
                if (error instanceof Error) {
                    (0, messageError_1.messageError)(error.message, 500, error.message);
                }
                throw error;
            }
        });
    }
    sendFeedback(data, topic, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                feedback.body = data;
                console.log('Enviando feedback:', feedback);
                const response = yield this.sendHttpRequest(feedback.verb, `${this.endPoint}/${topic}`, feedback);
                return response;
            }
            catch (error) {
                if (error instanceof Error) {
                    (0, messageError_1.messageError)(error.message, 500, error);
                }
            }
        });
    }
    sendHttpRequest(verb, path, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                "Content-Type": "application/json",
            };
            const startTime = Date.now();
            try {
                let response;
                switch (verb.toUpperCase()) {
                    case 'POST':
                        response = yield this.httpClient.post(path, body, headers);
                        break;
                    case 'PATCH':
                        response = yield this.httpClient.patch(path, body, headers);
                        break;
                    case 'GET':
                        response = yield this.httpClient.get(path, headers);
                        break;
                    case 'PUT':
                        response = yield this.httpClient.put(path, body, headers);
                        break;
                    case 'DELETE':
                        response = yield this.httpClient.delete(path, headers);
                        break;
                    default:
                        throw new Error(`Unsupported HTTP verb: ${verb}`);
                }
                const duration = calculateDuration(startTime);
                console.log(`Tiempo de respuesta HTTP: ${duration} segundos`);
                return response;
            }
            catch (error) {
                const duration = calculateDuration(startTime);
                if (error instanceof axios_1.AxiosError) {
                    (0, messageError_1.messageError)(error.message, duration, error.name);
                }
            }
        });
    }
}
exports.MessageHandler = MessageHandler;
function calculateDuration(startTime) {
    const endTime = Date.now();
    return (endTime - startTime) / 1000;
}
