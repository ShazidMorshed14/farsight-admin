import {
  ActionIcon,
  Button,
  Card,
  FileInput,
  Flex,
  Grid,
  Image,
  LoadingOverlay,
  MultiSelect,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import NoFileSelectedBox from "../../pages/global/NoFileSelectedBox";
import {
  addNewCategory,
  fetchCategoriesPageless,
} from "../../services/categories";
import { NotificationUtil } from "../../utils/notifications";
import { isArrayAndHasContent } from "../../utils/utils";
import { addNewSubCategory } from "../../services/subcategories";

const AddSubCategory = ({ onUpdate, onClose }) => {
  const [files, setFiles] = useState([]);
  const [appFiles, setAppFiles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const form = useForm({
    initialValues: {
      name: "",
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

    apiFormData.append(`name`, values.name);

    if (isArrayAndHasContent(selectedCategories)) {
      selectedCategories.forEach((cat) => {
        apiFormData.append(`categories`, cat);
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
      children: (
        <Text size="sm">Are you sure you want to add this subcategory?</Text>
      ),
      confirmProps: { color: "blue" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        createMutate(values);
      },
    });
  };

  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: async (values) => await addNewSubCategory(values),
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

  return (
    <div>
      <LoadingOverlay visible={isCreating} />

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
              <MultiSelect
                disabled={categoriesLoading}
                data={
                  categoryData?.data?.data?.map((cat) => {
                    return { label: cat?.name, value: cat?._id };
                  }) || []
                }
                label="Select Categories"
                placeholder="Pick all that you like"
                searchable
                nothingFound="Nothing found"
                value={selectedCategories}
                onChange={setSelectedCategories}
                withAsterisk
              />
              <FileInput
                files={files}
                clearable
                label="Select Category Image (only JPEG or PNG files)"
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
          <Flex direction="column" gap={10}>
            {isArrayAndHasContent(files) || isArrayAndHasContent(appFiles) ? (
              <>
                <Card
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid white",
                    borderStyle: "dotted",
                  }}
                >
                  <Flex justify="space-around" gap="lg">
                    {isArrayAndHasContent(files) && (
                      <Flex direction="column" gap="md">
                        <Text fw={500}>Selected Feature Image</Text>
                        {files.map((img, index) => {
                          let image_as_base64 = URL.createObjectURL(img);
                          let caption = img.name;
                          return (
                            <div style={{ position: "relative" }}>
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
                    )}

                    {isArrayAndHasContent(appFiles) && (
                      <Flex direction="column" gap="md">
                        <Text fw={500}>Selected App Feature Image</Text>
                        {appFiles.map((img, index) => {
                          let image_as_base64 = URL.createObjectURL(img);
                          let caption = img.name;
                          return (
                            <div style={{ position: "relative" }}>
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
                    )}
                  </Flex>
                </Card>
              </>
            ) : (
              <NoFileSelectedBox caption="No File Selected" />
            )}
          </Flex>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default AddSubCategory;
