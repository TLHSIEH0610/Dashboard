import React, { useEffect, useState } from "react";
import { Input, Form, Button, Space, Select, message, Modal } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
// import Context from "../../../../Utility/Reduxx";
import axios from "axios";
import styles from "../management.module.scss";
import { Translator } from '../../../../i18n/index'


const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const CreateUserForm = ({
  setUploading,
  GroupList,
  record,
  CreateUservisible,
  setCreateUservisible,
}) => {
  const [form] = Form.useForm();
  // const { state } = useContext(Context);
  const [btnloading, setBtnloading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      cid: record.cid,
    });
  }, [CreateUservisible]);

  const onFinish = (values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    setBtnloading(true);
    console.log(values)
    const url = `/user_mgnt?create_user={"cid":"${values.cid}", "user_list":${JSON.stringify(values.users)}}`;
    console.log(values, url)
    axios
      .get(url)
      .then((res) => {
        setUploading(false);
        setBtnloading(false);
        message.success("Create successfully.");
        console.log(res);
        setCreateUservisible(false);
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        setBtnloading(false);
        message.error("Create fail.");
      });
  };
  // /user_mgnt?create_user={"cid":"proscend", "user_list":[{"gid":[],"name":"super@proscend.com","password":"70746615DWDddw@","level":"get"}]}
  // /user_mgnt?create_user={"cid":"proscend", "user_list":[{"gid":[],"name":"super@proscend.com","password":"70746615DWDddw", "level":"get"}]}
  return (
    <Modal
      title="Create User"
      visible={CreateUservisible}
      // onOk={() => setCreateUservisible(false)}
      onCancel={() => setCreateUservisible(false)}
      // width='60%'
      className={styles.modal}
      destroyOnClose={true}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={btnloading}
          onClick={() => {
            form.submit();
          }}
        >
           {Translator("ISMS.Submit")}
        </Button>,
      ]}
    >
      <Form name="CreateUser" form={form} onFinish={onFinish}>
          <Form.Item
            name="cid"
            rules={[{ required: true, message: "" }]}
            label={"Customer"}
            style={{display:'none'}}
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
                      rules={[{ required: true, message: "Missing level" }]}
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
                          if (item.cid === record.cid) {
                            return item.group.map((group, groupIndex) => {
                              return (
                                <Option
                                  key={`${index}_${groupIndex}`}
                                  value={group.gid}
                                >
                                  {group.gid}
                                </Option>
                              );
                            });
                          }
                          // return
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
    </Modal>
  );
};

export const CreateUserModalMC = React.memo(CreateUserForm);

const EditUserForm = ({
  GroupList,
  UserEditRecord,
  onEditcid,
  setUploading,
  setEditVisible,
  EditVisible,
  uploading
}) => {
  const [form] = Form.useForm();
  // const [uploading, setUploading] = useState(false)
  const EditUseronFinish = (values) => {
    setUploading(true);
    const EditUserUrl =
      values.password === undefined
        ? `/user_mgnt?modify_user={"cid":"${onEditcid}", "user_list":[{"name":"${
            values.name
          }", "level":"${values.level}", "gid":${JSON.stringify(values.gid)}}]}`
        : `/user_mgnt?modify_user={"cid":"${onEditcid}", "user_list":[{"name":"${
            values.name
          }", "password":"${values.password}", "level":"${
            values.level
          }", "gid":${JSON.stringify(values.gid)}}]}`;
    axios
      .get(EditUserUrl)
      .then((res) => {
        console.log(res);
        setUploading(false);
        message.success("update successfully.");
        form.resetFields()
        setEditVisible(false)
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("update fail.");
        form.resetFields()
      });
    console.log(EditUserUrl);
  };

  useEffect(() => {
    form.setFieldsValue({
      name: UserEditRecord.name,
      level: UserEditRecord.level,
      gid: UserEditRecord.gid,
    });
  }, [UserEditRecord]);

  return (
    <Modal
      title="EditUser"
      visible={EditVisible}
      // onOk={() => setEditVisible(false)}
      okButtonProps={{ form: "EditUser", key: "submit", htmlType: "submit" }}
      onCancel={() => setEditVisible(false)}
      destroyOnClose={true}
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
        name="EditUser"
        autoComplete="off"
        form={form}
        onFinish={EditUseronFinish}
        {...layout}
      >
        <Form.Item
          label="name"
          name="name"
          rules={[
            {
              type: "email",
              required: true,
              message: "name@xxx.com is required",
            },
          ]}
        >
          <Input placeholder="name" disabled={true} />
        </Form.Item>
        <Form.Item
          label="password"
          name="password"
          rules={[
            // { required: true, message: "Missing password" },
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
          <Input placeholder="password" />
        </Form.Item>
        <Form.Item
          label="level"
          name="level"
          rules={[{ required: true, message: "Missing level" }]}
        >
          <Select
          >
            <Option value="super">super</Option>
            <Option value="admin">admin</Option>
            <Option value="get">get</Option>
            <Option value="set">set</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="gid"
          label="Group"
          initialValue={[]}
        >
          <Select
            mode={"multiple"}
          >
            {GroupList.map((item, index) => {
              if (item.cid === onEditcid) {
                return item.group.map((group, groupIndex) => {
                  return (
                    <Option key={`${index}_${groupIndex}_`} value={group.gid}>
                      {group.gid}
                    </Option>
                  );
                });
              }
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const EditUserModalMC = React.memo(EditUserForm);

const  CreateInfoForm = ({ CreateVisible, setCreateVisible, setUploading }) => {
  const [form] = Form.useForm();
  const  CreateInfoonFinish = async(values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    const CreateUserTokenUrl = `/user_mgnt?generate_token={}`
    let UserToken
    await axios.get(CreateUserTokenUrl).then((res) =>{
      // console.log(res)
      UserToken = res.data.response.token
    })
    const CreateInfo = ` /inf_mgnt?create_inf={"cid":"${UserToken}","inf_list":{"company":"${values.company ? values.company : ''}", "contact":"${values.contact ? values.contact: ''}", "mail":"${values.mail ? values.mail: ""}", "phone":"${values.phone ? values.phone : ''}"}}`;
    console.log(CreateInfo);
    axios
      .get(CreateInfo)
      .then((res) => {
        setUploading(false);
        message.success("update successfully.");
        setCreateVisible(false);
        // console.log(CreateInfo);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("update fail.");
      });


      // async function CreateToken(TokenTablerecord) {
      //   setUploading(true);
      //   const generateTokenUrl = `/device_mgnt/token?generate_token={}`;
      //   let newToken;
    
      //   await axios.get(generateTokenUrl).then((res) => {
      //     newToken = res.data.response.token;
      //   });
      //   axios
      //     .get(
      //       `/device_mgnt/token?create_token={"cid":"${TokenTablerecord.cid}", "token_list":["${newToken}"]}`
      //     )
      //     .then((resu) => {
      //       console.log(resu);
      //       setUploading(false);
      //       message.success("Create successfully");
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //       setUploading(false);
      //       message.error("Create fail");
      //     });
      // }
  };

  return (
    <Modal
      title="Create Customer"
      visible={CreateVisible}
      // onOk={() => setCreateVisible(false)}
      onCancel={() => setCreateVisible(false)}
      okButtonProps={{
        form: "CreateInfo",
        key: "submit",
        htmlType: "submit",
      }}
      okText="Create"
      cancelText="Cancel"
    >
      <Form
        {...layout}
        name="CreateInfo"
        onFinish={CreateInfoonFinish}
        form={form}
      >
        {/* <Form.Item name={"cid"} label="CustomerID" rules={[{ required: true }]}>
          <Input />
        </Form.Item> */}
        <Form.Item
          name={"company"}
          label="Company"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"contact"}
          label="Contact Person"
          // rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"mail"}
          label="Email"
          // rules={[{ type: "email", required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"phone"}
          label="Phone"
          // rules={[{ type: "number", required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const CreateInfoModalMC = React.memo(CreateInfoForm);




const  EditUserInfo = ({ EditCustomerInfovisible, setEditCustomerInfovisible, setUploading }) => {
  const [form] = Form.useForm();
  const  EditCustomerInfoOnFinish = async(values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    const CreateUserTokenUrl = `/user_mgnt?generate_token={}`
    let UserToken
    await axios.get(CreateUserTokenUrl).then((res) =>{
      // console.log(res)
      UserToken = res.data.response.token
    })
    const CreateInfo = ` /inf_mgnt?create_inf={"cid":"${UserToken}","inf_list":{"company":"${values.company ? values.company : ''}", "contact":"${values.contact ? values.contact: ''}", "mail":"${values.mail ? values.mail: ""}", "phone":"${values.phone ? values.phone : ''}"}}`;
    console.log(CreateInfo);
    axios
      .get(CreateInfo)
      .then((res) => {
        setUploading(false);
        message.success("update successfully.");
        setEditCustomerInfovisible(false);
        // console.log(CreateInfo);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("update fail.");
      });

  };

  return (
    <Modal
      title="Create Customer"
      visible={EditCustomerInfovisible}
      onCancel={() => setEditCustomerInfovisible(false)}
      okButtonProps={{
        form: "CreateInfo",
        key: "submit",
        htmlType: "submit",
      }}
      okText="Create"
      cancelText="Cancel"
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
          disabled = {true}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"contact"}
          label="Contact Person"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"mail"}
          label="Email"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"phone"}
          label="Phone"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const EditUserInfoMC = React.memo(EditUserInfo);