import React from "react";
import { render } from "react-dom";
import { Router } from "@reach/router";
import App from "./components/App/App";
import Advanced from "./components/Advanced/Advanced";
import "./index.scss";

render(
  <Router>
    <App path="/" />
    <Advanced path="advanced" />
  </Router>,
  document.getElementById("root")
);
