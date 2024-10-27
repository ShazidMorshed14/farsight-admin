import React from "react";
import { useParams } from "react-router-dom";
import { fetchOrderDetails } from "../services/order";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Flex,
  Loader,
  Stack,
  Text,
  Card,
  Divider,
  Box,
  Grid,
  Group,
} from "@mantine/core";
import ServerErrorBox from "../components/Global/ServerErrorBox";
import COLORS from "../constants/colors";
import {
  IconDatabase,
  IconReceipt2,
  IconStatusChange,
  IconAddressBook,
  IconUser,
  IconShoppingCart,
  IconTag,
  IconCreditCard,
} from "@tabler/icons-react";

const OrderDetails = () => {
  const { orderNo } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order-details", orderNo],
    queryFn: fetchOrderDetails,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  if (isLoading) return <LoaderContent />;

  if (error) return <ServerErrorBox apiError={true} />;

  const { data: orderDetails } = data.data;

  if (!orderDetails) return <NoOrderContent />;

  return (
    <div>
      {/* Header Section */}
      <Flex w="100%" justify="space-between" align="center" my="sm">
        <Text weight="bold" fz="lg" color={COLORS.fontPrimary}>
          Order Details - {orderNo}
        </Text>
        <Flex gap={10}>
          <Button
            className="primary_btn"
            leftIcon={<IconStatusChange />}
            size="xs"
          >
            Change Status
          </Button>
          <Button
            className="primary_btn"
            leftIcon={<IconReceipt2 />}
            size="xs"
            color="orange"
          >
            Receipt
          </Button>
        </Flex>
      </Flex>

      {/* Order Information Section */}
      <OrderInfoSection orderDetails={orderDetails} />

      {/* Ordered Products Section */}
      <Stack spacing="lg" mt="xl">
        <Text weight="bold" fz="lg" color={COLORS.fontPrimary}>
          Ordered Products
        </Text>
        {orderDetails.ordered_products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </Stack>
    </div>
  );
};

const LoaderContent = () => (
  <div>
    <Flex w="100%" justify="space-between" align="center" my="sm">
      <Text weight="bold" fz="md" color={COLORS.fontPrimary}>
        Order Details
      </Text>
    </Flex>
    <Stack sx={{ minHeight: "80vh" }} justify="center" align="center">
      <Loader size="md" variant="oval" />
    </Stack>
  </div>
);

const NoOrderContent = () => (
  <Stack sx={{ minHeight: "80vh" }} justify="center" align="center">
    <Text>No Order Found</Text>
  </Stack>
);

const OrderInfoSection = ({ orderDetails }) => (
  <Card shadow="sm" padding="lg" mt="sm" withBorder>
    <Text weight="bold" fz="lg" mb="xs" color={COLORS.fontPrimary}>
      Order Information
    </Text>
    <Divider my="sm" />

    <Grid columns={24} gutter="md">
      <Grid.Col span={12}>
        <OrderInfoRow
          icon={<IconDatabase />}
          label="Order No"
          value={orderDetails.order_no}
        />
        <OrderInfoRow
          icon={<IconReceipt2 />}
          label="Receipt No"
          value={orderDetails.receipt_no}
        />
        <OrderInfoRow
          icon={<IconUser />}
          label="Customer"
          value={`${orderDetails.user_id.name} (${orderDetails.user_id.email})`}
        />
        <OrderInfoRow
          icon={<IconShoppingCart />}
          label="Total Bill"
          value={`$${orderDetails.total_bill}`}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <OrderInfoRow
          icon={<IconTag />}
          label="Discounted Bill"
          value={`$${orderDetails.total_discounted_bill}`}
        />
        <OrderInfoRow
          icon={<IconAddressBook />}
          label="Delivery Address"
          value={orderDetails.delivery_address}
        />
        <OrderInfoRow
          icon={<IconCreditCard />}
          label="Payment Method"
          value={orderDetails.payment_method}
        />
        <OrderInfoRow
          icon={<IconStatusChange />}
          label="Status"
          value={orderDetails.order_status}
        />
      </Grid.Col>
    </Grid>
  </Card>
);

const OrderInfoRow = ({ icon, label, value }) => (
  <Flex align="center" gap="xs" mb="xs">
    {React.cloneElement(icon, { size: 20, color: COLORS.primary })}
    <Text>
      <strong>{label}:</strong> {value}
    </Text>
  </Flex>
);

const ProductCard = ({ product }) => (
  <Card
    shadow="sm"
    padding="lg"
    radius="md"
    style={{ border: `1px solid ${COLORS.borderGray}`, position: "relative" }}
  >
    <Flex align="center" justify="space-between">
      <Box>
        <Text weight="bold" fz="md" color={COLORS.fontPrimary} mb="xs">
          {product.productId.name}
        </Text>
        <Text fz="sm" color={COLORS.fontSecondary}>
          <strong>Variant:</strong> {product.variant.name}
        </Text>
        <Text fz="sm" color={COLORS.fontSecondary}>
          <strong>Quantity:</strong> {product.quantity}
        </Text>
        <Text fz="sm" color={COLORS.fontSecondary}>
          <strong>Unit Price:</strong> ${product.product_unit_price}
        </Text>
        <Text fz="sm" color={COLORS.fontSecondary}>
          <strong>Discount:</strong> ${product.product_discount}
        </Text>
        <Text fz="sm" color={COLORS.fontPrimary} mt="xs">
          <strong>Total Price:</strong> ${product.product_total_price}
        </Text>
        <Text fz="sm" color={COLORS.fontPrimary}>
          <strong>Discounted Price:</strong> ${product.product_discounted_price}
        </Text>
      </Box>
      <Group
        align="center"
        style={{
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src={product.productId.productPictures.find((p) => p.default)?.img}
          alt={product.productId.name}
          style={{
            width: "15vw",
            height: "auto",
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </Group>
    </Flex>
  </Card>
);

export default OrderDetails;
