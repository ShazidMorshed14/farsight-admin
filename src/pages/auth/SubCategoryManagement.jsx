import {
  ActionIcon,
  Button,
  Flex,
  Loader,
  Modal,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
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
import SubCategoryTable from "../../components/Tables/SubCategoryTable";
import {
  deleteSubCategory,
  fetchSubCategoriesPageless,
  removeCategoryFromSubCategory,
} from "../../services/subcategories";
import SearchInput from "../../components/Global/SearchInput";
import AddSubCategory from "../../components/Forms/AddSubCategory";
import EditSubCategory from "../../components/Forms/EditSubCategory";
import { isArrayAndHasContent } from "../../utils/utils";

const SubCategoryManagement = () => {
  useEffect(() => {
    document.title = "Sub-Categories | Farsight";
  }, []);

  const [selectedItem, setSelectedItem] = useState(null);

  //modals states
  const [itemAddModal, setItemAddModal] = useState(false);
  const [itemEditModal, setItemEditModal] = useState(false);

  //filter options
  const [searchKey, setSearchKey] = useState(null);
  const [invokingRefreshForSearchInput, setInvokingRefreshForSearchInput] =
    useState(null);
  const [categoryId, setCategoryId] = useState(null);

  const handleSearch = (value) => {
    setSearchKey(value);
  };

  const handleRefresh = () => {
    setInvokingRefreshForSearchInput(!invokingRefreshForSearchInput);
    setSearchKey("");
    setCategoryId(null);
  };

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

  const handleCategoryRemove = (
    subCategoryId,
    categoryId,
    assignedCategoriesList
  ) => {
    const assignedCatSimpleList =
      assignedCategoriesList?.map((cat) => cat?._id) || [];

    if (
      isArrayAndHasContent(assignedCatSimpleList) &&
      assignedCatSimpleList.length > 1
    ) {
      const reqBody = {
        subCategoryId: subCategoryId,
        categoryId: categoryId,
      };

      ConfirmCategoryRemoveModal(reqBody);
    } else {
      NotificationUtil({
        success: false,
        title: "Category Must be assigned",
        message: "Atleast one category must be selected",
      });
    }
  };

  const ConfirmCategoryRemoveModal = (values) => {
    openConfirmModal({
      title: "Confirm",
      styles: () => ({
        title: {
          fontSize: "22px",
          fontWeight: "bold",
        },
      }),
      children: (
        <Text size="sm">Are you sure you want to remove this category?</Text>
      ),
      confirmProps: { color: "red" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        categoryRemoveMutate(values);
      },
    });
  };

  const { mutate: categoryRemoveMutate, isLoading: isCategoryRemoving } =
    useMutation({
      mutationFn: async (values) => await removeCategoryFromSubCategory(values),
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
        <Text size="sm">Are you sure you want to delete this subcategory?</Text>
      ),
      confirmProps: { color: "red" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        deleteMutate(id);
      },
    });
  };

  const { mutate: deleteMutate, isLoading: isDeleting } = useMutation({
    mutationFn: async (id) => await deleteSubCategory(id),
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

  //fetching sub-categories
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["fetch-subcategories-pageless", searchKey, categoryId],
    queryFn: fetchSubCategoriesPageless,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  //fetching categories
  const { data: categoryData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["fetch-categories-pageless"],
    queryFn: fetchCategoriesPageless,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  if (isLoading || categoriesLoading)
    return (
      <div className="card">
        <div className="card-body">
          <Flex w="100%" justify="space-between" align="center" my="sm">
            <CommonHeader title="Sub-Category Management" />
            <Flex gap={10}>
              <Button className="primary_btn" leftIcon={<IconPlus />} size="xs">
                Add Sub-Category
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

  const { data: subCategoryData } = data?.data;
  const { data: categoryList } = categoryData?.data;

  return (
    <div>
      {/* MODALS */}

      <Modal
        opened={itemAddModal}
        closeOnClickOutside={false}
        onClose={() => setItemAddModal(false)}
        title={<Text fw="600">Add Sub-Category</Text>}
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
        <AddSubCategory
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
        title={<Text fw="600">Edit Sub-Category</Text>}
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
        <EditSubCategory
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
        <CommonHeader title="Sub-Category Management" />
        <Flex gap={10}>
          <Button
            onClick={() => setItemAddModal(true)}
            className="primary_btn"
            leftIcon={<IconPlus />}
            size="xs"
          >
            Add Sub-Category
          </Button>
        </Flex>
      </Flex>

      <Flex w="100%" justify="flex-start" align="center" my="sm" gap={20}>
        <SearchInput
          handleRefresh={() => setSearchKey(null)}
          handleSearch={handleSearch}
          placeholder="Search here"
          invokeRefresh={invokingRefreshForSearchInput}
          refreshBtn={false}
        />

        <Select
          placeholder="Select Category"
          value={categoryId}
          onChange={setCategoryId}
          disabled={!categoryList ? true : false}
          searchable
          data={
            categoryList?.map((cat) => {
              return { label: cat?.name, value: cat?._id };
            }) || []
          }
        />

        <Flex gap={20} align="center" justify="center">
          <Tooltip label="Refresh">
            <ActionIcon
              size="lg"
              onClick={handleRefresh}
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
            <SubCategoryTable
              data={subCategoryData}
              handleItemAdd={handleItemAdd}
              handleItemEdit={handleItemEdit}
              handleItemDelete={handleItemDelete}
              handleCategoryRemove={handleCategoryRemove}
            />
          </>
        )}
      </>
    </div>
  );
};

export default SubCategoryManagement;
