import {
  Badge,
  Box,
  Button,
  ColorPicker,
  Flex,
  Grid,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Radio,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  createStyles,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchShapes } from "../../services/shape";
import { isArrayAndHasContent } from "../../utils/utils";
import {
  fetchCategoriesList,
  fetchCategoriesPageless,
} from "../../services/categories";
import { fetchSubCategoriesPageless } from "../../services/subcategories";
import {
  IconArrowRight,
  IconFile,
  IconPlus,
  IconRefresh,
  IconTrashFilled,
  IconX,
} from "@tabler/icons-react";
import AssignColor from "./AssignColor";
import { NotificationUtil } from "../../utils/notifications";
import AssignPower from "./AssignPower";
import { fetchColors } from "../../services/color";
import { fetchBrands } from "../../services/brand";

const useStyles = createStyles(() => ({
  sectionBox: {
    border: "1px solid white",
    minHeight: "30vh",
    padding: "1em",
    borderRadius: "8px",
  },

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

const ProductVariants = ({ productDetails, handleEditSubmit, nextStep }) => {
  console.log(productDetails);
  const { classes } = useStyles();

  const [isActive, setIsActive] = useState(true);
  const [isFeaturd, setIsFeatured] = useState(false);
  const [shape, setShape] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [singleColor, setSingleColor] = useState(null);
  const [powers, setPowers] = useState([]);
  const [singlePower, setSinglePower] = useState(null);

  const [colorAddModal, setColorAddModal] = useState(false);
  const [powerAddModal, setPowerAddModal] = useState(false);

  const [brand, setBrand] = useState(null);

  console.log(isFeaturd);

  const saveData = () => {
    const obj = {
      status: isActive ? "active" : "deactive",
      isFeatured: isFeaturd ? true : false,
      categories,
      subCategories,
      colors,
      supportedPowers: powers,
      shape,
      brand,
    };

    handleEditSubmit(obj);
  };

  const saveColor = (values) => {
    const checkColor = colors.filter((c) => c.color == values?.color);

    if (isArrayAndHasContent(checkColor)) {
      NotificationUtil({
        success: false,
        title: "Color name already exists",
        message: "Color name already exists",
      });
    } else {
      let updatedValue = {
        ...values,
        add_amount: values.add_amount ? parseInt(values.add_amount) : 0,
        color_quantity: values.color_quantity
          ? parseInt(values.color_quantity)
          : 0,
      };
      colors.push(updatedValue);
    }
  };

  const savePower = (values) => {
    const checkPower = powers.filter((p) => p.power_name == values?.power_name);

    if (isArrayAndHasContent(checkPower)) {
      NotificationUtil({
        success: false,
        title: "Power already exists",
        message: "Power name already exists",
      });
    } else {
      let updatedValue = {
        ...values,
        add_amount: values.add_amount ? parseInt(values.add_amount) : 0,
      };
      powers.push(updatedValue);
    }
  };

  //fetching shapes
  const { data: shapeData, isLoading: shapeDataLoading } = useQuery({
    queryKey: ["fetch-shapes"],
    queryFn: fetchShapes,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  //fetching colors
  const { data: colorData, isLoading: colorDataLoading } = useQuery({
    queryKey: ["fetch-colors"],
    queryFn: fetchColors,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  console.log(colorData);

  //fetching brands
  const { data: brandData, isLoading: brandDataLoading } = useQuery({
    queryKey: ["fetch-brands"],
    queryFn: fetchBrands,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  console.log(brandData);

  const { data: categoryData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["fetch-categories-pageless"],
    queryFn: fetchCategoriesPageless,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  const { data: subCategoryData, isLoading: subCategoriesLoading } = useQuery({
    queryKey: ["fetch-sub-categories"],
    queryFn: fetchSubCategoriesPageless,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  console.log(colors);

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay
        visible={shapeDataLoading || categoriesLoading || subCategoriesLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      {/* color modal */}
      <Modal
        opened={colorAddModal && singleColor}
        closeOnClickOutside={false}
        onClose={() => {
          setColorAddModal(false);
          setSingleColor(null);
        }}
        title={<Text fw="600">Assign Color</Text>}
        centered
        styles={() => ({
          title: {
            fontSize: "21px",
            fontWeight: "bold",
          },
        })}
        size="md"
      >
        <AssignColor
          onClose={() => {
            setColorAddModal(false);
          }}
          colorDetails={singleColor}
          saveColor={saveColor}
          productDetails={productDetails}
        />
      </Modal>

      {/* power modal */}
      <Modal
        opened={powerAddModal && singlePower}
        closeOnClickOutside={false}
        onClose={() => setPowerAddModal(false)}
        title={<Text fw="600">Assign Power</Text>}
        centered
        styles={() => ({
          title: {
            fontSize: "21px",
            fontWeight: "bold",
          },
        })}
        size="md"
      >
        <AssignPower
          onClose={() => {
            setPowerAddModal(false);
            setSinglePower(null);
          }}
          powerValue={singlePower}
          savePower={savePower}
        />
      </Modal>

      <Flex direction="column" gap={20}>
        <Flex justify="space-between" align="center">
          <Text fw={600} fz="md">
            {productDetails?.name || "N/A"}
          </Text>
          <Flex gap={10} py="md">
            <Switch
              checked={isActive}
              onChange={(event) => setIsActive(event.currentTarget.checked)}
              label="Active"
            />
            <Switch
              checked={isFeaturd}
              onChange={(event) => setIsFeatured(event.currentTarget.checked)}
              label="Featured"
            />
          </Flex>
        </Flex>

        <Grid gap={10}>
          <Grid.Col lg={6} md={6} sm={12} xs={12}>
            <Box className={classes.sectionBox}>
              <Flex direction="column" gap={10}>
                <Radio.Group
                  name="favoriteFramework"
                  label="Select your frame shape"
                  description="you must select specific shape for glasses"
                  value={shape}
                  onChange={setShape}
                >
                  {isArrayAndHasContent(shapeData?.data?.data) ? (
                    <Flex direction="column" gap={10}>
                      <Group mt="xs">
                        {shapeData?.data?.data?.map((shape, index) => {
                          return (
                            <Radio
                              value={shape?._id}
                              label={shape?.name}
                              key={index}
                            />
                          );
                        })}
                      </Group>

                      <Flex justify="space-around" gap={10} py="sm">
                        {shapeData?.data?.data?.map((s, index) => {
                          return (
                            <div
                              style={{
                                backgroundColor:
                                  shape == s?._id ? "gold" : "white",
                                padding: "0.5em",
                                borderRadius: "8px",
                              }}
                            >
                              <Image
                                key={index}
                                src={s?.featureImage}
                                alt={s?.featureImage}
                                caption={s?.name}
                                height={25}
                                width={"auto"}
                              />
                            </div>
                          );
                        })}
                      </Flex>
                    </Flex>
                  ) : (
                    <>No Shapes Found</>
                  )}
                </Radio.Group>
              </Flex>
            </Box>
          </Grid.Col>
          <Grid.Col lg={6} md={6} sm={12} xs={12}>
            <Box className={classes.sectionBox}>
              <Flex direction="column" gap={20}>
                <Select
                  value={brand}
                  onChange={setBrand}
                  data={
                    brandData?.data?.data?.map((b) => {
                      return { label: b?.name, value: b?._id };
                    }) || []
                  }
                  label="Select Brand"
                  placeholder="Pick your brand"
                  searchable
                  nothingFound="Nothing found"
                />
                <MultiSelect
                  value={categories}
                  onChange={setCategories}
                  data={
                    categoryData?.data?.data?.map((cat) => {
                      return { label: cat?.name, value: cat?._id };
                    }) || []
                  }
                  label="Select Categories"
                  placeholder="Pick all that you like"
                  searchable
                  nothingFound="Nothing found"
                />

                <MultiSelect
                  value={subCategories}
                  onChange={setSubCategories}
                  data={
                    subCategoryData?.data?.data?.map((cat) => {
                      return { label: cat?.name, value: cat?._id };
                    }) || []
                  }
                  label="Select Sub-Categories"
                  placeholder="Pick all that you like"
                  searchable
                  nothingFound="Nothing found"
                />
              </Flex>
            </Box>
          </Grid.Col>
        </Grid>

        <Grid gap={10}>
          <Grid.Col lg={6} md={6} sm={12} xs={12}>
            <Box className={classes.sectionBox}>
              <Flex justify="space-between" align="center">
                <Text fw={600}>Colors Section</Text>
                <Flex gap={5}>
                  <Button
                    size="xs"
                    disabled={!singleColor}
                    leftIcon={<IconPlus />}
                    onClick={() => setColorAddModal(true)}
                  >
                    Add
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => setSingleColor(null)}
                    leftIcon={<IconX />}
                    color="orange"
                    disabled={!singleColor}
                  >
                    Deselect
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => setColors([])}
                    leftIcon={<IconRefresh />}
                    color="orange"
                  >
                    Reset
                  </Button>
                </Flex>
              </Flex>

              <Stack align="center" py="md">
                <Flex gap={20}>
                  {colorDataLoading ? (
                    <Loader />
                  ) : (
                    <>
                      {isArrayAndHasContent(colorData?.data?.data) ? (
                        <SimpleGrid
                          cols={3}
                          spacing="lg"
                          breakpoints={[
                            { maxWidth: "lg", cols: 6, spacing: "lg" },
                            { maxWidth: "md", cols: 4, spacing: "sm" },
                            { maxWidth: "sm", cols: 2, spacing: "sm" },
                            { maxWidth: "xs", cols: 1, spacing: "sm" },
                          ]}
                        >
                          <Flex gap={10}>
                            {colorData?.data?.data?.map((color, index) => {
                              return (
                                <Flex
                                  key={index}
                                  style={{
                                    border:
                                      singleColor?.value == color?.value
                                        ? "1px solid yellow"
                                        : "1px solid white",
                                    cursor: "pointer",
                                  }}
                                  p="xs"
                                  gap={10}
                                  align="center"
                                  onClick={() => setSingleColor(color)}
                                >
                                  <div
                                    style={{
                                      backgroundColor: color?.value,
                                      height: "15px",
                                      width: "15px",
                                      //borderRadius: "50%",
                                    }}
                                  ></div>
                                  <Text> {color?.name}</Text>
                                </Flex>
                              );
                            })}
                          </Flex>
                        </SimpleGrid>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </Flex>
                <Text>{singleColor?.name}</Text>
              </Stack>

              {isArrayAndHasContent(colors) ? (
                <Flex direction="column" gap={20} align="flex-start">
                  <Text fw={600}>Selected Colors</Text>
                  <SimpleGrid
                    cols={3}
                    spacing="lg"
                    breakpoints={[
                      { maxWidth: "lg", cols: 4, spacing: "md" },
                      { maxWidth: "md", cols: 4, spacing: "sm" },
                      { maxWidth: "sm", cols: 2, spacing: "sm" },
                      { maxWidth: "xs", cols: 1, spacing: "sm" },
                    ]}
                  >
                    <Flex gap={10}>
                      {colors?.map((color, index) => {
                        return (
                          <Flex
                            key={index}
                            style={{
                              border: "1px solid white",
                              cursor: "pointer",
                            }}
                            p="xs"
                            gap={10}
                            align="center"
                          >
                            <IconTrashFilled
                              size="1em"
                              onClick={() => {
                                let updatedColors = colors.filter(
                                  (c) => c.color !== color.color
                                );
                                setColors(updatedColors);
                              }}
                            />

                            <Text fw={600}>A: +{color?.add_amount}</Text>
                            <Text fw={600}>Q: +{color?.add_amount}</Text>
                          </Flex>
                        );
                      })}
                    </Flex>
                  </SimpleGrid>
                </Flex>
              ) : null}
            </Box>
          </Grid.Col>

          <Grid.Col lg={6} md={6} sm={12} xs={12}>
            <Box className={classes.sectionBox}>
              <Flex justify="space-between" align="center">
                <Text fw={600}>Power Section</Text>
                <Flex gap={5}>
                  <Button
                    size="xs"
                    onClick={() => setPowers([])}
                    leftIcon={<IconRefresh />}
                    color="orange"
                  >
                    Reset
                  </Button>
                </Flex>
              </Flex>

              <MultiSelect
                value={powers}
                onChange={setPowers}
                data={[
                  "Upto Regular Power",
                  "Support High Power",
                  "Support Very High Power",
                  "Support All Powers",
                ]}
                label="Select Power"
                searchable
                nothingFound="Nothing found"
              />
            </Box>
          </Grid.Col>
        </Grid>
        <div style={{ position: "absolute", bottom: "0", right: "0" }}>
          <Flex justify="flex-end" align="center">
            <Flex gap={5}>
              <Button
                size="md"
                leftIcon={<IconFile />}
                onClick={() => saveData()}
              >
                Save
              </Button>

              <Button
                size="md"
                onClick={() => {}}
                leftIcon={<IconRefresh />}
                color="red"
              >
                Reset All
              </Button>

              <Button
                color="green"
                size="md"
                leftIcon={<IconArrowRight />}
                onClick={() => {}}
              >
                Skip
              </Button>
            </Flex>
          </Flex>
        </div>
      </Flex>
    </div>
  );
};

export default ProductVariants;
