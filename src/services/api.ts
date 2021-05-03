import axios from "axios";

import { enqueueSnackbar as enqueueSnackbarAction } from "../redux/actions";

import { store } from "../hooks/AppProvider";

import { LocalStorageKeys } from "../constants";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const newConfig = config;
  const token = localStorage.getItem(LocalStorageKeys.TOKEN);

  if (token) {
    newConfig.headers.Authorization = `Bearer ${token}`;
    return newConfig;
  }

  return newConfig;
});

api.interceptors.response.use(
  (response) => {
    const { message, success } = response.data;

    if (message) {
      store.dispatch(
        enqueueSnackbarAction({
          message,
          key: message,
          dismissed: false,
          options: {
            variant: success ? "success" : "error",
            autoHideDuration: 1500,
          },
        })
      );
    }

    return response;
  },
  (error) => {
    const { status, data } = error.response;

    if (status === 401) {
      store.dispatch(
        enqueueSnackbarAction({
          message: data.message,
          key: data.message,
          dismissed: false,
          options: { variant: "error", autoHideDuration: 2500 },
        })
      );
      localStorage.removeItem(LocalStorageKeys.TOKEN);
      localStorage.removeItem(LocalStorageKeys.USER);
      window.location.replace("/");
      return Promise.reject(error);
    }

    if (status === 500) {
      store.dispatch(
        enqueueSnackbarAction({
          message: data.message,
          key: data.message,
          dismissed: false,
          options: { variant: "error", autoHideDuration: 2500 },
        })
      );
      return Promise.reject(error);
    }

    if (status === 400) {
      store.dispatch(
        enqueueSnackbarAction({
          message: data.message,
          key: data.message,
          dismissed: false,
          options: { variant: "warning", autoHideDuration: 2500 },
        })
      );
    }
    return Promise.reject(error);
  }
);

export default api;
