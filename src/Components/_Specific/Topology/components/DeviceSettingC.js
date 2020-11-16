import React, { useEffect, useState } from "react";
import styles from "../topology.module.scss";
import { useHistory } from "react-router-dom";
import {
  LanSettingMF,
  WanSettingMF,
  LteSettingMF,
  PeriodSettingMF
} from "./DeviceSettingF";
import { Modal, Tabs, Alert, Spin, Empty } from "antd";
import axios from "axios";
import { UserLogOut } from "../../../../Utility/Fetch";
// import { useForm } from "antd/lib/form/Form";

const { TabPane } = Tabs;

const DeviceSettingC = ({
  DeviceSettingvisible,
  setDeviceSettingvisible,
  record,
  setRecord
}) => {
  const history = useHistory();
  const [DeviceConfig, setDeviceConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [haveContent, setHaveContent] = useState(false)

  useEffect(() => {
    if (record.id) {
      console.log(record)
      setHaveContent(false)
      setLoading(true);
      
      const url = `/cmd?get={"device_cfg":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{"report_period":{},"lan":{},"wan":{},"lte":{}}}}`;

      axios
        .get(url)
        .then((res) => {
          // console.log(loading, haveContent)
          if(res.data.response.device_cfg[0].obj !== "No Response!"){
            setDeviceConfig(res.data.response.device_cfg[0].obj);
            setHaveContent(true)
          }else{
            setHaveContent(false)

          }
          setLoading(false);  
          console.log(res.data)
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
      onCancel={() => {setDeviceSettingvisible(false); setRecord({id:null});}}
      destroyOnClose={true}
      className={styles.modal}
      centered={true}
      footer={null}
    >
      {DeviceConfig && !loading  ? (
        <Tabs defaultActiveKey="1">
          {/* <TabPane tab="Identity" key="identity" className={styles.tabpane}>
              <IdentityTableMF DeviceConfig={DeviceConfig} setUploading={setUploading} uploading={uploading}/>
          </TabPane> */}
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
          <TabPane tab="Period" key="period" className={styles.tabpane}>
            <PeriodSettingMF
              id={record.id}
              setUploading={setUploading} uploading={uploading}
              DeviceConfig={DeviceConfig}
            />
          </TabPane>
        </Tabs>
      ) : (
        !haveContent && loading?
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
        :
        <Empty description={
          <span>
            No Data
          </span>
        }/> 
      )}
    </Modal>
  );
};

export const DeviceSettingMC = React.memo(DeviceSettingC) ;
