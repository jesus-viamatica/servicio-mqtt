import { AxiosError } from "axios";
import { Feedback, Message } from "../domain/message";
import dotenv from "dotenv";
import { HttpClient } from "../infrastructure/httpClient";
import { messageError } from "./messageError";
import { logger } from "../../logger";
import { calculateDuration } from "./calculateDuration";
import { RetryRequest } from "../domain/retryRequest";

dotenv.config();

export class MessageHandler {
  private httpClient: HttpClient;
  private endPoint: string;
  private retryQueue: Array<RetryRequest> = [];

  constructor() {
    this.httpClient = new HttpClient();
    this.endPoint = process.env.MIDDLEWARE_ENDPOINT || "";
    this.startRetryInterval();
  }

  async handle(message: Message, topic: string) {
    try {
      const response = await this.sendHttpRequest(
        message.verb,
        `${this.endPoint}/${topic}`,
        message
      );
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
      logger.info(`Enviando feedback: ${feedback}`);
      const response = await this.sendHttpRequest(
        feedback.verb,
        `${this.endPoint}/${topic}`,
        feedback
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        messageError(error.message, 500, error);
      }
      throw error;
    }
  }

  async sendHttpRequest(verb: string, path: string, body: any) {
    const headers = {
      "Content-Type": "application/json",
    };
    const startTime = Date.now();
    const timeout = 3000;
    try {
      let response;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      switch (verb.toUpperCase()) {
        case "POST":
          response = await this.httpClient.post(path, body, headers, { signal: controller.signal });
          break;
        case "PATCH":
          response = await this.httpClient.patch(path, body, headers, { signal: controller.signal });
          break;
        case "GET":
          response = await this.httpClient.get(path, headers, { signal: controller.signal });
          break;
        case "PUT":
          response = await this.httpClient.put(path, body, headers, { signal: controller.signal });
          break;
        case "DELETE":
          response = await this.httpClient.delete(path, headers, { signal: controller.signal });
          break;
        default:
          throw new Error(`Unsupported HTTP verb: ${verb}`);
      }
      clearTimeout(timeoutId);
      const duration = calculateDuration(startTime);
      logger.info(`HTTP request to ${path} completed in ${duration} seconds`, {
        response,
      });
      return response;
    } catch (error) {
      const duration = calculateDuration(startTime);
      if (error instanceof AxiosError) {
        if (error.code === "ECONNABORTED" || error.message === "canceled") {
          logger.warn(
            `HTTP request to ${path} aborted after ${timeout / 1000} seconds`
          );
          this.retryQueue.push({ verb, path, body });
          logger.info(`Request to ${path} added to retry queue due to abort`);
        } else {
          messageError(error.message, duration, error.name);
        }
        throw error;
      } else if (error instanceof Error && error.name === "AbortError") {
        logger.warn(
          `HTTP request to ${path} aborted after ${timeout / 1000} seconds`
        );
        this.retryQueue.push({ verb, path, body });
        logger.info(`Request to ${path} added to retry queue due to abort`);
      } else {
        throw error;
      }
    }
  }

  private startRetryInterval() {
    setInterval(() => this.retryFailedRequests(), 60000);
  }

  private async retryFailedRequests() {
    logger.info(`Reintentando ${this.retryQueue.length} peticiones fallidas`);
    const retryQueueCopy = [...this.retryQueue];
    this.retryQueue = [];

    for (const request of retryQueueCopy) {
      try {
        await this.sendHttpRequest(request.verb, request.path, request.body);
      } catch (error) {
        if (error instanceof AxiosError) {
          logger.error(
            `Error al reintentar la petición a ${request.path}: ${error.message}`
          );
          this.retryQueue.push(request);
        }
      }
    }
  }
}
