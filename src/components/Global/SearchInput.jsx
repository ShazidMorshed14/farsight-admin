import { ActionIcon, Input, Stack } from "@mantine/core";
import { IconRefresh, IconSearch } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

const SearchInput = ({
  handleSearch,
  handleRefresh,
  placeholder,
  invokeRefresh,
  refreshBtn = true,
  liveSearch = false,
  disable,
}) => {
  const [searchKey, setSearchKey] = useState("");

  const handleInput = (e) => {
    if (e.key === "Enter") {
      handleSearch(e.target.value);
    }
  };

  const handleRefreshbtn = () => {
    setSearchKey("");
    handleRefresh();
  };

  useEffect(() => {
    if (invokeRefresh) {
      handleRefreshbtn();
    }
  }, [invokeRefresh]);

  return (
    <Stack>
      <Input
        value={searchKey}
        //size="xs"
        icon={<IconSearch />}
        placeholder={placeholder}
        mr={20}
        radius={5}
        onChange={(e) => {
          if (liveSearch) {
            handleSearch(e.target.value);
          }
          setSearchKey(e.target.value);
        }}
        onKeyDown={handleInput}
        rightSection={
          refreshBtn && (
            <ActionIcon onClick={handleRefreshbtn} variant="transparent">
              <IconRefresh />
            </ActionIcon>
          )
        }
        wrapperProps={{ style: { marginRight: 0 } }}
        disabled={disable}
      />
    </Stack>
  );
};

export default SearchInput;
