import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { useMemo } from "react";
import { config } from "@/lib/config";

export const useUnprotectedHttpClient = () => {
  return useMemo(() => {
    const instance = axios.create({
      baseURL: config.service.baseUrl,
      timeout: 10 * 1000,
    });

    instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    return instance;
  }, []);
};
