import React, { useEffect, useState } from "react";
import { Modal, Tabs, Button, Spin, Alert } from "antd";
import styles from "../topology.module.scss";
import axios from 'axios'
// import useURLloader from "../../../../hook/useURLloader";
import {
  StatusStrengthMF,
  StatusGPSMF,
  StatusDNSMF,
  StatusConnectionMF,
  TxRxStatisticMF,
} from "./DeviceStateF";

const { TabPane } = Tabs;

const DeviceStateC = ({ record, setDeviceStatevisible, DeviceStatevisible }) => {
  const [DeviceStatus, setDeviceStatus] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(()=>{
    if(record.id){
    const DeviceStatusUrl=`/cmd?get={"device_status":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{}}}`
    setUploading(true)
    axios.get(DeviceStatusUrl).then((res)=>{
      console.log(res)
      setDeviceStatus(res.data.response.device_status[0].obj)
      setUploading(false)
    }).catch((erro)=>{
      console.log(erro)
      setUploading(false)
    })}
  }, [record])



  return (
    <Modal
      visible={DeviceStatevisible}
      onCancel={() => setDeviceStatevisible(false)}
      destroyOnClose={true}
      className={styles.modal}
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
      {DeviceStatus.status ? <Tabs defaultActiveKey="1" className={styles.Tabs}>
        <TabPane tab="Statistic" key="1" className={styles.tabpane}>
          <TxRxStatisticMF uploading={uploading} DeviceStatus={DeviceStatus} />
        </TabPane>
        <TabPane tab="Connection" key="2" className={styles.tabpane}>
          <StatusConnectionMF uploading={uploading} DeviceStatus={DeviceStatus} className={styles.connection}/>
        </TabPane>
        <TabPane tab="Strength" key="3" className={styles.tabpane}>
          <StatusStrengthMF uploading={uploading} DeviceStatus={DeviceStatus} />
        </TabPane>
        <TabPane tab="GPS" key="4" className={styles.tabpane}>
          <StatusGPSMF uploading={uploading} DeviceStatus={DeviceStatus} />
        </TabPane>
        <TabPane tab="DNS" key="5" className={styles.tabpane}>
          <StatusDNSMF uploading={uploading} DeviceStatus={DeviceStatus} />
        </TabPane>
      </Tabs> : <Spin tip="Loading...">
    <Alert
      message="Getting Data"
      description="We are now getting data from server, please wait for a few seconds"
    />
  </Spin>}
    </Modal>
  );
};

export const DeviceStateMC = React.memo(DeviceStateC);
