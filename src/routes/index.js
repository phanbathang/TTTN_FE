import AdminPage from '../pages/AdminPage/AdminPage';
import DetailOrderPage from '../pages/DetailOrderPage/DetailOrderPage';
import HomePage from '../pages/HomePage/HomePage';
import MyOrderPage from '../pages/MyOrderPage/MyOrderPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import OrderPage from '../pages/OrderPage/OrderPage';
import OrderSuccessPage from '../pages/OrderSuccessPage/OrderSuccessPage';
import PaymentPage from '../pages/PaymentPage/PaymentPage';
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProfileUser from '../pages/ProfileUser/ProfileUser';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage';
import WishListPage from '../pages/WishListPage/WishListPage';

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },

    {
        path: '/wishlist',
        page: WishListPage,
        isShowHeader: true,
    },

    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
    },

    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
    },

    {
        path: '/orderSuccess',
        page: OrderSuccessPage,
        isShowHeader: true,
    },

    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true,
    },

    {
        path: '/detailOrder/:id',
        page: DetailOrderPage,
        isShowHeader: true,
    },

    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true,
    },

    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
    },

    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false,
    },

    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,
    },

    {
        path: '/product-detail/:id',
        page: ProductDetailPage,
        isShowHeader: true,
    },

    {
        path: '/profile-user',
        page: ProfileUser,
        isShowHeader: true,
    },

    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true,
    },

    {
        path: '*',
        page: NotFoundPage,
    },
];
