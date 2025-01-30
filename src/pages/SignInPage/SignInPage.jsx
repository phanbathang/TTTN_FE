import React, { useEffect, useState } from 'react';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponents from '../../components/ButtonComponents/ButtonComponents';
import styles from './SignInPage.module.scss';
import imageIcon from '../../assets/images/logo-login.png';
import { Image } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import InputFormPassword from '../../components/InputFormPassword/InputFormPassword';
import * as UserService from '../../services/UserService.js';
import { useMutationHook } from '../../hooks/useMutationHook.js';
import Loading from '../../components/LoadingComponent/Loading.jsx';
// import * as toast from '../../components/MessageComponent/MessageComponent';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slides/userSlide.js';
import { Bounce, toast } from 'react-toastify';

const SignInPage = () => {
    const location = useLocation();

    const navigate = useNavigate();
    const handleSignUp = () => {
        navigate('/sign-up');
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    const mutation = useMutationHook((data) => UserService.loginUser(data));

    const { data, isLoading, isSuccess, isError, error } = mutation;

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            // if (location?.state) {
            //     navigate(location?.state);
            // } else {
            //     navigate('/');
            // }
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                if (location?.state) {
                    navigate(location?.state);
                } else {
                    navigate('/');
                }
                toast.success('Đăng nhập thành công', {
                    style: { fontSize: '1.5rem' },
                });
            }, 2000);
            localStorage.setItem(
                'access_token',
                JSON.stringify(data?.access_token),
            );
            localStorage.setItem(
                'refresh_token',
                JSON.stringify(data?.refresh_token),
            );
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token);
                if (decoded?.id) {
                    handleGetDetailUser(decoded?.id, data?.access_token);
                }
            }
        } else if (isError || data?.status === 'ERR') {
            const errorMessage =
                error?.response?.data?.message ||
                data?.message ||
                'An unexpected error occurred';
            toast.error(errorMessage, {
                style: { fontSize: '1.5rem' },
            });
        }
    }, [isSuccess, isError, data]);

    const handleGetDetailUser = async (id, token) => {
        const storage = localStorage.getItem('refresh_token');
        const refreshToken = JSON.parse(storage);
        const res = await UserService.getDetailUser(id, token);
        dispatch(
            updateUser({ ...res?.data, access_token: token, refreshToken }),
        );
    };

    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };

    const handleOnchangePassword = (value) => {
        setPassword(value);
    };

    const handleSignIn = () => {
        mutation.mutate({ email, password });
    };
    return (
        <div
            style={{
                background: 'rgba(0, 0, 0, 0.53)',
                display: 'flex',
                justifyContent: 'center',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <div className={styles.Wrapper}>
                <div className={styles.WrapperLoginLeft}>
                    <h1 style={{ fontSize: '3rem' }}>Đăng nhập bằng email</h1>
                    <p
                        style={{
                            fontSize: '1.5rem',
                            opacity: '0.9',
                            marginBottom: '20px',
                        }}
                    >
                        Nhập email và mật khẩu tài khoản MixiShop
                    </p>
                    <InputForm
                        placeholder="abc@gmail.com"
                        style={{ marginBottom: '15px' }}
                        value={email}
                        onChange={handleOnchangeEmail}
                    />
                    <InputFormPassword
                        style={{
                            width: '384px',
                            display: 'flex',
                        }}
                        placeholder="Input password"
                        value={password}
                        onChange={handleOnchangePassword}
                    />
                    <Loading isLoading={isLoading || isSubmitting}>
                        <ButtonComponents
                            onClick={handleSignIn}
                            disabled={!email.length || !password.length}
                            className={styles.WrapperButtonBuy}
                            textButton="Đăng nhập"
                        />
                    </Loading>
                    <div
                        style={{
                            paddingTop: '20px',
                            fontSize: '1.5rem',
                            color: '#2561b1',
                        }}
                    >
                        Quên mật khẩu?
                    </div>
                    <span
                        style={{
                            paddingTop: '20px',
                            fontSize: '1.5rem',
                        }}
                    >
                        Chưa có tài khoản?
                    </span>
                    <span
                        style={{
                            paddingTop: '20px',
                            fontSize: '1.5rem',
                            color: '#2561b1',
                            paddingLeft: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={handleSignUp}
                    >
                        Tạo tài khoản
                    </span>
                </div>
                <div className={styles.WrapperLoginRight}>
                    <Image
                        src={imageIcon}
                        preview={false}
                        style={{ width: '150px' }}
                    />
                    <div
                        style={{
                            paddingTop: '20px',
                            fontSize: '1.5rem',
                        }}
                    >
                        Mua sắm tại THANGBOOK
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
