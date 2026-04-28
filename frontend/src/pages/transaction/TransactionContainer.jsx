import Card from "../../components/common/Card";
import TransactionList from "../../components/transaction/TransactionList";
import { Page } from "./style";

function TransactionContainer() {
  return (
    <Page>
      <Card title="거래 내역 관리">
        <TransactionList />
      </Card>
    </Page>
  );
}

export default TransactionContainer;
