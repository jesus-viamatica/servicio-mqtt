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
const dotenv_1 = __importDefault(require("dotenv"));
const httpClient_1 = require("../infrastructure/httpClient");
// export interface Message {
//   source: string;
//   destination: string;
//   operation: string;
//   verb: string;
//   path: string;
//   body: Body;
//   feedback: Feedback;
// }
// export interface Feedback {
//   source: string;
//   destination: string;
//   operation: string;
//   verb: string;
//   path: string;
//   body: string;
// }
dotenv_1.default.config();
class MessageHandler {
    constructor() {
        this.httpClient = new httpClient_1.HttpClient();
        this.endPoint = process.env.MIDDLEWARE_ENDPOINT || "";
    }
    handle(message, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendHttpRequest(message.verb, `${this.endPoint}/${topic}`, message.body);
            return response;
        });
    }
    sendHttpRequest(verb, path, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                "Content-Type": "application/json",
            };
            switch (verb.toUpperCase()) {
                case 'POST':
                    return yield this.httpClient.post(path, body, headers);
                case 'PATCH':
                    return yield this.httpClient.patch(path, body, headers);
                case 'GET':
                    return yield this.httpClient.get(path, { headers });
                case 'PUT':
                    return yield this.httpClient.put(path, body, headers);
                case 'DELETE':
                    return yield this.httpClient.delete(path, { headers });
                default:
                    throw new Error(`Unsupported HTTP verb: ${verb}`);
            }
        });
    }
    sendFeedback(data, topic, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            const reponse = yield this.sendHttpRequest(feedback.verb, `${this.endPoint}/${topic}`, data);
            return reponse;
        });
    }
}
exports.MessageHandler = MessageHandler;
