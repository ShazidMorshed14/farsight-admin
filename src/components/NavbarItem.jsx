import { Fragment, useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  Space,
} from "@mantine/core";

import { Link, useLocation } from "react-router-dom";

import { isArrayAndHasContent } from "../utils/utils";

import useStyles from "../styles/nav-styles";
import { IconChevronRight } from "@tabler/icons-react";

const NavBarItem = (props) => {
  const location = useLocation();

  const { icon: Icon, label, links, link } = props;

  const { classes } = useStyles();

  const [opened, setOpened] = useState(false);

  let items = [];
  let hasLinks = false;

  if (isArrayAndHasContent(links)) {
    hasLinks = true;

    items = links.map((link) => (
      <Text
        component={Link}
        className={classes.link}
        to={link.link}
        key={link.label}
      >
        {link.label}
      </Text>
    ));
  }

  return (
    <Fragment>
      <Space h={10} />
      <UnstyledButton
        {...(link && { component: Link, to: link })}
        onClick={() => setOpened(!opened)}
        className={classes.control}
        sx={{
          backgroundColor: location.pathname.includes(link)
            ? "#D3D3D3"
            : "transparent",
        }}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30} color="violet">
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">
              <Text size={14} weight={700}>
                {label}
              </Text>
            </Box>
          </Box>

          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              size={14}
              stroke={1.5}
              style={{
                transform: opened ? "rotate(90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>

      <Collapse in={opened}>{items}</Collapse>
    </Fragment>
  );
};

export default NavBarItem;
