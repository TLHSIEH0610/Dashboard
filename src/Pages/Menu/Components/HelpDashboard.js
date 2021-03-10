import React, { Fragment } from "react";
import { Descriptions } from "antd";

import styles from "../menu.module.scss";


const HelpDashboard = () => {
  return (
    <div className={styles.helpContainer}>
      <h2 className={styles.title}>Overview</h2>
      <p>A draggable and dropable dashboard which can be highly customized and enable users to display a bunch of statistical data through charts or maps.  </p>
      <img
      alt=''
        className={styles.dashboardIMG}
        src={require("../../../image/dashboard.png")}
      />

      <Descriptions
        // title="Router Information"
        className={styles.Description}
        bordered={true}
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Item" className={styles.tableheader}>
          Description
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>1</span><span>Health</span></Fragment>}>
         <p>Summary of devices' health in the form of pie-chart.</p>
          <p>Up: Equal to device status: Up</p>
          <p>Warning: Equal to device status: Warning</p>
          <p>Critical: Equal to device status: Fatal or Error</p>
          <p>Offline: Equal to device status: Offline</p>
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>2</span><span>Signal</span></Fragment>}>
        <p>Summary of devices' signal in the form of pie-chart.</p>
          <p>Excellent: rssi: larger than -65 dbm </p>
          <p>Good: rssi: -75 dbm ~ - -65 dbm </p>
          <p>Fair: rssi: -85 dbm ~ - -75 dbm</p>
          <p>Poor: rssi: smaller than -85 dbm</p>
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>3</span><span>Router with Flow</span></Fragment>}>
          The number of routers that have flow set.
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>4</span><span>Flow Number</span></Fragment>}>
        The number of flows sum from routers
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>5</span><span>Map</span></Fragment>}>
          Enable user to display devices on the map with basic pop-up information. Scroll to zoom in/out.
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>6</span><span>Refresh</span></Fragment>}>
          Refresh to get last data.
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>7</span><span>Edit Dashboard</span></Fragment>}>
          <p>Customerized your own dashboard by selecting the items you want to show</p>
          <img
          alt=''
            // className={styles.dashboardIMG}
            src={require("../../../image/dashboardSelect.png")}
      />
        </Descriptions.Item>
      </Descriptions>






      
    </div>
  );
};

export default HelpDashboard;
