import {
  ActionIcon,
  Badge,
  Center,
  Flex,
  HoverCard,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconEdit,
  IconEye,
  IconTrash,
  IconTrashFilled,
  IconUserCircle,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import React from "react";

import TableComponent from "../Global/TableComponent";
import { isArrayAndHasContent } from "../../utils/utils";

const SubCategoryTable = ({
  data,
  handleItemEdit,
  handleItemDelete,
  handleCategoryRemove,
}) => {
  const ths = (
    <tr>
      <th>Name</th>
      <th>Slug</th>
      <th>Feature Img</th>
      <th>Feature Img(App)</th>
      <th>Categories</th>
      <th>Created By</th>
      <th>Created At</th>
      <th>Action</th>
    </tr>
  );

  const rows = data.map((product, index) => (
    <tr key={index}>
      <td>
        <Text fw="600">{product?.name}</Text>
      </td>

      <td>{product?.slug}</td>

      <td>
        <Center>
          {product?.subCategoryImage ? (
            <Image
              src={product?.subCategoryImage}
              alt={product?.subCategoryImage}
              height={50}
              width={50}
              key={index}
            />
          ) : (
            <>No Image</>
          )}
        </Center>
      </td>

      <td>
        <Center>
          {product?.subCategoryAppImage ? (
            <Image
              src={product?.subCategoryAppImage}
              alt={product?.subCategoryAppImage}
              height={50}
              width={50}
              key={index}
            />
          ) : (
            <>No Image</>
          )}
        </Center>
      </td>

      <td>
        <Stack
          sx={{
            maxWidth: "400px",
          }}
        >
          <Flex justify="flex-start" align="center" gap={10} wrap="wrap">
            {isArrayAndHasContent(product?.categories) &&
              product?.categories?.map((item, index) => {
                return (
                  <Badge key={index} size="lg">
                    <Flex align="center" gap={5}>
                      {item?.name}{" "}
                      <Tooltip label={"Remove"}>
                        <ActionIcon
                          // variant="filled"
                          color="white"
                          onClick={() =>
                            handleCategoryRemove(
                              product?._id,
                              item?._id,
                              product?.categories
                            )
                          }
                        >
                          <IconTrashFilled size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Flex>
                  </Badge>
                );
              })}
          </Flex>
        </Stack>
      </td>

      <td>
        <Stack
          sx={{
            maxWidth: "400px",
          }}
        >
          {product?.createdBy ? (
            <Flex gap={5} align="center" wrap="wrap">
              <HoverCard key={index} maxWidth={500} shadow="md">
                <HoverCard.Target>
                  <Flex align="center" justify="center" gap={10}>
                    <IconUserCircle />
                    <Text>{product?.createdBy?.name}</Text>
                  </Flex>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Flex gap={20} justify="center" align="center">
                    <Text size="sm" py="sm" fw={600}>
                      {product?.createdBy?.name}
                    </Text>
                    <Badge color="blue" variant="filled">
                      {product?.createdBy?.role}
                    </Badge>
                  </Flex>
                </HoverCard.Dropdown>
              </HoverCard>
            </Flex>
          ) : (
            <Text c="dimmed">N/A </Text>
          )}
        </Stack>
      </td>

      <td>{dayjs(product?.createdAt).format("MMM DD, YYYY")}</td>

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
          <Tooltip label={"Delete"}>
            <ActionIcon
              variant="light"
              color="teal"
              onClick={() => handleItemDelete(product)}
            >
              <IconTrash size={16} />
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

export default SubCategoryTable;
