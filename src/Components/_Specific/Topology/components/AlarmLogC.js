import React, { useEffect, useState, useContext } from "react";
import { Modal, Table, Button, Tabs } from "antd";
import styles from "../topology.module.scss";
import axios from "axios";
import { UserLogOut } from '../../../../Utility/Fetch'
import { useHistory } from 'react-router-dom'
import Context from "../../../../Utility/Reduxx";

const { TabPane } = Tabs;

const AlarmLogC = ({
  setRecord,
  record,
  setAlarmTablevisible,
  AlarmTablevisible,
}) => {
  const [alarmLog, setAlarmLog] = useState([]);
  const [currentAlarm, setCurrentAlarm] = useState([]);
  const [uploading, setUploading] = useState(false);
  const history = useHistory()
  const { dispatch } = useContext(Context);

  useEffect(() => {
    if(record.id){
      setUploading(true);
    function AlarmLogUrl() {
      return axios.post(`/cmd?get={"alarm_log":{"filter":{"id":"${record.id}"}}}`)
    }
    function CurrentAlarmUrl() {
      return axios.post(`/cmd?get={"current_alarm":{"filter":{"id": "${record.id}"}}}`)
    }
    axios.all([AlarmLogUrl(), CurrentAlarmUrl()])
    .then(axios.spread((acct, perms) => {
      let alarmLog = [];
      acct.data.response.alarm_log.list[0].alarm_list.forEach(
        (item, index) => {
          item.key = index;
          alarmLog.push(item);
        }
      );
      setAlarmLog(alarmLog);

      let currentAlarm = [];
      perms.data.response.current_alarm.list[0].alarm_list.forEach(
        (item, index) => {
          item.key = index;
          currentAlarm.push(item);
        }
      );
      setCurrentAlarm(currentAlarm);

      setUploading(false);
    }))
    .catch((error) => { 
      if (error.response && error.response.status === 401) {
        dispatch({ type: "setLogin", payload: { IsLogin: false } });
        UserLogOut();
        history.push("/userlogin");                                                                         
      } 
      console.error(error); 
      setUploading(false); })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.id]);


  const alarmcolumns = [
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "TrigerTime",
      dataIndex: "trigger_time",
      key: "trigger_time",
      render:(text) => {
        let date = new Date(text * 1000);
        return(
          `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
        )
      }
    },
    {
      title: "RecoverTime",
      dataIndex: "recover_time",
      key: "recover_time",
      render:(text) => {
        let date = new Date(text * 1000);
        return(
          `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
        )
      }
    },
  ];
  return (
    <>
      <Modal
        visible={AlarmTablevisible}
        onCancel={() => {setAlarmTablevisible(false); setRecord({cid:null})}}
        centered={true}
        className={styles.modal}
        destroyOnClose={true}
        footer={[
          <Button
            key="confirm"
            type="primary"
            onClick={() => setAlarmTablevisible(false)}
          >
            Confirm
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="Log">
          <TabPane tab="Current" key="Current" className={styles.tabpane}>
          <Table
              loading={uploading}
              className={styles.alarmtable}
              dataSource={currentAlarm}
              columns={alarmcolumns}
              pagination={true}
              scroll={{ y: 400 }}
              size="middle"
            />
          </TabPane>
          <TabPane tab="Log" key="Log" className={styles.tabpane}>
            <Table
              loading={uploading}
              className={styles.alarmtable}
              dataSource={alarmLog}
              columns={alarmcolumns}
              pagination={true}
              scroll={{ y: 400 }}
              // style={{overflowX:'auto'}}
              size="middle"
            />
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export const AlarmLogMC = React.memo(AlarmLogC);
