import React from 'react';
import styles from './AdminOrder.module.scss';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import * as OrderService from '../../services/OrderService.js';
import { useQuery } from '@tanstack/react-query';
import { convertPrice } from '../../ultils.js';

import { orderContent } from '../../content.js';
import PieChartComponent from './PieChart.jsx';

const AdminOrder = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.user);
    const token = user?.access_token;

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };

    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: OrderService.getAllOrder,
    });

    const { isLoading: isLoadingOrder, data: orders } = queryOrder;

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

    const columns = [
        {
            title: 'Name',
            dataIndex: 'userName',
            width: 220,
            sorter: (a, b) => a.userName.length - b.userName.length,
            ...getColumnSearchProps('userName'),
        },

        {
            title: 'Phone',
            dataIndex: 'phone',
            width: 150,
            ...getColumnSearchProps('phone'),
        },

        {
            title: 'Address',
            dataIndex: 'address',
            width: 200,
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address'),
        },

        {
            title: 'Paided',
            dataIndex: 'isPaid',
            width: 100,
            sorter: (a, b) => a.isPaid.length - b.isPaid.length,
            ...getColumnSearchProps('isPaid'),
        },

        {
            title: 'Shipped',
            dataIndex: 'isDelivered',
            width: 100,
            sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
            ...getColumnSearchProps('isDelivered'),
        },

        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            width: 400,
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
            width: 300,
            sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
            ...getColumnSearchProps('totalPrice'),
        },
    ];

    const formatDateTime = (dateString) => {
        const [date, time] = dateString.split('T');
        const [year, month, day] = date.split('-');
        const [hour, minute] = time.split(':');
        return `${day}-${month}-${year} - ${hour}:${minute}`;
    };

    const dataTable =
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
        </div>
    );
};

export default AdminOrder;
