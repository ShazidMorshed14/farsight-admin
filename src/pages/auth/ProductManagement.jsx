import { Button, Flex } from "@mantine/core";
import { IconDatabaseExport, IconPlus } from "@tabler/icons-react";
import React from "react";
import CommonHeader from "../../components/Global/CommonHeader";

const ProductManagement = () => {
  return (
    <div>
      <Flex w="100%" justify="space-between" align="center" my="sm">
        <CommonHeader title="Product Management" />
        <Flex gap={10}>
          <Button
            onClick={() => {}}
            className="primary_btn"
            leftIcon={<IconPlus />}
            size="xs"
          >
            Add Product
          </Button>
          <Button
            onClick={() => {}}
            className="primary_btn"
            leftIcon={<IconDatabaseExport />}
            size="xs"
            color="orange"
          >
            Export Product
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default ProductManagement;
