import { Loader, Stack } from "@mantine/core";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
const PublicLayout = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);

  useEffect(() => {
    if (isAuth) {
      window.location.href = "/dashboard";
    }
  }, []);

  if (isAuth) {
    return (
      <Stack
        sx={{
          width: "100%",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </Stack>
    );
  }

  return <Outlet />;
};

export default PublicLayout;
