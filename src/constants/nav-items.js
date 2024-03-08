import {
  IconCategory,
  IconLayoutDashboard,
  IconMoneybag,
  IconPackages,
  IconSubtask,
  IconUsers,
} from "@tabler/icons-react";
import * as urls from "./app-urls";

const navBarList = [
  {
    label: "Dashboard",
    icon: IconLayoutDashboard,
    link: urls.DASHBOARD,
  },
  {
    label: "Categories",
    icon: IconCategory,
    link: urls.CATEGORIES,
  },
  {
    label: "Sub-Categories",
    icon: IconSubtask,
    link: urls.SUBCATEGORIES,
  },
  {
    label: "Products",
    icon: IconPackages,
    link: urls.PRODUCTS,
  },
  {
    label: "Orders",
    icon: IconMoneybag,
    link: urls.ORDERS,
  },
  {
    label: "Users",
    icon: IconUsers,
    link: urls.USERS,
  },
];

export default navBarList;
