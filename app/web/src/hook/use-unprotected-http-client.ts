import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { useMemo } from "react";
import { globalConfig } from "@/lib/global-config";

export const useUnprotectedHttpClient = () => {
  return useMemo(() => {
    const instance = axios.create({
      baseURL: globalConfig.service.baseUrl,
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
