import axios from "./axios";

export const fetchSubCategoriesPageless = async (context) => {
  const response = await axios().get("/subcategory", {
    params: {
      searchKey: context.queryKey[1],
      categoryId: context.queryKey[2],
    },
  });
  return response;
};

export const fetchSubCategoriesList = async () => {
  const response = await axios().get("/subcategory/list");
  return response;
};

export const addNewSubCategory = async (formData) => {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };

  const response = await axios().post("/subcategory/create", formData, config);

  return response;
};

export const updateSubCategory = async (formData, id) => {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };

  const response = await axios().put(
    `/subcategory/update/${id}`,
    formData,
    config
  );

  return response;
};

export const deleteSubCategory = async (id) => {
  const response = await axios().delete(`/subcategory/delete/${id}`);

  return response;
};

export const removeCategoryFromSubCategory = async (values) => {
  const response = await axios().post(
    "/subcategory/remove-category-from-subcategory",
    values
  );

  return response;
};
