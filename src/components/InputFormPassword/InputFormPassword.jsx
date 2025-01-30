import { Input } from 'antd';
import React from 'react';

const InputFormPassword = (props) => {
    const { placeholder = 'Input password', ...rests } = props;
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value);
    };
    return (
        <div>
            <Input.Password
                placeholder={placeholder}
                value={props.value}
                {...rests}
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
                onChange={handleOnchangeInput}
            />
        </div>
    );
};

export default InputFormPassword;
