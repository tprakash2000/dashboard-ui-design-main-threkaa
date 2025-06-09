import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "./dashboard";
import OrderList from "./order/list";
import CreateOrder from "./order/create";
import LoginPage from "./login";
import { RequireAuth } from "../contexts/AuthContext";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: (
            <RequireAuth>
                <Layout />
            </RequireAuth>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "order/list",
                element: <OrderList />,
            },
            {
                path: "order/create",
                element: <CreateOrder />,
            },
        ],
    },
]); 