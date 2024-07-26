import axios from "./axios";

export const fetchCategoriesPageless = async (context) => {
  const response = await axios().get("/category", {
    params: {
      page: context.queryKey[1],
      pageSize: context.queryKey[2],
      pid: context.queryKey[3],
      name: context.queryKey[4],
      phone: context.queryKey[5],
      pageLess: context.queryKey[6],
    },
  });
  return response;
};

export const fetchCategoriesList = async () => {
  const response = await axios().get("/category/list");
  return response;
};

export const addNewCategory = async (formData) => {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };

  const response = await axios().post("/category/create", formData, config);

  return response;
};

export const updateCategory = async (formData, id) => {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };

  const response = await axios().put(
    `/category/update/${id}`,
    formData,
    config
  );

  return response;
};

export const deleteCategory = async (id) => {
  const response = await axios().delete(`/category/delete/${id}`);

  return response;
};
