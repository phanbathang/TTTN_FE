import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const loginUser = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/sign-in`,
        data,
    );
    return res.data;
};

export const signUpUser = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/sign-up`,
        data,
    );
    return res.data;
};

export const getAllUser = async () => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/getAllUser`,
    );
    return res.data;
};

export const getDetailUser = async (id, access_token) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/getDetailUser/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

export const updateUser = async (id, data) => {
    const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/update-user/${id}`,
        data,
    );
    return res.data;
};

export const deleteUser = async (id, access_token) => {
    const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/user/delete-user/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

export const deleteManyUser = async (data, access_token) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/delete-many`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

// export const refreshToken = async () => {
//     const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/user/refresh_token`,
//         {
//             withCredentials: true,
//         },
//     );
//     return res.data;
// };

export const refreshToken = async (refreshToken) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/refresh_token`,
        {},
        {
            headers: {
                token: `Bearer ${refreshToken}`,
            },
        },
    );
    return res.data;
};

export const checkAndRefreshToken = async () => {
    let access_token = JSON.parse(localStorage.getItem('access_token'));
    if (!access_token) return null;

    const decoded = jwtDecode(access_token);
    const currentTime = new Date().getTime() / 1000;

    if (decoded.exp < currentTime) {
        const data = await refreshToken();
        access_token = data.access_token;
        localStorage.setItem('access_token', JSON.stringify(access_token));
    }
    return access_token;
};

export const logoutUser = async () => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/log-out`,
    );
    return res.data;
};
