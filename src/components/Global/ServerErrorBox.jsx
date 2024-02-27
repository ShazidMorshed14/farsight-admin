import { Stack, Text } from "@mantine/core";
import { IconMoodSadSquint } from "@tabler/icons-react";
import React from "react";
import COLORS from "../../constants/colors";

const ServerErrorBox = () => {
  return (
    <Stack w="100%" h={"90vh"} align="center" justify="center">
      <IconMoodSadSquint size={70} color={COLORS.error} />
      <Text size="xl" weight={700}>
        Something went wrong
      </Text>
      <Text size="sm" weight={300} color="dimmed">
        Please contact admin to see what is wrong or refresh after some time.
      </Text>
    </Stack>
  );
};

export default ServerErrorBox;
