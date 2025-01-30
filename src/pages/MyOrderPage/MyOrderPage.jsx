import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService.js';
import { useSelector } from 'react-redux';
import styles from './MyOrderPage.module.scss';
import { convertPrice } from '../../ultils.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHook } from '../../hooks/useMutationHook.js';
import { Bounce, toast } from 'react-toastify';
import { Modal } from 'antd'; // Thêm Modal của Ant Design

const MyOrderPage = () => {
    const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị Modal
    const [selectedOrderId, setSelectedOrderId] = useState(null); // Lưu ID đơn hàng cần hủy

    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();

    const fetchMyOrder = async () => {
        const res = await OrderService.getAllOrderDetail(
            state?.id,
            state?.access_token,
        );
        return res.data;
    };

    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: fetchMyOrder,
        enabled: !!state?.id && !!state?.access_token,
    });

    const { isLoading, data } = queryOrder;

    // const renderProduct = (data) => {
    //     return data?.map((order) => {
    //         return (
    //             <div className={styles.OrderDetails}>
    //                 <img
    //                     src={order.image}
    //                     alt={order.name}
    //                     className={styles.OrderImage}
    //                 />
    //                 <div className={styles.OrderInfo}>
    //                     <p>{order.name}</p>
    //                     <p>{convertPrice(order.price)}</p>
    //                 </div>
    //             </div>
    //         );
    //     });
    // };

    const renderProduct = (orderItems) => {
        return (
            <div className={styles.OrderDetailsGroup}>
                {orderItems?.map((item, idx) => (
                    <div key={idx} className={styles.OrderDetails}>
                        <img
                            src={item.image}
                            alt={item.name}
                            className={styles.OrderImage}
                        />
                        <div className={styles.OrderInfo}>
                            <p>{item.name}</p>
                            <p>{convertPrice(item.price)}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const handleDetailOrder = (id) => {
        navigate(`/detailOrder/${id}`, {
            state: {
                access_token: state?.access_token,
            },
        });
    };

    const mutation = useMutationHook((data) => {
        const { id, access_token } = data;
        return OrderService.cancelOrderDetail(id, access_token);
    });

    const handleCancelOrder = (id) => {
        mutation.mutate(
            { id, access_token: state?.access_token },
            {
                onSuccess: () => {
                    queryOrder.refetch(); // Tải lại danh sách đơn hàng sau khi hủy
                },
            },
        );
    };

    const {
        isLoading: isLoadingCancel,
        isSuccess: isSuccessCancel,
        isError: isErrorCancel,
        data: dataCancel,
    } = mutation;

    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === 'OK') {
            toast.success('Hủy đơn hàng thành công.', {
                style: { fontSize: '1.5rem' },
            });
        } else if (isErrorCancel || dataCancel?.status === 'ERR') {
            toast.error('Hủy đơn hàng không thành công.', {
                style: { fontSize: '1.5rem' },
            });
        }
    }, [isSuccessCancel, isErrorCancel]);

    const showCancelModal = (id) => {
        setSelectedOrderId(id); // Lưu ID của đơn hàng
        setIsModalVisible(true); // Hiển thị Modal
    };

    return (
        <div className={styles.Wrapper}>
            <h1>Đơn hàng của tôi</h1>
            {data?.map((order) => (
                <div key={order.id} className={styles.OrderCard}>
                    <h2>Trạng thái</h2>
                    <div className={styles.OrderStatus}>
                        <p>
                            <span className={styles.StatusLabel}>
                                Giao hàng:
                            </span>
                            <span className={styles.StatusValue}>
                                {`${
                                    order.isDelivered
                                        ? 'Đã giao hàng'
                                        : 'Chưa giao hàng'
                                }`}
                            </span>
                        </p>
                        <p>
                            <span className={styles.StatusLabel}>
                                Thanh toán:
                            </span>
                            <span className={styles.StatusValue}>
                                {`${
                                    order.isPaid
                                        ? 'Đã thanh toán'
                                        : 'Chưa thanh toán'
                                }`}
                            </span>
                        </p>
                    </div>
                    {renderProduct(order?.orderItems)}
                    <div className={styles.OrderFooter}>
                        <p className={styles.OrderTotal}>
                            Tổng tiền:{' '}
                            <span>{convertPrice(order.totalPrice)}</span>
                        </p>
                        <div className={styles.OrderActions}>
                            <button
                                className={styles.CancelButton}
                                onClick={() => showCancelModal(order?._id)}
                            >
                                Hủy đơn hàng
                            </button>
                            <button
                                className={styles.DetailsButton}
                                onClick={() => handleDetailOrder(order?._id)}
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {/* Modal Xác nhận hủy */}
            <Modal
                title="Xác nhận hủy đơn hàng"
                visible={isModalVisible}
                onOk={() => {
                    handleCancelOrder(selectedOrderId); // Hủy đơn hàng khi xác nhận
                    setIsModalVisible(false); // Đóng Modal
                }}
                onCancel={() => setIsModalVisible(false)} // Đóng Modal khi người dùng hủy
                okText="Xác nhận"
                cancelText="Hủy bỏ"
            >
                <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
            </Modal>
        </div>
    );
};

export default MyOrderPage;
