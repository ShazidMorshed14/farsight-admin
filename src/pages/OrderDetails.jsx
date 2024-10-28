import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOrderDetails } from "../services/order";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Stepper,
  Modal,
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
  IconUserCheck,
  IconMailOpened,
  IconCircleCheck,
  IconLoader,
  IconHourglass,
  IconBox,
  IconTruckDelivery,
  IconCheckbox,
  IconExchange,
  IconExchangeOff,
  IconEyeCancel,
  IconX,
  IconTruckLoading,
} from "@tabler/icons-react";
import { IconShieldCheck } from "@tabler/icons-react";
import ChangeOrderStatus from "../components/Forms/ChangeOrderStatusModal";
import OrderLifeCycle from "../components/Pages/OrderDetails/OrderLifeCycle";

const OrderDetails = () => {
  const queryClient = useQueryClient();
  const { orderNo } = useParams();

  // Stepper state
  const [active, setActive] = useState(7);

  //modals states
  const [statusChangeModal, setStatusChangeModal] = useState(false);

  // Fetching data with useQuery
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["order-details", orderNo],
    queryFn: fetchOrderDetails,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  // Get order details only if data is available
  const orderDetails = data?.data?.data;

  useEffect(() => {
    if (orderDetails) {
      // Set the active step in the Stepper based on order status
      switch (orderDetails.order_status) {
        case "PENDING":
          setActive(1);
          break;
        case "CONFIRMED":
          setActive(2);
          break;
        case "PACKED":
          setActive(3);
          break;
        case "SHIPPED":
          setActive(4);
          break;
        case "DELIVERED":
          setActive(5);
          break;
        case "RETURNED":
          setActive(6);
          break;
        case "CANCELLED":
          setActive(7);
          break;
        default:
          setActive(0);
      }
    }
  }, [orderDetails]);

  // Conditional rendering for loader, error, or order details
  if (isLoading) {
    return <LoaderContent />;
  }

  if (error) {
    return <ServerErrorBox apiError={true} />;
  }

  if (!orderDetails) {
    return <NoOrderContent />;
  }

  return (
    <div>
      <Modal
        opened={statusChangeModal}
        onClose={() => setStatusChangeModal(false)}
        title={<Text fw="600">Change Status</Text>}
        centered
        styles={() => ({
          title: {
            fontSize: "24px",
            fontWeight: "bold",
          },
        })}
        size="lg"
      >
        <ChangeOrderStatus
          orderId={orderDetails._id}
          currentStatus={orderDetails.order_status ?? "PENDING"}
          onUpdate={() => {
            setStatusChangeModal(false);
            refetch();
            queryClient.invalidateQueries(["orders"]);
          }}
          onClose={() => {
            setStatusChangeModal(false);
          }}
          orderDetails={orderDetails}
        />
      </Modal>

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
            onClick={() => setStatusChangeModal(true)}
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

      <Stepper
        my="lg"
        active={active}
        completedIcon={active < 6 ? <IconCircleCheck /> : <IconX />}
        color={active < 6 ? "green" : "transparent"}
      >
        <Stepper.Step
          icon={<IconHourglass size="1.1rem" />}
          description="Pending"
        />
        <Stepper.Step
          icon={<IconUserCheck size="1.1rem" />}
          description="Confirmed"
        />
        <Stepper.Step icon={<IconBox size="1.1rem" />} description="Packed" />
        <Stepper.Step
          icon={<IconTruckDelivery size="1.1rem" />}
          description="Shipped"
        />
        <Stepper.Step
          icon={<IconCheckbox size="1.1rem" />}
          description="Delivered"
        />
        <Stepper.Step
          icon={<IconExchangeOff size="1.1rem" />}
          description="Returned"
        />
        <Stepper.Step
          icon={<IconX size="1.1rem" />}
          description="Cancelled"
          color="red"
        />
      </Stepper>

      {/* Order Information Section */}
      <OrderInfoSection orderDetails={orderDetails} />

      <Grid columns={24} gutter="md">
        <Grid.Col span={12}>
          <ShippingInfoSection orderDetails={orderDetails} />
        </Grid.Col>
        <Grid.Col span={12}>
          <DeliveryInfoSection orderDetails={orderDetails} />
        </Grid.Col>
      </Grid>

      <Grid columns={24} gutter="md">
        <Grid.Col span={12}>
          {/* Ordered Products Section */}
          <Stack spacing="lg" mt="xl">
            <Text weight="bold" fz="lg" color={COLORS.fontPrimary}>
              Ordered Products
            </Text>
            {orderDetails.ordered_products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </Stack>
        </Grid.Col>

        <Grid.Col span={12}>
          <Stack spacing="lg" mt="xl">
            <div>
              <OrderLifeCycle orderDetails={orderDetails} />
            </div>
          </Stack>
        </Grid.Col>
      </Grid>
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
          label="Vendor"
          value={`${orderDetails.user_id.name} (${orderDetails.user_id.phone})`}
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

const ShippingInfoSection = ({ orderDetails }) => (
  <Card shadow="sm" padding="lg" mt="sm" withBorder>
    <Text weight="bold" fz="lg" mb="xs" color={COLORS.fontPrimary}>
      Shipping Information
    </Text>
    <Divider my="sm" />

    <Grid columns={24} gutter="md">
      <Grid.Col span={24}>
        <OrderInfoRow
          icon={<IconTruckLoading />}
          label="Shipping Medium"
          value={orderDetails.shipping_medium ?? "N/A"}
        />
        <OrderInfoRow
          icon={<IconDatabase />}
          label="Shipping Info"
          value={orderDetails.shipping_info ?? "N/A"}
        />
      </Grid.Col>
    </Grid>
  </Card>
);

const DeliveryInfoSection = ({ orderDetails }) => (
  <Card shadow="sm" padding="lg" mt="sm" withBorder>
    <Text weight="bold" fz="lg" mb="xs" color={COLORS.fontPrimary}>
      Delivery Information
    </Text>
    <Divider my="sm" />

    <Grid columns={24} gutter="md">
      <Grid.Col span={24}>
        <OrderInfoRow
          icon={<IconTruckLoading />}
          label="Apx. Delivery Date"
          value={orderDetails.apx_delivery_date ?? "N/A"}
        />
        <OrderInfoRow
          icon={<IconTruckLoading />}
          label="Delivery Date"
          value={orderDetails.delivery_date ?? "N/A"}
        />
        <OrderInfoRow
          icon={<IconTruckLoading />}
          label="Delivery Info"
          value={orderDetails.delivery_info ?? "N/A"}
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
            width: "5vw",
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
