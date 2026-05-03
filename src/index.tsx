import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ReactGA from "react-ga4";
import { BrowserRouter } from "react-router-dom";
import mixpanel from "mixpanel-browser";

ReactGA.initialize("G-MXD39PF2N0");
ReactGA.initialize([
  {
    trackingId: "G-MXD39PF2N0",
    gaOptions: {
      userId: window.location.pathname,
    },
  },
]);

mixpanel.init("cf0335878fc64cac5f65d24c75bc2c10", {
  persistence: "localStorage",
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
