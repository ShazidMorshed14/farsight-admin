import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  addNewCategory,
  fetchCategoriesList,
  updateCategory,
} from "../../services/categories";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  FileInput,
  Flex,
  Grid,
  Image,
  LoadingOverlay,
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

const no_img_link = "https://www.freeiconspng.com/uploads/no-image-icon-4.png";

const EditCategory = ({ onClose, onUpdate, defaultValues }) => {
  const [files, setFiles] = useState([]);
  const [appFiles, setAppFiles] = useState([]);

  const form = useForm({
    initialValues: {
      name: defaultValues?.name ? defaultValues?.name : "",
    },

    validate: {
      name: (value) =>
        value.length < 1 ? "Category Name must be given" : null,
    },
  });

  //fetching categories list
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["fetch-categories-list"],
    queryFn: fetchCategoriesList,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
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

    if (values.name && values.name !== defaultValues?.name) {
      apiFormData.append("name", values.name);
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
        console.log(values);
        updateMutate(values);
      },
    });
  };

  const { mutate: updateMutate, isLoading: isCreating } = useMutation({
    mutationFn: async (values) =>
      await updateCategory(values, defaultValues._id),
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
                  label="Category Name"
                  size="xs"
                  withAsterisk
                  {...form.getInputProps("name")}
                />
              </div>
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

export default EditCategory;
