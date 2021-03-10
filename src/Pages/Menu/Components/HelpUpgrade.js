import React, { Fragment } from "react";
import styles from "../menu.module.scss";
import {
  Divider,
  Descriptions
} from "antd";




const HelpUpgrade = ({}) => {
  return (
    <div className={styles.helpContainer}>
      <h2 className={styles.title}>Overview</h2>
      <p>Allow users to upgrade/backup/restore devices</p>  
      <Divider/>
  <h2 className={styles.title}>Action Request</h2>
  
  <img
  alt=''
        className={styles.actionRequest}
        src={require("../../../image/actionRequest.png")}
      />
      <Descriptions
        className={styles.Description}
        bordered={true}
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Item" className={styles.tableheader}>
          Description
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>1</span><span>Model</span></Fragment>}>
        <p>Select a model</p>
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>2</span><span>Device</span></Fragment>}>
        <p>Select devices which you want to operate</p>
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>3</span><span>Action</span></Fragment>}>
        <p>Select an action</p>
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>4</span><span>File</span></Fragment>}>
        <p>Select a file that corresponds to your action from the repository.(see table below)</p>
          <img
          alt=''
            className={styles.actiontype}
            src={require("../../../image/actiontype.png")}
          />
        </Descriptions.Item>
      </Descriptions>

      <Divider/>

      <h2 className={styles.title}>Action Status</h2>
      <p>View operations history submitted from Action Request</p>  
      <img
      alt=''
        className={styles.actionStatus}
        src={require("../../../image/actionStatus.png")}
      />
      <Descriptions
        className={styles.Description}
        bordered={true}
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Item" className={styles.tableheader}>
          Description
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>1</span><span>FileName</span></Fragment>}>
          <p>File that you chose for upgrade/restore</p>
        </Descriptions.Item>
        <Descriptions.Item label={<Fragment><span className={styles.index}>2</span><span>Status</span></Fragment>}>
          <p>Progress of your action can be stated as the table</p>
          <img
          alt=''
          className={styles.actionStatus2}
          src={require("../../../image/actionStatus2.png")}
        />
        </Descriptions.Item>

      </Descriptions>

    </div>
  );
};

export default HelpUpgrade;
