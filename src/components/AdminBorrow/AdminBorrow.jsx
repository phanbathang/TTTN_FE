import React, { useState } from 'react';
import styles from './AdminBorrow.module.scss';
import { Button, Input, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import * as OrderService from '../../services/OrderService.js';
import { useQuery } from '@tanstack/react-query';
import { convertPrice } from '../../ultils.js';

import { orderContent } from '../../content.js';
import PieChartComponent from './PieChart.jsx';
import { useNavigate } from 'react-router-dom';

const AdminBorrow = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.user);
    const access_token = user?.access_token;

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };

    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: OrderService.getAllOrder,
    });

    const { isLoading: isLoadingOrder, data: orders = { data: [] } } =
        queryOrder;

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    // ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    // onPressEnter={() =>
                    //     handleSearch(selectedKeys, confirm, dataIndex)
                    // }
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        // onClick={() =>
                        //     handleSearch(selectedKeys, confirm, dataIndex)
                        // }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        // onClick={() =>
                        //     clearFilters && handleReset(clearFilters)
                        // }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    // setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    const handleViewOrderDetail = (id) => {
        const orderDetail = dataModal.find((order) => order.key === id);
        setSelectedOrder(orderDetail); // Lưu đơn hàng vào state
        setIsModalOpen(true); // Mở modal
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'userName',
            width: 200,
            sorter: (a, b) => a.userName.length - b.userName.length,
            ...getColumnSearchProps('userName'),
        },

        {
            title: 'Phone',
            dataIndex: 'phone',
            width: 70,
            ...getColumnSearchProps('phone'),
        },

        {
            title: 'Address',
            dataIndex: 'address',
            width: 400,
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address'),
        },

        {
            title: 'Paided',
            dataIndex: 'isPaid',
            width: 70,
            sorter: (a, b) => a.isPaid.length - b.isPaid.length,
            ...getColumnSearchProps('isPaid'),
        },

        {
            title: 'Shipped',
            dataIndex: 'isDelivered',
            width: 70,
            sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
            ...getColumnSearchProps('isDelivered'),
        },

        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            width: 300,
            sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
            ...getColumnSearchProps('paymentMethod'),
        },

        {
            title: 'Ordered Date',
            dataIndex: 'createdAt',
            width: 300,
            sorter: (a, b) => a.createdAt.length - b.createdAt.length,
            ...getColumnSearchProps('createdAt'),
        },

        {
            title: 'Price Total',
            dataIndex: 'totalPrice',
            width: 250,
            sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
            ...getColumnSearchProps('totalPrice'),
        },

        {
            title: 'Action',
            dataIndex: 'action',
            width: 50,
            align: 'center',
            render: (_, order) => (
                <Button
                    type="link"
                    onClick={() => handleViewOrderDetail(order?._id)}
                    style={{ color: '#007784' }}
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    const formatDateTime = (dateString) => {
        const dateObj = new Date(dateString);

        // Lấy thông tin ngày, tháng, năm
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();

        // Lấy thông tin giờ, phút, giây
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');

        return `${day}-${month}-${year}\n${hours}:${minutes}:${seconds}`;
    };

    const dataTable =
        Array.isArray(orders?.data) &&
        orders?.data.length &&
        orders?.data.map((order) => {
            return {
                ...order,
                key: order._id,
                userName: order?.shippingAddress?.fullName,
                phone: `0${order?.shippingAddress?.phone}`,
                address: order?.shippingAddress?.address,
                paymentMethod: orderContent.payment[order?.paymentMethod],
                isPaid: order?.isPaid ? 'TRUE' : 'FALSE',
                isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE',
                totalPrice: convertPrice(order?.totalPrice),
                createdAt: formatDateTime(order?.createdAt),
            };
        });

    const dataModal =
        Array.isArray(orders?.data) &&
        orders?.data.length &&
        orders?.data.map((order) => {
            return {
                ...order,
                key: order._id,
                name: order?.orderItems.map((item) => item.name).join(', '),
                amount: order?.orderItems.map((item) => item.amount).join(', '),
                userName: order?.shippingAddress?.fullName,
                phone: `0${order?.shippingAddress?.phone}`,
                address: order?.shippingAddress?.address,
                paymentMethod: orderContent.payment[order?.paymentMethod],
                isPaid: order?.isPaid ? 'TRUE' : 'FALSE',
                isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE',
                totalPrice: convertPrice(order?.totalPrice),
                createdAt: formatDateTime(order?.createdAt),
            };
        });

    return (
        <div>
            <h1 className={styles.WrapperHeader}>Quản lý đơn hàng</h1>
            <div style={{ height: '200px', width: '200px' }}>
                <PieChartComponent data={orders?.data} />
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    style={{ position: 'relative' }}
                    columns={columns}
                    data={dataTable}
                />
            </div>

            <Modal
                title={
                    <span
                        style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#007784',
                        }}
                    >
                        Chi tiết đơn hàng
                    </span>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalOpen(false)}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedOrder ? (
                    <div>
                        <p style={{ marginBottom: '10px' }}>
                            <strong>Tên sản phẩm:</strong> {selectedOrder.name}
                        </p>
                        <p style={{ marginBottom: '10px' }}>
                            <strong>Số lượng:</strong> {selectedOrder.amount}
                        </p>
                        <p style={{ marginBottom: '10px' }}>
                            <strong>Tên khách hàng:</strong>{' '}
                            {selectedOrder.userName}
                        </p>
                        <p style={{ marginBottom: '10px' }}>
                            <strong>Số điện thoại:</strong>{' '}
                            {selectedOrder.phone}
                        </p>
                        <p style={{ marginBottom: '10px' }}>
                            <strong>Địa chỉ:</strong> {selectedOrder.address}
                        </p>
                        <p style={{ marginBottom: '10px' }}>
                            <strong>Phương thức thanh toán:</strong>{' '}
                            {selectedOrder.paymentMethod}
                        </p>
                        <p style={{ marginBottom: '10px' }}>
                            <strong>Đã thanh toán:</strong>{' '}
                            {selectedOrder.isPaid}
                        </p>
                        <p style={{ marginBottom: '10px' }}>
                            <strong>Đã giao hàng:</strong>{' '}
                            {selectedOrder.isDelivered}
                        </p>
                        <p style={{ marginBottom: '10px' }}>
                            <strong>Tổng tiền:</strong>{' '}
                            {selectedOrder.totalPrice}
                        </p>
                        <p style={{ marginBottom: '10px' }}>
                            <strong>Ngày đặt hàng:</strong>{' '}
                            {selectedOrder.createdAt}
                        </p>
                    </div>
                ) : (
                    <p>Đang tải dữ liệu...</p>
                )}
            </Modal>
        </div>
    );
};

export default AdminBorrow;
