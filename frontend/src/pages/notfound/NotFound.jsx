import { HomeLink, NotFoundWrapper } from "./style";

function NotFound() {
  return (
    <NotFoundWrapper>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <HomeLink to="/">홈으로 이동</HomeLink>
    </NotFoundWrapper>
  );
}

export default NotFound;
