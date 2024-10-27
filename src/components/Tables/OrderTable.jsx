import {
  ActionIcon,
  Badge,
  Flex,
  HoverCard,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconEye, IconUserCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
import React from "react";

import TableComponent from "../Global/TableComponent";

//  "PENDING",
//         "CONFIRMED",
//         "PACKED",
//         "SHIPPED",
//         "DELIVERED",
//         "RETURNED",
//         "CANCELLED",

const getBadgeByStatus = (status) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge color="orange" variant="filled" radius="xs">
          Pending
        </Badge>
      );

    case "CONFIRMED":
      return (
        <Badge color="skyblue" variant="filled" radius="xs">
          Confirmed
        </Badge>
      );

    case "PACKED":
      return (
        <Badge color="purple" variant="filled" radius="xs">
          Packed
        </Badge>
      );

    case "SHIPPED":
      return (
        <Badge color="violet" variant="filled" radius="xs">
          Shipped
        </Badge>
      );
    case "DELIVERED":
      return (
        <Badge color="green" variant="filled" radius="xs">
          Delivered
        </Badge>
      );
    case "RETURNED":
      return (
        <Badge color="orange" variant="filled" radius="xs">
          Returned
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge color="red" variant="filled" radius="xs">
          Cancelled
        </Badge>
      );

    default:
      return <Badge> {status}</Badge>;
  }
};

const OrderTable = ({ data, handleItemDetails, handleItemEdit }) => {
  const ths = (
    <tr>
      <th>Order No</th>
      <th>Receipt No</th>
      <th>Total</th>
      <th>Discount</th>
      <th>Bill</th>
      <th>Delivery</th>
      <th>Status</th>
      <th>Order Date</th>
      <th>Delivery Date</th>
      <th>Action</th>
    </tr>
  );

  const rows = data.map((product, index) => (
    <tr key={index}>
      <td>{product?.order_no}</td>

      <td>{product?.receipt_no}</td>

      <td>{product?.total_bill ?? 0}</td>
      <td>
        {(product?.total_bill ?? 0) - (product?.total_discounted_bill ?? 0)}
      </td>
      <td>{product?.total_discounted_bill ?? 0}</td>
      <td>{product?.delivery_address ?? "N/A"}</td>
      <td>
        <Flex justify="center" align="center">
          {getBadgeByStatus(product?.order_status ?? "N/A")}
        </Flex>
      </td>

      <td>{dayjs(product?.createdAt).format("MMM DD, YYYY")}</td>
      <td>N/A</td>

      <td>
        <Flex gap={20} align="center">
          <Tooltip label={"Edit"}>
            <ActionIcon
              variant="light"
              color="teal"
              onClick={() => handleItemEdit(product)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={"Details"}>
            <ActionIcon
              variant="light"
              color="teal"
              onClick={() => handleItemDetails(product)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </td>
    </tr>
  ));
  return (
    <>
      <TableComponent ths={ths} rows={rows} data={data} />
    </>
  );
};

export default OrderTable;
