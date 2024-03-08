import { Stack } from "@mantine/core";
import React from "react";
import useStyles from "../styles/nav-styles";
import NavbarLink from "./NavbarLink";
import navItems from "../constants/nav-items";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userRoles } from "../constants/const";

const NavbarLinks = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const appUser = useSelector((state) => state.auth.user);

  const hasAccess = (navItem) => {
    if (
      appUser.role === userRoles.ADMIN ||
      appUser.role === userRoles["SUPER ADMIN"]
    ) {
      if (navItem.adminsAccess) {
        if (navItem.onlySuperAdminAccess) {
          return appUser.role === userRoles["SUPER ADMIN"];
        }
        return true;
      } else {
        return false;
      }
    }
    return appUser?.userWeight >= navItem.accessWeight;
  };
  return (
    <Stack justify="center" align="center" spacing="lg">
      <div className={classes.linksInner}>
        {/* {navItems.map(
          (item, index) =>
            hasAccess(item) && (
              <div
                key={index}
                style={{
                  marginBottom: 15,
                }}>
                <NavbarLink
                  active={location.pathname
                    .split('/')
                    .includes(item.link?.split('/')[1])}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => navigate(item.link)}
                />
              </div>
            ),
        )} */}
        {navItems.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: 15,
            }}
          >
            <NavbarLink
              active={location.pathname
                .split("/")
                .includes(item.link?.split("/")[1])}
              icon={item.icon}
              label={item.label}
              onClick={() => navigate(item.link)}
            />
          </div>
        ))}
      </div>
    </Stack>
  );
};

export default NavbarLinks;
