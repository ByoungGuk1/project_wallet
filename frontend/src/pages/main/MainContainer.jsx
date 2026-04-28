import MonthlyChart from "../../components/chart/MonthlyChart";
import Card from "../../components/common/Card";
import {
  Page,
  SummaryGrid,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
} from "./style";

function MainContainer() {
  return (
    <Page>
      <Card title="전체 요약">
        <SummaryGrid>
          <SummaryItem>
            <SummaryLabel>전체 잔액</SummaryLabel>
            <SummaryValue>0원</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>이번 달 수입</SummaryLabel>
            <SummaryValue>0원</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>이번 달 지출</SummaryLabel>
            <SummaryValue>0원</SummaryValue>
          </SummaryItem>
        </SummaryGrid>
      </Card>

      <Card title="월별 소비 흐름">
        <MonthlyChart />
      </Card>
    </Page>
  );
}

export default MainContainer;
