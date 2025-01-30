import { Button, Input } from 'antd';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import InputComponents from '../InputComponents/InputComponents';
import ButtonComponents from '../ButtonComponents/ButtonComponents';

const ButtonInputSearch = (props) => {
    const { size, placeholder, textButton, className } = props;
    return (
        <div style={{ display: 'flex' }}>
            <InputComponents
                size={size}
                placeholder={placeholder}
                className={styles.wrapperInput}
                {...props}
            />

            <ButtonComponents
                size={size}
                icon={<SearchOutlined />}
                className={styles.wrapperButton}
                textButton={textButton}
            />
        </div>
    );
};
export default ButtonInputSearch;
