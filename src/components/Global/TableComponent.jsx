import { Box, ScrollArea, Stack, Table } from "@mantine/core";
import React from "react";
import { isArrayAndHasContent } from "../../utils/utils";
import NoDataPlaceholder from "./NoDataPlaceholder";
import { IconPackageOff } from "@tabler/icons-react";

const TableComponent = ({ ths, rows, data, tableHeight }) => {
  return (
    <>
      {isArrayAndHasContent(data) ? (
        <ScrollArea h={tableHeight ? tableHeight : "73vh"}>
          <Table
            highlightOnHover
            verticalSpacing="md"
            stickyHeader
            withBorder
            withColumnBorders
          >
            <thead>{ths}</thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      ) : (
        <Stack mih="73vh" align="center" justify="center">
          <NoDataPlaceholder
            title="No Items found"
            subtext={" "}
            icon={<IconPackageOff size={70} color="#4562f7" />}
          />
        </Stack>
      )}
    </>
  );
};

export default TableComponent;
