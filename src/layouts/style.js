import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  appShell: {
    backgroundColor: "#222 !important",
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
  control: {
    fontWeight: 500,
    display: "flex",
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    justifyContent: "center",
    alignItems: "center",
    color: theme.black,
    fontSize: theme.fontSizes.sm,
    marginTop: 15,
    "&:hover": {
      backgroundColor: "transparent",
      color: theme.black,
      transform: "scale(1.1)",
    },
  },

  link: {
    width: "50px",
    height: "50px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.white,
    opacity: 0.85,

    "&:hover": {
      opacity: 1,
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background,
        0.1
      ),
    },
  },

  linksInner: {
    // paddingTop: theme.spacing.xl,
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
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background,
        0.15
      ),
    },
  },
}));

export default useStyles;
