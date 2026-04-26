import { MantineProvider } from "@mantine/core";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { theme } from "./styles/themes/MantineTheme.js";

createRoot(document.getElementById("root")).render(
  <MantineProvider theme={theme} defaultColorScheme="light">
    <App />
  </MantineProvider>,
);
