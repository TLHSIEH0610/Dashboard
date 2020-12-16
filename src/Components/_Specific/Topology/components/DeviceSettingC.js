import React, { useEffect, useState, useContext } from "react";
import styles from "../topology.module.scss";
import { useHistory } from "react-router-dom";
import {
  LanSettingMF,
  WanSettingMF,
  LteSettingMF,
  PeriodSettingMF,
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
  const [CurrentPage, setCurrentPage] = useState("1");
  const [LANform] = Form.useForm();
  const [WANform] = Form.useForm();
  const [LTEform] = Form.useForm();
  const [PERIODform] = Form.useForm();

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

  const callback = (page) => {
    setCurrentPage(page);
  };

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
        CurrentPage === "1" && (
          <Button
            key="LANform"
            type="primary"
            onClick={() => LANform.submit()}
            loading={uploading}
          >
            Submit
          </Button>
        ),
        CurrentPage === "2" && (
          <Button
            key="WANform"
            type="primary"
            onClick={() => WANform.submit()}
            loading={uploading}
          >
            Submit
          </Button>
        ),
        CurrentPage === "3" && (
          <Button
            key="LTEform"
            type="primary"
            onClick={() => LTEform.submit()}
            loading={uploading}
          >
            Submit
          </Button>
        ),
        CurrentPage === "4" && (
          <Button
            key="PERIODform"
            type="primary"
            onClick={() => PERIODform.submit()}
            loading={uploading}
          >
            Submit
          </Button>
        ),
      ]}
    >
      {DeviceConfig && !loading ? (
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="LAN" key="1" className={styles.tabpane}>
            <LanSettingMF
              setIsUpdate={setIsUpdate}
              IsUpdate={IsUpdate}
              DeviceConfig={DeviceConfig}
              id={record.id}
              form={LANform}
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
              form={WANform}
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
              form={LTEform}
              uploading={uploading}
              setUploading={setUploading}
            />
          </TabPane>
          <TabPane tab="Period" key="4" className={styles.tabpane}>
            <PeriodSettingMF
              id={record.id}
              setIsUpdate={setIsUpdate}
              IsUpdate={IsUpdate}
              DeviceConfig={DeviceConfig}
              form={PERIODform}
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
