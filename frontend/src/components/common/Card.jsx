import { CardBody, CardTitle, CardWrapper } from "./style";

function Card({ title, children }) {
  return (
    <CardWrapper>
      {title && <CardTitle>{title}</CardTitle>}
      <CardBody>{children}</CardBody>
    </CardWrapper>
  );
}

export default Card;
