import React from "react";
import { Outlet } from "react-router-dom";
// import { MenuOutlined } from "@ant-design/icons"; // Ant Design's menu icon
// import { Drawer, Menu, Select } from "antd";

const Layout: React.FC = () => {
   return (
      <div>
         <div>
            <Outlet />
         </div>
      </div>
   );
};

export default Layout;
