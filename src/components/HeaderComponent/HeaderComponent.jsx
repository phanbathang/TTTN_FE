import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Dropdown, message, Popover, Menu } from 'antd';
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import styles from './style.module.scss';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService.js';
import { resetUser } from '../../redux/slides/userSlide.js';
import Loading from '../LoadingComponent/Loading.jsx';
import { Bounce, toast } from 'react-toastify';
import image1 from '../../assets/images/booktech-Photoroom.png';
import { searchProduct } from '../../redux/slides/productSlide.js';
import * as ProductService from '../../services/ProductService';
import TypeProduct from '../TypeProduct/TypeProduct.jsx';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [useravatar, setUseravatar] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const order = useSelector((state) => state.order);
    const [search, setSearch] = useState('');
    const [typeProduct, setTypeProduct] = useState([]);

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'OK') {
            setTypeProduct(res?.data);
        }
    };

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    const handleLogin = () => {
        navigate('/sign-in');
    };

    const handleLogout = async () => {
        const response = await UserService.logoutUser();
        if (response.status === 'OK') {
            setIsSubmitting(true);
            setTimeout(() => {
                localStorage.removeItem('access_token'); // Xóa access_token
                dispatch(resetUser());
                toast.success('Đã đăng xuất', {
                    style: { fontSize: '1.5rem' },
                });
                setIsSubmitting(false);
            }, 1000);
        } else {
            console.error('Logout API failed:', response.message);
        }
    };

    useEffect(() => {
        setIsSubmitting(true);
        setUsername(user?.name);
        setUseravatar(user?.avatar);
        setIsSubmitting(false);
    }, [user?.name, user?.avatar]);

    const content = (
        <div>
            {user?.isAdmin && (
                <p
                    className={styles.WrapperAdmin}
                    onClick={() => navigate('/')}
                >
                    Quản lý giao diện
                </p>
            )}
            {user?.isAdmin && (
                <p
                    className={styles.WrapperAdmin}
                    onClick={() => navigate('/system/admin')}
                >
                    Quản lý hệ thống
                </p>
            )}
            <p
                className={styles.WrapperPopover}
                onClick={() => navigate('/profile-user')}
            >
                Thông tin người dùng
            </p>

            <p
                className={styles.WrapperPopover}
                onClick={() =>
                    navigate('/my-order', {
                        state: {
                            id: user?.id,
                            access_token: user?.access_token,
                        },
                    })
                }
            >
                Đơn hàng của tôi
            </p>

            <p className={styles.WrapperPopoverLogout} onClick={handleLogout}>
                Đăng xuất
            </p>
        </div>
    );

    const onSearch = (e) => {
        setSearch(e.target.value);
        dispatch(searchProduct(e.target.value));
    };

    // Menu cho Dropdown
    const menu = (
        <Menu style={{ backgroundColor: '#f0f0f0' }}>
            {typeProduct.map((item, index) => (
                <Menu.Item
                    key={index}
                    style={{
                        display: 'block',
                        padding: '10px 20px',
                        borderBottom: '1px solid #ddd',
                    }}
                >
                    <TypeProduct name={item} />
                </Menu.Item>
            ))}
        </Menu>
    );

    const handleLink = () => {
        navigate('/');
    };

    return (
        <div>
            <div
                className={styles.WrappperHeader}
                gutter={16}
                style={{
                    justifyContent:
                        isHiddenSearch && isHiddenSearch
                            ? 'space-between'
                            : 'unset',
                }}
            >
                <Col span={6} style={{ textAlign: 'center' }}>
                    <a
                        href="#"
                        className={styles.WrappperHeaderLink}
                        onClick={handleLink}
                    >
                        <img
                            src={image1}
                            className={styles.WrappperHeaderImg}
                            alt="img"
                        />
                    </a>
                </Col>

                {/* Dropdown ở giữa
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button style={{ margin: 'auto' }}>Chọn danh mục</Button>
                </Dropdown> */}

                {!isHiddenSearch && (
                    <Col span={12} style={{ margin: 'auto' }}>
                        <ButtonInputSearch
                            size="large"
                            placeholder="Bạn đang muốn tìm sách gì ?"
                            textButton="Tìm kiếm"
                            style={{ height: '38px' }}
                            onChange={onSearch}
                        />
                    </Col>
                )}

                <Col span={6} style={{ display: 'flex' }}>
                    <Loading isLoading={isSubmitting}>
                        <div className={styles.WrrapperHeaderAccount}>
                            {useravatar ? (
                                <img
                                    src={useravatar}
                                    alt="avatar"
                                    style={{
                                        height: '50px',
                                        width: '50px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <UserOutlined style={{ fontSize: '30px' }} />
                            )}
                            {user?.access_token ? (
                                <>
                                    <Popover content={content} trigger="click">
                                        <div style={{ cursor: 'pointer' }}>
                                            {username?.length
                                                ? username
                                                : user?.email}
                                        </div>
                                    </Popover>
                                </>
                            ) : (
                                <div
                                    style={{
                                        margin: 'auto',
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleLogin}
                                >
                                    <span className={styles.WrappperHeaderText}>
                                        Đăng nhập/Đăng ký
                                    </span>
                                    <div>
                                        <span
                                            className={
                                                styles.WrappperHeaderText
                                            }
                                        >
                                            Tài khoản
                                        </span>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Loading>
                    {!isHiddenCart && (
                        <div
                            style={{ margin: 'auto', cursor: 'pointer' }}
                            onClick={() => navigate('/order')}
                        >
                            <Badge
                                count={order?.orderItems?.length}
                                size="small"
                            >
                                <ShoppingCartOutlined
                                    style={{ fontSize: '30px', color: '#fff' }}
                                />
                            </Badge>
                            <span className={styles.WrappperHeaderText}>
                                Giỏ hàng
                            </span>
                        </div>
                    )}
                </Col>
            </div>
        </div>
    );
};

export default HeaderComponent;
