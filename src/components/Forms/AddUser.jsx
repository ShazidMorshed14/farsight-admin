import {
  Button,
  Flex,
  LoadingOverlay,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { NotificationUtil } from "../../utils/notifications";
import { addNewUser } from "../../services/users";

const AddUser = ({ onUpdate }) => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
      designation: "",
    },

    validate: {
      name: (value) => (value.length < 1 ? "Name must be given" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) => (value.length < 1 ? "Phone must be given" : null),
      password: (value) => (value.length < 1 ? "Password must be given" : null),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
      role: (value) => (value.length < 1 ? "Role must be given" : null),
    },
  });

  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: async (values) => await addNewUser(values),
    onSuccess: (data) => {
      NotificationUtil({
        success: true,
        title: "Success",
        message: data?.data?.message,
      });
      form.reset();
      onUpdate();
    },
    onError: (error) => {
      NotificationUtil({
        success: false,
        title: "Error",
        message: error.response.data.message,
      });
    },
  });

  const ConfirmModal = (values) => {
    openConfirmModal({
      title: "Confirm",
      styles: () => ({
        title: {
          fontSize: "22px",
          fontWeight: "bold",
        },
      }),
      children: <Text size="sm">Are you sure you want to add this user?</Text>,
      confirmProps: { color: "blue" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        createMutate(values);
      },
    });
  };

  const handleSubmit = (values) => {
    ConfirmModal(values);
  };

  return (
    <div>
      <LoadingOverlay
        visible={isCreating}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Flex direction="column" justify="space-between" gap={10}>
          <div>
            <TextInput
              placeholder="Ex. John Wick "
              label="Full Name"
              size="xs"
              withAsterisk
              {...form.getInputProps("name")}
            />
          </div>

          <div>
            <TextInput
              placeholder="Ex. test@gmail.com "
              label="Email"
              size="xs"
              withAsterisk
              {...form.getInputProps("email")}
            />
          </div>

          <div>
            <TextInput
              label="Phone"
              size="xs"
              withAsterisk
              placeholder="+880123456789"
              {...form.getInputProps("phone")}
            />
          </div>

          <div>
            <PasswordInput
              placeholder="Enter Password "
              label="Password"
              size="xs"
              withAsterisk
              {...form.getInputProps("password")}
            />
          </div>

          <div>
            <PasswordInput
              placeholder="Confirm Password "
              label="Confirm Password"
              size="xs"
              withAsterisk
              {...form.getInputProps("confirmPassword")}
            />
          </div>

          <div>
            <Select
              size="xs"
              label="Role"
              placeholder="Select Role"
              dropdownPosition="bottom"
              withinPortal
              withAsterisk
              data={[
                { label: "Admin", value: "admin" },
                { label: "Vendor", value: "vendor" },
                { label: "User", value: "user" },
              ]}
              {...form.getInputProps("role")}
            />

            <div>
              <TextInput
                placeholder="Designation"
                label="Designation"
                size="xs"
                {...form.getInputProps("designation")}
              />
            </div>
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

export default AddUser;
