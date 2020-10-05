import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Radio,
  Input,
  Table,
  Form,
  Steps,
  Button,
  InputNumber,
  Space,
  Select,
} from "antd";
// import Swal from 'sweetalert2'
// import { useHistory } from "react-router-dom"
import {
  UserOutlined,
  LockOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Context from "../../../Utility/Reduxx";
import styles from "./management.module.scss";
import useURLloader from "../../../hook/useURLloader";
import axios from "axios";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not validate email!",
    number: "${label} is not a validate number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const CreateUserForm = ({ onFinish, GroupList, form, data }) => {
  // const cid = localStorage.getItem("authUser.cid");
  const { state } = useContext(Context);
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <Form name="CreateUser" autoComplete="off" form={form} onFinish={onFinish}>
      {state.Login.Cid === "" ? (
        <Form.Item name="cid" rules={[{ required: true, message: "" }]}>
          <Select style={{ width: 170 }} onChange={handleChange}>
            {data.map((item, index) => {
              return (
                <Option key={index} value={item.cid}>
                  {item.cid}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      ) : (
        <Form.Item
          name="cid"
          label="CustomerID"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input disabled={true} />
        </Form.Item>
      )}

      <Form.List name="users">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field) => (
                <Space
                  key={field.key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="start"
                >
                  <Form.Item
                    {...field}
                    name={[field.name, "name"]}
                    fieldKey={[field.fieldKey, "name"]}
                    rules={[
                      {
                        type: "email",
                        required: true,
                        message: "name@xxx.com is required",
                      },
                    ]}
                  >
                    <Input placeholder="name" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, "password"]}
                    fieldKey={[field.fieldKey, "password"]}
                    rules={[{ required: true, message: "Missing password" }]}
                  >
                    <Input placeholder="password" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, "level"]}
                    fieldKey={[field.fieldKey, "level"]}
                    rules={[
                      { required: true, message: "Missing plevelassword" },
                    ]}
                  >
                    <Select style={{ width: 120 }} onChange={handleChange}>
                      <Option value="super">super</Option>
                      <Option value="admin">admin</Option>
                      <Option value="get">get</Option>
                      <Option value="set">set</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, "gid"]}
                    fieldKey={[field.fieldKey, "gid"]}
                    rules={[{ required: true, message: "Missing gid" }]}
                  >
                    <Select style={{ width: 120 }} onChange={handleChange} mode={'multiple'}>
                      {GroupList.map((item, index)=>{
                        return(item.group.map((group,groupIndex)=>{
                          console.log(group.gid)
                          return (<Option key={`${index}_${groupIndex}`} value={group.gid}>{group.gid}</Option>)
                        }))
                      })}
                    </Select>
                  </Form.Item>

                  <MinusCircleOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                >
                  <PlusOutlined /> Add field
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
    </Form>
  );
};

const CreateInfoForm = ({ form, onFinish }) => {
  return (
    <Form
      {...layout}
      name="CreateInfo"
      onFinish={onFinish}
      validateMessages={validateMessages}
      form={form}
    >
      <Form.Item name={"cid"} label="CustomerID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name={"company_name"}
        label="Company"
        rules={[{ required: true }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name={"contact_name"}
        label="Contact Person"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"email"}
        label="Email"
        rules={[{ type: "email", required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"phone"}
        label="Phone"
        rules={[{ type: "number", required: true }]}
      >
        <InputNumber />
      </Form.Item>
      {/* <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item> */}
    </Form>
  );
};

const UserC = () => {
  // const {} = props;
  const { state } = useContext(Context);
  const [form] = Form.useForm();
  const cid = localStorage.getItem("authUser.cid");
  const UserUrl =
    cid === "proscend"
      ? `/user_mgnt?list_user={${state.Login.Cid}}`
      : `/user_mgnt?list_user={"${cid}}"`;
  const [loading, response] = useURLloader(UserUrl);
  const [Clist, setClist] = useState([]);
  const [CreateVisible, setCreateVisible] = useState(false);
  const [CreateUservisible, setCreateUservisible] = useState(false);
  const [EditVisible, setEditVisible] = useState(false);
  const [GroupList, setGroupList] = useState([]);
  // let test = '"cid":"proscend"'
  // console.log(test.split('"')[3])
  const getGroupUrl =
    cid === "proscend"
      ? `/device_mgnt/group?list_group={${state.Login.Cid}}`
      : `/device_mgnt/group?list_group={"cid":"${cid}"}`;
  const [Grouploading, Groupresponse] = useURLloader(getGroupUrl);

  useEffect(() => {
    if (response) {
      let CustomerList = [];
      console.log(response);
      response.response.forEach((item, index) => {
        item.user_list.forEach((user, userIndex) => {
          user["key"] = userIndex;
        });
        CustomerList.push({
          key: index,
          cid: item.cid,
          user_list: item.user_list,
        });
      });
      setClist(CustomerList);
      console.log(CustomerList);
    }
  }, [response]);

  useEffect(() => {
    if (Groupresponse) {
      let GroupList = [];
      console.log(Groupresponse);
      Groupresponse.response.forEach((item, index) => {
        item.group_list.forEach((group, groupIndex) => {
          group["key"] = groupIndex;
        });
        GroupList.push({
          key: index,
          cid: item.cid,
          group: item.group_list,
        });
      });
      console.log(GroupList);
      setGroupList(GroupList);
    }
  }, [Groupresponse]);

  const onFinish = (values) => {
    console.log("Received values of form:", values);
    const userlist = JSON.stringify(values.users);
    console.log(userlist);
    const url = `/user_mgnt?create_user={"cid":"${values.cid}", "user_list":${userlist}}`;
    console.log(url);
    axios.get(url).then((res)=>{
      console.log(url)
      console.log(res)
    })
  };

  const CreateInfoonFinish = (values) => {
    console.log("Received values of form:", values);
    const url = ` /inf_mgnt?create_inf={"cid":"${values.cid}", "company_name":"${values.company_name}", "contact_name":"${values.contact_name}, "email":"${values.email}", "phone":"${values.phone}"}`;
    axios.get(url).then((res) => {
      console.log(url);
      console.log(res);
    });
  };

  const deleteUser = (record) => {
    const DeleteUrl = `/customer_inf_mgnt?delete_inf={"cid":"${record.cid}"}`;
    axios.get(DeleteUrl).then((res) => {
      console.log(res);
    });
  };

  const expandedRowRender = (record) => {
    const columns = [
      { title: "Name", dataIndex: ["name"], key: "name", width: "20%" },
      { title: "Level", dataIndex: ["level"], key: "level", width: "20%" },
      { title: "Group", dataIndex: [["gid"]], key: "[gid]", width: "15%" },
      {
        title: "Action",
        dataIndex: ["action"],
        key: "action",
        width: "20%",
        render: (text, record, index) => {
          return (
            <div>
              <Button
                key={`${index}_${text}`}
                onClick={() => {
                  setEditVisible(true);
                }}
              >
                Edit
              </Button>
              <Button key={index} onClick={() => deleteUser(record)}>
                Delete
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.user_list}
        pagination={false}
        size={"middle"}
        className={styles.subHeader}
      />
    );
  };

  const columns = [
    { title: "Customer_ID", dataIndex: "cid", key: "cid" },
    { title: "CompanyName", dataIndex: "company_name", key: "company_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "PhoneNumber", dataIndex: "phone", key: "phone" },
    {
      title: "Information",
      dataIndex: "information",
      key: "information",
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
    <div>
      <div>
        <Button
          type="primary"
          onClick={() => {
            setCreateUservisible(true);
            form.setFieldsValue({
              cid:
                localStorage.getItem("authUser.cid") === "proscend"
                  ? state.Login.Cid.split('"')[3]
                  : localStorage.getItem("authUser.cid"),
            });
          }}
        >
          User
        </Button>
        <Modal
          title="New User"
          visible={CreateUservisible}
          onOk={() => setCreateUservisible(false)}
          onCancel={() => setCreateUservisible(false)}
          okButtonProps={{
            form: "CreateUser",
            key: "submit",
            htmlType: "submit",
          }}
          okText="Create"
          cancelText="Cancel"
        >
          <CreateUserForm
            form={form}
            data={Clist}
            GroupList={GroupList}
            onFinish={onFinish}
          />
        </Modal>
      </div>

      <Button onClick={() => setCreateVisible(true)}>User Info</Button>
      <Modal
        title="New User Info"
        visible={CreateVisible}
        onOk={() => setCreateVisible(false)}
        onCancel={() => setCreateVisible(false)}
        okButtonProps={{
          form: "CreateInfo",
          key: "submit",
          htmlType: "submit",
        }}
        okText="Create"
        cancelText="Cancel"
      >
        <CreateInfoForm
          form={form}
          onFinish={CreateInfoonFinish}
          
        />
      </Modal>

      <Modal
        title="EditUser"
        visible={EditVisible}
        onOk={() => setEditVisible(false)}
        okButtonProps={{ form: "EditUser", key: "submit", htmlType: "submit" }}
        onCancel={() => setEditVisible(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <p>edit ...</p>
        <p>edit ...</p>
        <p>edit ...</p>
      </Modal>
      <Table
        columns={columns}
        dataSource={Clist}
        expandable={{ expandedRowRender }}
      />
    </div>
  );
};

export default UserC;

// /user_mgnt?create_user={"cid":"12345678901234567890123456789011", "user_list":[{"name":"a1@a1.com", "password":"a1", "level":"super", "gid":[]}, {"name":"a2@a2.com","password":"a2", "level":"admin", "gid":["g1"]}, {"name":"a3@a3.com","password":"a3", "level":"get", "gid":["g2"]}]}
// /user_mgnt?modify_user={"cid":"12345678901234567890123456789011", "user_list":[{"name":"a1@a1.com", "password":"a11", "level":"super", "gid":[]}, {"name":"a2@a2.com","password":"a2", "level":"set", "gid":["g2"]}]}
// /user_mgnt?delete_user={"cid":"12345678901234567890123456789011", "user_list":[{"name":"a2@a2.com"}, {"name":"a3@a3.com"}]}
// /user_mgnt?list_user={} # {"response": {"cid":"12345678901234567890123456789011", "user_list":[{"name":"a1@a1.com", "level":"super", "gid":[]}]}}

// https://ba6e036d2d9a.ngrok.io/inf_mgnt?create_inf={"cid":"12345678901234567890123456789011", "company_name":"customer_1", "contact_name":"abc", "email":"c1@company.com", "phone":"123456789012345"}
// /inf_mgnt?modify_inf={"cid":"12345678901234567890123456789011", "company_name":"customer_1", "contact_name":"abc", "email":"c1@company.com", "phone":"123456789012345"}
// /inf_mgnt?delete_inf={"cid":"12345678901234567890123456789011"}
// /inf_mgnt?list_inf={}  # {"response": [{"cid":"12345678901234567890123456789011", "company_name":"customer_1", "customer_inf_mgnt":"abc", "email":"c1@company.com", "phone":"123456789012345"}, {"cid":"12345678901234567890123456789022", "company_name":"customer_2", "contact_name":"def", "email":"c2@company.com", "phone":"123456789012345"}]}

// /scheme_mgnt?create_scheme={"cid":"12345678901234567890123456789011","user":10,"group":10,"device":1024,"expire":null,"tracking":100,"tracking_pool":10000000,"iot":10,"iot_poor":10000000}
// /scheme_mgnt?modify_scheme={"cid":"12345678901234567890123456789011","user":10,"group":10,"device":1024,"expire":null,"tracking":100,"tracking_pool":10000000,"iot":10,"iot_poor":10000000}
// /scheme_mgnt?delete_scheme={"cid":"12345678901234567890123456789011"}
// /scheme_mgnt?list_scheme={}  # {"response": [{"cid": "proscend_2", "user": 10, "group": 10, "device": 1024, "expiry": 1640966399, "tracking": 100, "tracking_pool": 10000000, "iot": 10, "iot_poor": 10000000, "users": 10, "groups": 10, "devices": 1024, "expires": 467, "trackings": 100, "tracking_pools": 10000000, "iots": 10, "iot_poors": 10000000}]}
