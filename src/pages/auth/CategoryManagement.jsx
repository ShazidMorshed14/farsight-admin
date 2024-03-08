import { Button, Flex, Loader, Modal, Stack, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import AddCategory from "../../components/Forms/AddCategory";
import EditCategory from "../../components/Forms/EditCategory";
import CommonHeader from "../../components/Global/CommonHeader";
import ServerErrorBox from "../../components/Global/ServerErrorBox";
import CategoryTable from "../../components/Tables/CategoryTable";
import COLORS from "../../constants/colors";
import {
  deleteCategory,
  fetchCategoriesPageless,
} from "../../services/categories";
import { NotificationUtil } from "../../utils/notifications";

const CategoryManagement = () => {
  useEffect(() => {
    document.title = "Categories | Farsight";
  }, []);

  const [selectedItem, setSelectedItem] = useState(null);

  //modals states
  const [itemAddModal, setItemAddModal] = useState(false);
  const [itemEditModal, setItemEditModal] = useState(false);

  const handleItemAdd = (item) => {
    setSelectedItem(item);
    setItemAddModal(true);
  };

  const handleItemEdit = (item) => {
    setSelectedItem(item);
    setItemEditModal(true);
  };

  const handleItemDelete = (item) => {
    ConfirmDeleteModal(item?._id);
  };

  const ConfirmDeleteModal = (id) => {
    openConfirmModal({
      title: "Confirm",
      styles: () => ({
        title: {
          fontSize: "22px",
          fontWeight: "bold",
        },
      }),
      children: (
        <Text size="sm">Are you sure you want to delete this category?</Text>
      ),
      confirmProps: { color: "red" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        deleteMutate(id);
      },
    });
  };

  const { mutate: deleteMutate, isLoading: isDeleting } = useMutation({
    mutationFn: async (id) => await deleteCategory(id),
    onSuccess: (data) => {
      NotificationUtil({
        success: true,
        title: "Success",
        message: data?.data?.message,
      });
      refetch();
    },
    onError: (error) => {
      NotificationUtil({
        success: false,
        title: "Error",
        message: error.response.data.message,
      });
    },
  });

  //fetching patient only
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["fetch-categories-pageless"],
    queryFn: fetchCategoriesPageless,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  if (isLoading)
    return (
      <div className="card">
        <div className="card-body">
          <Flex w="100%" justify="space-between" align="center" my="sm">
            <CommonHeader title="Category Management" />
            <Flex gap={10}>
              <Button className="primary_btn" leftIcon={<IconPlus />} size="xs">
                Add Category
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
            <Loader size="md" variant="oval" color="white" />
          </Stack>
        </div>
      </div>
    );

  if (error)
    return (
      <div>
        <ServerErrorBox apiError={true} />
      </div>
    );

  const { data: categoryData } = data?.data;

  return (
    <div>
      {/* MODALS */}

      <Modal
        opened={itemAddModal}
        closeOnClickOutside={false}
        onClose={() => setItemAddModal(false)}
        title={<Text fw="600">Add Category</Text>}
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
        <AddCategory
          onUpdate={() => {
            refetch();
            setItemAddModal(false);
          }}
          onClose={() => {
            setItemAddModal(false);
          }}
        />
      </Modal>

      <Modal
        opened={selectedItem && itemEditModal}
        closeOnClickOutside={false}
        onClose={() => setItemEditModal(false)}
        title={<Text fw="600">Edit Category</Text>}
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
        <EditCategory
          defaultValues={selectedItem}
          onUpdate={() => {
            setSelectedItem(null);
            setItemEditModal(false);
            refetch();
          }}
          onClose={() => {
            setItemEditModal(false);
            setSelectedItem(null);
          }}
        />
      </Modal>

      {/* MODALS END*/}

      <Flex w="100%" justify="space-between" align="center" my="sm">
        <Text weight="bold" fz="md" color={COLORS.fontPrimary}>
          Category Management
        </Text>
        <Flex gap={10}>
          <Button
            onClick={() => setItemAddModal(true)}
            className="primary_btn"
            leftIcon={<IconPlus />}
            size="xs"
          >
            Add Category
          </Button>
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
            <CategoryTable
              data={categoryData}
              handleItemAdd={handleItemAdd}
              handleItemEdit={handleItemEdit}
              handleItemDelete={handleItemDelete}
            />
          </>
        )}
      </>
    </div>
  );
};

export default CategoryManagement;
