import axios from "axios";

let service = axios.create({
    baseURL: 'http://localhost:3400'
});

// Isso aqui vai ser utilizado em todas as requisições.
service.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json'; // Define o tipo de dados que estamos enviando, no caso é JSON.
    config.headers.Authorization = localStorage.getItem("token"); // adiciona o token de autorização.
    return config;
});

export default service;
