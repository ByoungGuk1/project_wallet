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
      { path: "events/:eventId", element: <NotFound /> },
      { path: "notifications/:notificationId", element: <NotFound /> },
      { path: "informations/:informationId", element: <NotFound /> },
      { path: "faq", element: <NotFound /> },
      { path: "support", element: <NotFound /> },
      { path: "ars", element: <NotFound /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
