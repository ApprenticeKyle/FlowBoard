import { API_BASE_URL } from '@shared/constants';

// 存储token的变量
let authToken = null;
// 用于确保只登录一次的Promise
let loginPromise = null;

// 错误类
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// 统一的请求处理函数
const request = async (url, options = {}) => {
  // 设置默认headers
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };
  
  // 如果有token，添加到headers
  if (authToken) {
    defaultHeaders['Authorization'] = `Bearer ${authToken}`;
  }
  
  // 合并headers
  const headers = {
    ...defaultHeaders,
    ...options.headers
  };
  
  const method = options.method || 'GET';
  const params = options.params || {};

  // 构建带有查询参数的URL
  let fullUrl = `${API_BASE_URL}${url}`;
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  }
  const queryString = queryParams.toString();
  if (queryString) {
    fullUrl += `?${queryString}`;
  }

  try {
    // 发送请求
    const response = await fetch(fullUrl, {
      ...options,
      headers
    });
    
    // 处理响应
    const responseData = await response.json();
    
    if (!response.ok) {
      const errorMessage = responseData?.message || response.statusText || '请求失败';
      throw new ApiError(errorMessage, response.status, responseData);
    }
    
    // 检查响应格式，确保它有code, message, data字段
    if (typeof responseData === 'object' && responseData !== null && 'code' in responseData && 'data' in responseData) {
      return responseData.data;
    } else {
      // 如果响应格式不符合预期，返回原始响应
      return responseData;
    }
  } catch (error) {
    // 如果是ApiError，直接抛出
    if (error instanceof ApiError) {
      throw error;
    }
    // 网络错误或其他错误
    throw new ApiError(error.message || '网络错误', 0, null);
  }
};

// 登录函数，确保只执行一次
const loginOnce = async () => {
  // 如果已经有token，直接返回
  if (authToken) {
    return;
  }
  
  // 如果已经有登录Promise，等待它完成
  if (loginPromise) {
    return loginPromise;
  }
  
  // 原子化创建登录Promise，避免并发问题
  try {
    // 创建新的登录Promise
    const promise = (async () => {
      const result = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'test', password: 'test' })
      });
      authToken = result.token;
      return result;
    })();
    
    // 将Promise赋值给loginPromise
    loginPromise = promise;
    
    // 等待Promise完成
    await promise;
    
    return promise;
  } catch (error) {
    // 登录失败时清空Promise，以便下次可以重试
    loginPromise = null;
    throw error;
  }
};

// 设置token
export const setAuthToken = (token) => {
  authToken = token;
};

// 清除token
export const clearAuthToken = () => {
  authToken = null;
  loginPromise = null;
};

export const apiClient = {
  get: async (url, params = {}) => {
    await loginOnce();
    return request(url, {
      method: 'GET',
      params
    });
  },
  
  post: async (url, data) => {
    // 如果是登录请求，直接处理
    if (url === '/auth/login') {
      const result = await request(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      authToken = result.token;
      return result;
    }
    
    // 其他POST请求，确保已登录
    await loginOnce();
    return request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put: async (url, data) => {
    await loginOnce();
    return request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (url) => {
    await loginOnce();
    return request(url, {
      method: 'DELETE'
    });
  },
  
  patch: async (url, data) => {
    await loginOnce();
    return request(url, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
};

// 保持向后兼容
export const login = async (username, password) => {
  return apiClient.post('/auth/login', { username, password });
};

