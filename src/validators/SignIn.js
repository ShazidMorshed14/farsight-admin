import * as yup from "yup";

export const SignInSchema = yup.object().shape({
  email: yup.string().required("Email/Phone is required"),
  password: yup.string().required("Password is required"),
});
