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
  Stepper,
  Group,
  Center,
  Box,
  createStyles,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { NotificationUtil } from "../../utils/notifications";
import { isArrayAndHasContent } from "../../utils/utils";
import axios from "../../services/axios";
import { openConfirmModal } from "@mantine/modals";
import JoditEditor from "jodit-react";
import { addNewProduct, updateProductJson } from "../../services/products";
import NoFileSelectedBox from "../../pages/global/NoFileSelectedBox";
import { fetchShapes } from "../../services/shape";
import ProductVariants from "./ProductVariants";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import COLORS from "../../constants/colors";

const useStyles = createStyles(() => ({
  shapeSelectBox: {
    backgroundColor: "white",
    cursor: "pointer",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "&:hover": {
      backgroundColor: "gold",
      color: "white",
    },
  },
  shapeSelectBoxActive: {
    backgroundColor: "gold",
    cursor: "pointer",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "&:hover": {
      backgroundColor: "gold",
      color: "white",
    },
  },
}));

const AddProduct = ({ onClose, onUpdate }) => {
  const { classes } = useStyles();

  const queryClient = useQueryClient();

  const descriptionRef = useRef(null);

  //stepper steps
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [files, setFiles] = useState([]);
  const [productDescription, setProductDescription] = useState(null);
  const [shape, setShape] = useState(null);
  const [newProductDetails, setNewProductDetails] = useState(null);
  console.log(newProductDetails);

  const form = useForm({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      quantity: 1,
      discount_amount: 0,
    },

    //8192
    validate: {
      name: (value) => (value.length < 1 ? "Product Name must be given" : null),
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
      selectedFiles.length > 5
    ) {
      NotificationUtil({
        success: false,
        title: "File Limit Exceeded",
        message: "Can't Select More than 5 File",
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
    files.forEach((file) => {
      apiFormData.append("images", file);
    });

    apiFormData.append("name", values.name);
    apiFormData.append("price", values.price);
    apiFormData.append("discount_amount", values.discount_amount);
    apiFormData.append("quantity", values.quantity);
    apiFormData.append("description", productDescription);

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
        <Text size="sm">Are you sure you want to add this Product?</Text>
      ),
      confirmProps: { color: "blue" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        createMutate(values);
      },
    });
  };

  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: async (values) => await addNewProduct(values),
    onSuccess: (data) => {
      NotificationUtil({
        success: true,
        title: "Success",
        message: data?.data?.message,
      });
      form.reset();
      setFiles([]);
      setNewProductDetails(data?.data?.data);
      setActive(1);
    },
    onError: (error) => {
      NotificationUtil({
        success: false,
        title: "Error",
        message: error.response.data.message,
      });
    },
  });

  const handleEditSubmit = (values) => {
    ConfirmModalForUpdate(values);
  };

  const ConfirmModalForUpdate = (values) => {
    openConfirmModal({
      title: "Confirm",
      styles: () => ({
        title: {
          fontSize: "22px",
          fontWeight: "bold",
        },
      }),
      children: (
        <Text size="sm">Are you sure you want to update this Product?</Text>
      ),
      confirmProps: { color: "blue" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        updateMutate(values);
      },
    });
  };

  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: async (values) =>
      await updateProductJson(values, newProductDetails?._id),
    onSuccess: (data) => {
      NotificationUtil({
        success: true,
        title: "Success",
        message: data?.data?.message,
      });
      form.reset();
      setFiles([]);
      setActive(2);
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
        visible={isCreating || isUpdating}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Box p="md">
        <Stepper active={active} onStepClick={() => {}} breakpoint="sm">
          <Stepper.Step label="First step" description="Create product">
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
                    <Grid>
                      <Grid.Col xl={4} lg={4} md={6} sm={12} xs={12}>
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
                      </Grid.Col>
                      <Grid.Col xl={4} lg={4} md={6} sm={12} xs={12}>
                        <div>
                          <TextInput
                            placeholder="Ex. 9000"
                            label="Discount"
                            size="xs"
                            type="number"
                            {...form.getInputProps("discount_amount")}
                          />
                        </div>
                      </Grid.Col>
                      <Grid.Col xl={4} lg={4} md={6} sm={12} xs={12}>
                        <div>
                          <TextInput
                            placeholder="Ex. 100"
                            label="Quantity"
                            size="xs"
                            type="number"
                            {...form.getInputProps("quantity")}
                          />
                        </div>
                      </Grid.Col>
                    </Grid>

                    <div>
                      <p className="form-label">Description</p>
                      <ScrollArea style={{ height: "40vh" }}>
                        <JoditEditor
                          ref={descriptionRef}
                          value={productDescription}
                          //config={config}
                          tabIndex={1} // tabIndex of textarea
                          onChange={(newContent) =>
                            setProductDescription(newContent)
                          }
                        />
                      </ScrollArea>
                    </div>

                    <Flex my="sm" justify="flex-end" gap={10}>
                      <Button size="xs" color="red" onClick={() => onClose()}>
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
                {isArrayAndHasContent(files) ? (
                  <Card
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid white",
                      borderStyle: "dotted",
                    }}
                  >
                    <SimpleGrid
                      cols={3}
                      py="md"
                      spacing="lg"
                      breakpoints={[
                        { maxWidth: "lg", cols: 3, spacing: "lg" },
                        { maxWidth: "md", cols: 2, spacing: "sm" },
                        { maxWidth: "sm", cols: 2, spacing: "sm" },
                        { maxWidth: "xs", cols: 1, spacing: "sm" },
                      ]}
                    >
                      {files.map((img, index) => {
                        let image_as_base64 = URL.createObjectURL(img);
                        let caption = img.name;
                        return (
                          <Image
                            src={image_as_base64}
                            radius="md"
                            height={150}
                            width={150}
                            key={index}
                            caption={caption}
                          />
                        );
                      })}
                    </SimpleGrid>
                  </Card>
                ) : (
                  <>
                    <NoFileSelectedBox caption="No Image Selected Yet" />
                  </>
                )}
              </Grid.Col>
            </Grid>
          </Stepper.Step>
          <Stepper.Step label="Select Variants" description="Set Variants">
            <ProductVariants
              handleEditSubmit={handleEditSubmit}
              productDetails={newProductDetails}
              nextStep={nextStep}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Product Upload Done"
            description="Upload Completed"
          >
            <Stack mih="70vh" justify="center" align="center">
              <Flex direction="column" gap={20} justify="center" align="center">
                <IconCircleCheckFilled size="5em" color={"green"} />
                <Text size="xl">Product Uploaded Successfully!</Text>
                <Flex>
                  <Button size="lg" onClick={() => onUpdate()}>
                    Go Back
                  </Button>
                </Flex>
              </Flex>
            </Stack>
          </Stepper.Step>
        </Stepper>
      </Box>
    </div>
  );
};

export default AddProduct;
