import { Message } from "../domain/message";
import { messageError } from "./messageError";
import { MessageHandler } from "./messageHandler";
import { convertMessageToArray } from "./messageUtils";
const messageHandler = new MessageHandler();
export async function processMessage(message: string, topic: string) {
  try {
    const isJson = message.trim().startsWith('{') && message.trim().endsWith('}');
    const cleanedMessage = isJson ? message : convertMessageToArray(message);

    const parsedMessage: Message = JSON.parse(cleanedMessage);
    
    if (!parsedMessage) {
        console.error('El mensaje no tiene la estructura esperada:', message);
        return;
    }
    if (parsedMessage.verb === 'GET' || parsedMessage.verb === 'DELETE') {
        console.log('Consulta recibida, no se encolará:', message);
        return;
    }

    const response = await messageHandler.handle(parsedMessage, topic);
    if (!response) {
        console.log('No se recibió respuesta del middleware para el mensaje:', message);
        return;
    }
    console.log('Respuesta del middleware:', response.data);

    if (!parsedMessage.feedback) {
        console.log('No se enviará feedback para el mensaje:', message);
        return;
    }

   
    const feedbackResponse = await messageHandler.sendFeedback(response.data, topic, parsedMessage.feedback);


    if (feedbackResponse) {
      console.log('Respuesta del feedback:', feedbackResponse.data);
    } 

  } catch (error) {
    if (error instanceof Error) {
      messageError(error.message, undefined, { message, topic });
    }
  }
}