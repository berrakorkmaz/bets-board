import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nesine-case-study.onrender.com',
});

export const getBets = async () => {
  const response = await api.get('/bets');
  return response.data;
};
