const API_BASE_URL = '/api';

// 存储token的变量
let authToken = null;

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
    
    // 发送请求 - 确保URL格式正确
    const fullUrl = `${API_BASE_URL}${url}`;
    console.log('Request URL:', fullUrl);
    const response = await fetch(fullUrl, {
        ...options,
        headers
    });
    
    // 处理响应
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    
    return response.json();
};

export const api = {
    get: async (url) => {
        // 如果没有token，先登录获取
        if (!authToken) {
            await api.post('/auth/login', { username: 'test', password: 'test' });
        }
        
        return request(url, {
            method: 'GET'
        });
    },
    post: async (url, data) => {
        const result = await request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        // 如果是登录请求，存储token
        if (url === '/auth/login') {
            authToken = result.data.token;
            console.log('Login successful, token acquired:', authToken);
        }
        
        return result;
    }
};

// 保持向后兼容
export const login = async (username, password) => {
    return api.post('/auth/login', { username, password });
};
