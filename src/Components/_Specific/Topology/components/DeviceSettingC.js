import React, { useEffect, useState, useContext } from "react";
import styles from "../topology.module.scss";
import { useHistory } from "react-router-dom";
import {
  LanSettingMF,
  WanSettingMF,
  LteSettingMF,
  PeriodSettingMF,
  GPSSettingMF
} from "./DeviceSettingF";
import { Modal, Tabs, Alert, Spin, Empty, Form, Button } from "antd";
import axios from "axios";
import { UserLogOut } from "../../../../Utility/Fetch";
import Context from "../../../../Utility/Reduxx";

const { TabPane } = Tabs;

const DeviceSettingC = ({
  DeviceSettingvisible,
  setDeviceSettingvisible,
  record,
  setRecord,
}) => {
  const { dispatch } = useContext(Context);
  const history = useHistory();
  const [DeviceConfig, setDeviceConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [haveContent, setHaveContent] = useState(false);
  const [IsUpdate, setIsUpdate] = useState(false);
  // const [CurrentPage, setCurrentPage] = useState("1");
  const [form] = Form.useForm();
  const level = localStorage.getItem("authUser.level");
  useEffect(() => {
    if (record.id) {
      // console.log(record)
      setHaveContent(false);
      setLoading(true);
      // const DeviceCfgUrl = `/cmd?get={"device_cfg":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{"report_period":{},"lan":{},"wan":{},"lte":{}}}}`;
      const config = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        url: '/cmd',
        data: JSON.parse(`{"get":{"device_cfg":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{"report_period":{},"lan":{},"wan":{},"lte":{}}}}}`),
      }
      axios(config)
        .then((res) => {
          // console.log(loading, haveContent)
          if (res.data.response.device_cfg[0].obj !== "No Response!") {
            setDeviceConfig(res.data.response.device_cfg[0].obj);
            setHaveContent(true);
          } else {
            setHaveContent(false);
          }
          setLoading(false);
          // console.log(res.data)
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response.status === 401) {
            dispatch({ type: "setLogin", payload: { IsLogin: false } });
            UserLogOut();
            history.push("/userlogin");
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.id, IsUpdate]);

  // const callback = (page) => {
  //   setCurrentPage(page);
  // };

  return (
    <Modal
      visible={DeviceSettingvisible}
      onOk={() => setDeviceSettingvisible(false)}
      onCancel={() => {
        setDeviceSettingvisible(false);
        setRecord({ id: null });
      }}
      destroyOnClose={true}
      className={styles.modal}
      centered={true}
      width={'50%'}
      footer={[
          <Button
            key="PERIODform"
            type="primary"
            // onClick={() => PERIODform.submit()}
            onClick={() => form.submit()}
            loading={uploading}
            disabled={level==='get'}
          >
            Submit
          </Button>
      ]}
    >
      {DeviceConfig && !loading ? (
        <Tabs defaultActiveKey="1" >
          <TabPane tab="LAN" key="1" className={styles.tabpane}> 
            <LanSettingMF
              setIsUpdate={setIsUpdate}
              IsUpdate={IsUpdate}
              DeviceConfig={DeviceConfig}
              id={record.id}
              // form={LANform}
              form={form}
              uploading={uploading}
              setUploading={setUploading}
            />
          </TabPane>
          <TabPane tab="WAN" key="2" className={styles.tabpane}>
            <WanSettingMF
              setIsUpdate={setIsUpdate}
              IsUpdate={IsUpdate}
              DeviceConfig={DeviceConfig}
              id={record.id}
              // form={WANform}
              form={form}
              uploading={uploading}
              setUploading={setUploading}
            />
          </TabPane>
          <TabPane tab="LTE" key="3" className={styles.tabpane}>
            <LteSettingMF
              id={record.id}
              setIsUpdate={setIsUpdate}
              IsUpdate={IsUpdate}
              DeviceConfig={DeviceConfig}
              // form={LTEform}
              form={form}
              uploading={uploading}
              setUploading={setUploading}
            />
          </TabPane>
          <TabPane tab="GPS" key="4" className={styles.tabpane}>
            <GPSSettingMF
              id={record.id}
              setIsUpdate={setIsUpdate}
              IsUpdate={IsUpdate}
              DeviceConfig={DeviceConfig}
              // form={PERIODform}
              form={form}
              uploading={uploading}
              setUploading={setUploading}
            />
          </TabPane>
          <TabPane tab="Period" key="5" className={styles.tabpane}>
            <PeriodSettingMF
              id={record.id}
              setIsUpdate={setIsUpdate}
              IsUpdate={IsUpdate}
              DeviceConfig={DeviceConfig}
              // form={PERIODform}
              form={form}
              uploading={uploading}
              setUploading={setUploading}
            />
          </TabPane>
        </Tabs>
      ) : !haveContent && loading ? (
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
      ) : (
        <Empty description={<span>No Data</span>} />
      )}
    </Modal>
  );
};

export const DeviceSettingMC = React.memo(DeviceSettingC);
