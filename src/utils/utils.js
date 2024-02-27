import { NotificationUtil } from "./notifications";

export const isArrayAndHasContent = (arr) => {
  return Array.isArray(arr) && arr.length > 0;
};

export const isObjectAndHasProperties = (obj) => {
  return obj !== null && typeof obj === "object" && Object.keys(obj).length > 0;
};

export const parseResponseError = (err) => {
  if (err.response) {
    const { data } = err.response;

    if (data.validation && data.validation.body) {
      return data.validation.body.message;
    } else if (data.message) {
      return data.msg;
    } else {
      return data.msg;
    }
  }

  return "Please try again later.";
};

export const handleErrorResponse = (err) => {
  const { data } = err.response;

  NotificationUtil({
    success: false,
    title: "Something went wrong!",
    message: data.message,
  });
};
