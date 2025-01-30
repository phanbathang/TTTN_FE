import { Input } from 'antd';
import React from 'react';

const InputForm = (props) => {
    const { placeholder, ...rests } = props;
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value);
    };
    return (
        <div>
            <Input
                placeholder={placeholder}
                value={props.value}
                {...rests}
                rules={[
                    {
                        required: true,
                        message: 'Please input your email!',
                    },
                ]}
                onChange={handleOnchangeInput}
            />
        </div>
    );
};

export default InputForm;
