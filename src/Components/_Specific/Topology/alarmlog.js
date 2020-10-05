import React, { useState } from "react";
import { Modal, Button, Space } from "antd";
// import Swal from 'sweetalert2'
// import { useHistory } from "react-router-dom";
// import { UserLogin } from '../../../Utility/Fetch'
// // import Context from '../../../Utility/Reduxx'
import TopoTable from "./topoTable";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const AlarmLog = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(false);
  };

  const hideModal = () => {
    setVisible(false);
  };

  function confirm() {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Bla bla ...",
      okText: "确认",
      cancelText: "取消",
    });
  }

  return (
    // <Space>
    //   <AlarmLog />
    //   <Button onClick={confirm}>Confirm</Button>
    // </Space>
    <>
    <Button type="primary" onClick={showModal}>
      Modal
    </Button>
    <Modal
      title="Modal"
      visible={visible}
      onOk={hideModal}
      onCancel={hideModal}
      okText="确认"
      cancelText="取消"
    >
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
    </Modal>
  </>
  );
};

export default AlarmLog;
