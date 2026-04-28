import { EmptyMessage, TransactionListWrapper } from "./style";

function TransactionList() {
  return (
    <TransactionListWrapper>
      <EmptyMessage>등록된 거래 내역이 없습니다.</EmptyMessage>
    </TransactionListWrapper>
  );
}

export default TransactionList;
