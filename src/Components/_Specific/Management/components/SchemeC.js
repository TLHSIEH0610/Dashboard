// http://192.168.0.95:8000/scheme_mgnt?create_scheme={"cid":"12345678901234567890123456789011","user":10,"group":10,"device":1024,"expire":null,"tracking":100,"tracking_pool":10000000,"iot":10,"iot_poor":10000000}
// http://192.168.0.95:8000/scheme_mgnt?modify_scheme={"cid":"12345678901234567890123456789011","user":10,"group":10,"device":1024,"expire":null,"tracking":100,"tracking_pool":10000000,"iot":10,"iot_poor":10000000}
// http://192.168.0.95:8000/scheme_mgnt?delete_scheme={"cid":"12345678901234567890123456789011"}
// http://192.168.0.95:8000/scheme_mgnt?list_scheme={}  # {"response": [{"cid": "proscend_2", "user": 10, "group": 10, "device": 1024, "expiry": 1640966399, "tracking": 100, "tracking_pool": 10000000, "iot": 10, "iot_poor": 10000000, "users": 10, "groups": 10, "devices": 1024, "expires": 467, "trackings": 100, "tracking_pools": 10000000, "iots": 10, "iot_poors": 10000000}]}

import React, { useContext, useEffect, useState } from "react";
import { Table, Card, Form, Descriptions, Modal, Button } from "antd";
import Context from "../../../../Utility/Reduxx";
import styles from "../management.module.scss";
import useURLloader from "../../../../hook/useURLloader";

const CreateSchemeForm = () => {
  return 123;
};

export const SchemeManageC = () => {
  const { state } = useContext(Context);
  const [form] = Form.useForm();
  const cid = localStorage.getItem("authUser.cid");
  const SchemeUrl =
    cid === "proscend"
      ? `/scheme_mgnt?list_scheme={${state.Login.Cid}}`
      : `/scheme_mgnt?list_scheme={"cid":"${cid}"}`;
  const [loading, response] = useURLloader(SchemeUrl);
  const [SchemeData, setSchemeData] = useState([]);
  const [CreateSchemevisible, setCreateSchemevisible] = useState(false);

  useEffect(() => {
    console.log(response);
    if (response) {
      let SchemeData = [];
      response.response.forEach((item, index) => {
        SchemeData.push({
          key: index,
          cid: item.cid,
          device: item.scheme_list.device,
          devices: item.scheme_list.devices,
          expire: item.scheme_list.expire,
          expires: item.scheme_list.expires,
          group: item.scheme_list.group,
          iot: item.scheme_list.iot,
          iot_poor: item.scheme_list.iot_poor,
          iot_poors: item.scheme_list.iot_poors,
          iots: item.scheme_list.iots,
          tracking: item.scheme_list.tracking,
          trackings: item.scheme_list.trackings,
          tracking_pools: item.scheme_list.tracking_pools,
          tracking_pool: item.scheme_list.tracking_pool,
          user: item.scheme_list.user,
          users: item.scheme_list.users,
        });
        setSchemeData(SchemeData);
      });
      console.log(SchemeData);
    }
  }, [response]);

  const onFinish = (values) => {
    console.log("Received values of form:", values);
    // const userlist =  JSON.stringify(values.users)
    // console.log(userlist)
    // const url = `/user_mgnt?create_user={"cid":"${values.cid}", "user_list":${userlist}}`
    // axios.get(url).then((res)=>{
    //   console.log(url)
    //   console.log(res)
    // })
  };

  const columns = [
    {
      title: "CustomerID",
      width: 150,
      dataIndex: "cid",
      key: "cid",
      fixed: "left",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 100,
    },
    {
      title: "Users",
      dataIndex: "users",
      key: "users",
      width: 100,
    },
    {
      title: "Device",
      width: 100,
      dataIndex: "device",
      key: "device",
    },
    {
      title: "Devices",
      dataIndex: "devices",
      key: "devices",
      width: 100,
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
      width: 100,
    },
    {
      title: "Groups",
      dataIndex: "groups",
      key: "groups",
      width: 100,
    },
    {
      title: "IoT",
      dataIndex: "iot",
      key: "iot",
      width: 100,
    },
    {
      title: "IoTs",
      dataIndex: "iots",
      key: "iots",
      width: 100,
    },
    {
      title: "iot_poor",
      dataIndex: "iot_poor",
      key: "iot_poor",
      width: 110,
    },
    {
      title: "iot_poors",
      dataIndex: "iot_poors",
      key: "iot_poors",
      width: 110,
    },
    {
      title: "Tracking",
      dataIndex: "tracking",
      key: "trackings",
      width: 100,
    },
    {
      title: "Tracking",
      dataIndex: "trackings",
      key: "tracking",
      width: 100,
    },
    {
      title: "tracking_pool",
      dataIndex: "tracking_pool",
      key: "tracking_pool",
      width: 110,
    },
    {
      title: "tracking_pools",
      dataIndex: "tracking_pools",
      key: "tracking_pools",
      width: 110,
    },
    {
      title: "Expires",
      key: "expires",
      width: 100,
    },
    {
      title: "Expire",
      dataIndex: "expire",
      key: "expire",
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      width: 160,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <div>
            <Button>Edit</Button>
            <Button>Delete</Button>
          </div>
        );
      },
    },
  ];

  return (
    <Card loading={loading}>
      <div>
        <Button
          type="primary"
          onClick={() => {
            setCreateSchemevisible(true);
            // form.setFieldsValue({ cid: (localStorage.getItem("authUser.cid")  === 'proscend'? state.Login.Cid.split('"')[3] :localStorage.getItem("authUser.cid")) });
          }}
        >
          New Scheme
        </Button>
        <Modal
          title="New Scheme"
          visible={CreateSchemevisible}
          onOk={() => setCreateSchemevisible(false)}
          onCancel={() => setCreateSchemevisible(false)}
          okButtonProps={{
            form: "CreateScheme",
            key: "submit",
            htmlType: "submit",
          }}
          okText="Create"
          cancelText="Cancel"
        >
          <CreateSchemeForm
            form={form}
            // data={Clist}
            // visible={CreateUservisible}
            onFinish={onFinish}
          />
        </Modal>
      </div>

      <Table
        columns={columns}
        dataSource={SchemeData}
        scroll={{ x: 1500, y: 600 }}
      />
    </Card>
  );
};

export const SchemeModalC = ({
  SchemeModalvisible,
  setSchemeModalvisible,
  record,
}) => {
  const SchemeUrl = `/scheme_mgnt?list_scheme={"cid":"${record.cid}"}`;
  const [Schemeloading, Schemeresponse] = useURLloader(SchemeUrl);
  const [SchemeData, setSchemeData] = useState({})

  useEffect(() => {
    if(Schemeresponse){
      setSchemeData(Schemeresponse.response[0].scheme_list)
    }
    
    
  }, [Schemeresponse]);

  return (
    <Modal
      visible={SchemeModalvisible}
      onOk={() => setSchemeModalvisible(false)}
      onCancel={() => setSchemeModalvisible(false)}
      okText="confirm"
      cancelText="cancel"
      centered={true}
      width={"50%"}
      className={styles.modal}
      title='Scheme'
      destroyOnClose={true}
    >
      <Card loading={Schemeloading} bordered={false}>
      <Descriptions
        bordered
        // column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        {SchemeData && <Descriptions.Item label="Current Scheme">
          device: {SchemeData.device}
          <br />
          devices: {SchemeData.devices}
          <br />
          expire: {SchemeData.expire}
          <br />
          expires: {SchemeData.expires}
          <br />
          group: {SchemeData.group}
          <br />
          groups: {SchemeData.groups}
          <br />
          iot: {SchemeData.iot}
          <br />
          iots: {SchemeData.iots}
          <br />
          iot_poor: {SchemeData.iot_poor}
          <br />
          iot_poors: {SchemeData.iot_poors}
          <br />
          tracking: {SchemeData.tracking}
          <br />
          trackings: {SchemeData.trackings}
          <br />
          tracking_pool: {SchemeData.tracking_pool}
          <br />
          tracking_pools: {SchemeData.tracking_pools}
          <br />
          user: {SchemeData.user}
          <br />
          users: {SchemeData.users}
          <br />
        </Descriptions.Item>}
      </Descriptions>
      </Card>
    </Modal>
  );
};
