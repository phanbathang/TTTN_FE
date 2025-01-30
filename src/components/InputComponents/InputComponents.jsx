import { Input } from 'antd';
import React from 'react';
// import styles from './style.module.scss';

const InputComponents = ({ size, placeholder, styles, ...rests }) => {
    return <Input size={size} placeholder={placeholder} className={styles} {...rests} />;
};
export default InputComponents;
