import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/mainLayout";
import Drafts from "./pages/Drafts";
import SendEmails from "./pages/SendEmails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/drafts",
        element: <Drafts />,
      },
      {
        path: "/send_mail",
        element: <SendEmails/>
      },
      {
      }
    ],
  },
]);
