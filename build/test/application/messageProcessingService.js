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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMessage = processMessage;
const messageError_1 = require("./messageError");
const messageHandler_1 = require("./messageHandler");
const messageUtils_1 = require("./messageUtils");
const messageHandler = new messageHandler_1.MessageHandler();
function processMessage(message, topic) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isJson = message.trim().startsWith('{') && message.trim().endsWith('}');
            const cleanedMessage = isJson ? message : (0, messageUtils_1.convertMessageToArray)(message);
            const parsedMessage = JSON.parse(cleanedMessage);
            if (!parsedMessage) {
                console.error('El mensaje no tiene la estructura esperada:', message);
                return;
            }
            if (parsedMessage.verb === 'GET' || parsedMessage.verb === 'DELETE') {
                console.log('Consulta recibida, no se encolará:', message);
                return;
            }
            const response = yield messageHandler.handle(parsedMessage, topic);
            if (!response) {
                console.log('No se recibió respuesta del middleware para el mensaje:', message);
                return;
            }
            console.log('Respuesta del middleware:', response.data);
            if (!parsedMessage.feedback) {
                console.log('No se enviará feedback para el mensaje:', message);
                return;
            }
            const feedbackResponse = yield messageHandler.sendFeedback(response.data, topic, parsedMessage.feedback);
            if (feedbackResponse) {
                console.log('Respuesta del feedback:', feedbackResponse.data);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                (0, messageError_1.messageError)(error.message, undefined, { message, topic });
            }
        }
    });
}
