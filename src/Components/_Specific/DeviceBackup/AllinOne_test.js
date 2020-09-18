import React, { useState, useEffect, Fragment } from "react";
import styles from "./devicebackup.module.scss";
import { Button, Card, Space, Form, Select, Tag } from "antd";
import axios from "axios";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {UserLogOut} from '../../../Utility/Fetch'
import { useHistory } from "react-router-dom";
// import useURLloader from '../../../hook/useURLloader'

const AllinOne_test = () => {
  const [form] = Form.useForm();
  const history = useHistory()
 
  const [data, setData] = useState([{ nodeInf: { id: "", model: "" } }]);
  const [FR, setFR] = useState([]);
  const [userModel, setUserModel] = useState([]);
  const [selectedModel, setSelectedModel] = useState('')
  const rawdata = [];
  const Allmodel = new Set();
  const [options, setOptions] = useState([]);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);

  data.forEach((item) => {
    rawdata.push({
      key: item.nodeInf.id,
      id: item.nodeInf.id,
      model: item.nodeInf.model,
    });
    !Allmodel.has(item.nodeInf.model) && Allmodel.add(item.nodeInf.model);
  });

  useEffect(() => {
    // const url = "/api/nodes.json";
    const url = '/cmd?get={"device_status":{}}';
    setLoading(true);
    axios.get(url).then((res) => {
      setData(res.data.response.device_status);
      setLoading(false);
    })
    .catch((err)=>{
      console.log(err.response.status)
      if(err.response.status === 401){
        // dispatch({type:'setLogin', payload:{IsLogin: false}})
        UserLogOut()
        history.push('/login')    
    }
    })
  }, []);

  useEffect(() => {
    const FileRepostoryUrl = "api/CloudLibary.json";
    setLoading(true);
    axios.get(FileRepostoryUrl).then((res) => {
      setFR(res.data.response.repository[0].list);
      setLoading(false);
    });
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    console.log("Received values of form:", values);
    let cid = localStorage.getItem("authUser.cid");
    // let AllDevices = [];
    let RestoreData = [];
    let UpgradeData = [];
    let BackupData = [];

    values.Device_ID.forEach((device) => {
      // AllDevices.push(device);
      values.Action === "restore" &&
        RestoreData.push({
          cid: cid,
          id: device,
          type: "cfg",
          name: device,
          inf: { model: values.Model },
        });
      values.Action === "upgrade" &&
        UpgradeData.push({
          cid: cid,
          id: device,
          type: "fw",
          name: device,
          inf: { model: values.Model },
        });
      values.Action === "backup" &&
        BackupData.push({
          cid: cid,
          id: device,
          type: "cfg",
          name: device,
          inf: { model: values.Model },
        });
    });
    let url = `http://192.168.0.95:8000/cmd?set={"${values.Action}":${
      values.Action === "restore"
        ? JSON.stringify(RestoreData)
        : values.Action === "upgrade"
        ? JSON.stringify(UpgradeData)
        : JSON.stringify(BackupData)
    }}`;
    axios
      .get(url)
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: "Action submitted! please check action log",
          icon: "success",
          showConfirmButton: true,
        });
        setLoading(false);
        form.resetFields();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "Fail, please try again later",
          icon: "error",
          showConfirmButton: true,
        });
        setLoading(false);
        form.resetFields();
      });
  };
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
        title="Action Request"
        className={styles.card}
        // headStyle={{ display: "none" }}
        loading = {loading}
      >
        <Form
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
          className={styles.Form}
        >
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Device</th>
                <th>Action</th>
                <th>File</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            <tr>
            <td>
          <Form.Item
            // label='Model'
            name="Model"
            className={styles.formitem}
            rules={[{ required: true, message: "Model is required" }]}
          >
            <Select
              loading={loading}
              showSearch
              showArrow
              // style={{ width:  100 }}
              // className={styles.actioninput}
              placeholder="Select a model"
              optionFilterProp="children"
              onChange={(value) => {
                form.resetFields([["Device_ID"]]);
                let DevicebyModel = [];
                rawdata.forEach((item) => {
                  if (item.model === value) {
                    DevicebyModel.push(item.id);
                  }
                });
                setOptions(DevicebyModel)
                setSelectedModel(value)
              }}
              onFocus={() => {
                onFocus();
                setUserModel(Array.from(Allmodel));
              }}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {userModel.map((item, index) => {
                return (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          </td>
          <td>
          <Form.Item
            // label='Device'
            // style={{ width: 100 }}
            className={styles.formitem}
            name="Device_ID"
            rules={[{ required: true, message: "Deivce Id is required!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select devices"
              showArrow
              tagRender={tagRender}
              // style={{ width: 230 }}
              className={styles.deviceinput}
              onFocus={() => {
              }}
            >
              {options.map((item, index) => {
                return (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          </td>
          <td>
          <Form.Item
            // label='Action'
            className={styles.formitem}
            name="Action"
            rules={[{ required: true, message: "Action is required" }]}
          >
            <Select
              showSearch
              showArrow
              // style={{ width: 150 }}
              className={styles.actioninput}
              placeholder="Select an action"
              optionFilterProp="children"
              onChange={(value) => {
                setAction(value);
                form.resetFields([["Repostiry"]]);
              }}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="backup">BackUp</Option>
              <Option value="restore">Restore</Option>
              <Option value="upgrade">Upgrade</Option>
            </Select>
          </Form.Item>
          </td>
          <td>
          <Form.Item
            // label='File'
            className={styles.formitem}
            name="Repostiry"
            rules={[
              {
                required: action === "backup" ? false : true,
                message: "File is required!",
              },
            ]}
          >
            <Select
              disabled={action === "backup" ? true : false}
              showSearch
              // style={{ width: 230 }}
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
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
                {action !== null &&
                (action === "backup"
                  ? ""
                  : action === "restore"
                  ? FR.map((item, index) => {
                    if(item.type==='cfg' && item.inf.model===selectedModel){
                      return (
                        <Option key={index} value={item.name}>
                          {item.name}
                        </Option>
                      );
                    }
                    })
                  : FR.map((item, index) => {
                    if(item.type==='fw' && item.inf.model===selectedModel){
                      return (
                        <Option key={index} value={item.name}>
                          {item.name}
                        </Option>
                      );
                    }
                    }))}
            </Select>
          </Form.Item>
          </td>
          <td>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.clickBtn}
            >
              Submit
            </Button>
          </Form.Item>
          </td>
          </tr>
          </tbody>
          </table>
        </Form>
      </Card>
    </Fragment>
  );
};

export default AllinOne_test;

// Backup/Restore/Upgrade
// http://127.0.0.1:8000/cmd?set={"backup":[{"cid":"12345678901234567890123456789011","id":"015E350099100001","name":"1234","type":"cfg","inf":{}}]}
// http://127.0.0.1:8000/cmd?set={"restore":[{"cid":"12345678901234567890123456789011","id":"015E350099100001","name":"1234","type":"cfg","inf":{}}]}
// http://127.0.0.1:8000/cmd?set={"upgrade":[{"cid":"12345678901234567890123456789011","id":"015E350099100001","name":"1234","type":"cfg","inf":{}}]}
