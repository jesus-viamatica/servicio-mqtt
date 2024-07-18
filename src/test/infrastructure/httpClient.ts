import axios, { AxiosRequestConfig } from 'axios';

export class HttpClient {
  async post(url: string, body: any, headers: any) {
    const config: AxiosRequestConfig = {
      headers: headers
    };
    return axios.post(url, body, config);
  }
}
