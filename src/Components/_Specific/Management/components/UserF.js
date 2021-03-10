import React, { useEffect, useState, useContext, Fragment } from "react";
import {
  Input,
  Form,
  Button,
  Divider,
  Select,
  message,
  Modal,
  Tabs,
  Table,
  Popconfirm,
  Tooltip,
  Spin,
  Alert,
  Row,
  Col,
  InputNumber,
  Tag,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "../management.module.scss";
import { Translator } from "../../../../i18n/index";
// import { FcDeleteRow } from "react-icons/fc";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { RiEdit2Fill } from "react-icons/ri";
import { ImCross } from "react-icons/im";
import { useTranslation } from 'react-i18next';

const { TabPane } = Tabs;
const { Option } = Select;

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
  const { t } = useTranslation();
  const LoginUser = localStorage.getItem("authUser.name");


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
            if (acct.data.response[0] && acct?.data?.response?.[0]?.user_list) {
              acct.data.response[0].user_list.forEach((item, index) => {
                if (level === "admin" && item.level === "super") {
                  return;
                }
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
    if(!values.users){
      return
    }
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
        setCurrentPage("2");
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
      });
  };

  const EditUseronFinish = (values) => {
    // console.log("Received values of form:", values);
    setUploading(true);

    values.EditUser.forEach((item) => {
      if (!item.password) {
        delete item.password;
      }
    });

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
    console.log( `{"modify_user":{"cid":"${record.cid}", "user_list":${JSON.stringify(
      values.EditUser
    )}}}`)
    axios(config)
      .then((res) => {
        setUploading(false);
        message.success("Edit successfully.");
        console.log(res);
        EditUserform.resetFields();
        setEditingKey("");
        setIsUpdate(!IsUpdate);
        setCurrentPage("2");
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
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [editingKey, setEditingKey] = useState("");

  const edit = (index) => {
    setEditingKey(index);

  };

  const cancel = () => {
    setEditingKey("");
  };

  const columns = [
    {
      title:  t('ISMS.name') ,
      dataIndex: ["name"],
      render: (_, record, index) => {
        return (
          <Fragment>
            {record.name}
            <Form.Item
              style={{ display: "none", marginBottom: 0 }}
              name={["EditUser", index, "name"]}
              rules={[{ required: true, message: "Group is required!" }]}
              initialValue={record.name}
            >
              <Input disabled={true} />
            </Form.Item>
          </Fragment>
        );
      },
    },
    {
      title:  t('ISMS.password'),
      editable: true,
      dataIndex: ["password"],
      render: (_, __, index) => {
        return index === editingKey ? (
          <Form.Item
            style={{ marginBottom: 0 }}
            name={["EditUser", index, "password"]}
            rules={[
              {
                whitespace: true,
                message: "spaces are not allow!",
              },
              // {
              //   pattern: new RegExp(
              //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
              //   ),
              //   message:
              //   "Must contain (1) at leat a numeric digit. (2) Uppercase and lowercase letter (3) special character (4) at least 8 characters"
              // },
            ]}
          >
            <Input
              placeholder={ t('ISMS.Newpassword(optional)')}
              style={{ width: "200px" }}
            />
          </Form.Item>
        ) : (
          "******"
        );
      },
    },
    {
      title: t('ISMS.level'),
      editable: true,
      dataIndex: ["level"],
      render: (text, record, index) => {
        return (
          <Fragment>
            {index !== editingKey && text}
            <Form.Item
              style={
                index !== editingKey ? { display: "none" } : { marginBottom: 0 }
              }
              name={["EditUser", index, "level"]}
              rules={[{ required: true, message: "level is required!" }]}
              initialValue={record.level}
            >
              <Select
                // mode="multiple"
                placeholder={t('ISMS.Selectlevel')}
                style={{ width: "100px" }}
                // className={styles.deviceinput}
                loading={uploading}
                disabled={record.level === "super" && level !=='super_super'}
              >
                {level === "super_super" && (
                  <Option key={1} value={"super"}>
                    super
                  </Option>
                )}
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
          </Fragment>
        );
      },
    },
    {
      title: t('ISMS.Group'),
      editable: true,
      dataIndex: ["gid"],
      render: (_, record, index) => {
        return (
          <Fragment>
            {index !== editingKey &&
              record.gid.map((item, index) => <Tag key={index}>{item}</Tag>)}
            <Form.Item
              style={
                index !== editingKey ? { display: "none" } : { marginBottom: 0 }
              }
              name={["EditUser", index, "gid"]}
              initialValue={record.gid}
            >
              <Select
                mode="multiple"
                placeholder={t('ISMS.SelectGroup')}
                showArrow
                // tagRender={tagRender}
                style={{ width: "300px" }}
                disabled={record.level === "super" && level !=='super_super'}
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
          </Fragment>
        );
      },
    },
    {
      title:  t('ISMS.Operation'),
      dataIndex: "Operation",
      render: (_, record, index) => {
        return index === editingKey ? (
          <a
            href="/#"
            onClick={(e) => {
              e.preventDefault();
              cancel(record);
              EditUserform.setFieldsValue({
                EditUser: UserList,
              });
            }}
          >
             {t('ISMS.Cancel')}
          </a>
        ) : (
          <Fragment>
            {(record.level==='admin' && level==='admin' && record.name !==LoginUser)? null :<Tooltip title={t('ISMS.Edit')}>
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  edit(index);
                }}
              >
                <RiEdit2Fill className={styles.EditIcon} />
              </a>
            </Tooltip>}
            {level === "super_super" || record.level !== "super" ? (
              (record.level==='admin' && level==='admin' && record.name !==LoginUser)? null :
              <Tooltip title={t('ISMS.Delete')}>
                <Popconfirm
                  title="Sure to Delete?"
                  onConfirm={() => {
                    deleteUser(record);
                  }}
                >
                  <ImCross className={styles.DeleteIcon} />
                </Popconfirm>
              </Tooltip>
            ) : null}
          </Fragment>
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
        setCurrentPage("1");
        setEditingKey("");
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
            {t("ISMS.Submit")}
          </Button>
        ),
        currentPage === "2" && (
          <Button
            key="Edit"
            type="primary"
            loading={uploading}
            onClick={() => {
              if(editingKey!=='' ){
                EditUserform.submit();
              }else{
                setCreateUservisible(false);
                setCurrentPage("1");
              }
              
            }}
          >
            {editingKey!=='' ? t("ISMS.Submit") : t("ISMS.Confirm")}
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
        <Tabs
          defaultActiveKey="1"
          onChange={ChangeTabs}
          activeKey={currentPage}
        >
          <TabPane
            // tab="Create User"
            tab={t("ISMS.CreateUser")}
            key="1"
          >
            <Form
              name="CreateUser"
              form={CreateUserform}
              onFinish={CreateUseronFinish}
            >
              <div className={styles.formwrap}>
                <Form.List name="users">
                  {(fields, { add, remove }) => {
                    return (
                      <div>
                        {fields.map((field) => (
                          <Row gutter={24} justify="flex-start" key={field.key}>
                            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
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
                                label={t("ISMS.name")}
                              >
                                <Input
                                  placeholder="Name@xxx.com"
                                  autoComplete="new-password"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                              <Form.Item
                                {...field}
                                className={styles.password}
                                name={[field.name, "password"]}
                                label={t("ISMS.password")}
                                fieldKey={[field.fieldKey, "password"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing password",
                                  },
                                  {
                                    whitespace: true,
                                    message: "spaces are not allow!",
                                  },
                                  // {
                                  //   pattern: new RegExp(
                                  //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                                  //   ),
                                  //   message:
                                  //   "Must contain (1) at leat a numeric digit. (2) Uppercase and lowercase letter (3) special character (4) at least 8 characters"
                                  // },
                                ]}
                              >
                                <Input
                                  placeholder={t("ISMS.Password")}
                                  type="password"
                                  autoComplete="new-password"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={3} xl={3}>
                              <Form.Item
                                {...field}
                                className={styles.level}
                                name={[field.name, "level"]}
                                fieldKey={[field.fieldKey, "level"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing level",
                                  },
                                ]}
                                label={t("ISMS.level")}
                              >
                                <Select placeholder={t("ISMS.Select")}>
                                  {level === "super_super" && (
                                    <Option value="super">super</Option>
                                  )}
                                  {(level === "super_super" ||
                                    level === "super") && (
                                    <Option value="admin">admin</Option>
                                  )}
                                  <Option value="get">get</Option>
                                  <Option value="set">set</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                              <Form.Item
                                {...field}
                                className={styles.gid}
                                name={[field.name, "gid"]}
                                fieldKey={[field.fieldKey, "gid"]}
                                initialValue={[]}
                                // rules={[{ required: true, message: "Missin Group" }]}
                                label={t("ISMS.Group(optional)")}
                              >
                                <Select
                                  // onChange={handleChange}
                                  maxTagCount={1}
                                  mode={"multiple"}
                                  placeholder={t("ISMS.DefaultAll")}
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
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                              <MinusCircleOutlined
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                              <br />
                            </Col>
                          </Row>
                          // </Space>
                        ))}

                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => {
                              add();
                            }}
                            block
                          >
                            <PlusOutlined /> {t("ISMS.AddUser") }

                          </Button>
                        </Form.Item>
                      </div>
                    );
                  }}
                </Form.List>
              </div>
            </Form>
          </TabPane>
          <TabPane 
          // tab="Edit User"
          tab={t("ISMS.EditUser")}
           key="2">
            <Form
              form={EditUserform}
              onFinish={EditUseronFinish}
              style={{ overflowX: "auto" }}
            >
              <Table
                columns={columns}
                dataSource={UserList}
                pagination={false}
                className={styles.table}
                rowClassName="editable-row"
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
  const history = useHistory();

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
    await axios(config2)
      .then((res) => {
        // setUploading(false);

        setIsUpdate(!IsUpdate);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("Create fail.");
      });

    const config3 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/scheme_mgnt",
      data: JSON.parse(
        `{"create_scheme":{"cid":"${UserToken}","scheme_list":{"user":${
          values.user || 10
        },"group":${values.group || 50},"device":${
          values.device || 1000
        },"expire":${
          Date.parse(values.expire || "2030-12-12") / 1000
        },"tracking":${123},"tracking_pool":${123},"iot":${123},"iot_poor":${123},"period_alive":${
          values.period_alive
        },"alive_timeout":${values.period_alive + 30},"period_status":${
          values.period_status
        },"period_gps":${values.period_gps},"period_iot":${
          values.period_iot
        }}}}`
      ),
    };
    const config4 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(`{"set":{"device_cfg":{"filter":{"cid":"${UserToken}"},"obj":{"report_period":{"alive":${
        values.period_alive
      },"timeout":${values.period_alive + 30},
        "status":${values.period_status},"iot":${values.period_iot},"gps":${
        values.period_gps
      }}}}}}`),
    };
    console.log(config3.data);
    function CreateSchemeUrl() {
      return axios(config3);
    }
    function setAllScheme() {
      return axios(config4);
    }

    axios
      .post([CreateSchemeUrl(), setAllScheme()])
      .then(
        axios.spread(() => {
          dispatch({
            type: "setIsUpdate",
            payload: { IsUpdate: !state.Global.IsUpdate },
          });
          setUploading(false);
          setCreateVisible(false);
          setIsUpdate(!IsUpdate);
          message.success("Create successfully.");
        })
      )
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setUploading(false);
        console.log(error);
        message.error("Create fail.");
      });
  };

  return (
    <Modal
      title={Translator("ISMS.CreateCustomer")}
      visible={CreateVisible}
      className={`${styles.modal}`}
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
          {Translator("ISMS.Submit")}
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        name="CreateInfo"
        onFinish={CreateInfoonFinish}
        form={form}
      >
        <div className={styles.formwrap}>
          <Row gutter={24} justify="space-around">
            <Col xs={24} sm={24} md={24} lg={24} xl={10}>
              <h2>{Translator("ISMS.CompanyInfo")}</h2>
              <Divider className={styles.divider} />

              <Form.Item
                name={"company"}
                label={Translator("ISMS.Company")}
                rules={[{ required: true }]}
              >
                <Input placeholder={Translator("ISMS.CompanyName")} />
              </Form.Item>
              <Form.Item
                name={"contact"}
                label={Translator("ISMS.ContactPerson")}
              >
                <Input placeholder={Translator("ISMS.Person Name")} />
              </Form.Item>
              <Form.Item name={"mail"} label={Translator("ISMS.Email")}>
                <Input placeholder={Translator("ISMS.MailAddress")} />
              </Form.Item>
              <Form.Item name={"phone"} label={Translator("ISMS.Phone")}>
                <Input placeholder={Translator("ISMS.Phone Number")} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={10}>
              <h2>{Translator("ISMS.SchemePeriod")}</h2>
              <Divider className={styles.divider} />
              {/* <Form.Item
                label="User"
                name="user"
                rules={[{ required: true, message: "Required!!" }]}
              >
                <Input placeholder={'Available Users Number'}/>
              </Form.Item>
              <Form.Item
                label="Group"
                name="group"
                rules={[{ required: true, message: "Required!!" }]}
              >
                <Input placeholder={'Available Groups Number'}/>
              </Form.Item>
              <Form.Item
                label="Device"
                name="device"
                rules={[{ required: true, message: "Required!!" }]}
              >
                <Input placeholder={'Available Devices Number'}/>
              </Form.Item>
              <Form.Item
                label="Expire"
                name="expire"
                rules={[{ required: true, message: "Required!!" }]}
              >
                <Input placeholder="2020-12-12" />
              </Form.Item> */}
              <Form.Item
                label={Translator("ISMS.PeriodAlive(s)")}
                name="period_alive"
                rules={[{ required: true, message: "Required!!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={30}
                  step={30}
                  placeholder={Translator("ISMS.AlivePeriodstepby30")}
                />
              </Form.Item>
              <Form.Item
                label={Translator("ISMS.StatusPeriod(s)")}
                name="period_status"
                rules={[{ required: true, message: "Required!!" }]}
              >
                <InputNumber
                  placeholder={Translator("ISMS.StatusPeriod")}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                label={Translator("ISMS.IoTPeriod(s)")}
                name="period_iot"
                rules={[{ required: true, message: "Required!!" }]}
              >
                <InputNumber
                  placeholder={Translator("ISMS.IoTPeriod")}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                label={Translator("ISMS.GPSPeriod(s)")}
                name="period_gps"
                rules={[{ required: true, message: "Required!!" }]}
              >
                <InputNumber
                  placeholder={Translator("ISMS.GPSPeriod")}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              {/* <Form.Item
                style={{ display: "none" }}
                label="alive_timeout"
                name="alive_timeout"
                rules={[{ required: true, message: "Required!!" }]}
              >
                <Input />
              </Form.Item> */}
            </Col>
          </Row>
        </div>
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
      title={Translator("ISMS.EditCustomerInfo")}
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
        name="Edit Info"
        onFinish={EditCustomerInfoOnFinish}
        form={form}
        layout="vertical"
      >
        {/* <Form.Item
          name={"company"}
          label="Customer"
          rules={[{ required: true }]}
          disabled={true}
        >
          <Input />
        </Form.Item>
        <Form.Item name={"contact"} label={Translator("ISMS.ContactPerson")} initialValue={""}>
          <Input />
        </Form.Item>
        <Form.Item name={"mail"} label={Translator("ISMS.Email")} initialValue={""}>
          <Input />
        </Form.Item>
        <Form.Item name={"phone"} label={Translator("ISMS.Phone")} initialValue={""}>
          <Input />
        </Form.Item> */}

        <div className={styles.formwrap}>
          <Row gutter={24} justify="center">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              {/* <h2>{Translator("ISMS.CompanyInfo")}</h2>
              <Divider className={styles.divider} /> */}

              <Form.Item
                name={"company"}
                label={Translator("ISMS.Company")}
                rules={[{ required: true }]}
              >
                <Input placeholder={Translator("ISMS.CompanyName")} />
              </Form.Item>
              <Form.Item
                name={"contact"}
                label={Translator("ISMS.ContactPerson")}
              >
                <Input placeholder={Translator("ISMS.Person Name")} />
              </Form.Item>
              <Form.Item name={"mail"} label={Translator("ISMS.Email")}>
                <Input placeholder={Translator("ISMS.MailAddress")} />
              </Form.Item>
              <Form.Item name={"phone"} label={Translator("ISMS.Phone")}>
                <Input placeholder={Translator("ISMS.Phone Number")} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};

export const EditCustomerInfoMC = React.memo(EditCustomerInfo);
