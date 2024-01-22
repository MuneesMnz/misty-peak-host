import axios from "axios";
let protocol = window.location.protocol;
const BASE_URL = "http://13.233.133.251:3003/api/v1";

const getToken = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      resolve(token);
    }, 1000);
  });
};

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequset = axios.create({
  baseURL: BASE_URL,
});

userRequset.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
