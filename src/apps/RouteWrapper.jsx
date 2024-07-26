import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedPage from "../components/ProtectedPage";
import appRoutes from "../constants/app-routes";
import PrivateLayout from "../layouts/PrivateLayout";
import PublicLayout from "../layouts/PublicLayout";
import NoPageFound from "../pages/global/NoPageFound";

const RouteWrapper = () => {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map((route) => {
          const { path, Element, isProtected, isIndexUrl } = route;
          if (isProtected) {
            return (
              <Route element={<PrivateLayout />} key={path}>
                <Route
                  index={isIndexUrl}
                  path={path}
                  element={
                    <ProtectedPage>
                      <Element />
                    </ProtectedPage>
                  }
                />
              </Route>
            );
          } else {
            return (
              <Route element={<PublicLayout />} key={path}>
                <Route index={isIndexUrl} path={path} element={<Element />} />
              </Route>
            );
          }
        })}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NoPageFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteWrapper;
