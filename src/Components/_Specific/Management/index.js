import React, { useContext } from "react";
import { Tabs } from "antd";
import { UserOutlined, UsergroupDeleteOutlined, KeyOutlined, NotificationOutlined  } from "@ant-design/icons";
import { GiUpgrade } from 'react-icons/gi'
import UserC from './components/UserC'
import { SchemeManageC } from './components/SchemeC'
import { GroupManagementC } from './components/GroupC'
import { NotifiManageC } from './components/NotificationC'
import { TokenManagementC } from './components/TokenC'
import Context from "../../../Utility/Reduxx";

const { TabPane } = Tabs;

const ManagementC = () => {

  const { state } = useContext(Context);
  const cid = localStorage.getItem('authUser.cid')
  const show = cid ==='proscend' && state.Login.Cid === ''
  return (
    show ? <Tabs defaultActiveKey="User">
      <TabPane
        tab={
          <span>
            <UserOutlined />
           User
          </span>
        }
        key="User"
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
        key="token"
      >
        <TokenManagementC/>
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
        <NotifiManageC/>
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
    </Tabs> :
    <Tabs defaultActiveKey="User">
    <TabPane
      tab={
        <span>
          <UserOutlined />
         User
        </span>
      }
      key="User"
    >
      <UserC/>
    </TabPane>
  </Tabs>
  );
};

export default ManagementC;