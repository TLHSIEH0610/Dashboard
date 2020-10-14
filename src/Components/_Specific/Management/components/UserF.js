import React, { useEffect, useContext } from "react";
import {
  Input,
  Form,
  Button,
  InputNumber,
  Space,
  Select,
  message
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Context from "../../../../Utility/Reduxx";
import axios from 'axios'

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const CreateUserForm = ({ onFinish, GroupList, record }) => {
  const [form] = Form.useForm();
  const { state } = useContext(Context);

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  useEffect(()=>{
    form.setFieldsValue({
      cid: record.cid
    });
  })

  return (
    <Form name="CreateUser" autoComplete="off" form={form} onFinish={onFinish}>
      {state.Login.Cid === "" ? (
        <Form.Item name="cid" rules={[{ required: true, message: "" }]} label={'Customer'}>
          <Input disabled={true} />
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
          <Input disabled={true}/>
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
                    <Input placeholder="Name@xxx.com" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, "password"]}
                    fieldKey={[field.fieldKey, "password"]}
                    rules={[{ required: true, message: "Missing password" }]}
                  >
                    <Input placeholder="Password" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, "level"]}
                    fieldKey={[field.fieldKey, "level"]}
                    rules={[
                      { required: true, message: "Missing level" },
                    ]}
                  >
                    <Select 
                    // style={{ width: 120 }}
                     onChange={handleChange}
                     placeholder='Level  '
                    >
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
                    rules={[{ required: true, message: "Missin Group" }]}
                  >
                    <Select 
                      style={{ width: 120 }}
                      onChange={handleChange}
                      mode={"multiple"}
                      placeholder='Group'
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
                  <PlusOutlined /> Add User
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
    </Form>
  );
};

export const EditUserForm = ({ GroupList, UserEditRecord, onEditcid, setUploading }) => {
  const [form] = Form.useForm();
  console.log(GroupList,UserEditRecord, onEditcid)

  const EditUseronFinish = (values) => {
    console.log(values, UserEditRecord);
    setUploading(true);
    const EditUserUrl = values.password ===undefined? `/user_mgnt?modify_user={"cid":"${onEditcid}", "user_list":[{"name":"${
      values.name
    }", "level":"${values.level}", "gid":${JSON.stringify(
      values.gid
    )}}]}` : `/user_mgnt?modify_user={"cid":"${onEditcid}", "user_list":[{"name":"${
      values.name
    }", "password":"${values.password}", "level":"${values.level}", "gid":${JSON.stringify(
      values.gid
    )}}]}`
    axios
      .get(EditUserUrl)
      .then((res) => {
        console.log(res);
        setUploading(false);
        message.success("update successfully.");
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("update fail.");
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

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <Form name="EditUser" autoComplete="off" form={form} onFinish={EditUseronFinish}>
      <Form.Item
       label='name'
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
        label='password'
        name="password"
        // rules={[{ required: true, message: "Missing password" }]}
      >
        <Input placeholder="password" />
      </Form.Item>
      <Form.Item
        label='level'
        name="level"
        rules={[{ required: true, message: "Missing level" }]}
      >
        <Select style={{ width: 120 }} onChange={handleChange}>
          <Option value="super">super</Option>
          <Option value="admin">admin</Option>
          <Option value="get">get</Option>
          <Option value="set">set</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="gid"
        label='Group'
        // rules={[{ required: true, message: "Missing gid" }]}
      >
        <Select
          style={{ width: 120 }}
          onChange={handleChange}
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
  );
};

export const CreateInfoForm = ({ onFinish }) => {
  const [form] = Form.useForm();
  return (
    <Form
      {...layout}
      name="CreateInfo"
      onFinish={onFinish}
      form={form}
    >
      <Form.Item name={"cid"} label="CustomerID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={"company"} label="Company" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name={"contact"}
        label="Contact Person"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"mail"}
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
    </Form>
  );
};