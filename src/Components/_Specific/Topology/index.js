import React, { useEffect, useState, useContext, Fragment } from "react";
import {
  Form,
  Input,
  Card,
  Table,
  Tooltip,
  message,
  Row,
  Menu,
  Dropdown,
  Tabs,
  Select,
  Button,
  Col,
  Modal,
  Checkbox,
  Divider,
  Tag
} from "antd";
import Context from "../../../Utility/Reduxx";
import useURLloader from "../../../hook/useURLloader";
import { MdCastConnected } from "react-icons/md";
import styles from "./topology.module.scss";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";
import { TopoIoTMC } from "./components/TopoIoTC";
import { RiAlarmWarningFill, RiEdit2Fill } from "react-icons/ri";
import { FcDocument, FcSettings, FcSynchronize } from "react-icons/fc";
import { FaMapMarkerAlt, FaAutoprefixer } from "react-icons/fa";
import { AlarmLogMC } from "./components/AlarmLogC";
import { DeviceStateMC } from "./components/DeviceStateC";
import { healthIcon, strengthIcon } from "./components/TopologyF";
import { TopoFilterMC } from "./components/Filter";
import TrackMap from "../Track_Map/TrackerMap";
import { UserLogOut } from "../../../Utility/Fetch";
// import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ViewAllStatusMC } from "./components/ViewAllStatusC";
import { BulkConfigMC } from "./components/BulkConfigC";
import { useTranslation } from "react-i18next";
import { BsBootstrapReboot } from "react-icons/bs";


const { TabPane } = Tabs;
const { Option } = Select;
const { Column } = Table;

const TopologyC = () => {
  const { state, dispatch } = useContext(Context);
  const history = useHistory();
  const [uploading, setUploading] = useState(false);
  const [IsUpdate, setIsUpdate] = useState(false);
  const [DeviceTableIsUPdate, setDeviceTableIsUPdate] = useState(false)
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const [form] = Form.useForm();
  const NodeInfoUrl = "/cmd";
  const Urldata = `{"get":{"device_status":{"filter":{${
    level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
  }},"nodeInf":{},"obj":{}}}}`;
  const [NodeInfoLoading, NodeInfoResponse] = useURLloader(
    NodeInfoUrl,
    Urldata,
    IsUpdate, 
    DeviceTableIsUPdate
  );
  const { t } = useTranslation();
    // console.log(IsUpdate, DeviceTableIsUPdate)
  const [EditCityVisible, setEditCityVisible] = useState(false);
  // const [CreateAPIVisible, setCreateAPIVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [CityAction, setCityAction] = useState("");
  const [Editable, setEditable] = useState(false);
  const [RebootEditable, setRebootEditable] = useState(false);
  const [cityform] = Form.useForm();
  const [AutoRefresh, setAutoRefresh] = useState(false)
  // const [apiform] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [restore, setRestore] = useState([]);
  const [groups, setgroups] = useState([]);
  const [cities, setcities] = useState([]);
  const [models, setModels] = useState([]);
  const [AlarmTablevisible, setAlarmTablevisible] = useState(false);
  const [DeviceStatevisible, setDeviceStatevisible] = useState(false);
  const [IoTvisible, setIoTvisible] = useState(false);
  const [Mapvisible, setMapvisible] = useState(false);
  // const EditableContext = React.createContext();
  const [AlarmRecord, setAlarmRecord] = useState([]);
  const [DeviceStatusRecord, setDeviceStatusRecord] = useState([]);
  const [SettingRecord, setSettingRecord] = useState(undefined);
  const [IoTRecord, setIoTRecord] = useState([]);
  const [MapRecord, setMapRecord] = useState([]);
  const [count, setCount] = useState(0);
  const [Tab, setTab] = useState("1");
  const [editingKey, setEditingKey] = useState("");

  useEffect(()=>{
    if(!AutoRefresh){
      return
    }
      console.log('有執行')
      // setIsUpdate(!IsUpdate)
      setDeviceTableIsUPdate(!DeviceTableIsUPdate)
      const stateInterval = setInterval(() => {
        setCount((prevState) => prevState + 1);
      }, 10000);

    return () => clearInterval(stateInterval);
          // eslint-disable-next-line react-hooks/exhaustive-deps
  },[AutoRefresh, count])

  const edit = (index) => {
    // console.log(record.key)
    setEditingKey(index);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const RenameOnFinish = (value, record) => {
    console.log(value, record);

    setUploading(true);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"node_name":{"filter":{"cid":"${record.cid}"},"list":[{"id":"${record.id}","name":"${value.name}"}]}}}`
      ),
    };
    console.log(config.data)
    axios(config)
      .then((res) => {
        console.log(res);
        message.success("rename successfully.");
        setIsUpdate(!IsUpdate);
        setUploading(false);
        cancel();
      })
      .catch((error) => {
        console.log(error);
        message.error("rename fail.");
        setUploading(false);
        cancel();
        if (error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
          message.error("update failed");
        }
      });
  };

  useEffect(() => {
    if (NodeInfoResponse?.response) {
      console.log(NodeInfoResponse.response);
      let groups = new Set();
      let models = new Set();
      let cities = new Set();
      let NodeInfo = NodeInfoResponse.response.device_status.map(
        (item, index) => {
          if (item.nodeInf.gid?.length) {
            item.nodeInf.gid.forEach((item) => groups.add(item));
          }
          models.add(item.nodeInf.model);
          if (item.nodeInf.city) {
            cities.add(item.nodeInf.city);
          }

          return {
            city: item.nodeInf.city,
            key: index,
            id: item.nodeInf.id,
            name: item.nodeInf.name,
            health: item.nodeInf.health,
            model: item.nodeInf.model,
            lastupdate: item.nodeInf.lastUpdate,
            strength: item.nodeInf.sim,
            connection: item.nodeInf.connect,
            cid: item.nodeInf.cid,
            gid: item.nodeInf.gid,
            lat: item.obj?.status?.gps?.latitude,
            log: item.obj?.status?.gps?.longitude,
          };
        }
      );
      groups = Array.from(groups);
      models = Array.from(models);
      cities = Array.from(cities);
      // console.log(NodeInfo);
      setDataSource(NodeInfo);
      setRestore(NodeInfo);
      setModels(models);
      setgroups(groups);
      setcities(cities);
    } else {
      setDataSource(undefined);
    }
  }, [NodeInfoResponse]);

  const menu = (record, index) => {
    return (
      <Menu>
        <Menu.Item key={index}>{IconforGenerator(record, index)}</Menu.Item>
      </Menu>
    );
  };

  function IconforGenerator(record, index) {
    // console.log(record)
    return (
      <div className={styles.RWDwrapper}>
        <Tooltip title={`${t("ISMS.health")}: ${record.health}`}>
          {healthIcon(record.health)}
        </Tooltip>
        <Tooltip title={`${t("ISMS.signal")}: ${record.strength}`}>
          {strengthIcon(record.strength)}
        </Tooltip>

        <Tooltip title={t("ISMS.Alarm")}>
          <a
            href="/#"
            key={index}
            onClick={(e) => {
              e.preventDefault();
              setAlarmTablevisible(true);
              setAlarmRecord(record);
            }}
          >
            <RiAlarmWarningFill
              className={styles.alarmlog}
              style={record.health === "up" && { color: "lightgray" }}
            />
          </a>
        </Tooltip>
        <Tooltip title={t("ISMS.DeviceStatus")}>
          <a
            href="/#"
            key={index}
            onClick={(e) => {
              // console.log(record);
              e.preventDefault();
              setDeviceStatevisible(true);
              setDeviceStatusRecord(record);
            }}
          >
            <FcDocument className={styles.Status} />
          </a>
        </Tooltip>
        <Tooltip title={t("ISMS.Map")}>
          <a
            href="/#"
            key={index}
            onClick={(e) => {
              e.preventDefault();
              setMapvisible(true);
              setMapRecord(record);
            }}
          >
            <FaMapMarkerAlt className={styles.Map} />
          </a>
        </Tooltip>
        <Tooltip title={t("ISMS.ViewIoT")}>
          <a
            href="/#"
            key={index}
            onClick={(e) => {
              e.preventDefault();
              setIoTvisible(true);
              setIoTRecord(record);
              // console.log(record);
            }}
          >
            <MdCastConnected className={styles.IoT} />
          </a>
        </Tooltip>
        <Tooltip
          title={
            record.health === "offline"
              ? t("ISMS.Setting(Offline)")
              : t("ISMS.Setting")
          }
        >
          <a
            href="/#"
            key={index}
            style={{ position: "relative" }}
            onClick={(e) => {
              e.preventDefault();
              if (record.health !== "offline") {
                setTab("3");
                setSettingRecord(record);
              } else {
                return;
              }
            }}
          >
            <FcSettings
              className={`${styles.Setting} ${
                record.health === "offline" && styles.inhibit
              }`}
            />
          </a>
        </Tooltip>
      </div>
    );
  }

  const Tabcallback = (value) => {
    setTab(value);
    setSettingRecord(undefined);
  };

  function UpdateCityonFinish(value) {
    // console.log(value);
    setUploading(true);
    let ActionURL;
    if (value.action === "Self Define") {
      const str = value.devices.map((item) => {
        return `{"id":"${item}", "city":"${value.city_name}"}`;
      });

      ActionURL = `{"set":{"city":{"filter":{},"list":[${str}]}}}`;
    } else {
      ActionURL = `{"set":{"geocoding":{"filter":{${
        level === "super_super"
          ? state.Login.Cid === ""
            ? `"cid":"o-smart"`
            : state.Login.Cid
          : `"cid":"${cid}"`
      }, "id":${JSON.stringify(value.devices)}}, "action":"${value.action}"}}}`;
    }

    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(ActionURL),
    };

    // console.log(config.data);

    axios(config)
      .then((res) => {
        console.log(res.data);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        setEditCityVisible(false);
        setEditable(false);
        message.success("update successfully, data is now refeshing");
      })
      .catch((error) => {
        console.error(error);
        setUploading(false);
        if (error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
          message.error("update failed");
        }
      });
  }

  const handleSelect = (record, selected) => {
    if (selected) {
      setSelectedRowKeys((keys) => [...keys, record.id]);
    } else {
      setSelectedRowKeys((keys) => {
        const index = keys.indexOf(record.id);
        return [...keys.slice(0, index), ...keys.slice(index + 1)];
      });
    }
  };

  const toggleSelectAll = () => {
    setSelectedRowKeys((keys) =>
      keys.length === dataSource.length ? [] : dataSource.map((r) => r.id)
    );
  };

  const headerCheckbox = (
    <Checkbox
      checked={selectedRowKeys.length}
      indeterminate={
        selectedRowKeys.length > 0 && selectedRowKeys.length < dataSource.length
      }
      onChange={toggleSelectAll}
    />
  );

  const [ResultList, setResultList] = useState(undefined);
  const [Rebootvisible, setRebootvisible] = useState(false);
  function RebootDevices(selectedRowKeys) {
    setUploading(true);

    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"reboot":{"device_cfg":{"filter":{"id":${JSON.stringify(
          selectedRowKeys
        )}},"nodeInf":{}}}}`
      ),
    };
    // console.log(config);
    axios(config)
      .then((res) => {
        let rebootfailDevices = res.data.response?.device_cfg;
        console.log(res.data);
        message.success("submit reboot command");
        if (res.data.response?.device_cfg) {
          rebootfailDevices = rebootfailDevices
            .filter((item) => item.obj === "No Response!")
            .map((item) => item.nodeInf.id);
        }

        if (rebootfailDevices?.length) {
          setRebootvisible(true);
          setResultList(rebootfailDevices);
        }
        setUploading(false);
        setIsUpdate(!IsUpdate);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setUploading(false);
        message.error("reboot fail.");
      });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Fragment>
      <Modal
        visible={Rebootvisible}
        onCancel={() => {
          setRebootvisible(false);
          setResultList([]);
        }}
        destroyOnClose={true}
        className={styles.modal}
        centered={true}
        width={"50%"}
        title="Result"
        footer={[
          <Button key="Confirm" onClick={() => setRebootvisible(false)}>
            Confirm
          </Button>,
        ]}
      >
        {ResultList?.length && (
          <div className={styles.rebootWording}>
            <h2>No Response</h2>
            <p>
              Device:
              {ResultList?.map((item, index) => (
                <span key={index} className={styles.rebootdevice}>
                  {item}
                </span>
              ))}
            </p>
            <Divider />
          </div>
        )}
      </Modal>

      <Modal
        visible={EditCityVisible}
        onCancel={() => {
          setEditCityVisible(false);
          cityform.resetFields();
        }}
        destroyOnClose={true}
        className={`${styles.modal} ${styles.Citymodal}`}
        centered={true}
        title={t("ISMS.Edit Location")}
        footer={[
          <Button
            loading={uploading}
            key="Cancel"
            onClick={() => setEditCityVisible(false)}
          >
            {t("ISMS.Cancel")}
          </Button>,
          <Button
            key="Save"
            type="primary"
            loading={uploading}
            onClick={() => cityform.submit()}
          >
            {t("ISMS.Submit")}
          </Button>,
        ]}
      >
        <Form
          form={cityform}
          layout="vertical"
          onFinish={(value) => UpdateCityonFinish(value)}
        >
          <div className={`${styles.FormWrapper} ${styles.BulkFormWrapper}`}>
            <Row gutter={24} justify="flex-start">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  name={"devices"}
                  label={t("ISMS.SelectDevice")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    placeholder={t("ISMS.Device")}
                    maxTagCount={1}
                    mode={"multiple"}
                  >
                    {restore?.map((item, index) => (
                      <Option key={index} value={item.id}>
                        {item.name !== "" ? item.name : item.id}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name={"action"}
                  label={t("ISMS.Updatewith")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    placeholder={t("ISMS.SelectaMethod")}
                    onChange={(value) => {
                      setCityAction(value);
                    }}
                    // disabled={value !== "Import"}
                  >
                    <Option value={"Self Define"}>
                      {" "}
                      {t("ISMS.ManualInput")}
                    </Option>
                    <Option value={"renew"}>{t("ISMS.AutoInput")}</Option>
                  </Select>
                </Form.Item>
                {CityAction === "Self Define" && (
                  <Form.Item
                    name={"city_name"}
                    label={t("ISMS.Location")}
                    rules={[
                      {
                        required: true,
                        message: "required!",
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("ISMS.InputaLocation")}
                      disabled={CityAction !== "Self Define"}
                    />
                  </Form.Item>
                )}
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>

      <Tabs onChange={(value) => Tabcallback(value)} activeKey={Tab}>
        <TabPane tab={t("ISMS.Device")} key="1">
          <AlarmLogMC
            setRecord={setAlarmRecord}
            record={AlarmRecord}
            AlarmTablevisible={AlarmTablevisible}
            setAlarmTablevisible={setAlarmTablevisible}
          />

          <DeviceStateMC
            record={DeviceStatusRecord}
            setRecord={setDeviceStatusRecord}
            DeviceStatevisible={DeviceStatevisible}
            setDeviceStatevisible={setDeviceStatevisible}
          />

          <TopoIoTMC
            IoTvisible={IoTvisible}
            setIoTvisible={setIoTvisible}
            // setDeviceindex={setDeviceindex}
            record={IoTRecord}
            setRecord={setIoTRecord}
          />

          <TrackMap
            // drawerVisible={drawerVisible}
            // setDrawerVisible={setDrawerVisible}
            setMapvisible={setMapvisible}
            Mapvisible={Mapvisible}
            record={MapRecord}
            setRecord={setMapRecord}
          />

          <Card
            style={{ marginBottom: "10px" }}
            className={styles.TopoTableCard}
            title={t("ISMS.Filter")}
          >
            <TopoFilterMC
              setDataSource={setDataSource}
              groups={groups}
              dataSource={dataSource}
              uploading={NodeInfoLoading}
              cities={cities}
              restore={restore}
            />
          </Card>
          {/* setAutoRefreshVisible setRebootVisible */}
          <Card
            bodyStyle={{ padding: "2px" }}
            title={t("ISMS.DevicesOverview")}
            extra={
              <div className={styles.IconWrapper}>
                <Tooltip title={t("ISMS.Refresh")}>
                  <Button
                    icon={<FcSynchronize style={{fontSize:'1.7rem'}} />}
                    onClick={() => setDeviceTableIsUPdate(!DeviceTableIsUPdate)}
                  />
                </Tooltip>

                <Tooltip title={t("ISMS.AutoRefresh")}>
                  <Button style={AutoRefresh ? {background:'#FFEFD5'} : null} onClick={()=>setAutoRefresh(!AutoRefresh)} icon={<div className={styles.autoRefresh}> <FcSynchronize style={{fontSize:'1.7rem'}}/><FaAutoprefixer className={styles.alphet}/></div>} />
                </Tooltip>

                {level !=='get' && <Tooltip title={t("ISMS.Reboot")}>
                  {RebootEditable ? (
                    <div className={styles.RebootWrapper}>
                      <Tag
                        className={styles.editcity}
                        style={!selectedRowKeys?.length ?{cursor:'not-allowed'} : null}
                        onClick={() => {
                          if(!selectedRowKeys?.length){
                            return
                          }
                          RebootDevices(selectedRowKeys);
                          setRebootEditable(false)
                        }}
                      >
                        {t("ISMS.Reboot")}
                      </Tag>
                      <Tag
                        className={styles.editcity}
                        onClick={() =>{ setRebootEditable(false); setSelectedRowKeys([])}}
                      >
                        {t("ISMS.Cancel")}
                      </Tag>
                    </div>
                  ) : (
                    <Button
                      icon={<BsBootstrapReboot className={styles.RebootIcon}/>}
                      onClick={() => setRebootEditable(true)}
                    />
                  )}
                </Tooltip>}
              </div>
            }
          >
            <Table
              className={styles.TopoTable}
              rowClassName={() => "editable-row"}
              bordered
              loading={NodeInfoLoading || uploading}
              dataSource={dataSource}
              // columns={columns}
              rowKey={(record) => record.id}
              rowSelection={
                Editable || RebootEditable
                  ? {
                      selectedRowKeys,
                      onSelect: handleSelect,
                      columnTitle: headerCheckbox,
                    }
                  : null
              }
            >
              <Column
                title={
                  <Fragment>
                    {t("ISMS.Location")}
                    {Editable ? (
                      <Fragment>
                        <p
                          className={styles.editcity}
                          onClick={() => {
                            setEditCityVisible(true);
                            cityform.setFieldsValue({
                              devices: selectedRowKeys,
                            });
                          }}
                        >
                          {t("ISMS.Update")}
                        </p>
                        <p
                          className={styles.editcity}
                          onClick={() => setEditable(false)}
                        >
                          {t("ISMS.Cancel")}
                        </p>
                      </Fragment>
                    ) : (
                      level !== "get" && (
                        <span
                          style={{ marginLeft: "3px" }}
                          className={styles.editcity}
                          onClick={() => setEditable(true)}
                        >
                          {t("ISMS.edit")}
                        </span>
                      )
                    )}
                  </Fragment>
                }
                dataIndex="city"
                render={(text, record) => {
                  // console.log(record)
                  if (record.city) {
                    return text;
                  } else if (record.lat) {
                    return `${record.lat},${record.log}`;
                  } else {
                    return "No GPS Data";
                  }
                }}
              />

              <Column
                title={t("ISMS.Device")}
                dataIndex="name"
                editable={level !== "get"}
                render={(_, record, index) => {
                  return (
                    // <div className={styles.rename}>
                    <Fragment>
                      {editingKey !== index ? (
                        <div className={styles.rename}>
                          <Tooltip title={record.id}>
                            {record.name ? (
                              <p>{record.name}</p>
                            ) : (
                              <p>{record.id}</p>
                            )}
                          </Tooltip>
                          <Tooltip title={t("ISMS.rename")}>
                            <RiEdit2Fill
                              className={styles.renameIcon}
                              style={level === "get" && { display: "none" }}
                              onClick={() => {
                                form.setFieldsValue({
                                  name: record.name ? record.name : record.id,
                                });
                                edit(index);
                              }}
                            />
                          </Tooltip>
                        </div>
                      ) : (
                        <Form
                          form={form}
                          onFinish={(value) => RenameOnFinish(value, record)}
                        >
                          <Row>
                            <Col span={18}>
                              <Form.Item
                                style={{ margin: 0 }}
                                name={"name"}
                                rules={[{ required: true }]}
                                // initialValue={record.name ? record.name : record.id}
                              >
                                <Input placeholder="New Device Name" />
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <a
                                href="/#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  form.submit();
                                }}
                              >
                                {t("ISMS.Save")}
                              </a>
                            </Col>
                            <Col span={3}>
                              <a
                                href="/#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  cancel();
                                }}
                              >
                                {t("ISMS.Cancel")}
                              </a>
                            </Col>
                          </Row>
                        </Form>
                      )}
                    </Fragment>
                    // </div>
                  );
                }}
              />

              <Column
                title={t("ISMS.Model")}
                dataIndex="model"
                responsive={["sm"]}
              />

              <Column
                title={t("ISMS.LastUpdate")}
                dataIndex="lastupdate"
                responsive={["sm"]}
                render={(text) => {
                  let date = new Date(text * 1000);
                  return (
                    date.getFullYear() +
                    "/" +
                    (date.getMonth() + 1) +
                    "/" +
                    date.getDate() +
                    " " +
                    date.getHours() +
                    ":" +
                    date.getMinutes()
                  );
                }}
              />

              <Column
                title={
                  state.Global.innerWidth > 576
                    ? t("ISMS.Information")
                    : t("ISMS.Info")
                }
                dataIndex="information"
                render={(_, record, index) => {
                  // console.log(record)
                  return (
                    // <Fragment>
                    state.Global.innerWidth > 500 ? (
                      IconforGenerator(record, index)
                    ) : (
                      <Dropdown
                        overlay={menu(record, index)}
                        key={index}
                        overlayClassName={styles.iconDrop}
                      >
                        <DownOutlined />
                      </Dropdown>
                    )
                    // </Fragment>
                  );
                }}
              />
            </Table>
          </Card>
        </TabPane>
        <TabPane tab={t("ISMS.RoutersStatus")} key="2">
          <ViewAllStatusMC
            groups={groups}
            models={models}
            cities={cities}
            IsUpdate={IsUpdate}
            setIsUpdate={setIsUpdate}
          />
        </TabPane>
        <TabPane tab={t("ISMS.Setting")} key="3">
          <BulkConfigMC
            IsUpdate={IsUpdate}
            setIsUpdate={setIsUpdate}
            groups={groups}
            models={models}
            cities={cities}
            dataSource={restore?.filter((item) => item.health !== "offline")}
            record={SettingRecord}
            setSettingRecord={setSettingRecord}
          />
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

export default TopologyC;
