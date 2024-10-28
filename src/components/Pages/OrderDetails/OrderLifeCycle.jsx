import { Card, Stack, Stepper, Text } from "@mantine/core";
import React from "react";
import COLORS from "../../../constants/colors";
import { isArrayAndHasContent } from "../../../utils/utils";

const OrderLifeCycle = ({ orderDetails }) => {
  return (
    <Card shadow="sm" padding="lg" mt="sm" withBorder>
      <Text weight="bold" fz="lg" color={COLORS.fontPrimary}>
        Order History
      </Text>

      {isArrayAndHasContent(orderDetails?.order_life_history) ? (
        <Stepper orientation="vertical" my="lg" color="orange">
          {orderDetails.order_life_history.map((history, index) => (
            <Stepper.Step
              key={index}
              label={history.label ?? "N/A"}
              description={history.description ?? "N/A"}
              sx={{
                color: "orange",
              }}
            />
          ))}
        </Stepper>
      ) : (
        <Stack sx={{ minHeight: "20vh" }} justify="center" align="center">
          <Text>No History Found</Text>
        </Stack>
      )}
    </Card>
  );
};

export default OrderLifeCycle;
