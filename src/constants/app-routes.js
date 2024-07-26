import CategoryManagement from "../pages/auth/CategoryManagement";
import Dashboard from "../pages/auth/Dashboard";
import OptionManagement from "../pages/auth/OptionManagement";
import OrderManagement from "../pages/auth/OrderManagement";
import ProductManagement from "../pages/auth/ProductManagement";
import SignIn from "../pages/auth/Signin";
import SubCategoryManagement from "../pages/auth/SubCategoryManagement";
import UserManagement from "../pages/auth/UserManagement";
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
];

export default routes;
