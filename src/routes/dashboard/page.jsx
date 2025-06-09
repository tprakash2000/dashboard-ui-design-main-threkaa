import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getOrders } from "../../services/orderService";
import OrderAnalytics from "@/components/OrderAnalytics";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { overviewData, sampleOrders } from "@/constants";

import { Footer } from "@/layouts/footer";

import { ClipboardList, Clock, TruckIcon, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

const DashboardPage = () => {
    const { theme } = useTheme();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        shippedOrders: 0,
        cancelledOrders: 0,
        totalAmount: 0
    });

    // Calculate monthly overview data from orders
    const overviewData = useMemo(() => {
        const monthlyData = orders.reduce((acc, order) => {
            const month = new Date(order.transactionDate).toLocaleString('default', { month: 'short' });
            if (!acc[month]) {
                acc[month] = { name: month, total: 0 };
            }
            acc[month].total++;
            return acc;
        }, {});

        // Convert to array and sort by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map(month => ({
            name: month,
            total: monthlyData[month]?.total || 0
        }));
    }, [orders]);

    // Get recent orders sorted by transaction date
    const recentOrders = useMemo(() => {
        return [...orders]
            .sort((a, b) => {
                const dateA = new Date(a.transactionDate);
                const dateB = new Date(b.transactionDate);
                // Sort by date in descending order (most recent first)
                if (dateB - dateA !== 0) {
                    return dateB - dateA;
                    // return dateA - dateB;
                }
                // If dates are equal, sort by order number in descending order
                return b.orderNumber.localeCompare(a.orderNumber);
            })
            .slice(0, 5);
    }, [orders]);

    
    useEffect(() => {
        const loadOrders = () => {
            const orderData = getOrders();
            setOrders(orderData);

            // Calculate statistics
            const statistics = orderData.reduce((acc, order) => {
                // Count orders by status
                acc.totalOrders++;
                switch (order.status) {
                    case "Pending":
                        acc.pendingOrders++;
                        break;
                    case "Shipped":
                        acc.shippedOrders++;
                        break;
                    case "Cancelled":
                        acc.cancelledOrders++;
                        break;
                    default:
                        break;
                }

                // Calculate total amount from order lines
                const orderAmount = order.lines.reduce((sum, line) => sum + line.amount, 0);
                acc.totalAmount += orderAmount;

                return acc;
            }, {
                totalOrders: 0,
                pendingOrders: 0,
                shippedOrders: 0,
                cancelledOrders: 0,
                totalAmount: 0
            });

            setStats(statistics);
        };

        loadOrders();
    }, []);

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <ClipboardList size={26} />
                        </div>
                        <p className="card-title">Total Orders</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{stats.totalOrders}</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-green-500 px-2 py-1 font-medium text-green-500">
                            <TrendingUp size={18} />
                            15%
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-yellow-500/20 p-2 text-yellow-500 transition-colors dark:bg-yellow-600/20 dark:text-yellow-600">
                            <Clock size={26} />
                        </div>
                        <p className="card-title">Pending Approvals</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{stats.pendingOrders}</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-red-500 px-2 py-1 font-medium text-red-500">
                            <TrendingDown size={18} />
                            8%
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-green-500/20 p-2 text-green-500 transition-colors dark:bg-green-600/20 dark:text-green-600">
                            <TruckIcon size={26} />
                        </div>
                        <p className="card-title">Shipped This Week</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{stats.shippedOrders}</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-green-500 px-2 py-1 font-medium text-green-500">
                            <TrendingUp size={18} />
                            23%
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-red-500/20 p-2 text-red-500 transition-colors dark:bg-red-600/20 dark:text-red-600">
                            <AlertCircle size={26} />
                        </div>
                        <p className="card-title">Open Issues</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{stats.cancelledOrders}</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-red-500 px-2 py-1 font-medium text-red-500">
                            <TrendingDown size={18} />
                            15%
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header">
                        <p className="card-title">Orders Overview</p>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={overviewData}
                                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => `${value} orders`}
                                />
                                <XAxis
                                    dataKey="name"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <YAxis
                                    dataKey="total"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickFormatter={(value) => `${value}`}
                                    tickMargin={6}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="card col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title">Recent Orders</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0">
                        {recentOrders.map((order) => (
                            <div
                                key={order.orderNumber}
                                className="flex items-center justify-between gap-x-4 border-b border-slate-200 p-4 last:border-0 dark:border-slate-700"
                            >
                                <div className="flex items-center gap-x-4">
                                    <div className="flex flex-col gap-y-1">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                            Order #{order.orderNumber}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            {order.customer}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(order.transactionDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-slate-900 dark:text-slate-100">
                                        ${order.lines.reduce((sum, line) => sum + line.amount, 0).toFixed(2)}
                                    </p>
                                    <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                                        order.status === "Pending" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400" :
                                        order.status === "Approved" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" :
                                        order.status === "Shipped" ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400" :
                                        order.status === "Delivered" ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400" :
                                        "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Order Status</p>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">Order ID</th>
                                    <th className="table-head">Customer</th>
                                    <th className="table-head">Date</th>
                                    <th className="table-head">Amount</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Support Rep</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {orders.map((order) => (
                                    <tr
                                        key={order.orderNumber}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{order.orderNumber}</td>
                                        <td className="table-cell">{order.customer}</td>
                                        <td className="table-cell">{order.transactionDate}</td>
                                        <td className="table-cell">${order.lines.reduce((sum, line) => sum + line.amount, 0).toFixed(2)}</td>
                                        <td className="table-cell">
                                            <span className={`inline-block rounded-full px-2 py-1 text-sm ${
                                                order.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                                                order.status === "Approved" ? "bg-blue-100 text-blue-600" :
                                                order.status === "Shipped" ? "bg-green-100 text-green-600" :
                                                order.status === "Delivered" ? "bg-green-100 text-green-600" :
                                                "bg-red-100 text-red-600"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="table-cell">{order.supportRep}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <OrderAnalytics orders={orders} />
            <Footer />
        </div>
    );
};

export default DashboardPage;
