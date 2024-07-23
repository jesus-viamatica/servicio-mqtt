import { AxiosError, AxiosResponse } from "axios";
import { Feedback, Message } from "../domain/message";

import dotenv from "dotenv";
import { HttpClient } from "../infrastructure/httpClient";
import { messageError } from "./messageError";

dotenv.config();

export class MessageHandler {
  private httpClient: HttpClient;
  private endPoint: string;

  constructor() {
    this.httpClient = new HttpClient();
    this.endPoint = process.env.MIDDLEWARE_ENDPOINT || "";
  }

  async handle(message: Message, topic: string) {
    try {
      const response = await this.sendHttpRequest(message.verb, `${this.endPoint}/${topic}`, message);
      return response;

    } catch (error) {
      if (error instanceof Error) {
        messageError(error.message, 500, error.message);
      }
      throw error;
    }
  }



  async sendFeedback(data: any, topic: string, feedback: Feedback) {
    try {
      feedback.body = data;
      console.log('Enviando feedback:', feedback);
      const response = await this.sendHttpRequest(feedback.verb, `${this.endPoint}/${topic}`, feedback);
      return response;
      
    } catch (error) {
      if (error instanceof Error) {
        messageError(error.message, 500, error);
      }

    }
  }

  async sendHttpRequest(verb: string, path: string, body: any) {
    const headers = {
      "Content-Type": "application/json",
    };
    const startTime = Date.now();
    try {
      let response;
      switch (verb.toUpperCase()) {
        case 'POST':
          response = await this.httpClient.post(path, body, headers);
          break;
        case 'PATCH':
          response = await this.httpClient.patch(path, body, headers);
          break;
        case 'GET':
          response = await this.httpClient.get(path, headers);
          break;
        case 'PUT':
          response = await this.httpClient.put(path, body, headers);
          break;
        case 'DELETE':
          response = await this.httpClient.delete(path, headers);
          break;
        default:
          throw new Error(`Unsupported HTTP verb: ${verb}`);
      }
      const duration = calculateDuration(startTime);
      console.log(`Tiempo de respuesta HTTP: ${duration} segundos`);
      return response;
    } catch (error) {
      const duration = calculateDuration(startTime);
      if (error instanceof AxiosError) {
        messageError(error.message, duration, error.name);
      }
    }
  }

  
}

function calculateDuration(startTime: number): number {
  const endTime = Date.now();
  return (endTime - startTime) / 1000;
}
