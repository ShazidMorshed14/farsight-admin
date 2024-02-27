import { Badge, Flex, Grid, Text } from "@mantine/core";
import React from "react";
import PictureSlider from "../Global/PictureSlider";

const ProductDetails = ({ product }) => {
  console.log(product);
  return (
    <div>
      <Grid gap>
        <Grid.Col
          xl={6}
          lg={6}
          md={12}
          sm={12}
          xs={12}
          p="md"
          orderMd={2}
          orderSm={2}
          orderXs={2}
          orderXl={1}
          orderLg={1}
        >
          <Text size="sm" py="sm" fw={600}>
            Name: {product?.name}
          </Text>
          <Flex gap={10} direction="column">
            <Text color="orange" fw={600} fz="xs">
              SKU: {product?.sku}
            </Text>
            <Text color="yellow" fw={600} fz="xs">
              Slug: {product?.slug}
            </Text>
            <div>
              <Text fw={600} py="xs">
                Product Description:
              </Text>
              <div
                style={{ maxWidth: "100%" }}
                dangerouslySetInnerHTML={{
                  __html: product?.description,
                }}
              />
            </div>

            <Flex gap={20} py="xs">
              <Badge size="xl" color="yellow">
                Price: {product?.price || 0} BDT
              </Badge>
              <Badge size="xl" color="yellow">
                Quantity: {product?.quantity || 0}
              </Badge>
            </Flex>
          </Flex>
        </Grid.Col>
        <Grid.Col
          xl={6}
          lg={6}
          md={12}
          sm={12}
          xs={12}
          p="md"
          orderMd={1}
          orderSm={1}
          orderXs={1}
          orderXl={2}
          orderLg={2}
        >
          <PictureSlider images={product?.productPictures} />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default ProductDetails;
