import axios from 'axios';

export const getAllProduct = async (search, limit) => {
    let res = {};
    if (search?.length > 0) {
        res = await axios.get(
            `${process.env.REACT_APP_API_URL}/product/getAllProduct?filter=name&filter=${search}&limit=${limit}`,
        );
    } else {
        res = await axios.get(
            `${process.env.REACT_APP_API_URL}/product/getAllProduct?limit=${limit}`,
        );
    }

    return res.data;
};

export const getTypeProduct = async (type) => {
    if (type) {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/product/getAllProduct?filter=type&filter=${type}`,
        );
        return res.data;
    }
};

export const createProduct = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/product/create-product`,
        data,
    );
    return res.data;
};

export const getDetailProduct = async (id) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/getDetailProduct/${id}`,
    );
    return res.data;
};

export const updateProduct = async (id, data) => {
    const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/product/update-product/${id}`,
        data,
    );
    return res.data;
};

export const deleteProduct = async (id) => {
    const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/product/delete-product/${id}`,
    );
    return res.data;
};

export const deleteManyProduct = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/product/delete-many`,
        data,
    );
    return res.data;
};

export const getAllTypeProduct = async () => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/getAllType`,
    );
    return res.data;
};
