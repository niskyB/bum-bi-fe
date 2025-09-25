import { useContext } from "react";
import {
  ArgsProps,
  NotificationInstance,
} from "antd/es/notification/interface";
import { NotificationContext } from "main/HOC/NotificationWrapper";

export const useNotification = () => {
  const { api } = useContext(NotificationContext);

  const openNotification = (
    type: keyof Omit<NotificationInstance, "destroy">,
    props: ArgsProps
  ) => {
    api[type]({ ...props, placement: "topRight" });
  };

  return { openNotification };
};
