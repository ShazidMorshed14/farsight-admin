import { createStyles, rem } from "@mantine/core";
//import COLORS from '../constants/colors';

const useStyles = createStyles((theme) => ({
  appShell: {
    backgroundColor: "white !important",
  },

  navTitle: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md, // Because the AppShell has a base padding
    marginRight: -theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.gray[3]}`,
  },

  navTitleLink: {
    display: "flex",

    h1: {
      fontSize: "16px",
    },
  },

  header: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 80px",
  },

  mainBody: {
    paddingTop: theme.spacing.lg,
    paddingLeft: theme.spacing.lg * 2,
    paddingRight: theme.spacing.lg * 2,
  },

  // links: {
  //   marginLeft: -theme.spacing.md,
  //   marginRight: -theme.spacing.md,
  // },
  //some comment
  link: {
    width: rem(180),
    height: rem(50),
    borderRadius: "0.5rem !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: theme.white,
    opacity: 0.85,
    padding: "0em 1em",

    "&:hover": {
      opacity: 1,
      color: "#ffffff",
      backgroundColor: "#696cff !important",
      borderColor: "#696cff !important",
      boxShadow: "0 0.125rem 0.25rem 0 rgba(105, 108, 255, 0.4)",
      border: "1px solid transparent",
      borderRadius: " 0.375rem",
    },
  },
  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  navFooter: {
    padding: theme.spacing.md,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  active: {
    opacity: 1,
    color: "#fff",
    backgroundColor: "#696cff !important",
    // borderColor: "#696cff !important",
    // boxShadow: "0 0.125rem 0.25rem 0 rgba(105, 108, 255, 0.4)",
    // border: "1px solid transparent",
    borderRadius: " 0.375rem",
    fontWeight: "bold",
  },
}));

export default useStyles;
