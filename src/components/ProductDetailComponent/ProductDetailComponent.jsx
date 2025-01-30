import React, { useEffect, useState } from 'react';
import { Col, Image, InputNumber, Row, Rate } from 'antd';
import styles from './ProductDetailComponent.module.scss';
import imageSmall from '../../assets/images/imagesmall.webp';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ButtonComponents from '../ButtonComponents/ButtonComponents';
import * as ProductService from '../../services/ProductService.js';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide.js';
import { convertPrice } from '../../ultils.js';
import { toast } from 'react-toastify';

const ProductDetailComponent = ({ idProduct }) => {
    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order);
    const [errorOrderLimit, setErrorOrderLimit] = useState(false);
    const [numProduct, setNumProduct] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const onChange = (value) => {
        setNumProduct(Number(value));
    };
    const fetchGetDetailProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];
        if (id) {
            const res = await ProductService.getDetailProduct(id);
            return res.data;
        }
    };

    const handleChangeCount = (type, limited) => {
        if (type === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1);
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1);
            }
        }
    };

    const { isLoading, data: productDetails } = useQuery({
        queryKey: ['product-detail', idProduct],
        queryFn: fetchGetDetailProduct,
        enabled: !!idProduct,
    });

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location.pathname });
        } else {
            const orderRedux = order?.orderItems?.find(
                (item) => item.product === productDetails?._id,
            );
            if (
                orderRedux?.amount + numProduct <= orderRedux?.countInStock ||
                (!orderRedux && productDetails?.countInStock > 0)
            ) {
                dispatch(
                    addOrderProduct({
                        orderItem: {
                            name: productDetails?.name,
                            amount: numProduct,
                            image: productDetails?.image,
                            price: productDetails?.price,
                            product: productDetails?._id,
                            discount: productDetails?.discount,
                            countInStock: productDetails?.countInStock,
                        },
                    }),
                );
            } else {
                setErrorOrderLimit(true);
            }
        }
    };

    useEffect(() => {
        if (order.isSuccessOrder) {
            toast.success('Đã thêm vào giỏ hàng', {
                style: { fontSize: '1.5rem' },
            });
        }
        return () => {
            dispatch(resetOrder());
        };
    }, [order.isSuccessOrder]);

    useEffect(() => {
        const orderRedux = order?.orderItems?.find(
            (item) => item.product === productDetails?._id,
        );
        if (
            orderRedux?.amount + numProduct <= orderRedux?.countInStock ||
            (!orderRedux && productDetails?.countInStock > 0)
        ) {
            setErrorOrderLimit(false);
        } else if (productDetails?.countInStock === 0) {
            setErrorOrderLimit(true);
        }
    }, [numProduct]);

    return (
        <div>
            <Row style={{ padding: '16px', backgroundColor: '#fff' }}>
                <Col span={10}>
                    <Image
                        src={productDetails?.image}
                        alt="test"
                        preview="false"
                    />
                    <Row className={styles.WrapperRow}>
                        <Col span={4}>
                            <Image
                                className={styles.WrapperImage}
                                src={imageSmall}
                                alt="test"
                                preview="false"
                            />
                        </Col>
                        <Col span={4}>
                            <Image
                                className={styles.WrapperImage}
                                src={imageSmall}
                                alt="test"
                                preview="false"
                            />
                        </Col>
                        <Col span={4}>
                            <Image
                                className={styles.WrapperImage}
                                src={imageSmall}
                                alt="test"
                                preview="false"
                            />
                        </Col>
                        <Col span={4}>
                            <Image
                                className={styles.WrapperImage}
                                src={imageSmall}
                                alt="test"
                                preview="false"
                            />
                        </Col>
                        <Col span={4}>
                            <Image
                                className={styles.WrapperImage}
                                src={imageSmall}
                                alt="test"
                                preview="false"
                            />
                        </Col>
                        <Col span={4}>
                            <Image
                                className={styles.WrapperImage}
                                src={imageSmall}
                                alt="test"
                                preview="false"
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={14} style={{ paddingLeft: '20px' }}>
                    <div className={styles.WrapperNameProduct}>
                        {productDetails?.name}
                    </div>
                    <div>
                        <Rate
                            allowHalf
                            defaultValue={productDetails?.rating}
                            value={productDetails?.rating}
                            style={{ fontSize: '12px', color: 'yellow ' }}
                        />
                        <span className={styles.WrapperTextSell}>
                            | Da ban 100+
                        </span>
                        <div className={styles.WrapperPriceProduct}>
                            <h1>{convertPrice(productDetails?.price)}</h1>
                        </div>
                        <div className={styles.WrapperAddressProduct}>
                            <span>Giao đến </span>
                            <span className="address">{user?.address}</span>
                            <span className="change-address"> Đổi</span>
                        </div>
                        <div className={styles.WrapperQualityProduct}>
                            <div style={{ marginBottom: '15px' }}>
                                {' '}
                                Số Lượng
                            </div>
                            <div style={{ display: 'flex' }}>
                                <button
                                    className={styles.WrapperCustomNumber}
                                    onClick={() =>
                                        handleChangeCount(
                                            'decrease',
                                            numProduct === 1,
                                        )
                                    }
                                >
                                    <MinusOutlined size="10" />
                                </button>
                                <InputNumber
                                    className={styles.CustomInputNumber}
                                    min={1}
                                    max={productDetails?.countInStock}
                                    defaultValue={1}
                                    controls={false}
                                    onChange={onChange}
                                    value={numProduct}
                                />
                                <button
                                    className={styles.WrapperCustomNumber}
                                    onClick={() =>
                                        handleChangeCount(
                                            'increase',
                                            numProduct ===
                                                productDetails?.countInStock,
                                        )
                                    }
                                >
                                    <PlusOutlined size="10" />
                                </button>
                            </div>
                        </div>
                        {errorOrderLimit && (
                            <div style={{ color: 'red' }}>
                                Sản phẩm đã hết hàng
                            </div>
                        )}
                        <ButtonComponents
                            className={styles.WrapperButtonBuy}
                            textButton="Mua ngay"
                            onClick={handleAddOrderProduct}
                        />

                        <ButtonComponents
                            className={styles.WrapperButtonCart}
                            textButton="Thêm vào giỏ hàng"
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetailComponent;
