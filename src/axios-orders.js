import axios from 'axios';

const axiosInstance = axios.create({
    baseURL : 'https://learning-9c02e.firebaseio.com/'
});

export default axiosInstance;