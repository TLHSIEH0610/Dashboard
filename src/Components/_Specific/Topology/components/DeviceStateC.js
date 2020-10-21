import React from "react";
import { Modal, Tabs, Button } from "antd";
import styles from "../topology.module.scss";

import {
  StatusStrength,
  StatusGPS,
  StatusDNS,
  StatusConnection,
  TxRxStatistic,
} from "./DeviceStateF";

const { TabPane } = Tabs;
const DeviceStateC = ({ record, setDeviceStatevisible, DeviceStatevisible }) => {


  return (
    <Modal
      visible={DeviceStatevisible}
      onCancel={() => setDeviceStatevisible(false)}
      centered={true}
      width={"50%"}
      footer={[
        <Button
          key="confirm"
          type="primary"
          onClick={() => setDeviceStatevisible(false)}
        >
          Confirm
        </Button>
    ]}
    >
      <Tabs defaultActiveKey="1" className={styles.Tabs}>
        <TabPane tab="Statistic" key="1" className={styles.tabpane}>
          <TxRxStatistic dataSource={record} />
        </TabPane>
        <TabPane tab="Connection" key="2" className={styles.tabpane}>
          <StatusConnection dataSource={record} className={styles.connection}/>
        </TabPane>
        <TabPane tab="Strength" key="3" className={styles.tabpane}>
          <StatusStrength dataSource={record} />
        </TabPane>
        <TabPane tab="GPS" key="4" className={styles.tabpane}>
          <StatusGPS dataSource={record} />
        </TabPane>
        <TabPane tab="DNS" key="5" className={styles.tabpane}>
          <StatusDNS dataSource={record} />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default DeviceStateC;
