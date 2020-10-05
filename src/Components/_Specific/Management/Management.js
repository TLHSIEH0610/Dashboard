import React, { useState } from "react";
import { Modal, Button, Space, Tabs } from "antd";
// import Swal from 'sweetalert2'
// import { useHistory } from "react-router-dom";
// import { UserLogin } from '../../../Utility/Fetch'
// // import Context from '../../../Utility/Reduxx'
import { UserOutlined, UsergroupDeleteOutlined, KeyOutlined, NotificationOutlined, ControlOutlined  } from "@ant-design/icons";
import {GiUpgrade} from 'react-icons/gi'
import styles from "./management.module.scss";
import UserC from './user'
import NodeReNameC from './NodeRename'
import SchemeManageC from './scheme'
import GroupManagementC from './group'

const { TabPane } = Tabs;

const ManagementC = () => {
  return (
    <Tabs defaultActiveKey="group">
      <TabPane
        tab={
          <span>
            <UserOutlined />
           User
          </span>
        }
        key="1"
      >
        <UserC/>
      </TabPane>
      <TabPane
        tab={
          <span>
            <UsergroupDeleteOutlined />
           Group
          </span>
        }
        key="group"
      >
        <GroupManagementC/>
      </TabPane>
      <TabPane
        tab={
          <span>
            <KeyOutlined />
           Token
          </span>
        }
        key="3"
      >
        token {/* <UserC2/> */}
      </TabPane>
      <TabPane
        tab={
          <span>
            <NotificationOutlined />
           Notification
          </span>
        }
        key="Notification"
      >
        Tab 4
      </TabPane>
      <TabPane
        tab={
          <span>
            <GiUpgrade />
           scheme
          </span>
        }
        key="scheme"
      >
        <SchemeManageC/>
      </TabPane>
      <TabPane
        tab={
          <span>
            <ControlOutlined />
           NodeName
          </span>
        }
        key="NodeName"
      >
        <NodeReNameC/>
      </TabPane>
    </Tabs>
  );
};

export default ManagementC;
