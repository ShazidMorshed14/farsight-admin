import axios from "./axios";

export const fetchProducts = async (context) => {
  const response = await axios().get("/product", {
    params: {
      page: context.queryKey[1],
      pageSize: context.queryKey[2],
      name: context.queryKey[3],
      sku: context.queryKey[4],
    },
  });
  return response;
};

export const addNewProduct = async (formData) => {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };

  const response = await axios().post("/product/create", formData, config);

  return response;
};

export const updateProductJson = async (formData, id) => {
  const response = await axios().put(`/product/update/${id}`, formData);

  return response;
};
