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
const messageHandler_1 = require("./messageHandler");
const messageUtils_1 = require("./messageUtils");
const messageHandler = new messageHandler_1.MessageHandler();
function processMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isJson = message.trim().startsWith('{') && message.trim().endsWith('}');
            const cleanedMessage = isJson ? message : (0, messageUtils_1.convertMessageToArray)(message);
            const parsedMessage = JSON.parse(cleanedMessage);
            if (!parsedMessage) {
                console.error('El mensaje no tiene la estructura esperada:', message);
                return;
            }
            const response = yield messageHandler.handle(parsedMessage);
            console.log('Middleware response:', response.data);
        }
        catch (error) {
            console.error('Error al procesar el mensaje:', message, error);
        }
    });
}
