import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import RootLayout from "../layout/RootLayout";
import Sign_In from "../pages/Sign_In";
import Sign_Up from "../pages/Sign_Up";
import Dashboard from "../pages/Dashboard";
import Schedule from "../pages/Schedule";
import Payroll from "../pages/Payroll";
import Employees from "../pages/Employees";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Sign_In />,
      },
      {
        path: "sign-up",
        element: <Sign_Up />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <RootLayout/>,
    children:[
         {
      index: true,
      element: <Dashboard />,
    },
    {
      path: "schedule",
      element: <Schedule />,
    },
    {
      path: "payroll",
      element: <Payroll />,
    },
    {
      path: "employees",
      element: <Employees />,
    },
    ]
  },
]);
