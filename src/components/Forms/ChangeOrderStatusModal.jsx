import {
  Button,
  Flex,
  LoadingOverlay,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { orderStatusOptions } from "../../utils/dropdowns/order";
import { openConfirmModal } from "@mantine/modals";
import { NotificationUtil } from "../../utils/notifications";
import { editOrder } from "../../services/order";
import { useMutation } from "@tanstack/react-query";
import { DateInput } from "@mantine/dates";

const ChangeOrderStatus = ({
  orderId,
  currentStatus,
  onUpdate,
  onClose,
  orderDetails,
}) => {
  const [statusOptions, setStatusOptions] = useState(orderStatusOptions);

  useEffect(() => {
    // Find the index of the selected status
    const selectedIndex = orderStatusOptions.findIndex(
      (option) => option.value === orderDetails?.order_status
    );

    // Filter options up to and including the selected status
    let newFilteredOptions = orderStatusOptions.slice(selectedIndex);
    setStatusOptions(newFilteredOptions);
  }, [orderDetails]);

  const form = useForm({
    initialValues: {
      order_status: orderDetails.order_status ?? "PENDING",
      shipping_medium: orderDetails.shipping_medium ?? "",
      shipping_info: orderDetails.shipping_info ?? "",
      delivery_date: orderDetails.delivery_date ?? "",
      return_cause: orderDetails.return_cause ?? "",
    },

    validate: {
      order_status: (value) =>
        value.length < 1 ? "Status must be given" : null,
    },
  });

  const { mutate: editMutate, isLoading: isEditing } = useMutation({
    mutationFn: async (values) => await editOrder(values, orderId),
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
      children: (
        <Text size="sm">Are you sure you want to edit this order?</Text>
      ),
      confirmProps: { color: "green" },
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
            <Select
              size="xs"
              label="Status"
              placeholder="Select Status"
              dropdownPosition="bottom"
              withinPortal
              withAsterisk
              data={statusOptions}
              {...form.getInputProps("order_status")}
            />
          </div>

          {form.values.order_status === "SHIPPED" && (
            <>
              <div>
                <TextInput
                  placeholder="Ex. RedX "
                  label="Shipping Medium"
                  size="xs"
                  {...form.getInputProps("shipping_medium")}
                />
              </div>

              <div>
                <Textarea
                  placeholder="Ex. Shipping Related Data"
                  label="Shipping Info"
                  size="xs"
                  {...form.getInputProps("shipping_info")}
                />
              </div>
            </>
          )}

          {form.values.order_status === "DELIVERED" && (
            <>
              <div>
                <DateInput
                  label="Select Delivery Date"
                  size="xs"
                  {...form.getInputProps("delivery_date")}
                />
              </div>
            </>
          )}

          <Flex my="sm" justify="flex-end" gap={10}>
            <Button size="xs" color="red" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="xs"
              className="primary_btn"
              type="submit"
              loading={isEditing}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </form>
    </div>
  );
};

export default ChangeOrderStatus;
