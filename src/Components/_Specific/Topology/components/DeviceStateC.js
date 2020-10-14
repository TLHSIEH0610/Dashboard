import React from "react";
import { Modal, Tabs } from "antd";
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
      onOk={() => setDeviceStatevisible(false)}
      onCancel={() => setDeviceStatevisible(false)}
      okText="confirm"
      cancelText="cancel"
      centered={true}
      width={"50%"}
      className={styles.modal}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Statistic" key="1" className={styles.tabpane}>
          <TxRxStatistic dataSource={record} />
        </TabPane>
        <TabPane tab="Connection" key="2" className={styles.tabpane}>
          <StatusConnection dataSource={record} />
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
