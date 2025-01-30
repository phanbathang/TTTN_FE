import { Button } from 'antd';
import React from 'react';

const ButtonComponents = ({ size, styles, textButton, ...rests }) => {
    return (
        <Button size={size} className={styles} {...rests}>
            {textButton}
        </Button>
    );
};
export default ButtonComponents;
