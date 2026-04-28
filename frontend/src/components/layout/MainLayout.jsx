import { Outlet } from "react-router-dom";

import Header from "./header/Header";
import Footer from "./footer/Footer";
import { Main, LayoutWrapper } from "./style";

function MainLayout() {
  return (
    <LayoutWrapper>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </LayoutWrapper>
  );
}

export default MainLayout;
