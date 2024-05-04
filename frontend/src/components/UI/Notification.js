import React, { useMemo } from "react";
import { Button, Divider, notification, Space } from "antd";

const Context = React.createContext({
  name: "Default",
});

function Notification() {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.info({
      message: `Cart`,
      description: "Item added to the cart",
      placement,
    });
  };
  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );
  return (
    <Context.Provider value={contextValue}>
      {contextHolder}

      <Button type="primary" onClick={() => openNotification("bottomLeft")}>
        bottomLeft
      </Button>
    </Context.Provider>
  );
}

export default Notification;
