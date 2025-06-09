import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider, RequireAuth } from "@/contexts/auth-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import OrderList from "@/routes/order/list";
import CreateOrder from "@/routes/order/create";
import ViewOrder from "@/routes/order/view";
import SettingPage from "@/routes/settings/settingPage";
import LoginPage from "@/routes/login";

function App() {
    const router = createBrowserRouter([
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
                    element: <DashboardPage />,
                },
                {
                    path: "order/list",
                    element: <OrderList />,
                },
                {
                    path: "order/create",
                    element: <CreateOrder />,
                },
                {
                    path: "order/view/:id",
                    element: <ViewOrder />,
                },
                {
                    path: "settings",
                    element: <SettingPage />,
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;

