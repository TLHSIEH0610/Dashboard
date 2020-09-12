import React, { useState, useEffect } from "react";
import styles from "./devicebackup.module.scss";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Table, Input, Space, Upload, Form, Select, Tag  } from "antd";
import axios from "axios";
// import useURLloader from '../../../hook/useURLloader'
import Highlighter from "react-highlight-words";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";



const Test = () => {
  const url = "/api/nodes.json";
  const FileRepostoryUrl = "api/CloudLibary.json";
  const [data, setData] = useState([{ nodeInf: { id: "", model: "" } }]);
  const [FR, setFR] = useState([]);
  const rawdata = [];
  data.forEach((item) => {
    rawdata.push({
      key: item.nodeInf.id,
      id: item.nodeInf.id,
      model: item.nodeInf.model,
      selectedfile: FR,
    });
  });
  const options = []

data.forEach((item) => {
    options.push({
        value: item.nodeInf.id,
    });
  });

let FilesConstrain = []
const [action, setAction] = useState([])



  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        setData(res.data.response.device_status);
        // console.log(res.data.response)
        setLoading(false);
      })
      .then(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get(FileRepostoryUrl).then((res) => {
      console.log(res.data.CurrentFile);
      setFR(res.data.CurrentFile);
      setLoading(false);
    });
  }, []);

  let txtFile = FR.filter((item)=>{
    return item.FileType === "txt"
  })
  let imgFile = FR.filter((item)=>{
    return item.FileType === "img"
  })

  function RepositoryFilter(key) {
    console.log(key)
    // let thisaction = key
    // console.log( thisaction.action, thisaction.key)
  }

  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };
  const { Option } = Select;

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onBlur() {
    // console.log("blur");
  }

  function onFocus() {
    // console.log("focus");
  }

  function onSearch(val) {
    console.log("search:", val);
  }

  function tagRender(props) {
    const { label, value, closable, onClose } = props;
    return (
      <Tag
        color='black'
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }

  return (
    <Card
      bordered={true}
      title="FileRequest"
      className={styles.card}
      headStyle={{ display: "none" }}
    >
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="users">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field) =>  (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "Device_ID1"]}
                      fieldKey={[field.fieldKey, "Device_ID1"]}
                      rules={[
                        { required: true, message: "Deivce Id is required!" },
                      ]}
                    >
                          <Select
                                mode="multiple"
                                showArrow
                                tagRender={tagRender}
                                style={{ width: 300 }}
                                options={options}
                            />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "Action"]}
                      fieldKey={[field.fieldKey, "Action"]}
                      rules={[
                        { required: true, message: "Action is required" },
                      ]}
                    >
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select an action"
                        optionFilterProp="children"
                        // onChange={onChange}
                        
                        onChange={(value)=>{
                          let IndexOfRepeat =''
                          FilesConstrain.forEach((item)=>{
                            // console.log(Object.keys(item))
                            if(Object.keys(item) == field.key){
                              IndexOfRepeat = FilesConstrain.indexOf(item)
                              FilesConstrain.splice(IndexOfRepeat,1)
                            }
                          })
                            let Temp = {}
                            const rowKey = field.key
                            Temp[rowKey] = value
                            FilesConstrain.push(Temp)
                            field['action']= value
                            console.log(field)
                        }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="backup">BackUp</Option>
                        <Option value="restore">Restore</Option>
                        <Option value="upgrade">Upgrade</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "Repostiry"]}
                      fieldKey={[field.fieldKey, "Repostiry"]}
                      rules={[{ required: true, message: "File is required!" }]}
                    >
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a file"
                        optionFilterProp="children"
                        onChange={(value)=>{

                        }}
                        onFocus={()=>{
                          onFocus()
                          setAction(field.action)
                        }}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      > 
                      {
                        // RepositoryFilter(field)
                      (action ==='backup'? '' : (action==='restore'? 
                      txtFile.map((txt, index)=>{
                       return <Option key={index} value={txt.FileName}>{txt.FileName}</Option>
                      })
                      :
                      imgFile.map((img, index)=>{
                       return <Option key={index} value={img.FileName}>{img.FileName}</Option>
                      })
                      ))
                      }
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Test;
