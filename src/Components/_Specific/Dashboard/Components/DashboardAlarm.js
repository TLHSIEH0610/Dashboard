import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Tag } from "antd";
import styles from "../dashboard.module.scss";
import { useHistory } from 'react-router-dom'
// import Context from '../../../../Utility/Reduxx'
// import { Translator } from '../../../i18n/index'
import Context from "../../../../Utility/Reduxx";
import axios from "axios";
import { UserLogOut } from '../../../../Utility/Fetch'

const DashboardAlarmC = () => {
  const cid = localStorage.getItem("authUser.cid");
  const history = useHistory()
  const level = localStorage.getItem("authUser.level");
  const [CurrentAlarm, setCurrentAlarm] = useState(null);
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const config = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      url: '/cmd',
      data: JSON.parse(`{"get":{"current_alarm":{"filter":{${
        level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
      }}}}}`)
    }
 
    axios(config)
      .then((res) => {
          // console.log(res.data.response.current_alarm.list[0].alarm_list)
        setCurrentAlarm(res.data.response.current_alarm.list[0].alarm_list);
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
  }, [state.Login.Cid ]);

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
      title: "Trigger_Time",
      dataIndex: "time",
      render: (_, record) => {
        let time = new Date(record.trigger_time * 1000);
        return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
      },
    },
    {
      title: "Level",
      dataIndex: "level",
      render: (_,record) => {
        return <Tag color={record.level==='CRITICAL'? "red" : '#FF8C00'}>{record.level}</Tag>
      }
    },
    {
      title: "Message",
      dataIndex: "message",
    },
  ];

  return (
    <Card
      bordered={false}
      style={{height:'auto'}}
      className={styles.Card}
    //   title={"Alarm"}
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={CurrentAlarm}
        rowKey={(record) => `${record.alarm_record_time} ${record.id}`}
        // pagination={false}
        className={styles.alarmtable}
        // scroll={{y:300}}
      />
    </Card>
  );
};
export default DashboardAlarmC;
