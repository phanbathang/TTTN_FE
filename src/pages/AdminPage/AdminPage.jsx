import { Card, Col, Menu, Row, Statistic, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import {
    AppstoreOutlined,
    PieChartOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
import AdminDeletedOrder from '../../components/AdminDeletedOrder/AdminDeletedOrder';
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
    Cell,
    LineChart,
    Line,
} from 'recharts';
import styles from './AdminPage.module.scss';
import * as UserService from '../../services/ProductService.js';
import * as ProductService from '../../services/ProductService.js';
import * as OrderService from '../../services/OrderService.js';
import {
    checkAndRefreshToken,
    getAllUser,
} from '../../services/UserService.js';
import { getAllOrder, getDeletedOrders } from '../../services/OrderService.js';
import { convertPrice } from '../../ultils.js';

const { Title } = Typography;

const AdminPage = () => {
    const [keySelected, setKeySelected] = useState('dashboard');
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
        cancelledOrders: 0, // Thêm để lưu số đơn hàng đã hủy
        revenue: 0,
    });
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(false);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61'];

    const items = [
        { key: 'dashboard', icon: <PieChartOutlined />, label: 'Dashboard' },
        { key: 'users', icon: <TeamOutlined />, label: 'Người dùng' },
        { key: 'products', icon: <AppstoreOutlined />, label: 'Sản phẩm' },
        {
            key: 'orders',
            icon: <ShoppingCartOutlined />,
            label: 'Đơn hàng',
            children: [
                { key: 'active-orders', label: 'Đơn hàng đã thanh toán' },
                { key: 'cancelled-orders', label: 'Đơn hàng đã hủy' },
            ],
        },
    ];

    // Hàm fetch dữ liệu từ API (giữ nguyên logic gốc)
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const access_token = await checkAndRefreshToken();
            if (!access_token) {
                console.error('No access token available');
                return;
            }

            const userData = await getAllUser();
            const totalUsers = userData?.data?.length || 0;

            const productData = await UserService.getAllProduct('', 1000);
            const totalProducts = productData?.data?.length || 0;

            const orderData = await getAllOrder(access_token);
            const totalOrders = orderData?.data?.length || 0;

            // Thêm: Lấy dữ liệu đơn hàng đã hủy
            const deletedOrderData = await OrderService.getDeletedOrders(
                access_token,
            );
            const deletedOrders = deletedOrderData?.data || [];
            const totalCancelledOrders = deletedOrders.length;

            const totalRevenue =
                orderData?.data?.reduce(
                    (sum, order) => sum + (order.totalPrice || 0),
                    0,
                ) || 0;

            // Cập nhật stats (thêm cancelledOrders)
            setStats({
                users: totalUsers,
                products: totalProducts,
                orders: totalOrders,
                cancelledOrders: totalCancelledOrders,
                revenue: totalRevenue,
            });

            // Dữ liệu doanh số theo tháng (tính từ orderData)
            const monthlySales = {};
            const monthlyCancelled = {}; // Thêm để tính số đơn hàng đã hủy theo tháng
            orderData?.data?.forEach((order) => {
                const date = new Date(order.createdAt);
                const month = date.toLocaleString('vi-VN', { month: 'long' });
                monthlySales[month] =
                    (monthlySales[month] || 0) + (order.totalPrice || 0);
            });
            // Thêm: Tính số đơn hàng đã hủy theo tháng
            deletedOrders.forEach((order) => {
                const date = new Date(order.createdAt);
                const month = date.toLocaleString('vi-VN', { month: 'long' });
                monthlyCancelled[month] = (monthlyCancelled[month] || 0) + 1;
            });

            // Kết hợp dữ liệu doanh số và số đơn hàng đã hủy
            const salesArray = Object.entries(monthlySales).map(
                ([name, value]) => ({
                    name,
                    value,
                    cancelledOrders: monthlyCancelled[name] || 0, // Thêm số đơn hàng đã hủy
                }),
            );
            setSalesData(salesArray);

            const typeData = await UserService.getAllTypeProduct();
            const productTypes = typeData?.data || [];
            const categoryStats = {};
            productData?.data?.forEach((product) => {
                const type = product.type || 'Không xác định';
                categoryStats[type] = (categoryStats[type] || 0) + 1;
            });
            const categoryArray = Object.entries(categoryStats).map(
                ([name, value]) => ({
                    name,
                    value,
                }),
            );
            setCategoryData(categoryArray);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (keySelected === 'dashboard') {
            fetchDashboardData();
        }
    }, [keySelected]);

    // Tùy chỉnh Tooltip cho biểu đồ doanh số (cập nhật để hiển thị cả đơn hàng đã hủy)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <p>{`Tháng: ${label}`}</p>
                    <p>{`Doanh số: ${convertPrice(payload[0].value)}`}</p>
                    {payload[1] && (
                        <p>{`Đơn hàng đã hủy: ${payload[1].value}`}</p>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderPage = (key) => {
        switch (key) {
            case 'dashboard':
                return (
                    <div className={styles.dashboardContainer}>
                        <Title level={2} className={styles.dashboardTitle}>
                            Dashboard Quản Trị
                        </Title>
                        <Row gutter={[24, 24]} className={styles.statsRow}>
                            <Col xs={24} sm={12} md={6}>
                                <Card
                                    className={styles.statCard}
                                    loading={loading}
                                >
                                    <Statistic
                                        title="Người dùng"
                                        value={stats.users}
                                        prefix={<UserOutlined />}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card
                                    className={styles.statCard}
                                    loading={loading}
                                >
                                    <Statistic
                                        title="Sản phẩm"
                                        value={stats.products}
                                        prefix={<AppstoreOutlined />}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card
                                    className={styles.statCard}
                                    loading={loading}
                                >
                                    <Statistic
                                        title="Đơn hàng"
                                        value={stats.orders}
                                        prefix={<ShoppingCartOutlined />}
                                        valueStyle={{ color: '#faad14' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card
                                    className={styles.statCard}
                                    loading={loading}
                                >
                                    <Statistic
                                        title="Đơn hàng đã hủy"
                                        value={stats.cancelledOrders}
                                        prefix={<ShoppingCartOutlined />}
                                        valueStyle={{ color: '#ff7300' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card
                                    className={styles.statCard}
                                    loading={loading}
                                >
                                    <Statistic
                                        title="Doanh thu"
                                        value={stats.revenue}
                                        prefix="₫"
                                        valueStyle={{ color: '#f5222d' }}
                                        formatter={(value) =>
                                            convertPrice(value)
                                        }
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]} className={styles.chartRow}>
                            <Col xs={24} md={24}>
                                <Card
                                    title="Phân loại sản phẩm"
                                    className={styles.chartCard}
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                nameKey="name"
                                                label={({ name, percent }) =>
                                                    `${name}: ${(
                                                        percent * 100
                                                    ).toFixed(0)}%`
                                                }
                                            >
                                                {categoryData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]} className={styles.chartRow}>
                            <Col xs={24} md={12}>
                                <Card
                                    title="Doanh số và Đơn hàng đã hủy theo tháng"
                                    className={styles.chartCard}
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <BarChart data={salesData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis yAxisId="left" />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                            />
                                            <Tooltip
                                                content={<CustomTooltip />}
                                            />
                                            <Legend />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="value"
                                                fill="#8884d8"
                                                name="Doanh số"
                                            />
                                            <Bar
                                                yAxisId="right"
                                                dataKey="cancelledOrders"
                                                fill="#ff7300"
                                                name="Đơn hàng đã hủy"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card
                                    title="Xu hướng doanh thu theo tháng"
                                    className={styles.chartCard}
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <LineChart data={salesData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) =>
                                                    convertPrice(value)
                                                }
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#82ca9d"
                                                name="Doanh số"
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                );
            case 'users':
                return <AdminUser />;
            case 'products':
                return <AdminProduct />;
            case 'active-orders':
                return <AdminOrder />;
            case 'cancelled-orders':
                return <AdminDeletedOrder />;
            default:
                return (
                    <div className={styles.placeholder}>
                        <h2>Chào mừng đến với trang quản trị</h2>
                        <p>Vui lòng chọn một mục từ menu bên trái để bắt đầu</p>
                    </div>
                );
        }
    };

    const handleClick = ({ key }) => {
        setKeySelected(key);
    };

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart isHidden />
            <div className={styles.adminContainer}>
                <div className={styles.sidebar}>
                    <Menu
                        mode="inline"
                        className={styles.sidebarMenu}
                        items={items}
                        onClick={handleClick}
                        selectedKeys={[keySelected]}
                        defaultOpenKeys={['orders']}
                    />
                </div>
                <div className={styles.content}>{renderPage(keySelected)}</div>
            </div>
        </>
    );
};

export default AdminPage;
