import axios, { AxiosRequestConfig } from "axios";

export class HttpClient {
  async post(url: string, body: any, headers: any, options?: { signal?: AbortSignal }) {
    const config: AxiosRequestConfig = {
      headers: headers,
      signal: options?.signal,
    };
    return await axios.post(url, body, config);
  }

  async get(url: string, headers: any, options?: { signal?: AbortSignal }) {
    const config: AxiosRequestConfig = {
      headers: headers,
      signal: options?.signal,
    };
    return await axios.get(url, config);
  }

  async put(url: string, body: any, headers: any, options?: { signal?: AbortSignal }) {
    const config: AxiosRequestConfig = {
      headers: headers,
      signal: options?.signal,
    };
    return await axios.put(url, body, config);
  }

  async delete(url: string, headers: any, options?: { signal?: AbortSignal }) {
    const config: AxiosRequestConfig = {
      headers: headers,
      signal: options?.signal,
    };
    return await axios.delete(url, config);
  }

  async patch(url: string, body: any, headers: any, options?: { signal?: AbortSignal }) {
    const config: AxiosRequestConfig = {
      headers: headers,
      signal: options?.signal,
    };
    return await axios.patch(url, body, config);
  }
}