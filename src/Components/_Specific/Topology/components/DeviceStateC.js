import React, { useEffect, useState, useContext } from "react";
import { Modal, Tabs, Spin, Alert, Button } from "antd";
import styles from "../topology.module.scss";
import axios from "axios";
// import useURLloader from "../../../../hook/useURLloader";
import {
  StatusStrengthMF,
  StatusGPSMF,
  StatusDNSMF,
  StatusConnectionMF,
  TxRxStatisticMF,
  IdentityTableMF,
} from "./DeviceStateF";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from 'react-router-dom'
import Context from "../../../../Utility/Reduxx";

const { TabPane } = Tabs;

const DeviceStateC = ({
  record,
  setDeviceStatevisible,
  DeviceStatevisible,
  setRecord
}) => {
  const [DeviceStatus, setDeviceStatus] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [DeviceIdentity, setDeviceIdentity] = useState([]);
  const history = useHistory()
  const { dispatch } = useContext(Context);
  
  useEffect(() => {
    if (record.id) {
      setUploading(true)
      const config1 = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        url: '/cmd',
        data: JSON.parse(`{"get":{"device_status":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{}}}}`),
      }
      const config2 = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        url: '/cmd',
        data: JSON.parse(`{"get":{"device_identity":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{}}}}`),
      }
      function DeviceStatusUrl() {
        return axios(config1)
      }
      function DeviceIdentityUrl() {
        return axios(config2)
      }
      axios.all([DeviceStatusUrl(), DeviceIdentityUrl()])
      .then(axios.spread((acct, perms) => {
        setDeviceStatus(acct.data.response.device_status[0].obj);
        setDeviceIdentity(perms.data.response.device_identity[0].obj.identity);
        setUploading(false);
      }))
      .catch((error) => { 
        console.error(error)
        setUploading(false);
        if (error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.id]);

  return (
    <Modal
      visible={DeviceStatevisible}
      onCancel={() => {setDeviceStatevisible(false); setRecord({id:null})}}
      destroyOnClose={true}
      className={styles.modal}
      // footer={null}
      footer={[
        <Button
          key="confirm"
          type="primary"
          onClick={() => setDeviceStatevisible(false)}
        >
          Confirm
        </Button>,
      ]}
    >
      {DeviceStatus.status && !uploading ? (
        <Tabs defaultActiveKey="1" className={styles.Tabs}>
          <TabPane tab="Statistic" key="1" className={styles.tabpane}>
            <TxRxStatisticMF
              uploading={uploading}
              DeviceStatus={DeviceStatus}
            />
          </TabPane>
          <TabPane tab="Connection" key="2" className={styles.tabpane}>
            <StatusConnectionMF
              uploading={uploading}
              DeviceStatus={DeviceStatus}
              className={styles.connection}
            />
          </TabPane>
          <TabPane tab="Strength" key="3" className={styles.tabpane}>
            <StatusStrengthMF
              uploading={uploading}
              DeviceStatus={DeviceStatus}
            />
          </TabPane>
          <TabPane tab="GPS" key="4" className={styles.tabpane}>
            <StatusGPSMF uploading={uploading} DeviceStatus={DeviceStatus} />
          </TabPane>
          <TabPane tab="DNS" key="5" className={styles.tabpane}>
            <StatusDNSMF uploading={uploading} DeviceStatus={DeviceStatus} />
          </TabPane>
          <TabPane tab="Identity" key="6" className={styles.tabpane}>
            <IdentityTableMF
              DeviceIdentity={DeviceIdentity}
              uploading={uploading}
            />
          </TabPane>
        </Tabs>
      ) : (
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
      )}
    </Modal>
  );
};

export const DeviceStateMC = React.memo(DeviceStateC);
