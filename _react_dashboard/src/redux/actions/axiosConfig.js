import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api';
// "proxy": "http://localhost:5000",

export default axios;
