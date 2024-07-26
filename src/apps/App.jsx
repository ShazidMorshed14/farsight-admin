import React from "react";
import env from "../constants/env";
import RouteWrapper from "./RouteWrapper";
import ThemeWrapper from "./ThemeWrapper";
import QueryWrapper from "./QueryWrapper";
import ReduxWrapper from "./ReduxWrapper";

const App = () => {
  return (
    <ReduxWrapper>
      <QueryWrapper>
        <ThemeWrapper>
          <RouteWrapper />
        </ThemeWrapper>
      </QueryWrapper>
    </ReduxWrapper>
  );
};

export default App;

export const appEnv = env();
