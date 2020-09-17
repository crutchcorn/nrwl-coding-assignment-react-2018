import * as React from 'react';
import './snackbar.css';

interface SnackbarProps {
    message: string;
    show: boolean;
    setShow: (val: boolean) => void;
}

export const Snackbar = ({message, show, setShow}: SnackbarProps) => {
    React.useEffect(() => {
        if (!show) return;
        const timeout = setTimeout(() => {
            setShow(false);
        }, 3500)

        return () => clearTimeout(timeout);
    }, [show]);

    return !show ? null :
        <p className="successSnackbar" aria-live="assertive">
            {message}
        </p>
}
