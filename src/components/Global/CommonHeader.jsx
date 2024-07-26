import { Text } from "@mantine/core";
import React from "react";
import COLORS from "../../constants/colors";

const CommonHeader = ({ title }) => {
  return (
    <Text weight="bold" color={COLORS.fontPrimary} py="sm">
      {title}
    </Text>
  );
};

export default CommonHeader;
