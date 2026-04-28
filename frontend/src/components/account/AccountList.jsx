import { AccountListWrapper, EmptyMessage } from "./style";

function AccountList() {
  return (
    <AccountListWrapper>
      <EmptyMessage>등록된 계좌가 없습니다.</EmptyMessage>
    </AccountListWrapper>
  );
}

export default AccountList;
