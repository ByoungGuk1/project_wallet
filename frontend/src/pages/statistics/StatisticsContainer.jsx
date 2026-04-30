import MonthlyChart from "../../components/chart/MonthlyChart";
import Card from "../../components/common/Card";
import { EmptyMessage, Page } from "./style";

const StatisticsContainer = () => {
  return (
    <Page>
      <Card title="통계">
        <EmptyMessage>
          거래 내역이 등록되면 월별 통계를 확인할 수 있습니다.
        </EmptyMessage>
        <MonthlyChart />
      </Card>
    </Page>
  );
};

export default StatisticsContainer;
