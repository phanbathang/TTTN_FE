import { orderContent } from './content';

export const isJsonString = (data) => {
    try {
        JSON.parse(data);
    } catch (error) {
        return false;
    }
    return true;
};

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const renderOptions = (arr) => {
    let result = [];
    if (arr) {
        result = arr?.map((opt) => {
            return {
                value: opt,
                label: opt,
            };
        });
    }
    result.push({
        label: 'Thêm type',
        value: 'add_type',
    });
    return result;
};

export const renderOptionsUpdate = (arr) => {
    let result = [];
    if (arr) {
        result = arr?.map((opt) => {
            return {
                value: opt,
                label: opt,
            };
        });
    }
    return result;
};

export const convertPrice = (price) => {
    try {
        const result = price?.toLocaleString().replaceAll(',', '.');
        return `${result} VND`;
    } catch (error) {
        return null;
    }
};

export const convertDataChart = (data, type) => {
    try {
        const object = {};
        Array.isArray(data) &&
            data.forEach((option) => {
                if (!object[option[type]]) {
                    object[option[type]] = 1;
                } else {
                    object[option[type]] += 1;
                }
            });
        const result =
            Array.isArray(Object.keys(object)) &&
            Object.keys(object).map((item) => {
                return {
                    name: orderContent.payment[item],
                    value: object[item],
                };
            });
        return result;
    } catch (error) {
        return [];
    }
};
