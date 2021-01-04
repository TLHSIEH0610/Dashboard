import React, { useState, useContext, Fragment } from "react";
import styles from "../devicebackup.module.scss";
import { Button, Form, Select, Tag, message, Row, Col, Divider } from "antd";
import axios from "axios";
import Context from "../../../../Utility/Reduxx";
import { Translator } from "../../../../i18n/index";

const BkRsUgF = ({
  uploading,
  setUploading,
  Nodeloading,
  Fileloading,
  form,
  FileRepository,
  userModel,
  setSelectedModel,
  NodeData,
  setUserModel,
  ModelList,
  selectedModel,
}) => {
  const { state } = useContext(Context);
  const [options, setOptions] = useState([]);
  const [action, setAction] = useState(null);
  const cid = localStorage.getItem("authUser.cid");

  function SelectAll(){
    const allDevice = options?.map((item)=>item.id)
    form.setFieldsValue({
      Device_ID: allDevice
    })
  }

  function ClearAll(){
    form.resetFields(['Device_ID'])
  }


  const onFinish = (values) => {
    setUploading(true);
    console.log("Received values of form:", values);
    let ActionStateList = state.BackupRestore.ActionStatusList.filter(
      (item) => {
        return item.state !== "FILE_UPLOAD" && item.state !== "START_REBOOT";
      }
    );
    let ActionStateID = [];
    ActionStateList.forEach((item) => ActionStateID.push(item.id));
    let BRUData = [];


    let CheckIDorName= NodeData.filter((item) => {
      return (
        values.Device_ID.includes(item.id) ||
        values.Device_ID.includes(item.name)
      );
    })


    CheckIDorName.some((device) => {
      if (ActionStateID.length && ActionStateID.includes(device.id)) {
        message.error(`${device.id} is duplicated in action list!`);
        return false;
      }

      BRUData.push(
        `{${
          cid === "proscend"
            ? state.Login.Cid === ""
              ? `"cid":"proscend"`
              : state.Login.Cid
            : `"cid":"${cid}"`
        },"id":"${device.id}","type":"${
          values.Action === "upgrade" ? "fw" : "cfg"
        }","name":"${
          values.Action === "backup"
            ? `${device}_${Date.now()}`
            : values.Repostiry
        }","inf":{"model":"${values.Model}"}}`
      );
    });
    console.log(BRUData);
    // const BRUUrl = `/cmd?set={"${values.Action}":[${BRUData}]}`;
    const BRUUrl = `/cmd`;
    const BRUBody = `{"set":{"${values.Action}":[${BRUData}]}}`;
    console.log(BRUBody);
    console.log(JSON.parse(BRUBody));
    // const BRUBody = {set:{restore:[{cid:"proscend",id:"015FqciQvWxz1Nz148AeAAGa",name:"",type:"cfg",inf:{}}]}}
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: BRUUrl,
      data: JSON.parse(BRUBody),
    };
    console.log(BRUData.length);
    if (!BRUData.length) {
      setUploading(false);
      return;
    }
    console.log(BRUUrl);
    axios(config)
      .then((res) => {
        console.log(res);
        message.success("action submit successfully.");
        setUploading(false);
        form.resetFields();
      })
      .catch((err) => {
        console.log(err);
        message.error("action submit fail.");
        setUploading(false);
        form.resetFields();
      });
  };

  const { Option } = Select;

  function tagRender(props) {
    const { label, _, closable, onClose } = props; // eslint-disable-line no-unused-vars
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
    <Form
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      layout="vertical"
    >
      <div className={styles.formwrap}>
        <Row gutter={24}>
          <Col xs={24} sm={9} md={9} lg={4} xl={4}>
            <Form.Item
              label={Translator("ISMS.Model")}
              name="Model"
              rules={[{ required: true, message: "Model is required" }]}
            >
              <Select
                loading={uploading || Nodeloading || Fileloading}
                showArrow
                placeholder={Translator("ISMS.Select")}
                optionFilterProp="children"
                onChange={(value) => {
                  form.resetFields([["Device_ID"]]);
                  let DevicebyModel = NodeData.filter((item)=>item.model===value)
                  setOptions(DevicebyModel);
                  setSelectedModel(value);
                }}
                onFocus={() => {
                  setUserModel(Array.from(ModelList));
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
          </Col>
          <Col xs={24} sm={14} md={13} lg={9} xl={8}>
            <Form.Item
              label={Translator("ISMS.Device")}
              name="Device_ID"
              rules={[{ required: true, message: "Deivce Id is required!" }]}
            >
              <Select
                loading={uploading || Nodeloading || Fileloading}
                mode="multiple"
                maxTagCount={1}
                placeholder={Translator("ISMS.Select")}
                showArrow
                tagRender={tagRender}
                allowClear
                defaultActiveFirstOption={true}
                dropdownRender={(menu) =>(
                  <Fragment>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <Button onClick={() => SelectAll() }  style={{ margin: "5px", padding:'3px 5px' }}>
                      Select All
                    </Button>
                    <Button onClick={() => ClearAll()}  style={{ margin: "5px", padding:'3px 5px' }}>
                      Clear All
                    </Button>
                  </Fragment>
                )
              }
              >
                {options.map((item, index) => {
                  return (
                    <Option key={index} value={item.id}>
                      {item.name!==''? item.name : item.id}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={10} md={10} lg={4} xl={4}>
            <Form.Item
              label={Translator("ISMS.Action")}
              name="Action"
              rules={[{ required: true, message: "Action is required" }]}
            >
              <Select
                loading={uploading || Nodeloading || Fileloading}
                showSearch
                showArrow
                // className={styles.actioninput}
                placeholder={Translator("ISMS.Select")}
                optionFilterProp="children"
                onChange={(value) => {
                  setAction(value);
                  form.resetFields([["Repostiry"]]);
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="upgrade">Upgrade</Option>
                <Option value="backup" disabled>
                  BackUp
                </Option>
                <Option value="restore" disabled>
                  Restore
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={10} md={10} lg={5} xl={5}>
            <Form.Item
              label={Translator("ISMS.File")}
              name="Repostiry"
              rules={[
                {
                  required: action === "backup" ? false : true,
                  message: "File is required!",
                },
              ]}
            >
              <Select
                loading={uploading || Nodeloading || Fileloading}
                disabled={action === "backup" ? true : false}
                showSearch
                // className={styles.fileinput}
                placeholder={Translator("ISMS.Select")}
                optionFilterProp="children"
                notFoundContent={"Not available"}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {action !== null &&
                  (action === "backup"
                    ? ""
                    : action === "restore"
                    ? FileRepository.map((item, index) => {
                        if (
                          item.type === "cfg" &&
                          item.inf.model === selectedModel
                        ) {
                          return (
                            <Option key={index} value={item.name}>
                              {item.name}
                            </Option>
                          );
                        }
                      })
                    : FileRepository.map((item, index) => {
                        if (
                          item.type === "fw" &&
                          item.inf.model === selectedModel
                        ) {
                          return (
                            <Option key={index} value={item.name}>
                              {item.name}
                            </Option>
                          );
                        }
                      }))}
              </Select>
            </Form.Item>{" "}
          </Col>
          <Col xs={10} sm={10} md={10} lg={3} xl={3} style={{display:'flex', alignItems:'flex-end'}}>
            <Form.Item className={styles.submitBtn}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.clickBtn}
                loading={uploading || Nodeloading || Fileloading}
              >
                {Translator("ISMS.Submit")}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default BkRsUgF;
