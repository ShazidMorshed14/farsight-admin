import { Card, Flex, Text } from "@mantine/core";
import React from "react";
import COLORS from "../../constants/colors";

const NoFileSelectedBox = ({ caption }) => {
  return (
    <Card
      style={{
        backgroundColor: "transparent",
        border: "1px solid white",
        borderStyle: "dotted",
        minHeight: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      m="md"
    >
      <Flex direction="column" gap="md" justify="center" align="center">
        <div className="small_gif_image">
          <img
            src="https://ict-ingenieros.es/wp-content/uploads/2019/05/cloud-1.gif"
            alt="no-file-gif"
          />
        </div>
        <Text fz="xs" fw={600} color={COLORS.fontPrimary}>
          {caption || "No File Selected yet"}
        </Text>
      </Flex>
    </Card>
  );
};

export default NoFileSelectedBox;
