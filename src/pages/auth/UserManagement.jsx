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
import COLORS from "../../constants/colors";
import React, { useEffect, useState } from "react";
import { IconDatabase, IconPlus, IconRefresh } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserList } from "../../services/users";
import ServerErrorBox from "../../components/Global/ServerErrorBox";
import SearchInput from "../../components/Global/SearchInput";
import UserTable from "../../components/Tables/UserTable";
import ShowItems from "../../components/Global/ShowItems";
import UserDetails from "../../components/Forms/UserDetails";
import EditUser from "../../components/Forms/EditUser";
import AddUser from "../../components/Forms/AddUser";

const UserManagement = () => {
  useEffect(() => {
    document.title = "Users | Farsight";
  }, []);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKey, setSearchKey] = useState(null);
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);

  const [invokingRefreshForSearchInput, setInvokingRefreshForSearchInput] =
    useState(null);

  const [selectedItem, setSelectedItem] = useState(null);

  //modals states
  const [itemDetailsModal, setItemDetailsModal] = useState(false);
  const [itemEditModal, setItemEditModal] = useState(false);

  //drawer state
  const [itemAddDrawer, setItemAddDrawer] = useState(false);

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
    setRole(null);
    handleRefresh();
  };

  //modals actions
  const handleItemDetails = (item) => {
    setSelectedItem(item);
    setItemDetailsModal(true);
  };

  const handleItemEdit = (item) => {
    setSelectedItem(item);
    setItemEditModal(true);
  };

  //fetching products only
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["users", page, pageSize, searchKey, role, status],
    queryFn: fetchUserList,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  if (isLoading)
    return (
      <div>
        <Flex w="100%" justify="space-between" align="center" my="sm">
          <Text weight="bold" fz="xl" color={COLORS.fontPrimary}>
            User Management
          </Text>
          <Flex gap={10}>
            <Button
              //onClick={() => setAddCategoryModal(true)}
              className="primary_btn"
              leftIcon={<IconPlus />}
              size="xs"
            >
              Add User
            </Button>
            <Button
              //onClick={() => setAddCategoryModal(true)}
              className="primary_btn"
              leftIcon={<IconDatabase />}
              size="xs"
              color="orange"
            >
              Export Products
            </Button>
          </Flex>
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

  const { users, total } = data.data.data;

  return (
    <div>
      {/* MODALS */}
      <Modal
        opened={selectedItem && itemDetailsModal}
        onClose={() => setItemDetailsModal(false)}
        title={<Text fw="600">User Details</Text>}
        centered
        styles={() => ({
          title: {
            fontSize: "24px",
            fontWeight: "bold",
          },
          body: {
            minWidth: "80vw",
          },
        })}
        size="auto"
      >
        <UserDetails
          onClose={() => {
            setSelectedItem(null);
            setItemDetailsModal(false);
          }}
          onUpdate={() => {
            setSelectedItem(null);
            setItemDetailsModal(false);
          }}
          data={selectedItem}
        />
      </Modal>

      <Modal
        opened={selectedItem && itemEditModal}
        onClose={() => setItemEditModal(false)}
        title={<Text fw="600">Edit User</Text>}
        centered
        styles={() => ({
          title: {
            fontSize: "24px",
            fontWeight: "bold",
          },
        })}
        size="lg"
      >
        <EditUser
          onClose={() => {
            setSelectedItem(null);
            setItemEditModal(false);
          }}
          onUpdate={() => {
            setSelectedItem(null);
            setItemEditModal(false);
            refetch();
          }}
          data={selectedItem}
        />
      </Modal>

      <Drawer
        opened={itemAddDrawer}
        onClose={() => setItemAddDrawer(false)}
        title={
          <Text fw={600} fz="md">
            Add New User
          </Text>
        }
        position="right"
      >
        <AddUser
          onUpdate={() => {
            setItemAddDrawer(false);
            refetch();
          }}
        />
      </Drawer>
      {/* MODALS END*/}

      <Flex w="100%" justify="space-between" align="center" my="sm">
        <Text weight="bold" fz="md" color={COLORS.fontPrimary}>
          User Management
        </Text>
        <Flex gap={10}>
          <Button
            onClick={() => setItemAddDrawer(true)}
            className="primary_btn"
            leftIcon={<IconPlus />}
            size="xs"
          >
            Add User
          </Button>
          <Button
            //onClick={() => setAddCategoryModal(true)}
            className="primary_btn"
            leftIcon={<IconDatabase />}
            size="xs"
            color="orange"
          >
            Export Users
          </Button>
        </Flex>
      </Flex>

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
            data={[
              { label: "Active", value: "active" },
              { label: "Deactive", value: "deactive" },
            ]}
          />

          <Select
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
          />

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
            <UserTable
              data={users}
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

export default UserManagement;
