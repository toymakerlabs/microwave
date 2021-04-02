import Main from "./Main";
import React from "react";
import ReactDOM from "react-dom";
import { TimerProvider } from "components/TimerProvider";

ReactDOM.render(
  <TimerProvider>
    <Main />
  </TimerProvider>,
  document.getElementById("root")
);
