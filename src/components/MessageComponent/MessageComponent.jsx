import { Bounce, toast } from 'react-toastify';

const toastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
};

const success = (mes = 'Success') => {
    toast.success(mes, toastOptions);
};

const error = (mes = 'Error') => {
    toast.error(mes, toastOptions);
};

const warning = (mes = 'Warning') => {
    toast.warning(mes, toastOptions);
};
export { success, error, warning };
