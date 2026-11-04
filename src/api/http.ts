import axios from 'axios';

const http = axios.create({
  baseURL: 'https://your-energy.b.goit.study/api',
  timeout: 10000,
});

export default http;