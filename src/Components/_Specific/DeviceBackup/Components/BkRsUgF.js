import React, { useState, useContext, Fragment, useEffect } from "react";
import styles from "../devicebackup.module.scss";
import {
  Button,
  Form,
  Select,
  Tag,
  message,
  Row,
  Col,
  Divider,
  Modal,
} from "antd";
import axios from "axios";
import Context from "../../../../Utility/Reduxx";
import { useTranslation } from 'react-i18next';

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
  IsUpdate,
  setIsUpdate,
}) => {
  const { state } = useContext(Context);
  const [options, setOptions] = useState([]);
  const [action, setAction] = useState("upgrade");
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const [NoresponseDevice, setNoresponseDevice] = useState([]);
  const [NoResponsevisible, setNoResponsevisible] = useState(false);
  const [ActionList, setActionList] = useState([]);
  const [FileFilterbyAction, setFileFilterbyAction] = useState([]);
  const [DeviceNum, setDeviceNum] = useState(0)
  const { t } = useTranslation();

  useEffect(() => {
    if (state.BackupRestore.ActionStatusList) {
      let ActionList = state.BackupRestore?.ActionStatusList?.filter(
        (item) =>
          item.state !== "START_REBOOT" &&
          item.state !== "FILE_UPLOAD" &&
          item.state !== "COMMAND_ERROR"
      ).map((item) => item.id);
      // console.log(ActionList)
      setActionList(ActionList);
    }
  }, [state.BackupRestore.ActionStatusList, IsUpdate]);

  function SelectAll() {
    const allDevice = options?.filter((item)=>!ActionList.includes(item.id)).map((item) => item.id);
    form.setFieldsValue({
      Device_ID: allDevice,
    });
  }


  function ClearAll() {
    form.setFieldsValue({
      Device_ID: [],
    });
  }

  const onFinish = (values) => {
    setUploading(true);
    // console.log("Received values of form:", values);

    const BRUData = values.Device_ID.map((item) => {
      return `{${
        level === "super_super"
          ? state.Login.Cid === ""
            ? `"cid":"o-smart"`
            : state.Login.Cid
          : `"cid":"${cid}"`
      },"id":"${item}","type":"${
        values.Action === "upgrade" ? "fw" : "cfg"
      }","name":"${
        values.Action === "backup" ? `${item}_${Date.now()}` : values.Repostiry
      }","inf":{"model":"${values.Model}"}}`;
    });

    const BRUBody = `{"set":{"${values.Action}":[${BRUData}]}}`;

    // const BRUBody = {set:{restore:[{cid:"proscend",id:"015FqciQvWxz1Nz148AeAAGa",name:"",type:"cfg",inf:{}}]}}
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: `/cmd`,
      data: JSON.parse(BRUBody),
    };

    // console.log(config.data);

    axios(config)
      .then((res) => {
        console.log(res.data);
        let NoresponseDevice = res.data.response.bck_rst_upg
          .filter((item) => {
            let result = Object.values(item);
            return result[0] === "No Response";
          })
          .map((item) => Object.keys(item)[0]);

        setNoresponseDevice(NoresponseDevice);

        if (NoresponseDevice.length) {
          setNoResponsevisible(true);
        } else {
          message.success("action submit successfully.");
        }

        setUploading(false);
        form.resetFields();
        setIsUpdate(!IsUpdate);
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
    <Fragment>
      <Modal
        visible={NoResponsevisible}
        onCancel={() => {
          setNoResponsevisible(false);
          setNoresponseDevice([]);
        }}
        destroyOnClose={true}
        className={styles.modal}
        centered={true}
        width={"50%"}
        title="Result"
        footer={[
          <Button
            key="Confirm"
            onClick={() => {
              setNoResponsevisible(false);
              setNoresponseDevice([]);
            }}
          >
            Confirm
          </Button>,
        ]}
      >
        <div className={styles.noResponseWording}>
          <h2>No Response</h2>
          <p>
            Device:
            {NoresponseDevice.map((item, index) => (
              <Tag key={index} className={styles.noResponsedevice}>
                {item}
              </Tag>
            ))}
          </p>
        </div>
      </Modal>

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
                label={t("ISMS.Model")}
                name="Model"
                rules={[{ required: true, message: "Model is required" }]}
              >
                <Select
                  loading={uploading || Nodeloading || Fileloading}
                  showArrow
                  placeholder={t("ISMS.Select")}
                  optionFilterProp="children"
                  onChange={(value) => {
                    form.resetFields([["Device_ID"]]);
                    console.log(NodeData);
                    let DevicebyModel = NodeData.filter(
                      (item) => item.model === value
                      && item.health !== "offline"
                    );
                    setOptions(DevicebyModel);
                    setSelectedModel(value);
                  }}
                  onFocus={() => {
                    setUserModel(Array.from(ModelList));
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
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
                label={t("ISMS.Device")}
                name="Device_ID"
                rules={[{ required: true, message: "Deivce Id is required!" }]}
              >
                <Select
                  loading={uploading || Nodeloading || Fileloading}
                  mode="multiple"
                  maxTagCount={1}
                  placeholder={t("ISMS.SelectAvailableDevice")}
                  showArrow
                  tagRender={tagRender}
                  allowClear
                  onChange={(value) => {
                    // console.log(value)
                    form.resetFields(['Action'])
                    setDeviceNum(value.length);
                  }}
                  defaultActiveFirstOption={true}
                  dropdownRender={(menu) => (
                    <Fragment>
                      {menu}
                      <Divider style={{ margin: "4px 0" }} />
                      <Button
                        onClick={() => SelectAll()}
                        style={{ margin: "5px", padding: "3px 5px" }}
                      >
                        {t("ISMS.SelectAll")}
                      </Button>
                      <Button
                        onClick={() => ClearAll()}
                        style={{ margin: "5px", padding: "3px 5px" }}
                      >
                        {t("ISMS.ClearAll")}
                      </Button>
                    </Fragment>
                  )}
                >
                  {options.map((item, index) => {
                    return (
                      <Option
                        key={index}
                        value={item.id}
                        disabled={ActionList.includes(item.id)}
                      >
                        {item.name !== "" ? item.name : item.id} {ActionList.includes(item.id)&& '(Duplicated Action)'}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={10} md={10} lg={4} xl={4}>
              <Form.Item
                label={t("ISMS.Action")}
                name="Action"
                rules={[{ required: true, message: "Action is required" }]}
              >
                <Select
                  loading={uploading || Nodeloading || Fileloading}
                  showSearch
                  showArrow
                  // className={styles.actioninput}
                  placeholder={t("ISMS.Select")}
                  // optionFilterProp="children"
                  onChange={(value) => {
                    setAction(value);

                    let fileType;
                    if (value === "upgrade") {
                      fileType = "fw";
                    } else if (value === "restore") {
                      fileType = "cfg";
                    }
                    // console.log(value, fileType)
                    let FileFilterbyAction = FileRepository?.filter(
                      (item) =>
                        item.type === fileType &&
                        item.inf.model === selectedModel
                    );
                    setFileFilterbyAction(FileFilterbyAction);
                    form.resetFields([["Repostiry"]]);
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="upgrade">{t("ISMS.Upgrade")}</Option>
                  <Option value="backup">{t("ISMS.Backup")}</Option>
                  {DeviceNum <2 && <Option value="restore">{t("ISMS.Restore")}</Option>}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={10} md={10} lg={5} xl={5}>
              <Form.Item
                label={t("ISMS.File")}
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
                  placeholder={t("ISMS.Select")}
                  optionFilterProp="children"
                  notFoundContent={"Not available"}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {FileFilterbyAction?.map((item, index) => (
                    <Option key={index} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={10}
              sm={10}
              md={10}
              lg={3}
              xl={3}
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <Form.Item className={styles.submitBtn}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.clickBtn}
                  loading={uploading || Nodeloading || Fileloading}
                >
                  {t("ISMS.Submit")}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </Fragment>
  );
};

export default BkRsUgF;
