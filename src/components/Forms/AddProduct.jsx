import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { addNewCategory, fetchCategoriesList } from "../../services/categories";
import {
  Button,
  Card,
  FileInput,
  Flex,
  Grid,
  Image,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { NotificationUtil } from "../../utils/notifications";
import { isArrayAndHasContent } from "../../utils/utils";
import axios from "../../services/axios";
import { openConfirmModal } from "@mantine/modals";
import JoditEditor from "jodit-react";

const AddProduct = ({ onClose, onUpdate }) => {
  const queryClient = useQueryClient();

  const descriptionRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [productDescription, setProductDescription] = useState(null);

  const form = useForm({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      category: "",
    },

    //8192
    validate: {
      name: (value) => (value.length < 1 ? "Product Name must be given" : null),
      category: (value) => (value.length < 1 ? "category must be given" : null),
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
      selectedFiles.length > 5
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
    files.forEach((file, index) => {
      apiFormData.append("images", file);
    });

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
      children: (
        <Text size="sm">Are you sure you want to add this category?</Text>
      ),
      confirmProps: { color: "blue" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        createMutate(values);
      },
    });
  };

  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: async (values) => await addNewCategory(values),
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

      <Grid>
        <Grid.Col
          lg={6}
          md={12}
          sm={12}
          xs={12}
          orderMd={2}
          orderSm={2}
          orderXs={2}
          orderLg={1}
        >
          <Text fw={600} fz="xs" color="red" align="right">
            Maximum 5 Images
          </Text>
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
                  placeholder="Ex. Samsung s22"
                  label="Product Name"
                  size="xs"
                  withAsterisk
                  {...form.getInputProps("name")}
                />
              </div>
              <div>
                <TextInput
                  placeholder="Ex. 9000"
                  label="Product Price"
                  size="xs"
                  withAsterisk
                  type="number"
                  {...form.getInputProps("price")}
                />
              </div>

              <div>
                <Select
                  size="xs"
                  label="Select Category"
                  placeholder="Select Category"
                  dropdownPosition="bottom"
                  withinPortal
                  withAsterisk
                  disabled={isFetching}
                  data={
                    data?.data?.data.map((category) => {
                      return {
                        label: category.name,
                        value: category._id,
                      };
                    }) || []
                  }
                  {...form.getInputProps("category")}
                />
              </div>
              <div>
                <p className="form-label">Description</p>
                <ScrollArea style={{ height: "25vh" }}>
                  <JoditEditor
                    ref={descriptionRef}
                    value={productDescription}
                    //config={config}
                    tabIndex={1} // tabIndex of textarea
                    onChange={(newContent) => setProductDescription(newContent)}
                  />
                </ScrollArea>
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
        </Grid.Col>

        <Grid.Col
          lg={6}
          md={12}
          sm={12}
          xs={12}
          orderMd={1}
          orderSm={1}
          orderXs={1}
          orderLg={2}
        >
          {isArrayAndHasContent(files) && (
            <Card
              style={{
                backgroundColor: "transparent",
                border: "1px solid white",
                borderStyle: "dotted",
              }}
            >
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
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default AddProduct;
