import { Button, Flex, Loader, Modal, Stack, Text } from "@mantine/core";
import { IconDatabaseExport, IconPlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import CommonHeader from "../../components/Global/CommonHeader";
import { fetchProducts } from "../../services/products";
import ServerErrorBox from "../../components/Global/ServerErrorBox";
import { useQuery } from "@tanstack/react-query";
import ProductTable from "../../components/Tables/ProductTable";
import AddProduct from "../../components/Forms/AddProduct";

const ProductManagement = () => {
  useEffect(() => {
    document.title = "Products | Farsight";
  }, []);

  const [selectedItem, setSelectedItem] = useState(null);

  //common states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //modals states
  const [itemAddModal, setItemAddModal] = useState(false);
  const [itemEditModal, setItemEditModal] = useState(false);

  const handleItemEdit = (item) => {
    setSelectedItem(item);
    setItemEditModal(true);
  };

  const handleItemDelete = (item) => {
    // ConfirmDeleteModal(item?._id);
  };

  //fetching products
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["fetch-products", page, pageSize],
    queryFn: fetchProducts,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: false,
  });

  if (isLoading)
    return (
      <div className="card">
        <div className="card-body">
          <Flex w="100%" justify="space-between" align="center" my="sm">
            <CommonHeader title="Product Management" />
            <Flex gap={10}>
              <Button className="primary_btn" leftIcon={<IconPlus />} size="xs">
                Add Product
              </Button>
            </Flex>
          </Flex>
          <Stack
            sx={{
              minHeight: "80vh",
            }}
            justify="center"
            align="center"
          >
            <Loader size="md" variant="oval" color="white" />
          </Stack>
        </div>
      </div>
    );

  if (error)
    return (
      <div>
        <ServerErrorBox apiError={true} />
      </div>
    );

  const { products, total } = data?.data?.data;

  return (
    <div>
      {/* MODALS */}

      <Modal
        opened={itemAddModal}
        closeOnClickOutside={false}
        onClose={() => setItemAddModal(false)}
        title={<Text fw="600">Add Product</Text>}
        centered
        fullScreen
        styles={() => ({
          title: {
            fontSize: "24px",
            fontWeight: "bold",
          },
        })}
        size="auto"
      >
        <AddProduct
          onUpdate={() => {
            refetch();
            setItemAddModal(false);
          }}
          onClose={() => {
            setItemAddModal(false);
          }}
        />
      </Modal>

      {/* MODALS ENDS*/}

      <Flex w="100%" justify="space-between" align="center" my="sm">
        <CommonHeader title="Product Management" />
        <Flex gap={10}>
          <Button
            onClick={() => setItemAddModal(true)}
            className="primary_btn"
            leftIcon={<IconPlus />}
            size="xs"
          >
            Add Product
          </Button>
          <Button
            onClick={() => {}}
            className="primary_btn"
            leftIcon={<IconDatabaseExport />}
            size="xs"
            color="orange"
          >
            Export Product
          </Button>
        </Flex>
      </Flex>

      <>
        {isFetching ? (
          <>
            <Stack
              sx={{
                minHeight: "75vh",
              }}
              justify="center"
              align="center"
            >
              <Loader size="md" variant="oval" />
            </Stack>
          </>
        ) : (
          <>
            <ProductTable
              data={products}
              handleItemEdit={handleItemEdit}
              handleItemDelete={handleItemDelete}
            />
          </>
        )}
      </>
    </div>
  );
};

export default ProductManagement;
