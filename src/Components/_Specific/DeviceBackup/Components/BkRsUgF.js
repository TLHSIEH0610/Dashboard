import React, { useState, useContext } from "react";
import styles from "../devicebackup.module.scss";
import { Button, Form, Select, Tag, message } from "antd";
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

    // const deviceID = NodeData.filter((item)=>{
    //   if(values.Device_ID.includes(item))
    // })
    const CheckIDorName = NodeData.filter((item) => {
      return (
        values.Device_ID.includes(item.id) ||
        values.Device_ID.includes(item.name)
      );
    });
    console.log(
      ActionStateList,
      values,
      NodeData,
      CheckIDorName,
      ActionStateID
    );
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

    const BRUUrl = `/cmd?set={"${values.Action}":[${BRUData}]}`;
    if(!BRUData.length){setUploading(false); return}
    console.log(BRUUrl);
    axios
      .post(BRUUrl)
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
    >
      <div className={styles.formwrap}>
        <div className={styles.formDiv}>
          <p>{Translator("ISMS.Model")}</p>
          <Form.Item
            // label='Model'
            name="Model"
            className={styles.formitem}
            rules={[{ required: true, message: "Model is required" }]}
          >
            <Select
              loading={uploading || Nodeloading || Fileloading}
              showSearch
              showArrow
              className={styles.modelinput}
              placeholder={Translator("ISMS.Select")}
              optionFilterProp="children"
              onChange={(value) => {
                form.resetFields([["Device_ID"]]);
                let DevicebyModel = [];
                NodeData.forEach((item) => {
                  if (item.model === value && item.name === "") {
                    DevicebyModel.push(item.id);
                  } else if (item.model === value && item.name !== "") {
                    DevicebyModel.push(item.name);
                  }
                });
                setOptions(DevicebyModel);
                setSelectedModel(value);
              }}
              onFocus={() => {
                setUserModel(Array.from(ModelList));
              }}
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
        </div>
        <div className={styles.formDiv}>
          <p>{Translator("ISMS.Device")}</p>
          <Form.Item
            className={styles.formitem}
            name="Device_ID"
            rules={[{ required: true, message: "Deivce Id is required!" }]}
          >
            <Select
              loading={uploading || Nodeloading || Fileloading}
              mode="multiple"
              placeholder={Translator("ISMS.Select")}
              showArrow
              tagRender={tagRender}
              className={styles.deviceinput}
              onFocus={() => {}}
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
        </div>
        <div className={styles.formDiv}>
          <p>{Translator("ISMS.Action")}</p>
          <Form.Item
            className={styles.formitem}
            name="Action"
            rules={[{ required: true, message: "Action is required" }]}
          >
            <Select
              loading={uploading || Nodeloading || Fileloading}
              showSearch
              showArrow
              className={styles.actioninput}
              placeholder={Translator("ISMS.Select")}
              optionFilterProp="children"
              onChange={(value) => {
                setAction(value);
                form.resetFields([["Repostiry"]]);
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
        </div>
        <div className={styles.formDiv}>
          <p>{Translator("ISMS.File")}</p>
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
              loading={uploading || Nodeloading || Fileloading}
              disabled={action === "backup" ? true : false}
              showSearch
              className={styles.fileinput}
              placeholder={Translator("ISMS.Select")}
              optionFilterProp="children"
              notFoundContent={"Not available"}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
          </Form.Item>
        </div>
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
      </div>
    </Form>
  );
};

export default BkRsUgF;
