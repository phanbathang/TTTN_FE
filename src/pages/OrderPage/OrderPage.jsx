import React, { useEffect, useMemo, useState } from 'react';
import {
    Row,
    Col,
    Checkbox,
    Button,
    InputNumber,
    Form,
    Input,
    Upload,
    Steps,
} from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    decreaseAmount,
    increaseAmount,
    removeAllOrderProduct,
    removeOrderProduct,
    selectedOrder,
} from '../../redux/slides/orderSlide';
import { convertPrice } from '../../ultils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import styles from './OrderPage.module.scss';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService.js';
import { Bounce, toast } from 'react-toastify';
import { updateUser } from '../../redux/slides/userSlide.js';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import StepsComponent from '../../components/StepsComponent/StepsComponent.jsx';

const OrderPage = () => {
    const [listChecked, setListChecked] = useState([]);
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    });

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter(
                (item) => item !== e.target.value,
            );
            setListChecked(newListChecked);
        } else {
            setListChecked([...listChecked, e.target.value]);
        }
    };

    const handleChangeCount = (type, idProduct, limited) => {
        if (type === 'increase') {
            if (!limited) {
                dispatch(increaseAmount({ idProduct }));
            }
        } else {
            if (!limited) {
                dispatch(decreaseAmount({ idProduct }));
            }
        }
    };

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }));
    };

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = [];
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product);
            });
            setListChecked(newListChecked);
        } else {
            setListChecked([]);
        }
    };

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }));
    }, [listChecked]);

    useEffect(() => {
        form.setFieldsValue(stateUserDetail);
    }, [stateUserDetail, form]);

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetail({
                ...stateUserDetail,
                city: user?.city,
                name: user?.name,
                phone: user?.phone,
                address: user?.address,
            });
        }
    }, [isOpenModalUpdateInfo]);

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    };

    const handleRemoveAllOrder = () => {
        if (listChecked?.length > 0) {
            dispatch(removeAllOrderProduct({ listChecked }));
        }
    };

    const priceMemo = useMemo(() => {
        const result = order?.orderItemSelected.reduce((total, cur) => {
            return total + cur.price * cur.amount;
        }, 0);
        return result;
    }, [order]);

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemSelected.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0;
            return total + (priceMemo * (totalDiscount * cur.amount)) / 100;
        }, 0);
        if (Number(result)) {
            return result;
        }
        return 0;
    }, [order]);

    const priceDeliveryMemo = useMemo(() => {
        if (priceMemo >= 200000 && priceMemo < 500000) {
            return 10000;
        } else if (
            priceMemo >= 500000 ||
            order?.orderItemSelected?.length === 0
        ) {
            return 0;
        } else {
            return 20000;
        }
    }, [priceMemo]);

    const priceTotalMemo = useMemo(() => {
        return (
            Number(priceMemo) -
            Number(priceDiscountMemo) +
            Number(priceDeliveryMemo)
        );
    }, [priceMemo, priceDiscountMemo, priceDeliveryMemo]);

    const handleAddCard = () => {
        if (!order?.orderItemSelected?.length) {
            toast.error('Vui lòng chọn sản phẩm để thanh toán', {
                style: { fontSize: '1.5rem' },
            });
        } else if (
            !user?.phone ||
            !user?.address ||
            !user?.name ||
            !user?.city
        ) {
            setIsOpenModalUpdateInfo(true);
        } else {
            navigate('/payment');
        }
    };

    const handleCancelUpdate = () => {
        setStateUserDetail({
            name: '',
            email: '',
            isAdmin: false,
            phone: '',
            // name: user?.name || '',
            // phone: user?.phone || '',
            // address: user?.address || '',
            // city: user?.city || '',
        });
        form.resetFields();
        setIsOpenModalUpdateInfo(false);
    };

    const mutationUpdate = useMutationHook((data) => {
        const { id, access_token, ...rests } = data;
        return UserService.updateUser(id, rests, access_token);
    });

    const { data } = mutationUpdate;

    const queryUser = useQuery({
        queryKey: ['users'],
        queryFn: UserService.getAllUser,
    });

    const handleUpdateInfoUser = () => {
        const { name, phone, address, city } = stateUserDetail;
        if (name && address && phone && city) {
            mutationUpdate.mutate(
                {
                    id: user?.id,
                    // token,
                    ...stateUserDetail,
                },
                {
                    onSuccess: () => {
                        // queryUser.refetch();
                        dispatch(updateUser({ name, phone, address, city }));
                        setIsOpenModalUpdateInfo(false);
                    },
                },
            );
        }
    };

    const handleOnchangeDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value,
        });
    };

    const itemDelivery = [
        {
            title: '20.000 VND',
            description: 'Dưới 200.000 VND',
        },
        {
            title: '10.000 VND',
            description: 'Từ 200.000 VND đến dưới 500.000 VND',
        },
        {
            title: '0 VND',
            description: 'Trên 500.000 VND',
        },
    ];

    return (
        <div
            style={{
                backgroundColor: '#f0f0f5',
                width: '100%',
                minHeight: '100vh',
                padding: '20px',
            }}
        >
            <h1 style={{ marginBottom: '10px' }}>Giỏ hàng</h1>
            <Row gutter={16}>
                {/* Phần bên trái: Danh sách sản phẩm */}

                <Col span={18}>
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '5px',
                        }}
                    >
                        <StepsComponent
                            items={itemDelivery}
                            current={
                                priceDeliveryMemo === 10000
                                    ? 2
                                    : priceDeliveryMemo === 20000
                                    ? 1
                                    : order.orderItemSelected.length === 0
                                    ? 0
                                    : 3
                            }
                        />
                        {/* Header */}
                        <Row
                            style={{
                                borderBottom: '1px solid #ddd',
                                paddingBottom: '10px',
                                marginBottom: '15px',
                                marginTop: '20px',
                            }}
                        >
                            <Col span={4}>
                                <Checkbox
                                    onChange={handleOnchangeCheckAll}
                                    checked={
                                        listChecked?.length ===
                                        order?.orderItems?.length
                                    }
                                >
                                    Tất cả ({order?.orderItems?.length}) sản
                                    phẩm
                                </Checkbox>
                            </Col>
                            <Col
                                span={4}
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    marginRight: '25px',
                                }}
                            >
                                Tên sản phẩm
                            </Col>

                            <Col
                                span={4}
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    marginRight: '25px',
                                }}
                            >
                                Đơn giá
                            </Col>
                            <Col
                                span={4}
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    marginRight: '35px',
                                }}
                            >
                                Số lượng
                            </Col>
                            <Col
                                span={4}
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                }}
                            >
                                Thành tiền
                            </Col>

                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                danger
                                style={{ fontSize: '16px', marginLeft: '30px' }}
                                onClick={handleRemoveAllOrder}
                            />
                        </Row>

                        {/* Sản phẩm */}
                        {order?.orderItems?.map((order) => {
                            return (
                                <Row
                                    key={order?.id}
                                    style={{
                                        marginBottom: '15px',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #ddd',
                                        paddingBottom: '10px',
                                    }}
                                >
                                    <Col span={1}>
                                        <Checkbox
                                            onChange={onChange}
                                            value={order?.product}
                                            checked={listChecked.includes(
                                                order?.product,
                                            )}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <img
                                            src={order?.image}
                                            alt="Sản phẩm"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Col>
                                    <Col span={5}>
                                        <div>{order?.name}</div>
                                    </Col>
                                    <Col span={4}>
                                        <div
                                            style={{
                                                fontWeight: 'bold',
                                                color: '#ff4d4f',
                                            }}
                                        >
                                            {convertPrice(order?.price)}
                                        </div>
                                        <div
                                            style={{
                                                color: '#aaa',
                                                textDecoration: 'line-through',
                                            }}
                                        >
                                            211,230
                                        </div>
                                    </Col>
                                    <Col
                                        span={4}
                                        style={{ textAlign: 'center' }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                            }}
                                        >
                                            <Button
                                                icon={<MinusOutlined />}
                                                size="small"
                                                style={{ marginRight: '5px' }}
                                                onClick={() =>
                                                    handleChangeCount(
                                                        'decrease',
                                                        order?.product,
                                                        order?.amount === 1,
                                                    )
                                                }
                                            />
                                            <InputNumber
                                                defaultValue={order?.amount}
                                                value={order?.amount}
                                                size="small"
                                                style={{
                                                    width: '50px',
                                                    textAlign: 'center',
                                                }}
                                                controls={false}
                                                min={1}
                                                max={order?.countInStock}
                                            />
                                            <Button
                                                icon={<PlusOutlined />}
                                                size="small"
                                                style={{ marginLeft: '5px' }}
                                                onClick={() =>
                                                    handleChangeCount(
                                                        'increase',
                                                        order?.product,
                                                        order?.amount ===
                                                            order.countInStock,
                                                    )
                                                }
                                            />
                                        </div>
                                    </Col>
                                    <Col
                                        span={4}
                                        style={{
                                            textAlign: 'center',
                                            color: '#ff4d4f',
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold' }}>
                                            {convertPrice(
                                                order?.price * order?.amount,
                                            )}
                                        </div>
                                    </Col>
                                    <Col
                                        span={2}
                                        style={{ textAlign: 'center' }}
                                    >
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            danger
                                            style={{ fontSize: '16px' }}
                                            onClick={() =>
                                                handleDeleteOrder(
                                                    order?.product,
                                                )
                                            }
                                        />
                                    </Col>
                                </Row>
                            );
                        })}
                    </div>
                </Col>

                {/* Phần bên phải: Tóm tắt đơn hàng */}
                <Col span={6}>
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '5px',
                        }}
                    >
                        <Row style={{ marginBottom: '25px' }}>
                            <span>Địa chỉ:</span>
                            <span
                                style={{
                                    marginLeft: '5px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {`${user?.address} ${user?.city}`}{' '}
                            </span>
                            <span
                                style={{
                                    marginLeft: '5px',
                                    cursor: 'pointer',
                                    color: 'blue',
                                }}
                                onClick={handleChangeAddress}
                            >
                                Thay đổi
                            </span>
                        </Row>
                        <Row
                            justify="space-between"
                            style={{ marginBottom: '10px' }}
                        >
                            <Col>Tạm tính</Col>
                            <Col>{convertPrice(priceMemo)}</Col>
                        </Row>
                        <Row
                            justify="space-between"
                            style={{ marginBottom: '10px' }}
                        >
                            <Col>Giảm giá</Col>
                            <Col>{convertPrice(priceDiscountMemo)}</Col>
                        </Row>
                        <Row
                            justify="space-between"
                            style={{ marginBottom: '20px' }}
                        >
                            <Col>Phí giao hàng</Col>
                            <Col>{convertPrice(priceDeliveryMemo)}</Col>
                        </Row>
                        <Row
                            justify="space-between"
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18px',
                                marginBottom: '20px',
                            }}
                        >
                            <Col>Tổng tiền</Col>
                            <Col style={{ color: '#ff4d4f', fontSize: '20px' }}>
                                {convertPrice(priceTotalMemo)}
                            </Col>
                        </Row>
                        <Button
                            type="primary"
                            style={{
                                width: '100%',
                                backgroundColor: '#ff4d4f',
                                borderColor: '#ff4d4f',
                                height: '40px',
                            }}
                            onClick={handleAddCard}
                        >
                            Mua hàng
                        </Button>
                    </div>
                </Col>
            </Row>

            <ModalComponent
                title="Cập nhật thông tin giao hàng"
                open={isOpenModalUpdateInfo}
                onCancel={handleCancelUpdate}
                style={{ top: '50px' }}
                onOk={handleUpdateInfoUser}
                footer={[
                    <Button
                        key="cancel"
                        onClick={handleCancelUpdate}
                        style={{
                            borderColor: '#76b8bf',
                            color: '#000',
                        }}
                    >
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        style={{
                            backgroundColor: '#76b8bf', // Màu nền của nút OK
                            borderColor: '#76b8bf', // Đảm bảo viền có màu giống nền
                        }}
                        onClick={handleUpdateInfoUser} // Hàm xử lý khi nhấn nút OK
                    >
                        OK
                    </Button>,
                ]}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{
                        maxWidth: 600,
                        marginTop: '30px',
                        marginRight: '20%',
                    }}
                    initialValues={{ remember: true }}
                    // onFinish={onUpdateUser}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name!',
                            },
                        ]}
                    >
                        <Input
                            value={stateUserDetail.name}
                            onChange={handleOnchangeDetail}
                            name="name"
                            className={styles.WrapperInput}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone!',
                            },
                        ]}
                    >
                        <Input
                            value={stateUserDetail.phone}
                            onChange={handleOnchangeDetail}
                            name="phone"
                            className={styles.WrapperInput}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your address!',
                            },
                        ]}
                    >
                        <Input
                            value={stateUserDetail.address}
                            onChange={handleOnchangeDetail}
                            name="address"
                            className={styles.WrapperInput}
                        />
                    </Form.Item>

                    <Form.Item
                        label="City"
                        name="city"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your city!',
                            },
                        ]}
                    >
                        <Input
                            value={stateUserDetail.city}
                            onChange={handleOnchangeDetail}
                            name="city"
                            className={styles.WrapperInput}
                        />
                    </Form.Item>
                </Form>
            </ModalComponent>
        </div>
    );
};

export default OrderPage;
