import React, { Fragment } from "react";
import DashboardIoTC from "../../Components/_Specific/Dashboard/Components/DashboardIoT";
import { Breadcrumb } from "antd";
import { useHistory } from 'react-router-dom'
// import DashboardMap from "../../Components/_Specific/Dashboard/Components/DashboardMap";
// import styles from './index.module.scss'

const IoTGuage = () => {
  const history = useHistory();

  return (
    <Fragment>
      <Breadcrumb style={{ marginBottom: "20px" }}>
        <Breadcrumb.Item style={{ fontWeight: 500, fontSize: 16 }}>
          <a href="/#" onClick={() => history.push("./")}>
            Dashboard
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item
          style={{ color: "#1890ff", fontWeight: 500, fontSize: 16 }}
        >
          IoT_Device_Guage
        </Breadcrumb.Item>
      </Breadcrumb>
      <DashboardIoTC />
    </Fragment>
  );
};

export default IoTGuage;
