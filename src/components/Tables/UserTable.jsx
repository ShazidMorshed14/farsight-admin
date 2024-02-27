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

const getBadgeByRole = (role) => {
  switch (role) {
    case "super_admin":
      return (
        <Badge color="red" variant="filled" radius="xs">
          Super Admin
        </Badge>
      );

    case "admin":
      return (
        <Badge color="blue" variant="filled" radius="xs">
          Admin
        </Badge>
      );

    case "vendor":
      return (
        <Badge color="orange" variant="filled" radius="xs">
          Vendor
        </Badge>
      );

    case "user":
      return (
        <Badge color="yellow" variant="filled" radius="xs">
          User
        </Badge>
      );

    default:
      return <Badge> {role}</Badge>;
  }
};

const UserTable = ({ data, handleItemDetails, handleItemEdit }) => {
  const ths = (
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Role</th>
      <th>Designation</th>
      <th>Status</th>
      <th>Created At</th>
      <th>Action</th>
    </tr>
  );

  const rows = data.map((product, index) => (
    <tr key={index}>
      <td>
        <Text fw="600">{product?.name}</Text>
      </td>

      <td>{product?.email}</td>

      <td>{product?.phone}</td>

      <td>
        <Flex justify="center" align="center">
          {getBadgeByRole(product?.role)}
        </Flex>
      </td>

      <td>{product?.designation}</td>

      <td>
        <Flex justify="center" align="center">
          {product?.status === "active" ? (
            <Badge color="green" variant="filled">
              Active
            </Badge>
          ) : (
            <Badge color="red" variant="filled">
              Deactive
            </Badge>
          )}
        </Flex>
      </td>

      <td>{dayjs(product?.createdAt).format("MMM DD, YYYY")}</td>

      <td>
        <Flex gap={20} align="center">
          <Tooltip label={"Edit User"}>
            <ActionIcon
              variant="light"
              color="teal"
              onClick={() => handleItemEdit(product)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={"User Details"}>
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

export default UserTable;
