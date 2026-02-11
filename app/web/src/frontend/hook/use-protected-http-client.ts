import axios from "axios";
import { useMemo } from "react";
import { config } from "@/lib/config";

export const useProtectedHttpClient = () => {
  return useMemo(() => {
    return axios.create({
      baseURL: config.service.baseUrl,
      timeout: 10 * 1000,
      withCredentials: true, // Send cookies with requests
    });
  }, []);
};
