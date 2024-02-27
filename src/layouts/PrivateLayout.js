import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  AppShell,
  Avatar,
  Button,
  Flex,
  Navbar,
  ScrollArea,
  Space,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import NavBarItem from "../components/NavbarItem";
import navItems from "../constants/nav-items";
import useStyles from "../styles/nav-styles";
import { useDispatch, useSelector } from "react-redux";
import { appEnv } from "../apps/App";
import { IconLogout } from "@tabler/icons-react";
import { closeAllModals, openConfirmModal } from "@mantine/modals";
import { authActions } from "../store/reducers/authReducer";
import { useQueryClient } from "@tanstack/react-query";

const PrivateLayout = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const openLogoutConfirmModal = () => {
    openConfirmModal({
      title: "Are you sure?",
      children: <Text size="sm">Are you sure you want to logout?</Text>,
      labels: {
        confirm: "Confirm",
        cancel: "Cancel",
      },
      onCancel: () => {
        closeAllModals();
      },
      onConfirm: () => {
        dispatch(authActions.signout());
        queryClient.invalidateQueries();
        closeAllModals();
      },
    });
  };
  return (
    <AppShell
      className={classes.appShell}
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          width={{
            base: 200,
          }}
          height="100vh"
          p="md"
        >
          <Navbar.Section className={classes.navTitle}>
            <Text className={classes.navTitleLink}>
              <UnstyledButton
                component="a"
                href={user?.profileUrl}
                target="_blank"
              >
                <Flex position="apart" w="100%" align="center">
                  <Avatar bg="#161616" color="#fff" src={user?.avatar} />
                  <Space w="sm" />
                  <Text size="sm" weight="bold">
                    {user?.name} <br />
                    <span style={{ fontWeight: 300, fontSize: 12 }}>
                      {user?.handle}
                    </span>
                  </Text>
                </Flex>
              </UnstyledButton>
            </Text>
          </Navbar.Section>
          <Navbar.Section grow component={ScrollArea} className={classes.links}>
            <Space h={15} />
            <div className={classes.linksInner}>
              {navItems.map((item, index) => (
                <NavBarItem key={index} {...item} />
              ))}
            </div>
            <Space h={15} />
          </Navbar.Section>
          <Navbar.Section className={classes.navFooter}>
            <Text align="center" fz="xs" c="dimmed">
              Developed by Shazid Morshed
            </Text>
            <Space h="xs" />
            <Text align="center" fz="xs" c="dimmed">
              Version: {appEnv.appName} - {appEnv.version}
            </Text>
            <Space h="sm" />
            <Button
              className="btn-danger"
              onClick={() => openLogoutConfirmModal()}
              radius="xs"
              leftIcon={<IconLogout size={14} />}
              sx={{
                width: "100%",
              }}
              color="red"
            >
              Logout
            </Button>
          </Navbar.Section>
        </Navbar>
      }
    >
      <Outlet />
    </AppShell>
  );
};

export default PrivateLayout;
