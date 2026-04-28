import { Outlet } from "react-router-dom";

import Header from "./header/Header";
import Footer from "./footer/Footer";
import { S } from "./style";

function MainLayout() {
  return (
    <S.LayoutWrapper>
      <Header />
      <S.Main>
        <Outlet />
      </S.Main>
      <Footer />
    </S.LayoutWrapper>
  );
}

export default MainLayout;
