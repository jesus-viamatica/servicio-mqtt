import { Message } from "../domain/message";
import { HttpClient } from "../infrastructure/httpClient";

export class MessageHandler {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async handle(message: Message) {

    const url = `${message.ssl ? 'https' : 'http'}://${message.ip}:${message.port}${message.rootPath}/dummy`;
    return this.httpClient.post(url, {}, { 'Content-Type': 'application/json' });
  }
}
