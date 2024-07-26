import { handleErrorResponse } from "../utils/utils";
import axios from "./axios";

export const SignInApi = async (email, password) => {
  try {
    const { data } = await axios().post("/admin/auth/signin", {
      identifier: email,
      password: password,
    });

    console.log(data);
    return data;
  } catch (err) {
    handleErrorResponse(err);
  }
};

export const logout = async () => {
  try {
    const { data } = await axios().post("/auth/user/logout");
    return data;
  } catch (error) {
    handleErrorResponse(error);
  }
};
