import {
  Box,
  Button,
  ColorPicker,
  Flex,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  MultiSelect,
  Radio,
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
import { IconPlus, IconRefresh } from "@tabler/icons-react";

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

const ProductVariants = ({ productDetails, handleEditSubmit }) => {
  const { classes } = useStyles();

  const [isActive, setIsActive] = useState(false);
  const [isFeaturd, setIsFeatured] = useState(false);
  const [shape, setShape] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [singleColor, setSingleColor] = useState(null);

  //fetching patient only
  const { data: shapeData, isLoading: shapeDataLoading } = useQuery({
    queryKey: ["fetch-shapes"],
    queryFn: fetchShapes,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

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

  return (
    <div>
      <LoadingOverlay
        visible={shapeDataLoading || categoriesLoading || subCategoriesLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

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
                  >
                    Add
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => setSingleColor(null)}
                    leftIcon={<IconRefresh />}
                    color="orange"
                  >
                    Reset
                  </Button>
                </Flex>
              </Flex>

              <Stack align="center">
                <Flex gap={20}>
                  <Flex direction="column">
                    <div>color</div>
                  </Flex>
                  <ColorPicker
                    format="rgba"
                    value={singleColor}
                    onChange={setSingleColor}
                  />
                </Flex>
                <Text>{singleColor}</Text>
              </Stack>
            </Box>
          </Grid.Col>

          <Grid.Col lg={6} md={6} sm={12} xs={12}>
            <Box className={classes.sectionBox}></Box>
          </Grid.Col>
        </Grid>
      </Flex>
    </div>
  );
};

export default ProductVariants;
