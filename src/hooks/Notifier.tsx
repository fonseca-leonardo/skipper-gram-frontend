import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar, OptionsObject, SnackbarKey } from 'notistack';
import { removeSnackbar } from '../redux/actions';

let displayed: Array<SnackbarKey> = [];

interface IStore {
    app: {
        notifications: Array<INotification>
    }
}

interface INotification {
    key: string;
    message: string;
    options: OptionsObject,
    dismissed: boolean;
}

const Notifier: React.FC = () => {
    const dispatch = useDispatch();
    const notifications: Array<INotification> = useSelector<IStore, Array<any>>(store => store.app.notifications || []);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const storeDisplayed = (id: SnackbarKey) => {
        displayed = [...displayed, id];
    };

    const removeDisplayed = (id: SnackbarKey) => {
        displayed = [...displayed.filter(key => id !== key)];
    };

    useEffect(() => {
        notifications.forEach(({ key, message, options, dismissed }) => {
            if(dismissed) {
                closeSnackbar(key)

                return;
            }

            if (displayed.includes(key)) return;

            enqueueSnackbar(message, {
                key,
                ...options,
                onClose: (event, reason, myKey) => {
                    if (options.onClose) {
                        options.onClose(event, reason, myKey);
                    }
                },
                onExited: (event, myKey) => {
                    // remove this snackbar from redux store
                    dispatch(removeSnackbar(myKey));
                    removeDisplayed(myKey);
                },
            });

            storeDisplayed(key);
        })
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

    return null;
}

export default Notifier;