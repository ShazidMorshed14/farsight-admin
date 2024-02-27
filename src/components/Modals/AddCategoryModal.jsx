import {
  Button,
  FileInput,
  Flex,
  Modal,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { isArrayAndHasContent } from "../../utils/utils";
import { NotificationUtil } from "../../utils/notifications";
import { fetchCategoriesList } from "../../services/categories";

const AddCategoryModal = ({
  addCategoryModal,
  setAddCategoryModal,
  refetchCategories,
}) => {
  const queryClient = useQueryClient();

  const [files, setFiles] = useState([]);

  const form = useForm({
    initialValues: {
      patientId: null,
      name: "",
    },

    validate: {
      name: (value) =>
        value.length < 1 ? "Category Name must be given" : null,
    },
  });

  //fetching patient only
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
      selectedFiles.length > 5
    ) {
      NotificationUtil({
        success: false,
        title: "File Limit Exceeded",
        message: "Can't Select More than 5 Files",
      });
    } else {
      // Handle file change
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = (values) => {
    //e.preventDefault()
    //addCategoryMutate(values);

    // Prepare form data for API
    let apiFormData = new FormData();

    // Append each file to the FormData
    files.forEach((file, index) => {
      apiFormData.append("images", file);
    });

    //console.log(values);

    apiFormData.append("name", values.name);
    apiFormData.append("parentId", values.parentId);

    console.log(apiFormData);
  };

  console.log(data?.data);

  return (
    <Modal
      opened={addCategoryModal}
      onClose={() => setAddCategoryModal(false)}
      title={<Text fw="600">Add New Category</Text>}
      centered
      styles={() => ({
        title: {
          fontSize: "24px",
          fontWeight: "bold",
        },
      })}
      size="lg"
    >
      <div>
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

        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Flex direction="column" justify="space-between" gap={10}>
            <div>
              <TextInput
                name="name"
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
                dropdownPosition="bottom"
                withinPortal
                data={[
                  { value: "mobile", label: "Mobile" },
                  { value: "samsung", label: "Samsung" },
                ]}
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
    </Modal>
  );
};

export default AddCategoryModal;
