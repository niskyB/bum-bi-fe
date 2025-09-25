"use client";

import { createContext, FC, PropsWithChildren } from "react";
import { notification } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";

interface NotificationWrapperProps extends PropsWithChildren {}

interface NotificationContextProps {
  api: NotificationInstance;
}

export const NotificationContext = createContext<NotificationContextProps>(
  {} as NotificationContextProps
);

const NotificationWrapper: FC<NotificationWrapperProps> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={{ api }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationWrapper;
