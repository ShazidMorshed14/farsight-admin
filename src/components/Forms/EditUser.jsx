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
import React from "react";
import { openConfirmModal } from "@mantine/modals";
import { useMutation } from "@tanstack/react-query";
import { NotificationUtil } from "../../utils/notifications";
import { editUser } from "../../services/users";

const EditUser = ({ data, onUpdate }) => {
  const form = useForm({
    initialValues: {
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      role: data?.role || "",
      designation: data?.designation || "",
      status: data?.status || "inactive",
    },

    validate: {
      name: (value) => (value.length < 1 ? "Name must be given" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) => (value.length < 1 ? "Phone must be given" : null),
      role: (value) => (value.length < 1 ? "Role must be given" : null),
    },
  });

  const { mutate: editMutate, isLoading: isEditing } = useMutation({
    mutationFn: async (values) => await editUser(values, data?._id),
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
      children: <Text size="sm">Are you sure you want to edit this user?</Text>,
      confirmProps: { color: "blue" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        editMutate(values);
      },
    });
  };

  const handleSubmit = (values) => {
    ConfirmModal(values);
  };

  return (
    <div>
      <LoadingOverlay
        visible={isEditing}
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
          </div>

          <div>
            <TextInput
              placeholder="Designation"
              label="Designation"
              size="xs"
              {...form.getInputProps("designation")}
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

export default EditUser;
