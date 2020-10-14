import React from "react";
import { Modal, Table } from "antd";
import styles from "../topology.module.scss";


const AlarmLogC = ({ getColumnSearchProps, dataSource, setAlarmTablevisible, AlarmTablevisible }) => {

  const alarmcolumns = [
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      ...getColumnSearchProps("level"),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ...getColumnSearchProps("message"),
    },
    {
      title: "TrigerTime",
      dataIndex: "trigger_time",
      key: "trigger_time",
      ...getColumnSearchProps("trigger_time"),
    },
    {
      title: "RecoverTime",
      dataIndex: "recover_time",
      key: "recover_time",
      ...getColumnSearchProps("recover_time"),
    },
  ];
  return (
    <>
      <Modal
        visible={AlarmTablevisible}
        onOk={() => setAlarmTablevisible(false)}
        onCancel={() => setAlarmTablevisible(false)}
        okText="confirm"
        cancelText="cancel"
        centered={true}
        width={"70%"}
        className={styles.modal}
        destroyOnClose={true}
      >
        <Table
          // loading={loading}
          className={styles.alarmtable}
          dataSource={dataSource}
          columns={alarmcolumns}
          pagination={true}
          scroll={{ y: 400 }}
          size="middle"
        />
      </Modal>
    </>
  );
};

export default AlarmLogC;
