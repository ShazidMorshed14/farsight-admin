import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

const AssignPower = ({ onClose, powerValue, savePower }) => {
  const form = useForm({
    initialValues: {
      add_amount: 0,
      power_name: powerValue ? powerValue : "",
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
    savePower(values);
    onClose();
  };

  return (
    <div>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Flex direction="column" justify="space-between" gap={10}>
          <div>
            <TextInput
              placeholder="Ex. Red "
              label="Power Name"
              size="xs"
              withAsterisk
              {...form.getInputProps("power_name")}
            />
          </div>

          <div>
            <TextInput
              placeholder="Ex. 10 "
              label="Enter Added Amount"
              size="xs"
              withAsterisk
              {...form.getInputProps("add_amount")}
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

export default AssignPower;
