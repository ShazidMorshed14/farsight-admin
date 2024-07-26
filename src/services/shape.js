import axios from "./axios";

export const fetchShapes = async () => {
  const response = await axios().get("/shape");
  return response;
};
