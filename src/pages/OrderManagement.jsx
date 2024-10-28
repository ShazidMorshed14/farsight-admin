import React, { useState } from "react";
import {
  ActionIcon,
  Button,
  Drawer,
  Flex,
  Loader,
  Modal,
  Pagination,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import COLORS from "../constants/colors";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderList } from "../services/order";
import ServerErrorBox from "../components/Global/ServerErrorBox";
import SearchInput from "../components/Global/SearchInput";
import { IconRefresh } from "@tabler/icons-react";
import OrderTable from "../components/Tables/OrderTable";
import ShowItems from "../components/Global/ShowItems";
import { useNavigate } from "react-router-dom";
import { orderStatusOptions } from "../utils/dropdowns/order";

const OrderManagement = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKey, setSearchKey] = useState(null);
  const [status, setStatus] = useState(null);
  const [userId, setUserId] = useState(null);

  const [invokingRefreshForSearchInput, setInvokingRefreshForSearchInput] =
    useState(null);

  const handleSearch = (value) => {
    setPage(1);
    setSearchKey(value);
  };

  const handlePageSize = (value) => {
    setPage(1);
    setPageSize(value);
  };

  const handleRefresh = () => {
    setPage(1);
    setInvokingRefreshForSearchInput(!invokingRefreshForSearchInput);
    setSearchKey("");
  };

  const handleRefreshLocal = () => {
    setPage(1);
    setPageSize(10);
    setStatus(null);
    setSearchKey(null);
    handleRefresh();
  };

  const handleItemDetails = (item) => {
    navigate(`/orders/${item.order_no}`);
  };

  const handleItemEdit = (item) => {
    // setSelectedItem(item);
    // setItemEditModal(true);
  };

  //fetching products only
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["orders", page, pageSize, searchKey, userId, status],
    queryFn: fetchOrderList,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  if (isLoading)
    return (
      <div>
        <Flex w="100%" justify="space-between" align="center" my="sm">
          <Text weight="bold" fz="md" color={COLORS.fontPrimary}>
            Order Management
          </Text>
        </Flex>
        <Stack
          sx={{
            minHeight: "80vh",
          }}
          justify="center"
          align="center"
        >
          <Loader size="md" variant="oval" />
        </Stack>
      </div>
    );

  if (error)
    return (
      <div>
        <ServerErrorBox apiError={true} />
      </div>
    );

  const { orders, total } = data.data.data;
  console.log(orders);

  return (
    <div>
      <Flex w="100%" justify="space-between" align="center" my="sm">
        <Text weight="bold" fz="md" color={COLORS.fontPrimary}>
          Order Management
        </Text>
      </Flex>

      {/* filters section  */}
      <Flex justify="space-between" align="center" py="sm">
        <Flex gap={20}>
          <SearchInput
            handleRefresh={() => setSearchKey(null)}
            handleSearch={handleSearch}
            placeholder="Search here"
            invokeRefresh={invokingRefreshForSearchInput}
            refreshBtn={false}
          />

          <Select
            value={status}
            onChange={(value) => {
              setPage(1);
              setStatus(value);
            }}
            placeholder="Status"
            data={orderStatusOptions ?? []}
          />

          {/* <Select
            value={role}
            searchable
            onChange={(value) => {
              setPage(1);
              setRole(value);
            }}
            placeholder="Role"
            data={[
              { label: "Admin", value: "admin" },
              { label: "Vendor", value: "vendor" },
              { label: "User", value: "user" },
            ]}
          /> */}

          <Flex gap={20} align="center" justify="center">
            <Tooltip label="Refresh">
              <ActionIcon
                size="lg"
                onClick={handleRefreshLocal}
                sx={{
                  backgroundColor: COLORS.orange,
                }}
                variant="filled"
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>

      <>
        {isFetching ? (
          <>
            <Stack
              sx={{
                minHeight: "75vh",
              }}
              justify="center"
              align="center"
            >
              <Loader size="md" variant="oval" />
            </Stack>
          </>
        ) : (
          <>
            <OrderTable
              data={orders}
              handleItemDetails={handleItemDetails}
              handleItemEdit={handleItemEdit}
            />
            <Flex justify="space-between" align="center">
              <ShowItems
                mt="20px"
                handlePageSize={handlePageSize}
                pageSize={pageSize}
              />
              <Pagination
                mt="20px"
                value={page}
                onChange={setPage}
                total={Math.ceil(total / (pageSize ? pageSize : 10))}
              />
            </Flex>
          </>
        )}
      </>
    </div>
  );
};

export default OrderManagement;
