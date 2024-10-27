import axios from "./axios";

export const fetchOrderList = async (context) => {
  const response = await axios().get("/admin/order", {
    params: {
      page: context.queryKey[1],
      pageSize: context.queryKey[2],
      searchKey: context.queryKey[3],
      user_id: context.queryKey[4],
      status: context.queryKey[5],
      start_date: context.queryKey[6],
      end_date: context.queryKey[7],
    },
  });

  return response;
};

export const fetchOrderDetails = async (context) => {
  const response = await axios().get(`/admin/order/${context.queryKey[1]}`);
  return response;
};
