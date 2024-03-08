import { Flex, Tooltip, UnstyledButton } from "@mantine/core";
import React from "react";
import useStyles from "../styles/nav-styles";

const NavbarLink = ({ icon: Icon, label, active, onClick }) => {
  const { classes, cx } = useStyles();

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Flex justify="flex-start" align="center" gap={8}>
          <Icon size="1.2rem" stroke={1.5} />
          {label}
        </Flex>
      </UnstyledButton>
    </Tooltip>
  );
};

export default NavbarLink;
