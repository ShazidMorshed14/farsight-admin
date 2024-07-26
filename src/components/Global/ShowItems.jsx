import { Flex, Select, Text } from "@mantine/core";
import React from "react";
import COLORS from "../../constants/colors";

const ShowItems = ({ pageSize, handlePageSize }) => {
  return (
    <Flex gap={20} align="center">
      <Text fz="lg" color={COLORS.fontSecondary}>
        Items
      </Text>
      <Select
        value={pageSize}
        onChange={(value) => handlePageSize(value)}
        placeholder="Total Item"
        size="sm"
        width={10}
        data={[
          { label: 10, value: 10 },
          { label: 20, value: 20 },
          { label: 30, value: 30 },
          { label: 40, value: 40 },
        ]}
      />
    </Flex>
  );
};

export default ShowItems;
