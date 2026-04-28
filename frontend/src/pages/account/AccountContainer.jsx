import AccountList from "../../components/account/AccountList";
import Card from "../../components/common/Card";
import { Page } from "./style";

function AccountContainer() {
  return (
    <Page>
      <Card title="계좌 관리">
        <AccountList />
      </Card>
    </Page>
  );
}

export default AccountContainer;
