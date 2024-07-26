import axios from "axios";
import store from "../store";
import { authActions } from "../store/reducers/authReducer";

export default (baseURL = import.meta.env.VITE_APP_BASE_URL) => {
  console.log(baseURL);
  const instance = axios.create({
    baseURL,
  });

  //request interceptor to add the auth token header to requests
  instance.interceptors.request.use((config) => {
    // checking if the access token exist in the localStorage
    const accessToken = store.getState().auth.accessToken;
    const refreshToken = store.getState().auth.refreshToken;

    config.headers = {
      "Content-Type": config.headers["Content-Type"]
        ? config.headers["Content-Type"]
        : "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-refresh-token": refreshToken,
    };
    return config;
  });

  // response interceptor to refresh token on receiving token expired error
  instance.interceptors.response.use(
    (response) => {
      const newRefreshToken = response.headers["x-refresh-token"];

      if (newRefreshToken) {
        store.dispatch(authActions.updateRefreshToken(newRefreshToken));
      }

      return response;
    },
    async (error) => {
      if (error.response.status === 401) {
        // logging user out
        store.dispatch(authActions.signout());
        return;
      }
      // if (error.response.status === 403) {
      //   window.location.href = '/403';
      // }
      //   if (error.response.status === 500) {
      //     errorNoitif(error?.response?.data?.msg);
      //   }
      //   if (error.response.status === 404) {
      //     errorNoitif(error?.response?.data?.msg);
      //   }
      //   if (error.response.status === 400) {
      //     errorNoitif(error?.response?.data?.msg);
      //   }

      //   if (error.response) {
      //     console.error(error.response);
      //   } else if (error.request) {
      //     errorNoitif('Internal server error');
      //   } else {
      //     errorNoitif('Internal server error');
      //   }
      return Promise.reject(error);
    }
  );

  return instance;
};
