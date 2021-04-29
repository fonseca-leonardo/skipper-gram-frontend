import { SnackbarKey, OptionsObject } from "notistack";

export const ENQUEUE_SNACKBAR = "ENQUEUE_SNACKBAR";
export const CLOSE_SNACKBAR = "CLOSE_SNACKBAR";
export const REMOVE_SNACKBAR = "REMOVE_SNACKBAR";

interface INotification {
  key: string;
  message: string;
  options: OptionsObject;
  dismissed: boolean;
}

export const enqueueSnackbar = (notification: INotification) => {
  const key = notification.options && notification.options.key;

  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random(),
    },
  };
};

export const closeSnackbar = (key: SnackbarKey) => ({
  type: CLOSE_SNACKBAR,
  dismissAll: !key,
  key,
});

export const removeSnackbar = (key: SnackbarKey) => ({
  type: REMOVE_SNACKBAR,
  key,
});
