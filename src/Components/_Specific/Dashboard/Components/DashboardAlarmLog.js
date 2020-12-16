import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Tag } from "antd";
import styles from "../dashboard.module.scss";
// import { useHistory } from 'react-router-dom'
// import Context from '../../../../Utility/Reduxx'
// import { Translator } from '../../../i18n/index'
import Context from "../../../../Utility/Reduxx";
import axios from "axios";
import { useHistory } from 'react-router-dom'
import { UserLogOut } from '../../../../Utility/Fetch'

const DashboardAlarmLogC = () => {
    const history = useHistory()
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const [AlarmLog, setAlarmLog] = useState(null);
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // const AlarmUrl = `/cmd?get={"alarm_log":{"filter":{${
    //   level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
    // }}}}`;
    // console.log(AlarmUrl);
    const config = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      url: '/cmd',
      data: JSON.parse(`{"get":{"alarm_log":{"filter":{${
        level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
      }}}}}`),
    }
    axios(config)
      .then((res) => {
        // console.log(res.data.response.current_alarm.list[0].alarm_list)
        setAlarmLog(res.data.response.alarm_log.list[0].alarm_list);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
            dispatch({ type: "setLogin", payload: { IsLogin: false } });
            UserLogOut();
            history.push("/userlogin");                                                                         
          } 
        console.log(error);
        setLoading(false);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.Login.Cid]);

  const columns = [
    {
      title: "Alarm Device",
      dataIndex: "id",
      render: (_, record) => {
        return (
          <a
            href='/#'
            onClick={(e) => {
            e.preventDefault()
            dispatch({
                type: "setMaptoTopo",
                payload: { device: record.id },
              });
              history.push('./topology');
            }}
          >
            {record.id}
          </a>
        );
      },
    },
    {
      title: "Trigger",
      dataIndex: "trigger_time",
      render: (_, record) => {
        let time = new Date(record.trigger_time * 1000);
        return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
      },
    },
    {
      title: "Recover",
      dataIndex: "recover_time",
      render: (_, record) => {
        let time = new Date(record.recover_time * 1000);
        return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
      },
    },
    {
      title: "Level",
      dataIndex: "level",
      render: (_, record) => {
        return (
          <Tag color={record.level === "CRITICAL" ? "red" : "#FF8C00"}>
            {record.level}
          </Tag>
        );
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      // render: (_,record) => {
      //   return <Tag color={record.level==='CRITICAL'? "red" : '#FF8C00'}>{record.level}</Tag>
      // }
    },
  ];

  return (
    <Card
      bordered={false}
      className={styles.Card}
      style={{height:'auto'}}
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={AlarmLog}
        rowKey={(record) => `${record.alarm_record_time} ${record.id}`}
        // pagination={false}
        className={styles.alarmtable}
        // scroll={{y:300}}
      />
    </Card>
  );
};
export default DashboardAlarmLogC;
