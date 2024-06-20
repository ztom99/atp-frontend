import axios from 'axios';
import { getLocalConfig }  from '~/helpers/localpersistence';

export enum AuthTokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}
export const getAccessToken = () => {
  return getLocalConfig(AuthTokenType.ACCESS_TOKEN)
}

const baseConfig = {
  headers: {
    'Content-type': 'application/json',
  },
  withCredentials: true,
};

const gqlApi = axios.create({
  ...baseConfig,
  baseURL: import.meta.env.VITE_BACKEND_GQL_URL,
});

const restApi = axios.create({
  ...baseConfig,
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

// 设置请求拦截器，为所有请求添加Authorization头
gqlApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const listmonkApi = axios.create({
  ...baseConfig,
  withCredentials: false,
  baseURL: 'https://listmonk.hoppscotch.com/api/public',
});

export { gqlApi, restApi, listmonkApi };
