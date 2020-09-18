import React, { useState, useEffect, Fragment } from "react";
import styles from "./devicebackup.module.scss";
import { Button, Card, Space, Form, Select, Tag  } from "antd";
import axios from "axios";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from 'sweetalert2'
// import useURLloader from '../../../hook/useURLloader'

const AllinOne = () => {
  const [form] = Form.useForm();
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
  const options = [];

  data.forEach((item) => {
    options.push({
      value: item.nodeInf.id,
    });
  });

  const [action, setAction] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        setData(res.data.response.device_status);
        setLoading(false);
      })
      .then(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get(FileRepostoryUrl).then((res) => {
      // console.log(res.data.CurrentFile);
      setFR(res.data.CurrentFile);
      setLoading(false);
    });
  }, []);

  let txtFile = FR.filter((item) => {
    return item.FileType === "txt";
  });

  let imgFile = FR.filter((item) => {
    return item.FileType === "img";
  });

  const onFinish = (values) => {
    console.log("Received values of form:", values)
    let cid = localStorage.getItem('authUser.cid')
    let Formdata = values.users
    let AllDevices = []
    let UploadData = []
    let DownloadData = []
    // console.log(cid, data)
    Formdata.forEach((item)=>{
        item.Device_ID1.forEach((device)=>{
          AllDevices.push(device)
          item.Action ==='restore'&&  UploadData.push({cid:cid, id:device, file_type:'txt', file_name:device }) 
          item.Action ==='upgrade'&&  DownloadData.push({cid:cid, id:device, file_type:'img', file_name:device }) 
        })
    })
    if(AllDevices.length !== (Array.from(new Set(AllDevices))).length){
      Swal.fire({
        title: 'Duplicated deviceID in different action!',
        icon: 'error',
        showConfirmButton: true,
        // timer: 1200
      })
      return
    }
    // UploadData.length!==0 && axios.post(`/file_mgnt?upload_file=${UploadData}`)
    // DownloadData.length!==0 && axios.post(`/file_mgnt?download_file=${DownloadData}`)
  }
  const { Option } = Select;


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
        color="black"
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }

  return (
    <Fragment>
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
        form={form}
      >
        <Form.List name="users">
          {(fields, { add, remove }) => {
            return (
              <div className={styles.outerspace}>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                    className={styles.space}
                  >
                    <Form.Item
                      // label={"Device"}
                      {...field}
                      // style={{ width: 100 }}
                      className={styles.formitem}
                      name={[field.name, "Device_ID1"]}
                      fieldKey={[field.fieldKey, "Device_ID1"]}
                      rules={[
                        { required: true, message: "Deivce Id is required!" },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select devices"
                        showArrow
                        tagRender={tagRender}
                        style={{ width: 230 }}
                        className={styles.deviceinput}
                        options={options}
                      />
                    </Form.Item>
                    <Form.Item
                      // label={"Action"}
                      {...field}
                      name={[field.name, "Action"]}
                      fieldKey={[field.fieldKey, "Action"]}
                      rules={[
                        { required: true, message: "Action is required" },
                      ]}
                    >
                      <Select
                        showSearch
                        showArrow
                        style={{ width: 150 }}
                        className={styles.actioninput}
                        placeholder="Select an action"
                        optionFilterProp="children"
                        onChange={(value) => {
                          field["action"] = value;
                          let Temp = { ...action };
                          Temp[`${field.key}`] = value;
                          setAction(Temp);
                          form.resetFields([
                            ["users", field.name, "Repostiry"],
                          ]);
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
                      // label={"File"}
                      {...field}
                      name={[field.name, "Repostiry"]}
                      fieldKey={[field.fieldKey, "Repostiry"]}
                      rules={[
                        {
                          required:
                            action[`${field.key}`] === "backup" ? false : true,
                          message: "File is required!",
                        },
                      ]}
                    >
                      <Select
                        disabled={
                          action[`${field.key}`] === "backup" ? true : false
                        }
                        showSearch
                        style={{ width: 230 }}
                        className={styles.fileinput}
                        placeholder="Select a file"
                        optionFilterProp="children"
                        notFoundContent={"Not available"}
                        onChange={(value) => {}}
                        onFocus={() => {
                          onFocus();
                        }}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {action[`${field.key}`] !== undefined &&
                          (action[`${field.key}`] === "backup"
                            ? ""
                            : action[`${field.key}`] === "restore"
                            ? txtFile.map((txt, index) => {
                                return (
                                  <Option key={index} value={txt.FileName}>
                                    {txt.FileName}
                                  </Option>
                                );
                              })
                            : imgFile.map((img, index) => {
                                return (
                                  <Option key={index} value={img.FileName}>
                                    {img.FileName}
                                  </Option>
                                );
                              }))}
                      </Select>
                    </Form.Item>

                    <MinusCircleOutlined
                      style={{color: 'red'}}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    className={styles.clickBtn}
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
          <Button type="primary" htmlType="submit" className={styles.clickBtn}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
     </Fragment>
  );
};

export default AllinOne;


// Backup/Restore/Upgrade
// http://127.0.0.1:8000/cmd?set={"backup":[{"cid":"12345678901234567890123456789011","id":"015E350099100001","name":"1234","type":"cfg","inf":{}}]}
// http://127.0.0.1:8000/cmd?set={"restore":[{"cid":"12345678901234567890123456789011","id":"015E350099100001","name":"1234","type":"cfg","inf":{}}]}
// http://127.0.0.1:8000/cmd?set={"upgrade":[{"cid":"12345678901234567890123456789011","id":"015E350099100001","name":"1234","type":"cfg","inf":{}}]}
