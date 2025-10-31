const API_BASE_URLS = [
  'http://localhost:4000',
  'https://cw8nsbb5-4000.inc1.devtunnels.ms',
  'https://bookit-o6sm.onrender.com'
];

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = { method: 'GET' }
): Promise<T> {
  if (endpoint.startsWith('http')) {
    return fetchWithOptions(endpoint, options);
  }

  let lastError: Error | null = null;
  
  for (const baseUrl of API_BASE_URLS) {
    try {
      const url = new URL(endpoint, baseUrl);
      
      if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }
      
      return await fetchWithOptions(url.toString(), options);
    } catch (error) {
      console.warn(`API request to ${baseUrl}${endpoint} failed:`, error);
      lastError = error as Error;
    }
  }
  
  throw lastError || new Error('All API endpoints failed');
}

async function fetchWithOptions<T = any>(
  url: string,
  options: RequestOptions
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  const responseText = await response.text();
  if (!responseText) {
    return {} as T;
  }
  return JSON.parse(responseText);
}

export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, string>, options: Omit<RequestOptions, 'method' | 'params'> = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET', params }),
    
  post: <T = any>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body: data }),
    
  put: <T = any>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body: data }),
    
  delete: <T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
    
  patch: <T = any>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body: data }),
};
