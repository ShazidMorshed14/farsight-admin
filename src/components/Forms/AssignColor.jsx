import { Button, Flex, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

const AssignColor = ({ colorDetails, productDetails, saveColor, onClose }) => {
  console.log("colorDetails", colorDetails);
  const form = useForm({
    initialValues: {
      add_amount: 0,
      color_quantity: 1,
      color: colorDetails?._id ? colorDetails._id : "",
    },

    validate: {
      //   name: (value) => (value.length < 1 ? "Name must be given" : null),
      //   email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      //   phone: (value) => (value.length < 1 ? "Phone must be given" : null),
      //   password: (value) => (value.length < 1 ? "Password must be given" : null),
      //   confirmPassword: (value, values) =>
      //     value !== values.password ? "Passwords did not match" : null,
      //   role: (value) => (value.length < 1 ? "Role must be given" : null),
    },
  });

  const handleSubmit = (values) => {
    saveColor(values);
    onClose();
  };

  return (
    <div>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Flex direction="column" justify="space-between" gap={10}>
          <Flex align="center" gap={10}>
            <Text>Add color variant of : {colorDetails?.name} </Text>
          </Flex>
          <div>
            <TextInput
              placeholder="Ex. 10 "
              label="Enter Added Amount"
              size="xs"
              withAsterisk
              {...form.getInputProps("add_amount")}
            />
          </div>

          <div>
            <TextInput
              disabled={true}
              placeholder="Ex. Color Id Here"
              label="Color Value"
              size="xs"
              withAsterisk
              {...form.getInputProps("color")}
            />
          </div>

          <div>
            <TextInput
              placeholder="Ex. 10 "
              label="Enter Variant Quantity"
              size="xs"
              withAsterisk
              {...form.getInputProps("color_quantity")}
            />
          </div>

          <Flex my="sm" justify="flex-end" gap={10}>
            <Button size="xs" color="red">
              Cancel
            </Button>
            <Button size="xs" className="primary_btn" type="submit">
              Save
            </Button>
          </Flex>
        </Flex>
      </form>
    </div>
  );
};

export default AssignColor;
