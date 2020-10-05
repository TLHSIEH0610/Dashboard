import React, { useEffect, useState } from "react";
import { Select, Card, Form, Input, Space, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
// import Swal from 'sweetalert2'
// import { useHistory } from "react-router-dom";
// import { UserLogin } from '../../../Utility/Fetch'
// // import Context from '../../../Utility/Reduxx'
import styles from "./management.module.scss";
import UserC from "./user";
import useURLloader from "../../../hook/useURLloader";

const { Option } = Select;

const NodeReNameC = () => {
  const NodeUrl = `/cmd?get={"nodeInf":{"nodeInf":{"cid":{},"gid":{},"token":{},"id":{}}}}`
  const [loading, response] = useURLloader(NodeUrl)
  const [AllNodes, setAllNodes] = useState([])
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  useEffect(()=>{
      if(response){
        // console.log(response)
        let AllNodes = []
        response.response.nodeInf.forEach((item, index)=>{
            AllNodes.push({key:index, id:item.nodeInf.id})
        })
        setAllNodes(AllNodes)
        console.log(AllNodes)
      }
  }, [response])

  function onChange(value) {
    console.log(`selected ${value}`);
  }
  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }

  function onSearch(val) {
    console.log("search:", val);
  }
  return (
    <Card loading={loading}>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
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
                      name={[field.name, "DeviceID"]}
                      fieldKey={[field.fieldKey, "DeviceID"]}
                      rules={[
                        { required: true, message: "Missing DeviceID" },
                      ]}
                    >
                      <Select
                        showSearch
                        style={{ width: 300 }}
                        placeholder="Select a person"
                        optionFilterProp="children"
                        onChange={onChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                          {
                              AllNodes.map((item,index)=>{
                                  return(
                                    <Option key={index} value={item.id}>{item.id}</Option>
                                  )
                              })
                          }
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "NewName"]}
                      fieldKey={[field.fieldKey, "NewName"]}
                      rules={[{ required: true, message: "Missing NewName" }]}
                    >
                      <Input placeholder="New Device Name" />
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NodeReNameC;
