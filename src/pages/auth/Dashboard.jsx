import { Flex } from "@mantine/core";
import React, { useEffect } from "react";
import CommonHeader from "../../components/Global/CommonHeader";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | Farsight";
  }, []);
  return (
    <div>
      <Flex w="100%" justify="space-between" align="center" my="sm">
        <CommonHeader title="Dashboard" />
        <Flex gap={10}>date picker</Flex>
      </Flex>
    </div>
  );
};

export default Dashboard;
