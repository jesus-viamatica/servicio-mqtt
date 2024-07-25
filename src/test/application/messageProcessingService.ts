
import { logger } from "../../logger";
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
        logger.error('El mensaje no tiene la estructura esperada:', message);
        return;
    }
    if (parsedMessage.verb === 'GET' || parsedMessage.verb === 'DELETE') {
        logger.info('Consulta recibida, no se encolará:', message);
        return;
    }

    const response = await messageHandler.handle(parsedMessage, topic);
    if (!response) {
        logger.error('No se recibió respuesta del middleware para el mensaje:', message);
        return;
    }
    console.log('Respuesta del middleware:', response.data);

    if (!parsedMessage.feedback) {
        logger.info('No se enviará feedback para el mensaje:', message);
        return;
    }

    const feedbackResponse = await messageHandler.sendFeedback(response.data, parsedMessage.feedback.topic, parsedMessage.feedback);
    if (feedbackResponse) {
      logger.info('Feedback enviado:', feedbackResponse.data);
    } 

  } catch (error) {
    if (error instanceof Error) {
      messageError(error.message, undefined, { message, topic });
    }
  }
}