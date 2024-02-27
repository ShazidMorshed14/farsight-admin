import axios from "./axios";

export const fetchProducts = async (context) => {
  const response = await axios().get("/product", {
    params: {
      page: context.queryKey[1],
      pageSize: context.queryKey[2],
      name: context.queryKey[3],
      sku: context.queryKey[4],
      status: context.queryKey[5],
      category: context.queryKey[6],
      pageLess: context.queryKey[7],
    },
  });
  return response;
};
