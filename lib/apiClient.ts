type fetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

class ApiClientClass {
  private async fetch<T>(
    endpoint: string,
    options: fetchOptions = {},
  ): Promise<T> {
    const { method = "GET", body = {}, headers = {} } = options;
    const defaultheaders = {
      "Content-Type": "application/json",
      ...headers,
    };
    const response = await fetch(`/api/${endpoint}`, {
      method,
      body: JSON.stringify(body),
      headers: defaultheaders,
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
  }
  async get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.fetch<T>(endpoint, { method: "GET", headers });
  }
  async post<T>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>,
  ) {
    return this.fetch<T>(endpoint, { method: "POST", body, headers });
  }
  async put<T>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>,
  ) {
    return this.fetch<T>(endpoint, { method: "PUT", body, headers });
  }
  async delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.fetch<T>(endpoint, { method: "DELETE", headers });
  }
}
const ApiClient = new ApiClientClass();
export default ApiClient;
