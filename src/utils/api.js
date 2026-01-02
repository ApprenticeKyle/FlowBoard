const API_BASE_URL = '/api';

// 存储token的变量
let authToken = null;
// 用于确保只登录一次的Promise
let loginPromise = null;

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

// 登录函数，确保只执行一次
const loginOnce = async () => {
    if (authToken) {
        return;
    }
    
    // 如果已经有登录Promise，等待它完成
    if (loginPromise) {
        return loginPromise;
    }
    
    // 创建新的登录Promise
    loginPromise = (async () => {
        try {
            const result = await request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username: 'test', password: 'test' })
            });
            authToken = result.data.token;
            console.log('Login successful, token acquired:', authToken);
        } finally {
            // 清空Promise，允许下次登录
            loginPromise = null;
        }
    })();
    
    return loginPromise;
};

export const api = {
    get: async (url) => {
        // 如果没有token，先登录获取（确保只登录一次）
        await loginOnce();
        
        return request(url, {
            method: 'GET'
        });
    },
    post: async (url, data) => {
        // 如果是登录请求，直接处理
        if (url === '/auth/login') {
            const result = await request(url, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            authToken = result.data.token;
            console.log('Login successful, token acquired:', authToken);
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
        // PUT请求，确保已登录
        await loginOnce();
        
        return request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};

// 保持向后兼容
export const login = async (username, password) => {
    return api.post('/auth/login', { username, password });
};