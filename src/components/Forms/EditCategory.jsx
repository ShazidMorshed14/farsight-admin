import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  addNewCategory,
  fetchCategoriesList,
  updateCategory,
} from "../../services/categories";
import {
  Button,
  Card,
  FileInput,
  Flex,
  Image,
  LoadingOverlay,
  Paper,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { NotificationUtil } from "../../utils/notifications";
import { isArrayAndHasContent } from "../../utils/utils";
import axios from "../../services/axios";
import { openConfirmModal } from "@mantine/modals";

const EditCategory = ({ onClose, onUpdate, defaultValues }) => {
  const queryClient = useQueryClient();

  const [files, setFiles] = useState([]);

  const form = useForm({
    initialValues: {
      parentId: defaultValues.parentId ? defaultValues.parentId : null,
      name: defaultValues.name ? defaultValues.name : "",
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

  const handleSubmit = (values) => {
    // Prepare form data for API
    let apiFormData = new FormData();

    // Append each file to the FormData
    if (isArrayAndHasContent(files)) {
      files.forEach((file, index) => {
        apiFormData.append("images", file);
      });
    }

    apiFormData.append(`name`, values.name);
    if (values.parentId) {
      apiFormData.append(`parentId`, values.parentId);
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

      {!isArrayAndHasContent(files) && defaultValues.categoryImage && (
        <Card
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            borderStyle: "dotted",
          }}
        >
          <Text fz="sm" fw="600" py="xs" align="center">
            Previous Image
          </Text>
          <Image
            src={defaultValues.categoryImage}
            radius="md"
            height={100}
            width={100}
          />
        </Card>
      )}

      {isArrayAndHasContent(files) && (
        <Card
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            borderStyle: "dotted",
          }}
        >
          <Text fz="sm" fw="600" py="xs" align="center">
            New Image
          </Text>
          <SimpleGrid
            cols={4}
            py="md"
            spacing="lg"
            breakpoints={[
              { maxWidth: "lg", cols: 2, spacing: "lg" },
              { maxWidth: "md", cols: 1, spacing: "lg" },
              { maxWidth: "sm", cols: 1, spacing: "lg" },
              { maxWidth: "xs", cols: 1, spacing: "lg" },
            ]}
          >
            {files.map((img, index) => {
              let image_as_base64 = URL.createObjectURL(img);
              let caption = img.name;
              return (
                <Image
                  src={image_as_base64}
                  radius="md"
                  height={100}
                  width={100}
                  key={index}
                  caption={caption}
                />
              );
            })}
          </SimpleGrid>
        </Card>
      )}
      <FileInput
        files={files}
        clearable
        label="Upload Image (only JPEG or PNG files)"
        placeholder="Upload Image"
        multiple
        py="sm"
        accept="image/*"
        onChange={handleFileChange}
      />

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
          <div>
            <Select
              size="xs"
              label="Parent Category"
              placeholder="Select Parent Category"
              dropdownPosition="bottom"
              withinPortal
              disabled={isFetching}
              data={
                data?.data?.data
                  ?.filter((cat) => cat._id !== defaultValues._id)
                  .map((category) => {
                    return {
                      label: category.name,
                      value: category._id,
                    };
                  }) || []
              }
              {...form.getInputProps("parentId")}
            />
          </div>

          <Flex my="sm" justify="flex-end" gap={10}>
            <Button size="xs" color="red">
              Cancel
            </Button>
            <Button size="xs" className="primary_btn" type="submit">
              Save
            </Button>
          </Flex>
        </Flex>
      </form>
    </div>
  );
};

export default EditCategory;
