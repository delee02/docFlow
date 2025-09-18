import axios from "axios";

const api = axios.create({
    baseURL: "/",
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if(token){
        config.headers.Authorization= `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    res => res,
    err => {
        if(err.response?.status === 401){
            localStorage.removeItem('accessToken');
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/';
        }
        return Promise.reject(err);
    }
);

export default api;