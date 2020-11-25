
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Table,
  Alert,
  Spin,

} from "antd";
import styles from "../management.module.scss";
import axios from "axios";




const EventLogC = ({ record, EventLogModalvisible, setEventLogModalvisible, setRecord }) => {
    const [uploading, setUploading] = useState(false);
    const [EventLog, setEventLog] = useState([])

    useEffect(() => {
      if (record.cid) {
        setUploading(true)
        const EventLogUrl = `/cmd?get={"event_log":{"filter":{"cid":"${record.cid}"}}} `
        axios.post(EventLogUrl).then((res)=>{
            let EventLog = []
            res.data.response.event_log.list[0].event_list.forEach((item, index)=>{
                let getTime =  new Date(item.timestamp*1000)
                EventLog.push({
                    key: index,
                    message: item.message,
                    time: `${getTime.getFullYear()}-${
                          getTime.getMonth() + 1
                        }-${getTime.getDate()} ${getTime.getHours()}:${getTime.getMinutes()}`
                })
            })
            console.log(EventLog)
            setEventLog(EventLog)
            setUploading(false)
        })
        .catch((error)=>{
            console.log(error)
            setUploading(false)
        })
      }
    }, [record.cid]);

    const columns = [
        {
          title: 'Message',
          dataIndex: 'message',
        },
        {
          title: 'Time',
          dataIndex: 'time',
        },
      ];
  
    return (
      <Modal
        title="Event Log"
        className={styles.modal}
        visible={EventLogModalvisible}
        onCancel={() => {
          setEventLogModalvisible(false);
          setRecord({ cid: null });
        }}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={uploading}
            onClick={() => {
                setEventLogModalvisible(false);
            }}
          >
            Confirm
          </Button>,
        ]}
      >
       {uploading? <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin> : <Table columns={columns} dataSource={EventLog} />}
      </Modal>
    );
  };
  
  export const EventLogMC = React.memo(EventLogC);