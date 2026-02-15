import axios from "axios";

export const defaultHttpClient = axios.create({
  withCredentials: true,
});
