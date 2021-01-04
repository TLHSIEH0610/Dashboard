import React, { useEffect, useState, useContext } from "react";
import {
  Input,
  Form,
  Button,
  Space,
  Select,
  message,
  Modal,
  Tabs,
  Table,
  Popconfirm,
  Tooltip,
  Spin,
  Alert,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "../management.module.scss";
import { Translator } from "../../../../i18n/index";
import { FcDeleteRow } from "react-icons/fc";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";

const { TabPane } = Tabs;
const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const UserForm = ({
  setRecord,
  record,
  CreateUservisible,
  setCreateUservisible,
  level,
}) => {
  const [CreateUserform] = Form.useForm();
  const [EditUserform] = Form.useForm();
  const [UserList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState("1");
  const [GroupList, setGroupList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [IsUpdate, setIsUpdate] = useState(false);
  const history = useHistory();
  const { dispatch } = useContext(Context);

  useEffect(() => {
    if (record.cid) {
      console.log("有執行");
      setUploading(true);
      const config1 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/user_mgnt",
        data: JSON.parse(`{"list_user":{"cid":"${record.cid}"}}`),
      };
      const config2 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/device_mgnt/group",
        data: JSON.parse(`{"list_group":{"cid":"${record.cid}"}}`),
      };
      function UserListUrl() {
        return axios(config1);
      }
      function getGroupUrl() {
        return axios(config2);
      }
      axios
        .all([UserListUrl(), getGroupUrl()])
        .then(
          axios.spread((acct, perms) => {
            let UserList = [];
            if (acct.data.response[0] && acct.data.response[0].user_list) {
              acct.data.response[0].user_list.forEach((item, index) => {
                UserList.push({
                  key: index,
                  name: item.name,
                  level: item.level,
                  gid: item.gid,
                });
              });
              setUserList(UserList);
            } else {
              setUserList([]);
            }
            setGroupList(perms.data.response[0].group_list);
            setUploading(false);
            // console.log(UserList);
            EditUserform.setFieldsValue({
              EditUser: UserList,
            });
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
  }, [record.cid, IsUpdate]);

  useEffect(() => {
    CreateUserform.setFieldsValue({
      cid: record.cid,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CreateUservisible]);

  const ChangeTabs = (page) => {
    console.log(page);
    setCurrentPage(`${page}`);
  };

  const deleteUser = (Deleterecord) => {
    setUploading(true);
    // const deleteUserUrl = `/user_mgnt?delete_user={"cid":"${record.cid}", "user_list":[{"name":"${Deleterecord.name}"}]}`
    // console.log(deleteUserUrl)
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/user_mgnt",
      data: JSON.parse(
        `{"delete_user":{"cid":"${record.cid}", "user_list":[{"name":"${Deleterecord.name}"}]}}`
      ),
    };
    axios(config)
      .then((res) => {
        setUploading(false);
        message.success("Delete successfully.");
        console.log(res);
        setIsUpdate(!IsUpdate);
        CreateUserform.resetFields();
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("Delete fail.");
        CreateUserform.resetFields();
      });
  };

  const CreateUseronFinish = (values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    // setBtnloading(true);
    // console.log(values);
    // const url = `/user_mgnt?create_user={"cid":"${
    //   values.cid
    // }", "user_list":${JSON.stringify(values.users)}}`;
    // console.log(values, url);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/user_mgnt",
      data: JSON.parse(
        `{"create_user":{"cid":"${record.cid}", "user_list":${JSON.stringify(
          values.users
        )}}}`
      ),
    };
    console.log(
      `{"create_user":{"cid":"${record.cid}", "user_list":${JSON.stringify(
        values.users
      )}}}`
    );
    axios(config)
      .then((res) => {
        setUploading(false);
        message.success("Create successfully.");
        console.log(res);
        setIsUpdate(!IsUpdate);
        CreateUserform.resetFields();
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setUploading(false);
        message.error("Create fail.");
        // CreateUserform.resetFields();
      });
  };

  const EditUseronFinish = (values) => {
    console.log("Received values of form:", values);
    setUploading(true);

    values.EditUser.forEach((item) => {
      if (!item.password) {
        delete item.password;
      }
    });

    // const EditUserUrl = `/user_mgnt?modify_user={"cid":"${
    //   record.cid
    // }", "user_list":${JSON.stringify(values.EditUser)}}`;
    // console.log(EditUserUrl);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/user_mgnt",
      data: JSON.parse(
        `{"modify_user":{"cid":"${record.cid}", "user_list":${JSON.stringify(
          values.EditUser
        )}}}`
      ),
    };
    axios(config)
      .then((res) => {
        setUploading(false);
        message.success("Edit successfully.");
        console.log(res);
        EditUserform.resetFields();
        setIsUpdate(!IsUpdate);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setUploading(false);
        EditUserform.resetFields();
        message.error("Edit fail.");
      });
  };

  const columns = [
    {
      title: "name",
      dataIndex: ["name"],
      render: (_, record, index) => {
        console.log(record);
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Form.Item
              style={{ marginBottom: "10px" }}
              // className={styles.name}
              name={["EditUser", index, "name"]}
              rules={[{ required: true, message: "Group is required!" }]}
              initialValue={record.name}
            >
              <Input disabled={true} style={{ width: "300px" }} />
            </Form.Item>
            {level === "super_super" || record.level !== "super" ? (
              <Tooltip title="Delete User">
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => {
                    deleteUser(record);
                  }}
                >
                  <FcDeleteRow
                    className={styles.DeleteGroupIcon}
                    style={{ fontSize: "2rem", cursor: "pointer" }}
                  />
                </Popconfirm>
              </Tooltip>
            ) : null}
          </div>
        );
      },
    },
    {
      title: "password",
      dataIndex: ["password"],
      render: (_, __, index) => {
        return (
          <Form.Item
            style={{ marginBottom: "10px" }}
            // className={styles.formitem}
            name={["EditUser", index, "password"]}
            rules={[
              {
                whitespace: true,
                message: "spaces are not allow!",
              },
              {
                pattern: new RegExp(
                  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                ),
                message:
                  "Must contain  at leat a numeric digit/Uppercase and lowercase letter/special character, and at least 8 or more characters",
              },
            ]}
          >
            <Input placeholder={"Password"} style={{ width: "200px" }} />
          </Form.Item>
        );
      },
    },
    {
      title: "level",
      dataIndex: ["level"],
      render: (_, record, index) => {
        return (
          <Form.Item
            // className={styles.formitem}
            name={["EditUser", index, "level"]}
            rules={[{ required: true, message: "level is required!" }]}
            initialValue={record.level}
          >
            <Select
              // mode="multiple"
              placeholder="Select level"
              style={{ width: "100px" }}
              className={styles.deviceinput}
              loading={uploading}
              disabled={record.level === "super"}
            >
              <Option key={1} value={"super"}>
                super
              </Option>
              <Option key={2} value={"admin"}>
                admin
              </Option>
              <Option key={3} value={"get"}>
                get
              </Option>
              <Option key={4} value={"set"}>
                set
              </Option>
            </Select>
          </Form.Item>
        );
      },
    },
    {
      title: "Group",
      dataIndex: ["gid"],
      render: (_, record, index) => {
        return (
          <Form.Item
            className={styles.formitem}
            name={["EditUser", index, "gid"]}
            // rules={[{ required: true, message: "Deivce Id is required!" }]}
            initialValue={record.gid}
          >
            <Select
              mode="multiple"
              placeholder="Select Group"
              showArrow
              // tagRender={tagRender}
              style={{ width: "300px" }}
              disabled={record.level === "super"}
              loading={uploading}
            >
              {GroupList.map((item, index) => {
                return (
                  <Option key={index} value={item.gid}>
                    {item.gid}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      },
    },
  ];

  return (
    <Modal
      // title="Create User"
      visible={CreateUservisible}
      onCancel={() => {
        setCreateUservisible(false);
        setRecord({ cid: null });
        CreateUserform.resetFields();
      }}
      className={styles.modal}
      destroyOnClose={true}
      footer={[
        // <Fragment key='123'>
        currentPage === "1" && (
          <Button
            key="Create"
            type="primary"
            loading={uploading}
            onClick={() => {
              CreateUserform.submit();
            }}
          >
            Submit
          </Button>
        ),
        currentPage === "2" && (
          <Button
            key="Edit"
            type="primary"
            loading={uploading}
            onClick={() => {
              EditUserform.submit();
            }}
          >
            Submit
          </Button>
        ),
        // </Fragment>
      ]}
    >
      {uploading ? (
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
      ) : (
        <Tabs defaultActiveKey="1" onChange={ChangeTabs}>
          <TabPane tab="Create User" key="1">
            <Form
              name="CreateUser"
              form={CreateUserform}
              onFinish={CreateUseronFinish}
            >
              <Form.Item
                name="cid"
                // rules={[{ required: true, message: "" }]}
                label={"Customer"}
                style={{ display: "none" }}
              >
                <Input disabled={true} />
              </Form.Item>

              <Form.List name="users">
                {(fields, { add, remove }) => {
                  return (
                    <div>
                      {fields.map((field) => (
                        <Space
                          key={field.key}
                          style={{
                            display: "flex",
                            marginBottom: 8,
                            flexWrap: "wrap",
                          }}
                          align="start"
                        >
                          <Form.Item
                            className={styles.name}
                            {...field}
                            name={[field.name, "name"]}
                            fieldKey={[field.fieldKey, "name"]}
                            rules={[
                              {
                                type: "email",
                                required: true,
                                message: "must be name@xxx.com",
                              },
                            ]}
                          >
                            <Input placeholder="Name@xxx.com" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            className={styles.password}
                            style={{ width: 250 }}
                            name={[field.name, "password"]}
                            fieldKey={[field.fieldKey, "password"]}
                            rules={[
                              { required: true, message: "Missing password" },
                              {
                                whitespace: true,
                                message: "spaces are not allow!",
                              },
                              {
                                pattern: new RegExp(
                                  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                                ),
                                message:
                                  "Must contain  at leat a numeric digit/Uppercase and lowercase letter/special character, and at least 8 or more characters",
                              },
                            ]}
                          >
                            <Input placeholder="Password" type="password" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            className={styles.level}
                            name={[field.name, "level"]}
                            fieldKey={[field.fieldKey, "level"]}
                            rules={[
                              { required: true, message: "Missing level" },
                            ]}
                          >
                            <Select
                              // style={{ width: 120 }}
                              //  onChange={handleChange}
                              placeholder="Level  "
                            >
                              <Option value="super">super</Option>
                              <Option value="admin">admin</Option>
                              <Option value="get">get</Option>
                              <Option value="set">set</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            className={styles.gid}
                            name={[field.name, "gid"]}
                            fieldKey={[field.fieldKey, "gid"]}
                            initialValue={[]}
                            // rules={[{ required: true, message: "Missin Group" }]}
                          >
                            <Select
                              style={{ width: 150 }}
                              // onChange={handleChange}
                              mode={"multiple"}
                              placeholder="Group"
                            >
                              {GroupList.map((item, index) => {
                                return (
                                  <Option key={index} value={item.gid}>
                                    {item.gid}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>

                          <MinusCircleOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                          <br />
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
                          <PlusOutlined /> Add User
                        </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>
            </Form>
          </TabPane>
          <TabPane tab="Edit User" key="2">
            <Form
              form={EditUserform}
              onFinish={EditUseronFinish}
              style={{ overflowX: "auto" }}
            >
              <Table
                columns={columns}
                dataSource={UserList}
                pagination={false}
                // loading={uploading}
                // scroll={{ x: 1500, y: 600 }}
              />
            </Form>
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
};

export const UserModalMC = React.memo(UserForm);

const CreateInfoForm = ({
  CreateVisible,
  setCreateVisible,
  setIsUpdate,
  IsUpdate,
}) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const { state, dispatch } = useContext(Context);
  const CreateInfoonFinish = async (values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    // const CreateUserTokenUrl = `/user_mgnt?generate_token={}`;
    const config1 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/user_mgnt",
      data: JSON.parse(`{"generate_token":{}}`),
    };
    console.log(config1.data);
    let UserToken;
    await axios(config1)
      .then((res) => {
        UserToken = res.data.response.token;
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("Create fail.");
      });
    // const CreateInfo = ` /inf_mgnt?create_inf={"cid":"${UserToken}","inf_list":{"company":"${
    //   values.company ? values.company : ""
    // }", "contact":"${values.contact ? values.contact : ""}", "mail":"${
    //   values.mail ? values.mail : ""
    // }", "phone":"${values.phone ? values.phone : ""}"}}`;
    // console.log(CreateInfo);
    const config2 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/inf_mgnt",
      data: JSON.parse(
        `{"create_inf":{"cid":"${UserToken}","inf_list":{"company":"${
          values.company ? values.company : ""
        }", "contact":"${values.contact ? values.contact : ""}", "mail":"${
          values.mail ? values.mail : ""
        }", "phone":"${values.phone ? values.phone : ""}"}}}`
      ),
    };
    console.log(config2.data);
    axios(config2)
      .then((res) => {
        setUploading(false);
        message.success("Create successfully.");
        dispatch({
          type: "setIsUpdate",
          payload: { IsUpdate: !state.Global.IsUpdate },
        });
        setCreateVisible(false);
        setIsUpdate(!IsUpdate);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("Create fail.");
      });
  };

  return (
    <Modal
      title="Create Customer"
      visible={CreateVisible}
      // onOk={() => setCreateVisible(false)}
      onCancel={() => {
        setCreateVisible(false);
      }}
      footer={[
        <Button
          key="Submit"
          loading={uploading}
          onClick={() => {
            form.submit();
          }}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        {...layout}
        name="CreateInfo"
        onFinish={CreateInfoonFinish}
        form={form}
      >
        <Form.Item
          name={"company"}
          label="Company"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={"contact"} label="Contact Person">
          <Input />
        </Form.Item>
        <Form.Item name={"mail"} label="Email">
          <Input />
        </Form.Item>
        <Form.Item name={"phone"} label="Phone">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const CreateInfoModalMC = React.memo(CreateInfoForm);

const EditCustomerInfo = ({
  EditCustomerInfovisible,
  setEditCustomerInfovisible,
  record,
  setRecord,
  setIsUpdate,
  IsUpdate,
}) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const { state, dispatch } = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    if (record.inf_list) {
      // console.log(record.inf_list)
      form.setFieldsValue({
        company: record.inf_list.company,
        contact: record.inf_list.contact,
        mail: record.inf_list.mail,
        phone: record.inf_list.phone,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.inf_list]);

  const EditCustomerInfoOnFinish = (values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    // const EditCustInfiUrl = `/inf_mgnt?modify_inf={"cid":"${record.cid}", "inf_list":{"company":"${values.company}", "contact":"${values.contact}", "mail":"${values.mail}", "phone":"${values.phone}"}}`;
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/inf_mgnt",
      data: JSON.parse(
        `{"modify_inf":{"cid":"${record.cid}", "inf_list":{"company":"${values.company}", "contact":"${values.contact}", "mail":"${values.mail}", "phone":"${values.phone}"}}}`
      ),
    };
    axios(config)
      .then(() => {
        setUploading(false);
        message.success("update successfully.");
        dispatch({
          type: "setIsUpdate",
          payload: { IsUpdate: !state.Global.IsUpdate },
        });
        setIsUpdate(!IsUpdate);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
        setUploading(false);
        message.error("update fail.");
      });
  };

  return (
    <Modal
      title="Edit Customer Info"
      visible={EditCustomerInfovisible}
      onCancel={() => {
        setEditCustomerInfovisible(false);
        setRecord({ inf_list: null });
        // form.resetFields()
      }}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={uploading}
          onClick={() => {
            form.submit();
          }}
        >
          {Translator("ISMS.Submit")}
        </Button>,
      ]}
    >
      <Form
        {...layout}
        name="Edit Info"
        onFinish={EditCustomerInfoOnFinish}
        form={form}
      >
        <Form.Item
          name={"company"}
          label="Customer"
          rules={[{ required: true }]}
          disabled={true}
        >
          <Input />
        </Form.Item>
        <Form.Item name={"contact"} label="Contact Person" initialValue={""}>
          <Input />
        </Form.Item>
        <Form.Item name={"mail"} label="Email" initialValue={""}>
          <Input />
        </Form.Item>
        <Form.Item name={"phone"} label="Phone" initialValue={""}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const EditCustomerInfoMC = React.memo(EditCustomerInfo);
