import React, { useEffect, useState } from "react";
import { Modal, Tabs, Spin, Alert } from "antd";
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

  useEffect(() => {
    if (record.id) {
      const DeviceStatusUrl = `/cmd?get={"device_status":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{}}}`;
      setUploading(true);
      axios
        .get(DeviceStatusUrl)
        .then((res) => {
          // console.log(res);
          setDeviceStatus(res.data.response.device_status[0].obj);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          setUploading(false);
          if (error.response.status === 401) {
            UserLogOut();
            history.push("/login");
          }
        });
    }
  }, [record.id]);

  useEffect(() => {
    if (record.id) {
      const DeviceStatusUrl = `/cmd?get={"device_identity":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{}}}`;
      setUploading(true);
      axios
        .get(DeviceStatusUrl)
        .then((res) => {
          // console.log(res);
          setDeviceIdentity(res.data.response.device_identity[0].obj.identity);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          setUploading(false);
          if (error.response.status === 401) {
            UserLogOut();
            history.push("/login");
          }
        });
    }
  }, [record.id]);

  return (
    <Modal
      visible={DeviceStatevisible}
      onCancel={() => {setDeviceStatevisible(false); setRecord({id:null})}}
      destroyOnClose={true}
      className={styles.modal}
      footer={null}
      // footer={[
      //   <Button
      //     key="confirm"
      //     type="primary"
      //     onClick={() => setDeviceStatevisible(false)}
      //   >
      //     Confirm
      //   </Button>,
      // ]}
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
