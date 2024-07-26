import axios from "./axios";

export const fetchColors = async () => {
  const response = await axios().get("/color");
  return response;
};
