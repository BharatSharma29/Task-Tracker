// src/api.js

import axios from "axios";

// Base URL of your backend server
const API = axios.create({
  baseURL: "http://35.175.164.94/api",
});

// Automatically attach JWT token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});

export default API;