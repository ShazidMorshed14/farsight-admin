import { notifications } from "@mantine/notifications";

export const NotificationUtil = ({ success, title, message }) => {
  notifications.show({
    color: success ? "green" : "red",
    title: title || "Error",
    message: message || "Something went wrong!",
  });
};
