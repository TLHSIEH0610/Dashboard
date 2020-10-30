import React, { useEffect, useState } from "react";
import styles from "../topology.module.scss";
import { useHistory } from "react-router-dom";
import {
  LanSettingMF,
  WanSettingMF,
  LteSettingMF,
  IdentityTableMF,
} from "./DeviceSettingF";
import { Modal, Tabs, Alert, Spin, Button } from "antd";
import axios from "axios";
import { UserLogOut } from "../../../../Utility/Fetch";
// import { useForm } from "antd/lib/form/Form";

const { TabPane } = Tabs;

const DeviceSettingC = ({
  DeviceSettingvisible,
  setDeviceSettingvisible,
  record,
}) => {
  const history = useHistory();
  const [DeviceConfig, setDeviceConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (record.id) {
      setLoading(true);
      const url = `/cmd?get={"device_cfg":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{"identity":{},"lan":{},"wan":{},"lte":{}}}}`;
      console.log(url)
      axios
        .get(url)
        .then((res) => {
          setDeviceConfig(res.data.response.device_cfg[0].obj);
          console.log(res.data.response.device_cfg.obj);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response.status === 401) {
            UserLogOut();
            history.push("/login");
          }
        });
    }
  }, [record.id, uploading]);

  return (
    <Modal
      visible={DeviceSettingvisible}
      onOk={() => setDeviceSettingvisible(false)}
      onCancel={() => setDeviceSettingvisible(false)}
      destroyOnClose={true}
      className={styles.modal}
      centered={true}
      width={"55%"}
      footer={[
        <Button
          key="ok"
          type="primary"
          loading={loading || uploading}
          onClick={() => {
            setDeviceSettingvisible(false);
          }}
        >
          Confirm
        </Button>,
      ]}
    >
      {DeviceConfig && !loading  ? (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Identity" key="identity" className={styles.tabpane}>
            {/* <Card bordered={false} loading={uploading}> */}
              <IdentityTableMF DeviceConfig={DeviceConfig} setUploading={setUploading} uploading={uploading}/>
            {/* </Card> */}
          </TabPane>
          <TabPane tab="LAN" key="lan" className={styles.tabpane}>
            <LanSettingMF
              setUploading={setUploading} uploading={uploading}
              DeviceConfig={DeviceConfig}
              id={record.id}
            />
          </TabPane>
          <TabPane tab="WAN" key="wan" className={styles.tabpane}>
            <WanSettingMF
              setUploading={setUploading} uploading={uploading}
              DeviceConfig={DeviceConfig}
              id={record.id}
            />
          </TabPane>
          <TabPane tab="LTE" key="lte" className={styles.tabpane}>
            <LteSettingMF
              id={record.id}
              setUploading={setUploading} uploading={uploading}
              DeviceConfig={DeviceConfig}
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

export const DeviceSettingMC = React.memo(DeviceSettingC) ;
