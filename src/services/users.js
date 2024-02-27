import axios from "./axios";

export const fetchUserList = async (context) => {
  const response = await axios().get("/admin/users", {
    params: {
      page: context.queryKey[1],
      pageSize: context.queryKey[2],
      searchKey: context.queryKey[3],
      role: context.queryKey[4],
      status: context.queryKey[5],
    },
  });

  return response;
};

export const addNewUser = async (formData) => {
  const response = await axios().post("/admin/auth/register", formData);

  return response;
};

export const editUser = async (formData, id) => {
  const response = await axios().put(`/admin/users/${id}`, formData);
  return response;
};
