import axios from 'axios';
import type { Filter } from './types';

axios.defaults.baseURL = 'https://your-energy.b.goit.study/api';

export async function getCategories(filter: Filter, page: number, limit: number) {
  try {
    const response = await axios.get('/filters', {params: { filter, page, limit }});
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
