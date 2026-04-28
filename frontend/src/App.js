import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import router from "./routes/AppRouter";
import GlobalStyle from "./styles/global";
import theme from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ThemeProvider>
  );
}

export default App;
