import { Menu } from 'antd';
import React, { useState } from 'react';
import {
    AppstoreOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import styles from './AdminPage.module.scss';
import AdminOrder from '../../components/AdminOrder/AdminOrder';

const AdminPage = () => {
    const items = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: 'Người dùng',
        },
        {
            key: '2',
            icon: <AppstoreOutlined />,
            label: 'Sản phẩm',
        },
        {
            key: '3',
            icon: <ShoppingCartOutlined />,
            label: 'Đơn hàng',
        },
        // {
        //     key: '3',
        //     icon: <SettingOutlined />,
        //     label: 'Navigation Three',
        //     children: [
        //         {
        //             key: '31',
        //             label: 'Option 1',
        //         },
        //         {
        //             key: '32',
        //             label: 'Option 2',
        //         },
        //         {
        //             key: '33',
        //             label: 'Option 3',
        //         },
        //         {
        //             key: '34',
        //             label: 'Option 4',
        //         },
        //     ],
        // },
    ];

    const [keySelected, setKeySelected] = useState('');

    const renderPage = (key) => {
        switch (key) {
            case '1':
                return <AdminUser />;
            case '2':
                return <AdminProduct />;
            case '3':
                return <AdminOrder />;
            default:
                return <></>;
        }
    };

    const handleClick = ({ key }) => {
        if (key !== keySelected) {
            setKeySelected(key);
        }
    };

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />;
            <div
                style={{
                    display: 'flex',
                }}
            >
                <Menu
                    mode="inline"
                    style={{
                        width: '256px',
                        boxShadow: '1px 1px 2px #ccc',
                        height: 'auto',
                        width: '256px',
                    }}
                    items={items}
                    onClick={handleClick}
                    selectedKeys={[keySelected]} // Đảm bảo mục được chọn có thể được làm nổi bật
                    className={styles.adminmenu}
                />
                <div style={{ flex: 1, padding: '15px' }}>
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    );
};

export default AdminPage;
