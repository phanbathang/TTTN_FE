import { Spin } from 'antd';
import React from 'react';

const Loading = ({ children, isLoading, delays }) => {
    return (
        <Spin spinning={isLoading} delay={delays}>
            {children}
        </Spin>
    );
};

export default Loading;
