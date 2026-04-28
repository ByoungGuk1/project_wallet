import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import MainContainer from "../pages/main/MainContainer";
import AccountContainer from "../pages/account/AccountContainer";
import TransactionContainer from "../pages/transaction/TransactionContainer";
import StatisticsContainer from "../pages/statistics/StatisticsContainer";
import NotFound from "../pages/notfound/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <MainContainer /> },
      { path: "accounts", element: <AccountContainer /> },
      { path: "transactions", element: <TransactionContainer /> },
      { path: "statistics", element: <StatisticsContainer /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
