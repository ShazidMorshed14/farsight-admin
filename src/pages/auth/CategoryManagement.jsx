import {
  ActionIcon,
  Button,
  Flex,
  Loader,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import AddCategory from "../../components/Forms/AddCategory";
import EditCategory from "../../components/Forms/EditCategory";
import ServerErrorBox from "../../components/Global/ServerErrorBox";
import COLORS from "../../constants/colors";
import { fetchCategoriesPageless } from "../../services/categories";
import {
  isArrayAndHasContent,
  isObjectAndHasProperties,
} from "../../utils/utils";

const CategoryManagement = () => {
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);

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
            <Text weight="bold" fz="md" color={COLORS.fontPrimary}>
              Category Management
            </Text>
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

  //render categories in list
  const renderCategories = (categories) => {
    let myCategories = [];

    for (let category of categories) {
      myCategories.push(
        <li key={category._id} style={{ padding: "1em 0em" }}>
          <Flex gap={10}>
            {" "}
            {category.name}
            <Tooltip label="Edit">
              <ActionIcon
                radius="xs"
                size="lg"
                onClick={() => {
                  setSelectedItem(category);
                  setEditCategoryModal(true);
                }}
                color="yellow"
                variant="light"
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
          </Flex>
          {isArrayAndHasContent(category.children) && (
            <ul>{renderCategories(category.children)}</ul>
          )}
        </li>
      );
    }

    return myCategories;
  };

  return (
    <div>
      <LoadingOverlay
        visible={isFetching}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      {/* add modal */}
      <Modal
        opened={addCategoryModal}
        onClose={() => setAddCategoryModal(false)}
        title={<Text fw="600">Add Category</Text>}
        centered
        styles={() => ({
          title: {
            fontSize: "24px",
            fontWeight: "bold",
          },
        })}
        size="lg"
      >
        <AddCategory
          onClose={() => {
            setAddCategoryModal(false);
            setSelectedItem(null);
          }}
          onUpdate={() => {
            setAddCategoryModal(false);
            refetch();
          }}
          defaultValues={selectedItem}
          update={isObjectAndHasProperties(selectedItem)}
        />
      </Modal>

      {/* edit modal */}
      <Modal
        opened={editCategoryModal}
        onClose={() => setEditCategoryModal(false)}
        title={<Text fw="600">Edit Category</Text>}
        centered
        styles={() => ({
          title: {
            fontSize: "24px",
            fontWeight: "bold",
          },
        })}
        size="lg"
      >
        <EditCategory
          onClose={() => {
            setEditCategoryModal(false);
            setSelectedItem(null);
          }}
          onUpdate={() => {
            setEditCategoryModal(false);
            refetch();
          }}
          defaultValues={selectedItem}
          update={isObjectAndHasProperties(selectedItem)}
        />
      </Modal>

      <Flex w="100%" justify="space-between" align="center" my="sm">
        <Text weight="bold" fz="md" color={COLORS.fontPrimary}>
          Category Management
        </Text>
        <Flex gap={10}>
          <Button
            onClick={() => setAddCategoryModal(true)}
            className="primary_btn"
            leftIcon={<IconPlus />}
            size="xs"
          >
            Add Category
          </Button>
        </Flex>
      </Flex>

      <div>
        <ul>{renderCategories(categoryData)}</ul>
      </div>
    </div>
  );
};

export default CategoryManagement;
