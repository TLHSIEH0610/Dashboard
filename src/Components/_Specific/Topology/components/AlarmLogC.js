import React, { useEffect, useState, useContext } from "react";
import { Modal, Table, Button, Tabs, message } from "antd";
import styles from "../topology.module.scss";
import axios from "axios";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;

const AlarmLogC = ({
  setRecord,
  record,
  setAlarmTablevisible,
  AlarmTablevisible,
}) => {
  const level = localStorage.getItem("authUser.level");
  const [alarmLog, setAlarmLog] = useState([]);
  const [currentAlarm, setCurrentAlarm] = useState([]);
  const [uploading, setUploading] = useState(false);
  const history = useHistory();
  const { dispatch } = useContext(Context);
  const [CurrentPage, setCurrentPage] = useState("Current");
  const [IsUpdate, setIsUpdate] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (record.id) {
      setUploading(true);
      const config1 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/cmd",
        data: JSON.parse(
          `{"get":{"alarm_log":{"filter":{"id":"${record.id}"}}}}`
        ),
      };
      const config2 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/cmd",
        data: JSON.parse(
          `{"get":{"current_alarm":{"filter":{"id": "${record.id}"}}}}`
        ),
      };
      function AlarmLogUrl() {
        return axios(config1);
      }
      function CurrentAlarmUrl() {
        return axios(config2);
      }
      axios
        .all([AlarmLogUrl(), CurrentAlarmUrl()])
        .then(
          axios.spread((acct, perms) => {
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
          })
        )
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            dispatch({ type: "setLogin", payload: { IsLogin: false } });
            UserLogOut();
            history.push("/userlogin");
          }
          console.error(error);
          setUploading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.id, IsUpdate]);

  function ChangeTab(value) {
    setCurrentPage(value);
  }

  function ClearLog() {
    setUploading(true);
    // console.log(record);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"clean_alarm_log":{"filter":{"id":"${record.id}"}}}}`
      ),
    };
    console.log(config.data);
    axios(config)
      .then((res) => {
        console.log(res.data);
        message.success("Clear log successfully.");
        setIsUpdate(!IsUpdate);
        setUploading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        message.error("fail to Clear log.");
        console.error(error);
        setUploading(false);
      });
  }

  const alarmcolumns = [
    {
      title: t("ISMS.Level"),
      dataIndex: "level",
      key: "level",
    },
    {
      title: t("ISMS.Message"),
      dataIndex: "message",
      key: "message",
    },
    {
      title: t("ISMS.TrigerTime"),
      dataIndex: "trigger_time",
      key: "trigger_time",
      sorter: (a, b) => {
        // console.log(a,b)
        return a.trigger_time - b.trigger_time;
      },
      defaultSortOrder: "descend",
      render: (text) => {
        let date = new Date(text * 1000);
        return `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      },
    },
    {
      title: t("ISMS.RecoverTime"),
      dataIndex: "recover_time",
      key: "recover_time",
      sorter: (a, b) => {
        return a.recover_time - b.recover_time;
      },
      sortDirections: ["descend" | "ascend"],
      defaultSortOrder: "descend",
      render: (text) => {
        if (text === 0) {
          return null;
        }
        let date = new Date(text * 1000);
        return `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      },
    },
  ];
  return (
    <>
      <Modal
        visible={AlarmTablevisible}
        onCancel={() => {
          setAlarmTablevisible(false);
          setCurrentPage("Current");
          setRecord({ cid: null });
        }}
        centered={true}
        className={styles.modal}
        destroyOnClose={true}
        footer={[
          CurrentPage === "Log" && level !== "get" && (
            <Button
              danger
              key="clear"
              type="primary"
              onClick={() => ClearLog()}
            >
              {t("ISMS.ClearLog")}
            </Button>
          ),
          <Button
            key="confirm"
            type="primary"
            onClick={() => {
              setAlarmTablevisible(false);
              setCurrentPage("Current");
              setRecord({ cid: null });
            }}
          >
            {t("ISMS.Confirm")}
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="Current" onChange={(value) => ChangeTab(value)}>
          <TabPane
            tab={t("ISMS.Current")}
            key="Current"
            className={styles.tabpane}
          >
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
          <TabPane tab={t("ISMS.Log")} key="Log" className={styles.tabpane}>
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
