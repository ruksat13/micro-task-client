import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ErrorPage from "../pages/ErrorPage";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

import WorkerHome from "../dashboard/Worker/WorkerHome";
import TaskList from "../dashboard/Worker/TaskList";
import TaskDetails from "../dashboard/Worker/TaskDetails";
import MySubmissions from "../dashboard/Worker/MySubmissions";
import Withdrawals from "../dashboard/Worker/Withdrawals";

import BuyerHome from "../dashboard/Buyer/BuyerHome";
import AddTask from "../dashboard/Buyer/AddTask";
import MyTasks from "../dashboard/Buyer/MyTasks";
import TaskToReview from "../dashboard/Buyer/TaskToReview";
import PurchaseCoin from "../dashboard/Buyer/PurchaseCoin";
import PaymentHistory from "../dashboard/Buyer/PaymentHistory";

import AdminHome from "../dashboard/Admin/AdminHome";
import ManageUsers from "../dashboard/Admin/ManageUsers";
import ManageTasks from "../dashboard/Admin/ManageTasks";
import WithdrawRequests from "../dashboard/Admin/WithdrawRequests";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [
            { path: "worker-home", element: <WorkerHome /> },
            { path: "task-list", element: <TaskList /> },
            { path: "task-details/:id", element: <TaskDetails /> },
            { path: "my-submissions", element: <MySubmissions /> },
            { path: "withdrawals", element: <Withdrawals /> },

            { path: "buyer-home", element: <BuyerHome /> },
            { path: "add-task", element: <AddTask /> },
            { path: "my-tasks", element: <MyTasks /> },
            { path: "task-to-review", element: <TaskToReview /> },
            { path: "purchase-coin", element: <PurchaseCoin /> },
            { path: "payment-history", element: <PaymentHistory /> },

            { path: "admin-home", element: <AdminHome /> },
            { path: "manage-users", element: <ManageUsers /> },
            { path: "manage-tasks", element: <ManageTasks /> },
            { path: "withdraw-requests", element: <WithdrawRequests /> },
        ],
    },
]);

export default router;