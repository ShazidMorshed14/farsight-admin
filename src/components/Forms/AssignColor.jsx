import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

const AssignColor = ({ colorValue, productDetails, saveColor, onClose }) => {
  const form = useForm({
    initialValues: {
      add_amount: 0,
      color_name: "",
      color_quantity: 0,
      color_value: colorValue ? colorValue : "",
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
              placeholder="Ex. Red "
              label="Color Name"
              size="xs"
              withAsterisk
              {...form.getInputProps("color_name")}
            />
          </div>

          <div>
            <TextInput
              placeholder="Ex. #FFFFFF "
              label="Color Value"
              size="xs"
              withAsterisk
              {...form.getInputProps("color_value")}
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
