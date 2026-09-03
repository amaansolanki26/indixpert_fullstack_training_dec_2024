// axios only
"use client";

import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();

      const idToken = session.tokens?.idToken?.toString();
      const accessToken = session.tokens?.accessToken?.toString();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (idToken) {
        config.headers["x-id-token"] = idToken;
      }

    } catch (err) {
      console.log("No Cognito session found");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;