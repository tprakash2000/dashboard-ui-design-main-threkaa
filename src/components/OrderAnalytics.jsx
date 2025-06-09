import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const OrderAnalytics = ({ orders }) => {
    // Calculate status distribution
    const statusDistribution = useMemo(() => {
        const distribution = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(distribution).map(([name, value]) => ({
            name,
            value
        }));
    }, [orders]);

    // Calculate monthly trends
    const monthlyTrends = useMemo(() => {
        const trends = orders.reduce((acc, order) => {
            const month = new Date(order.transactionDate).toLocaleString('default', { month: 'short' });
            if (!acc[month]) {
                acc[month] = {
                    month,
                    count: 0,
                    amount: 0
                };
            }
            acc[month].count++;
            acc[month].amount += order.lines.reduce((sum, line) => sum + line.amount, 0);
            return acc;
        }, {});

        return Object.values(trends);
    }, [orders]);

    // Calculate top customers
    const topCustomers = useMemo(() => {
        const customerData = orders.reduce((acc, order) => {
            if (!acc[order.customer]) {
                acc[order.customer] = {
                    name: order.customer,
                    orders: 0,
                    amount: 0
                };
            }
            acc[order.customer].orders++;
            acc[order.customer].amount += order.lines.reduce((sum, line) => sum + line.amount, 0);
            return acc;
        }, {});

        return Object.values(customerData)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
    }, [orders]);

    // Calculate amount distribution by location
    const locationDistribution = useMemo(() => {
        const distribution = orders.reduce((acc, order) => {
            if (!acc[order.fromLocation]) {
                acc[order.fromLocation] = {
                    name: order.fromLocation,
                    amount: 0
                };
            }
            acc[order.fromLocation].amount += order.lines.reduce((sum, line) => sum + line.amount, 0);
            return acc;
        }, {});

        return Object.values(distribution);
    }, [orders]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Status Distribution */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Order Status Distribution</h3>
                </div>
                <div className="card-body h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Trends */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Monthly Order Trends</h3>
                </div>
                <div className="card-body h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="count" name="Order Count" fill="#8884d8" />
                            <Bar yAxisId="right" dataKey="amount" name="Order Amount" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Customers */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Top Customers</h3>
                </div>
                <div className="card-body h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topCustomers} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="orders" name="Number of Orders" fill="#8884d8" />
                            <Bar dataKey="amount" name="Total Amount" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Location Distribution */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Amount by Location</h3>
                </div>
                <div className="card-body h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={locationDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" name="Total Amount" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OrderAnalytics; 