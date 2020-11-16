import React, { useContext } from "react";
import { Tabs } from "antd";
import { UserOutlined, UsergroupDeleteOutlined, KeyOutlined, NotificationOutlined, AppstoreOutlined } from "@ant-design/icons";
import UserC from './components/UserC'
import { SchemeManageC } from './components/SchemeC'
import { GroupManagementC } from './components/GroupC'
import { NotifiManageC } from './components/NotificationC'
import { TokenManagementC } from './components/TokenC'
import Context from "../../../Utility/Reduxx";
import { Translator } from '../../../i18n/index'


const { TabPane } = Tabs;

const ManagementC = () => {

  const { state } = useContext(Context);
  const cid = localStorage.getItem('authUser.cid')
  const show = cid ==='proscend' && state.Login.Cid === ''
  return (
    <Tabs defaultActiveKey="User">
      <TabPane
        tab={
          <span>
            <UserOutlined />
            {Translator("ISMS.User")}
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
           {Translator("ISMS.Group")}
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
           {Translator("ISMS.Token")}
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
           {Translator("ISMS.Notification")}
          </span>
        }
        key="Notification"
      >
        <NotifiManageC/>
      </TabPane>
      <TabPane
        tab={
          <span>
            <AppstoreOutlined />
           {Translator("ISMS.Scheme")}
          </span>
        }
        key="scheme"
      >
        <SchemeManageC/>
      </TabPane>
    </Tabs>
  //   <Tabs defaultActiveKey="User">
  //   <TabPane
  //     tab={
  //       <span>
  //         <UserOutlined />
  //        {Translator("ISMS.User")}
  //       </span>
  //     }
  //     key="User"
  //   >
  //     <UserC/>
  //   </TabPane>
  // </Tabs>
  );
};

export default ManagementC;