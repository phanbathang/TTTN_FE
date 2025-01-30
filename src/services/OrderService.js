import axios from 'axios';

export const getAllOrder = async (access_token) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/order/getAllOrder`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

export const createOrder = async (data, access_token) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/order/createOrder`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

export const getAllOrderDetail = async (id, access_token) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/order/getAllOrderDetail/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

export const getOrderDetail = async (id, access_token) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/order/getOrderDetail/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

export const cancelOrderDetail = async (id, access_token) => {
    const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/order/cancelOrderDetail/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};
