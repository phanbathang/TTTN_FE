import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { routes } from './routes';
import { isJsonString } from './ultils';
import { jwtDecode } from 'jwt-decode';
import * as UserService from './services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/slides/userSlide';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    useEffect(() => {
        const fetchUserDetails = async () => {
            const { decoded } = handleDecoded();
            if (decoded?.id) {
                const access_token = await UserService.checkAndRefreshToken();
                if (access_token) {
                    await handleGetDetailUser(decoded.id, access_token);
                }
            }
        };
        fetchUserDetails();
    }, []);

    const handleDecoded = () => {
        let storageData = localStorage.getItem('access_token');
        let decoded = {};
        if (storageData && isJsonString(storageData)) {
            storageData = JSON.parse(storageData);
            decoded = jwtDecode(storageData);
        }
        return { decoded, storageData };
    };

    // UserService.axiosJWT.interceptors.request.use(
    //     async (config) => {
    //         const currentTime = new Date();
    //         const { decoded } = handleDecoded();
    //         if (decoded?.exp < currentTime.getTime() / 1000) {
    //             const data = await UserService.refreshToken();
    //             config.headers['token'] = `Bearer ${data?.access_token}`;
    //         }
    //         return config;
    //     },
    //     (err) => {
    //         return Promise.reject(err);
    //     },
    // );

    const handleGetDetailUser = async (id, token) => {
        let storageRefreshToken = localStorage.getItem('refresh_token');
        const refreshToken = JSON.parse(storageRefreshToken);
        const res = await UserService.getDetailUser(id, token);
        dispatch(
            updateUser({
                ...res?.data,
                access_token: token,
                refreshToken: refreshToken,
            }),
        );
    };

    return (
        // <div>
        //     <Router>
        //         <Routes>
        //             {routes.map((route) => {
        //                 const Page = route.page;
        //                 const isCheckAuth = !route.isPrivate || user.isAdmin;
        //                 const Layout = route.isShowHeader
        //                     ? DefaultComponent
        //                     : Fragment;
        //                 return (
        //                     <Route
        //                         key={route.path}
        //                         path={isCheckAuth && route.path}
        //                         element={
        //                             <Layout>
        //                                 <Page />
        //                             </Layout>
        //                         }
        //                     />
        //                 );
        //             })}
        //         </Routes>
        //     </Router>
        //     <ToastContainer />
        // </div>
        <div>
            <Router>
                <Routes>
                    {routes.map((route) => {
                        const Page = route.page;
                        const isCheckAuth = !route.isPrivate || user.isAdmin;

                        // Kiểm tra xem route.path có phải là chuỗi hợp lệ hay không
                        const path =
                            typeof route.path === 'string' &&
                            route.path.trim() !== ''
                                ? route.path
                                : '/';

                        const Layout = route.isShowHeader
                            ? DefaultComponent
                            : Fragment;

                        return (
                            <Route
                                key={path} // Dùng path đã kiểm tra
                                path={isCheckAuth ? path : '/'} // Đảm bảo rằng path là hợp lệ
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </Router>
            <ToastContainer />
        </div>
    );
}
export default App;
