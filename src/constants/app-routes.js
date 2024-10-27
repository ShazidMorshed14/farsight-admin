import CategoryManagement from "../pages/CategoryManagement";
import Dashboard from "../pages/Dashboard";
import OptionManagement from "../pages/OptionManagement";
import OrderDetails from "../pages/OrderDetails";
import OrderManagement from "../pages/OrderManagement";
import ProductManagement from "../pages/ProductManagement";
import SignIn from "../pages/Signin";
import SubCategoryManagement from "../pages/SubCategoryManagement";
import UserManagement from "../pages/UserManagement";
import * as urls from "./app-urls";

const routes = [
  {
    path: urls.SIGNIN,
    Element: SignIn,
    isIndexUrl: false,
    isProtected: false,
  },
  {
    path: urls.DASHBOARD,
    Element: Dashboard,
    isIndexUrl: true,
    isProtected: true,
  },
  {
    path: urls.CATEGORIES,
    Element: CategoryManagement,
    isIndexUrl: false,
    isProtected: true,
  },
  {
    path: urls.SUBCATEGORIES,
    Element: SubCategoryManagement,
    isIndexUrl: false,
    isProtected: true,
  },
  {
    path: urls.PRODUCTS,
    Element: ProductManagement,
    isIndexUrl: false,
    isProtected: true,
  },
  {
    path: urls.ORDERS,
    Element: OrderManagement,
    isIndexUrl: false,
    isProtected: true,
  },
  {
    path: urls.USERS,
    Element: UserManagement,
    isIndexUrl: false,
    isProtected: true,
  },
  {
    path: urls.OPTIONS,
    Element: OptionManagement,
    isIndexUrl: false,
    isProtected: true,
  },
  {
    path: urls.ORDER_DETAILS,
    Element: OrderDetails,
    isIndexUrl: false,
    isProtected: true,
  },
];

export default routes;
