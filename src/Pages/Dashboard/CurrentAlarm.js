import React, { Fragment } from "react";
import DashboardAlarmC from "../../Components/_Specific/Dashboard/Components/DashboardAlarm";
import DashboardAlarmLogC from "../../Components/_Specific/Dashboard/Components/DashboardAlarmLog";
import { Tabs, Breadcrumb } from "antd";
import { useHistory } from 'react-router-dom'
// import DashboardMap from "../../Components/_Specific/Dashboard/Components/DashboardMap";
// import styles from './index.module.scss'
const { TabPane } = Tabs;
const CurrentAlarm = () => {
  const history = useHistory()
  return (
    <Fragment>
      <Breadcrumb style={{ marginBottom:'20px' }}>
        <Breadcrumb.Item style={{ fontWeight: 500, fontSize:16 }}>
            <a href="/#" onClick={()=>history.push('./')}>Dashboard</a>
         </Breadcrumb.Item>
        <Breadcrumb.Item style={{color:'#1890ff', fontWeight: 500, fontSize:16 }}>Alarm</Breadcrumb.Item>
      </Breadcrumb>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Current Alarm" key="1">
          <DashboardAlarmC />
        </TabPane>
        <TabPane tab="History" key="2">
          <DashboardAlarmLogC />
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

export default CurrentAlarm;
