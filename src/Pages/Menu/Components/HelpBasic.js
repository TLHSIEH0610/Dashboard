import React, { Fragment } from "react";
import { Descriptions, Divider } from "antd";

import styles from "../menu.module.scss";

const HelpBasic = () => {
  return (
    <div className={styles.helpContainer}>
      <h2 className={styles.title}>O'smart  Ver.1.0 User Guide</h2>
      <p>The O'smart management system is designed and developed based on SPA(single page application) which provides faster transitions that make the website feel more like a native app.
      You can get more information in detail by going through the topics that list on the left slide.
      </p>

      <img
      alt=''
        className={styles.permissionIMG}
        src={require("../../../image/basic.png")}
      />
      <Descriptions
        // title="Web Guide"
        className={styles.Description}
        bordered={true}
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Item" className={styles.tableheader}>
          Description
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>1</span><span>Dashboard</span></Fragment>}>
            <p>A draggable & dropable dashboard constains statistical information which is analyzed from your devices</p>
        </Descriptions.Item>
        <Descriptions.Item label= {<Fragment><span className={styles.index}>2</span><span>Topology</span></Fragment>}>
            <p>Devices page: Provide a simple UI that users can quickly review devices' status including alarm, health, signal, GPS, IoT, and so on.</p>
            <p>Router Status page: To view your device status in a more detailed way</p>
            <p>Setting page: Get/Set from your current devices through O'smart. Buck setting is also supported.</p>
        </Descriptions.Item>
        <Descriptions.Item label= {<Fragment><span className={styles.index}>3</span><span>Upgrade</span></Fragment>}>
            <p>Upgrade page: devices upgrade, backup, and restore can be operated here. In addition, O'smart will record actions that users made so that you can view all the activity history on the web as well</p>
            <p>Repository page: Each customer can have their own file repository which provides a space to upload and manage your files easily. </p>
        </Descriptions.Item>
        <Descriptions.Item label= {<Fragment><span className={styles.index}>4</span><span>Management</span></Fragment>}>
            <p>Manage any information related to User setting such as company information, users, device groups, device token, alarm notification.. et cetera. </p>
        </Descriptions.Item>
        <Descriptions.Item label= {<Fragment><span className={styles.index}>5</span><span>Statistical Info</span></Fragment>}>
            <p>Statistic of your current devices which their health is up and the signal is excellent</p>
        </Descriptions.Item>
        <Descriptions.Item label= {<Fragment><span className={styles.index}>6</span><span>Login User</span></Fragment>}>
            <p>Current user on log</p>
        </Descriptions.Item>
 
      </Descriptions>
    <Divider/>
      <h2 className={styles.title} style={{marginTop:'15px'}}>Permission level</h2>
      <p>Osmart's user privilege can be divided into 5 different levels with permission strickly constrain as the table below. This could makes user access a more easy way to manage.</p>
      <img
      alt=''
        className={styles.permissionIMG}
        src={require("../../../image/permission_level.png")}
      />
    </div>
  );
};

export default HelpBasic;
