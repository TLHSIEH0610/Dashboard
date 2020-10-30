import React, { useEffect, useState } from "react";
import { Modal, Table, Button, Tabs } from "antd";
import styles from "../topology.module.scss";
import axios from "axios";

const { TabPane } = Tabs;

const AlarmLogC = ({
  record,
  setAlarmTablevisible,
  AlarmTablevisible,
}) => {
  const [alarmLog, setAlarmLog] = useState([]);
  const [currentAlarm, setCurrentAlarm] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const AlarmLogUrl = `/cmd?get={"alarm_log":{"filter":{"id":"${record.id}"}}}`;
    setUploading(true);
    axios
      .get(AlarmLogUrl)
      .then((res) => {
        let alarmLog = [];
        res.data.response.alarm_log.list[0].alarm_list.forEach(
          (item, index) => {
            item.key = index;
            alarmLog.push(item);
          }
        );
        setAlarmLog(alarmLog);
        setUploading(false);
      })
      .catch(() => {
        setUploading(false);
      });
  }, [record]);

  useEffect(() => {
    const CurrentAlarmUrl = `/cmd?get={"current_alarm":{"filter":{"id": "${record.id}"}}}`;                        
    setUploading(true);
    axios
      .get(CurrentAlarmUrl)
      .then((res) => {
        let currentAlarm = [];
        res.data.response.current_alarm.list[0].alarm_list.forEach(
          (item, index) => {
            item.key = index;
            currentAlarm.push(item);
          }
        );
        setCurrentAlarm(currentAlarm);
        setUploading(false);
      })
      .catch(() => {
        setUploading(false);
      });
  }, [record]);

  const alarmcolumns = [
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      // ...getColumnSearchProps("level"),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      // ...getColumnSearchProps("message"),
    },
    {
      title: "TrigerTime",
      dataIndex: "trigger_time",
      key: "trigger_time",
      // ...getColumnSearchProps("trigger_time"),
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
      // ...getColumnSearchProps("recover_time"),
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
        onCancel={() => setAlarmTablevisible(false)}
        centered={true}
        // width={"70%"}
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
