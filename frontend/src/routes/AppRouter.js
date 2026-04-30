import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import MainContainer from "../pages/main/MainContainer";
import StatisticsContainer from "../pages/statistics/StatisticsContainer";
import NotFound from "../pages/notfound/NotFound";
import MyWalletContainer from "../pages/mywallet/MyWalletContainer";
import GroupWalletContainer from "../pages/groupwallet/GroupWalletContainer";
import CommunityContainer from "../pages/community/CommunityContainer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <MainContainer /> },
      { path: "my-wallet", element: <MyWalletContainer /> },
      { path: "group-wallet", element: <GroupWalletContainer /> },
      { path: "community", element: <CommunityContainer /> },
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
