import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  addNewCategory,
  fetchCategoriesList,
  fetchCategoriesPageless,
  updateCategory,
} from "../../services/categories";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  FileInput,
  Flex,
  Grid,
  Image,
  LoadingOverlay,
  MultiSelect,
  Paper,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { NotificationUtil } from "../../utils/notifications";
import { isArrayAndHasContent } from "../../utils/utils";
import axios from "../../services/axios";
import { openConfirmModal } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import NoFileSelectedBox from "../../pages/global/NoFileSelectedBox";
import { updateSubCategory } from "../../services/subcategories";

const no_img_link = "https://www.freeiconspng.com/uploads/no-image-icon-4.png";

const EditSubCategory = ({ onClose, onUpdate, defaultValues }) => {
  const [files, setFiles] = useState([]);
  const [appFiles, setAppFiles] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customCategoryList, setCustomCategoryList] = useState([]);

  const form = useForm({
    initialValues: {
      name: defaultValues?.name ? defaultValues?.name : "",
    },

    validate: {
      name: (value) =>
        value.length < 1 ? "Sub-Category Name must be given" : null,
    },
  });

  const handleFileChange = (selectedFiles) => {
    // Check if all selected files are either JPEG or PNG
    if (
      selectedFiles.some(
        (file) => !["image/jpeg", "image/png"].includes(file.type)
      )
    ) {
      NotificationUtil({
        success: false,
        title: "Not Valid File Format",
        message: "Please select only JPEG or PNG files.",
      });
    } else if (
      isArrayAndHasContent(selectedFiles) &&
      selectedFiles.length > 1
    ) {
      NotificationUtil({
        success: false,
        title: "File Limit Exceeded",
        message: "Can't Select More than 1 File",
      });
      setFiles([]);
    } else {
      // Handle file change
      setFiles(selectedFiles);
    }
  };

  const handleAppFileChange = (selectedFiles) => {
    // Check if all selected files are either JPEG or PNG
    if (
      selectedFiles.some(
        (file) => !["image/jpeg", "image/png"].includes(file.type)
      )
    ) {
      NotificationUtil({
        success: false,
        title: "Not Valid File Format",
        message: "Please select only JPEG or PNG files.",
      });
    } else if (
      isArrayAndHasContent(selectedFiles) &&
      selectedFiles.length > 1
    ) {
      NotificationUtil({
        success: false,
        title: "File Limit Exceeded",
        message: "Can't Select More than 1 File",
      });
      setAppFiles([]);
    } else {
      // Handle file change
      setAppFiles(selectedFiles);
    }
  };

  const handleSubmit = (values) => {
    // Prepare form data for API
    let apiFormData = new FormData();

    // Append each file to the FormData feature image
    if (isArrayAndHasContent(files)) {
      files.forEach((file) => {
        apiFormData.append("image", file);
      });
    }
    // Append app each file to the FormData appImage
    if (isArrayAndHasContent(appFiles)) {
      appFiles.forEach((file) => {
        apiFormData.append("appImage", file);
      });
    }

    if (values.name) {
      apiFormData.append("name", values.name);
    }

    if (isArrayAndHasContent(selectedCategories)) {
      selectedCategories.forEach((cat) => {
        apiFormData.append("categories", cat);
      });
    }

    ConfirmModal(apiFormData);
  };

  const ConfirmModal = (values) => {
    openConfirmModal({
      title: "Confirm",
      styles: () => ({
        title: {
          fontSize: "22px",
          fontWeight: "bold",
        },
      }),
      children: <Text size="sm">Are you sure you want to save changes?</Text>,
      confirmProps: { color: "red" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        updateMutate(values);
      },
    });
  };

  const { mutate: updateMutate, isLoading: isCreating } = useMutation({
    mutationFn: async (values) =>
      await updateSubCategory(values, defaultValues._id),
    onSuccess: (data) => {
      NotificationUtil({
        success: true,
        title: "Success",
        message: data?.data?.message,
      });
      form.reset();
      setFiles([]);
      setAppFiles([]);
      onUpdate();
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
  const {
    data: categoryData,
    isLoading: categoriesLoading,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["fetch-categories-pageless"],
    queryFn: fetchCategoriesPageless,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  //filtering already selected categories in list
  useEffect(() => {
    const alreadyAssignedCatList =
      defaultValues?.categories?.map((cat) => cat?.name) || [];

    const filteredList =
      categoryData?.data?.data.filter(
        (cat) => !alreadyAssignedCatList?.includes(cat?.name)
      ) || [];

    const filteredValues =
      filteredList.map((cat) => {
        return { label: cat?.name, value: cat?._id };
      }) || [];
    setCustomCategoryList(filteredValues);
  }, [categoryData]);

  return (
    <div>
      <LoadingOverlay
        visible={isCreating || isFetching}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Grid>
        <Grid.Col md={6} lg={6} sm={12} xs={12}>
          <form
            onSubmit={form.onSubmit((values) => handleSubmit(values))}
            encType="multipart/form-data"
          >
            <Flex direction="column" justify="space-between" gap={10}>
              <div>
                <TextInput
                  placeholder="Ex. Mobile "
                  label="Sub-Category Name"
                  size="xs"
                  withAsterisk
                  {...form.getInputProps("name")}
                />
              </div>
              <Flex direction="column" gap={10} py="sm">
                <Text>Already Assigned Categories</Text>

                <Flex gap={10} wrap="flex-wrap">
                  {defaultValues?.categories?.map((cat, index) => {
                    return (
                      <div>
                        <Badge key={index} size="lg">
                          {cat?.name}
                        </Badge>
                      </div>
                    );
                  })}
                </Flex>

                <MultiSelect
                  disabled={categoriesLoading}
                  data={customCategoryList}
                  label="Select Categories"
                  placeholder="Pick all that you like"
                  searchable
                  nothingFound="Nothing found"
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                  withAsterisk
                />
              </Flex>
              <FileInput
                files={files}
                clearable
                label="Select Sub-Category Image (only JPEG or PNG files)"
                placeholder="Upload Image"
                multiple
                py="sm"
                accept="image/*"
                onChange={handleFileChange}
                size="xs"
              />
              <FileInput
                files={appFiles}
                clearable
                label="Select App Image (only JPEG or PNG files)"
                placeholder="Upload Image"
                multiple
                py="sm"
                accept="image/*"
                onChange={handleAppFileChange}
                size="xs"
              />

              <Flex my="sm" justify="flex-end" gap={10}>
                <Button
                  size="xs"
                  color="red"
                  onClick={() => {
                    setFiles([]);
                    setAppFiles([]);
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button size="xs" className="primary_btn" type="submit">
                  Save
                </Button>
              </Flex>
            </Flex>
          </form>
        </Grid.Col>

        {/* image showing section */}
        <Grid.Col md={6} lg={6} sm={12} xs={12} orderSm={1} orderXs={1}>
          <>
            <Card
              style={{
                backgroundColor: "transparent",
                border: "1px solid white",
                borderStyle: "dotted",
                minHeight: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Flex justify="space-around" gap="lg">
                {isArrayAndHasContent(files) ? (
                  <Flex direction="column" gap="md">
                    <Text fw={500}>Selected Feature Image</Text>
                    {files.map((img, index) => {
                      let image_as_base64 = URL.createObjectURL(img);
                      let caption = img.name;
                      return (
                        <div style={{ position: "relative" }} key={index}>
                          <Tooltip label={"Remove"}>
                            <ActionIcon
                              variant="filled"
                              color="white"
                              onClick={() => setFiles([])}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Image
                            src={image_as_base64}
                            radius="md"
                            height={100}
                            width={100}
                            key={index}
                            caption={caption}
                          />
                        </div>
                      );
                    })}
                  </Flex>
                ) : (
                  <Flex
                    direction="column"
                    gap="md"
                    justify="center"
                    align="center"
                  >
                    <Image
                      src={defaultValues?.categoryImage || no_img_link}
                      radius="md"
                      height={100}
                      width={100}
                    />
                    <Text fw={500}>Previous Feature Image</Text>
                  </Flex>
                )}

                {isArrayAndHasContent(appFiles) ? (
                  <Flex direction="column" gap="md">
                    <Text fw={500}>Selected App Feature Image</Text>
                    {appFiles.map((img, index) => {
                      let image_as_base64 = URL.createObjectURL(img);
                      let caption = img.name;
                      return (
                        <div style={{ position: "relative" }} key={index}>
                          <Tooltip label={"Remove"}>
                            <ActionIcon
                              variant="filled"
                              color="white"
                              onClick={() => setAppFiles([])}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Image
                            src={image_as_base64}
                            radius="md"
                            height={100}
                            width={100}
                            key={index}
                            caption={caption}
                          />
                        </div>
                      );
                    })}
                  </Flex>
                ) : (
                  <Flex
                    direction="column"
                    gap="md"
                    justify="center"
                    align="center"
                  >
                    <Image
                      src={defaultValues?.categoryAppImage || no_img_link}
                      radius="md"
                      height={100}
                      width={100}
                    />
                    <Text fw={500}>Previous Feature Image (App)</Text>
                  </Flex>
                )}
              </Flex>
            </Card>
          </>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default EditSubCategory;
