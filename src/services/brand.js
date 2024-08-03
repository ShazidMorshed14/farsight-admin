import axios from "./axios";

export const fetchBrands = async () => {
  const response = await axios().get("/brand");
  return response;
};
