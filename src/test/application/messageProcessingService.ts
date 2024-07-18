import { Message } from "../domain/message";
import { MessageHandler } from "./messageHandler";
import { convertMessageToArray } from "./messageUtils";
const messageHandler = new MessageHandler();
export async function processMessage(message: string) {
    try {
      const isJson = message.trim().startsWith('{') && message.trim().endsWith('}');
      const cleanedMessage = isJson ? message : convertMessageToArray(message);
      const parsedMessage: Message = JSON.parse(cleanedMessage);
  
      if (!parsedMessage) {
        console.error('El mensaje no tiene la estructura esperada:', message);
        return;
      }
  
      const response = await messageHandler.handle(parsedMessage);
      console.log('Middleware response:', response.data);
    } catch (error) {
      console.error('Error al procesar el mensaje:', message, error);
    }
  }
  