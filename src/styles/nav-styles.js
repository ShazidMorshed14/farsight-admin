import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  appShell: {
    backgroundColor: theme.colors.gray[0],
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

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
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
}));

export default useStyles;
