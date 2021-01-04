import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  Fragment,
} from "react";
import styles from "../topology.module.scss";
import {
  Form,
  Select,
  Radio,
  Button,
  Row,
  Col,
  Tag,
  Input,
  message,
  Card,
  Divider,
} from "antd";
import Context from "../../../../Utility/Reduxx";
import { Translator } from "../../../../i18n/index";
import { ImCross } from "react-icons/im";
import { FcPlus } from "react-icons/fc";
import axios from "axios";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router";

const { Option } = Select;

const BulkConfigF = ({ NodeData, ModelList, FileRepository, Nodeloading, Fileloading }) => {
  const [form] = Form.useForm();
  const { dispatch } = useContext(Context);
  // const [restore, setRestore] = useState([]);
  // const [modelOptions, setModelOptions] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState("New");
  const history = useHistory();
  const [NodebyModel, setNodebyModel] = useState(null);
  const [ImportFrom, setImportFrom] = useState("");
  const [showLan, setShowLan] = useState(true);
  const [showWan, setShowWan] = useState(true);
  const [showLte, setShowLte] = useState(true);

  const [LANIPV6Static, setLANIPV6Static] = useState("");
  const [LanStatisticIPEnable, setLanStatisticIPEnable] = useState("");
  const [LanDHCServerEnable, setLanDHCServerEnable] = useState("");

  const [WanPriority, setWanPriority] = useState("");
  const [WanEthernetType, setWanEthernetType] = useState("");
  const [WanDHCPServer1, setWanDHCPServer1] = useState("");
  const [WanDHCPServer2, setWanDHCPServer2] = useState("");
  const [WanDHCPServer3, setWanDHCPServer3] = useState("");
  const [PriorityOrderOptions, setPriorityOrderOptions] = useState([
    "LTE",
    "ETH",
    "WiFi",
  ]);

  const [LTEPinEnable, setLTEPinEnable] = useState("");
  const [LTERecoverAPN1, setLTERecoverAPN1] = useState("");
  const [LTEDataLimitEnable, setLTEDataLimitEnable] = useState("");
  const [LTEIpv6Enable, setLTEIpv6Enable] = useState("");
  const [LTERoamingEnable, setLTERoamingEnable] = useState("");

  const PriorityOptionsChange = (value) => {
    setPriorityOrderOptions(
      PriorityOrderOptions.filter((item) => item !== value)
    );
  };

  function setFields(data, nodeInf) {
    if (data.wan.priority.order.length === 3) {
      setWanPriority("Auto");
      form.setFieldsValue({ Priority: "Auto" });
    } else {
      setWanPriority(data.wan.priority.order[0]);
      form.setFieldsValue({ Priority: data.wan.priority.order[0] });
    }

    setLANIPV6Static(data.lan.ipv6.type);
    setLanStatisticIPEnable(data.lan.ipv4.dhcp.pool[0].fixed_ip?.[0]?.enabled);
    setLanDHCServerEnable(data.lan.ipv4.dhcp.mode);

    setWanEthernetType(data.wan.ethernet.type);
    setWanDHCPServer1(data.wan.ethernet.dhcp.dns.ipv4[0].type);
    setWanDHCPServer2(data.wan.ethernet.dhcp.dns.ipv4[1].type);
    setWanDHCPServer3(data.wan.ethernet.dhcp.dns.ipv4[2].type);

    setLTEPinEnable(data.lte.sim[0].pin_enabled);
    setLTERecoverAPN1(data.lte.policy.recovery.recover_apn.enabled);
    setLTEDataLimitEnable(data.lte.sim[0].apn[0].ipv6_enabled);
    setLTEIpv6Enable(data.lte.sim[0].apn[0].ipv6_enabled);
    setLTERoamingEnable(data.lte.policy.roaming);

    filterNodebyModel(nodeInf.model);
    form.setFieldsValue({
      Model: nodeInf.model,
      LAN_ipv4_address: data.lan.ipv4.address,
      LAN_ipv4_netmask: data.lan.ipv4.netmask,
      LAN_ipv4_dhcpmode: data.lan.ipv4.dhcp.mode,
      LAN_ipv4_dhcp_start: data.lan.ipv4.dhcp.pool[0].start,
      LAN_ipv4_dhcp_end: data.lan.ipv4.dhcp.pool[0].end,
      LAN_ipv6_type: data.lan.ipv6.type,
      LAN_ipv6_adress: data.lan.ipv6.static.address,
      LAN_ipv6_assignment: data.lan.ipv6.dhcp.assigment,
      WAN_ipv4_type_1: data.wan.ethernet.dhcp.dns.ipv4[0].type,
      WAN_ipv4_address_1: data.wan.ethernet.dhcp.dns.ipv4[0].address,
      WAN_ipv4_type_2: data.wan.ethernet.dhcp.dns.ipv4[1].type,
      WAN_ipv4_address_2: data.wan.ethernet.dhcp.dns.ipv4[1].address,
      WAN_ipv4_type_3: data.wan.ethernet.dhcp.dns.ipv4[2].type,
      WAN_ipv4_address_3: data.wan.ethernet.dhcp.dns.ipv4[2].address,
      WAN_username: data.wan.ethernet.pppoe.username,
      WAN_password: data.wan.ethernet.pppoe.password,
      WAN_service_name: data.wan.ethernet.pppoe.service_name,
      WAN_priority_1: data.wan.priority.order[0],
      WAN_priority_2: data.wan.priority.order[1],
      WAN_priority_3: data.wan.priority.order[2],
      WAN_lte_mode: data.wan.priority.lte.mode,
      WAN_ethernet_type: data.wan.ethernet.type,
      WAN_static_ipv4_address: data.wan.ethernet.static.ipv4.address,
      WAN_static_ipv4_dns_address1:
        data.wan.ethernet.static.ipv4.dns[0].address,
      WAN_static_ipv4_dns_address2:
        data.wan.ethernet.static.ipv4.dns[1].address,
      WAN_static_ipv4_dns_address3:
        data.wan.ethernet.static.ipv4.dns[2].address,
      WAN_static_gateway: data.wan.ethernet.static.ipv4.gateway,
      WAN_static_netmask: data.wan.ethernet.static.ipv4.netmask,
      LTE_mode: data.lte.config.mode,
      LTE_mtu: data.lte.config.mtu,
      LTE_pin: data.lte.sim[0].pin,
      LTE_puk: data.lte.sim[0].puk,
      LTE_pin_enabled: data.lte.sim[0].pin_enabled,
      LTE_apn: data.lte.sim[0].apn[0].apn,
      LTE_ipv6_enabled: data.lte.sim[0].apn[0].ipv6_enabled,
      LTE_auth: data.lte.sim[0].apn[0].auth.type,
      LTE_username: data.lte.sim[0].apn[0].auth.username,
      LTE_password: data.lte.sim[0].apn[0].auth.password,
      LTE_limit_mbyte: data.lte.limit[0].limit_mbyte,
      LTE_limit_enabled: data.lte.limit[0].enabled,
      LTE_reset_day: data.lte.limit[0].reset.day,
      LTE_reset_hour: data.lte.limit[0].reset.hour,
      LTE_reset_minute: data.lte.limit[0].reset.minute,
      LTE_reset_second: data.lte.limit[0].reset.second,
      LTE_roaming: data.lte.policy.roaming,
      LTE_recovery_down_time: data.lte.policy.recovery.down_times,
      LTE_recovery_apn_enabled: data.lte.policy.recovery.recover_apn.enabled,
      LTE_recovery_apn_action: data.lte.policy.recovery.recover_apn.action,
    });
  }
  function handleDeviceChange(value) {
    console.log(value);
    setLoading(true);
    // const DeviceCfgUrl = `/cmd?get={"device_cfg":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{"report_period":{},"lan":{},"wan":{},"lte":{}}}}`;
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"device_cfg":{"filter":{"id":"${value}"},"nodeInf":{},"obj":{"report_period":{},"lan":{},"wan":{},"lte":{}}}}}`
      ),
    };
    axios(config)
      .then((res) => {
        if (res.data.response.device_cfg[0].obj !== "No Response!") {
          const data = res.data.response.device_cfg[0].obj;
          const nodeInf = res.data.response.device_cfg[0].nodeInf;
          setFields(data, nodeInf);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
      });
  }

  function SelectAll(){
    const allDevice = NodebyModel?.map((item)=>item.id)
    form.setFieldsValue({
      Device_ID: allDevice
    })
  }

  function ClearAll(){
    form.resetFields(['Device_ID'])
  }

  function handleFileChange(value) {
    console.log(`selected ${value}`);
    axios.get("api/BulkConfig.json").then((res) => {
      let data = res.data.response.device_cfg[0].obj;
      const nodeInf = res.data.response.device_cfg[0].nodeInf;
      setFields(data, nodeInf);
    });
  }

  const filterNodebyModel = (value) => {
    let NodebyModel = NodeData.filter((item) => value === item.model);
    setNodebyModel(NodebyModel);
  };

  const ImportonChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
    form.resetFields();
    setImportFrom("");
  };

  const SubmitConfigonFinish = (values) => {
    console.log(values);
    setLoading(true);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"device_cfg":{"filter":{"id":${JSON.stringify(
          values.Device_ID
        )}},"nodeInf":{},"obj":{
          "lte":{"config":{"mode":"${values.LTE_mode}","mtu":${
          values.LTE_mtu
        }},"sim":[{${
          LTEPinEnable
            ? `"pin":"${values.LTE_pin}","puk":"${values.LTE_puk}",`
            : ""
        }"pin_enabled":${values.LTE_pin_enabled},"apn":[{"apn":"${
          values.LTE_apn
        }","ipv6_enabled":${values.LTE_ipv6_enabled},"auth":{"type":"${
          values.LTE_auth
        }","username":"${values.LTE_username}","password":"${
          values.LTE_password
        }"}}]}],"limit":[{"enabled":${values.LTE_limit_enabled} ${
          LTEDataLimitEnable
            ? `,"limit_mbyte":${values.LTE_limit_mbyte},"reset":{"day":${values.LTE_reset_day},"hour":${values.LTE_reset_hour},"minute":${values.LTE_reset_minute},"second":${values.LTE_reset_second}}`
            : ""
        }}],"policy":{"roaming":${
          values.LTE_roaming
        },"recovery":{"down_times":${
          values.LTE_recovery_apn_enabled ? values.LTE_recovery_down_time : 0
        },"recover_apn":{"enabled":${
          values.LTE_recovery_apn_enabled
        },"action":"${
          values.LTE_recovery_apn_enabled ? values.LTE_recovery_apn_action : ""
        }"}}}},
        "wan":{"priority":{"order":[ ${
          WanPriority === "Auto"
            ? `"${values.WAN_priority_1}","${values.WAN_priority_2}","${values.WAN_priority_3}"`
            : `"${WanPriority}"`
        }],"lte":{${
          WanPriority === "lte" ? `"mode":"${values.WAN_lte_mode}" ` : ""
        }}},"ethernet":{"type":"${values.WAN_ethernet_type}","dhcp":{${
          WanEthernetType === "dhcp"
            ? `"dns":{"ipv4":[{"type":"${values.WAN_ipv4_type_1}", "address":"${
                values.WAN_ipv4_type_1 === "ISP"
                  ? values.WAN_ipv4_address_1
                  : ""
              }"},{"type":"${values.WAN_ipv4_type_2}", "address":"${
                values.WAN_ipv4_type_2 === "ISP"
                  ? values.WAN_ipv4_address_2
                  : ""
              }"},{"type":"${values.WAN_ipv4_type_3}", "address":"${
                values.WAN_ipv4_type_3 === "ISP"
                  ? values.WAN_ipv4_address_3
                  : ""
              }"}]}`
            : ""
        }},"pppoe":{${
          WanEthernetType === "pppoe"
            ? `"username":"${values.WAN_username}","password":"${values.WAN_password}","service_name":"${values.WAN_service_name}"`
            : ""
        } },"static":{ ${
          WanEthernetType === "static"
            ? `"ipv4":{"address":"${values.WAN_static_ipv4_address}","netmask":"${values.WAN_static_netmask}","gateway":"${values.WAN_static_gateway}","dns":[{"address":"${values.WAN_static_ipv4_dns_address1}"},{"address":"${values.WAN_static_ipv4_dns_address2}"},{"address":"${values.WAN_static_ipv4_dns_address3}"}]}`
            : ""
        } }}},
          "lan":{"ipv4":{"address":"${values.LAN_ipv4_address}","netmask":"${
          values.LAN_ipv4_netmask
        }","dhcp":{"mode":"${values.LAN_ipv4_dhcpmode}","pool":[{"start":"${
          values.LAN_ipv4_dhcp_start
        }","end":"${values.LAN_ipv4_dhcp_end}","fixed_ip":[{ "enabled":${
          values.LAN_ipv4_fixed_enabled
        }, "mac": "${
          values.LAN_ipv4_fixed_enabled ? values.LAN_ipv4_fixed_mac : ""
        }", "ip": "${
          values.LAN_ipv4_fixed_enabled ? values.LAN_ipv4_fixed_IP : ""
        }" }]}]}},"ipv6":{"type":"${values.LAN_ipv6_type}","static":{${
          values.LAN_ipv6_type === "static"
            ? `"address":"${values.LAN_ipv6_adress}"`
            : ""
        }},"dhcp":{"assigment":"${values.LAN_ipv6_assignment}"}}}}}}}`
      ),
    };

    console.log(config);

    axios(config)
      .then((res) => {
        console.log(res);
        setLoading(false);
        // setIsUpdate(!IsUpdate);
        message.success("update successfully.");
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setLoading(false);
        message.error("update fail.");
      });
  };

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
      <Card className={styles.Card}>
        <Form onFinish={SubmitConfigonFinish} form={form} layout="vertical">
          <div className={styles.FormWrapper}>
            <Row gutter={24} justify="flex-start">
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={3}
                className={styles.ImportRadio}
              >
                <Radio.Group onChange={ImportonChange} value={value}>
                  <Radio value={"New"}>New Config</Radio>
                  <Radio value={"Import"}>Import</Radio>
                </Radio.Group>
              </Col>

              <Col xs={24} sm={24} md={24} lg={5}>
                <Form.Item name="ImportSelector" label="Source">
                  <Select
                    placeholder="Select"
                    onChange={(value) => {
                      setImportFrom(value);
                    }}
                    disabled={value !== "Import"}
                  >
                    <Option value={"Device"}>Device</Option>
                    <Option value={"FileRepository"}>FileRepository</Option>
                  </Select>
                </Form.Item>
              </Col>

              {ImportFrom === "Device" && (
                <Col xs={24} sm={24} md={24} lg={7}>
                  <Form.Item name="device" label="Import Device">
                    <Select
                      placeholder="Select a Device"
                      onChange={handleDeviceChange}
                      disabled={value !== "Import"}
                      loading={loading}
                      disabled={loading}
                    >
                      {NodeData?.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {item.name !== "" ? item.name : item.id}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              )}

              {ImportFrom === "FileRepository" && (
                <Col xs={24} sm={24} md={24} lg={7}>
                  <Form.Item name="FileRepository" label='Import File'>
                    <Select
                      placeholder="Select a File"
                      onChange={handleFileChange}
                      loading={loading || Fileloading}
                      disabled={loading || Fileloading}
                    >
                      <Option value={"demo"}>Bulk_Demo.yaml</Option>
                      {/* {FileRepository.map((item, index)=>{
                    return(
                    <Option value={item.name} key={index}>{item.name}</Option>
                    )
                })} */}
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  label={Translator("ISMS.Model")}
                  name="Model"
                  // className={styles.formitem}
                  rules={[{ required: true, message: "Model is required" }]}
                >
                  <Select
                    loading={Nodeloading || loading}
                    showSearch
                    showArrow
                    disabled={Nodeloading || loading || value !== "New"}
                    placeholder={Translator("ISMS.Select")}
                    onChange={(value) => {
                      form.resetFields([["Device_ID"]]);
                      filterNodebyModel(value);
                    }}
                  >
                    {ModelList.map((item, index) => {
                      return (
                        <Option key={index} value={item}>
                          {item}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  label={Translator("Group")}
                  name="group"
                >
                  <Select
                    loading={Nodeloading || loading}
                    showSearch
                    showArrow
                    disabled={true}
                    placeholder={Translator("ISMS.Select")}
                    onChange={() => {
                    }}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={9}>
                <Form.Item
                  label={Translator("ISMS.Device")}
                  // className={styles.formitem}
                  name="Device_ID"
                  rules={[
                    { required: true, message: "Deivce Id is required!" },
                  ]}
                >
                  <Select
                    loading={Nodeloading || loading}
                    disabled={Nodeloading || loading}
                    mode="multiple"
                    placeholder={Translator("ISMS.Select")}
                    showArrow
                    tagRender={tagRender}
                    maxTagCount={1}
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
                    {NodebyModel?.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name !== "" ? item.name : item.id}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={5} className={styles.submitBtn}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={Nodeloading || loading}
                    disabled={!showLan && !showWan && !showLte}
                  >
                    Submit
                  </Button>
                </Form.Item>
                <Form.Item style={{ marginLeft: "5%" }}>
                  <Button
                    loading={Nodeloading || loading}
                    onClick={() => {
                      form.resetFields();
                      setShowLan(true);
                      setShowWan(true);
                      setShowLte(true);
                      setPriorityOrderOptions(["LTE", "ETH", "WiFi"]);
                    }}
                  >
                    Reset
                  </Button>
                </Form.Item>
                <Form.Item style={{ marginLeft: "5%" }}>
                  <Button loading={Nodeloading || loading}>Save</Button>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Card>

      <Card
        className={styles.Card}
        title="LAN"
        headStyle={{
          boxShadow: "1px 1px 3px lightgray",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        bodyStyle={showLan ? {} : { padding: 0 }}
        extra={
          showLan ? (
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowLan(false)}
            />
          ) : (
            <FcPlus
              className={styles.AddIcon}
              onClick={() => setShowLan(true)}
            />
          )
        }
      >
        {showLan && (
          <Form onFinish={SubmitConfigonFinish} form={form}>
            <div className={styles.FormWrapper}>
              <Row gutter={24} justify="space-around">
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 10 }}
                >
                  <h2>IPv4</h2>
                  <Divider className={styles.divider} />
                  <Row gutter={24}>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name={"LAN_ipv4_address"}
                        label="IP Address"
                        className={styles.FormItem}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input placeholder="192.168.20.20" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name={"LAN_ipv4_netmask"}
                        label="IP Mask"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input placeholder="255.255.255.0" />
                      </Form.Item>
                    </Col>
                    <h3>DHCP Server Configuration</h3>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name={"LAN_ipv4_dhcpmode"}
                        label="DHCP Server"
                        initialValue={false}
                        rules={[{ required: true }]}
                      >
                        <Select
                          onChange={(value) => {
                            setLanDHCServerEnable(value);
                          }}
                        >
                          <Option key={0} value={true}>
                            ON
                          </Option>
                          <Option key={1} value={false}>
                            OFF
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name={"LAN_ipv4_dhcp_start"}
                        label="IP Address Pool(From)"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input placeholder="192.168.1.112" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name={"LAN_ipv4_dhcp_end"}
                        label="IP Address Pool(To)"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input placeholder="192.168.1.222" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name={"LAN_ipv4_fixed_enabled"}
                        label="Statistic IP adress"
                        initialValue={false}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Select
                          onChange={(value) => {
                            setLanStatisticIPEnable(value);
                          }}
                        >
                          <Option key={0} value={true}>
                            ON
                          </Option>
                          <Option key={1} value={false}>
                            OFF
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      {LanStatisticIPEnable && (
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item
                              name={"LAN_ipv4_fixed_mac"}
                              label="MAC"
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <Input placeholder="aa:bb:dd:ff:ee:gg" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item
                              name={"LAN_ipv4_fixed_IP"}
                              label="IP"
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <Input placeholder="0.0.0.0" />
                            </Form.Item>
                          </Col>
                        </Row>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 10 }}
                >
                  <h2>IPv6</h2>
                  <Divider className={styles.divider} />
                  <Form.Item
                    name={"LAN_ipv6_type"}
                    label="Type"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      onChange={(value) => {
                        setLANIPV6Static(value);
                      }}
                    >
                      <Option key={0} value={"delegate-prefix-from-wan"}>
                        Delegate Prefix from WAN
                      </Option>
                      <Option key={1} value={"static"}>
                        Static Address
                      </Option>
                    </Select>
                  </Form.Item>
                  {LANIPV6Static === "static" && (
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name={"LAN_ipv6_adress"}
                          label="Static Address"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input disabled={LANIPV6Static !== "static"} />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  <h3>DHCP Server Configuration</h3>
                  <Form.Item
                    name={"LAN_ipv6_assignment"}
                    label="Address Assign"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      onChange={(value) => {
                        setLANIPV6Static(value);
                      }}
                    >
                      <Option key={0} value={"stateful"}>
                        stateful
                      </Option>
                      <Option key={1} value={"stateless"}>
                        stateless
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        )}
      </Card>

      <Card
        className={styles.Card}
        title="WAN"
        headStyle={{
          boxShadow: "1px 1px 3px lightgray",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        bodyStyle={showWan ? {} : { padding: 0 }}
        extra={
          showWan ? (
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowWan(false)}
            />
          ) : (
            <FcPlus
              className={styles.AddIcon}
              onClick={() => setShowWan(true)}
            />
          )
        }
        // bodyStyle={{display:'none'}}
      >
        {showWan && (
          <Form onFinish={SubmitConfigonFinish} form={form}>
            <div className={styles.FormWrapper}>
              <Row gutter={24} justify="space-around">
                <Col xs={24} sm={24} md={24} lg={10}>
                  <h2>Priority</h2>
                  <Divider className={styles.divider} />
                  <Form.Item
                    label="Priority"
                    name="Priority"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      // loading={uploading || Nodeloading || Fileloading}
                      placeholder={"Priority"}
                      onChange={(value) => {
                        console.log(value);
                        setWanPriority(value);
                      }}
                    >
                      <Option key={0} value={"Auto"}>
                        Auto
                      </Option>
                      <Option key={1} value={"lte"}>
                        LTE only
                      </Option>
                      <Option key={2} value={"eth"}>
                        ETH only
                      </Option>
                      <Option key={3} value={"wifi-2.4G"}>
                        WiFi only
                      </Option>
                    </Select>
                  </Form.Item>
                  {WanPriority === "Auto" && (
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name="WAN_priority_1"
                          label="1st"
                          rules={[{ required: true, message: "required!" }]}
                        >
                          <Select
                            // loading={uploading || Nodeloading || Fileloading}
                            placeholder={"Priority"}
                            onChange={(value) => {
                              PriorityOptionsChange(value);
                            }}
                          >
                            {PriorityOrderOptions.map((item, index) => (
                              <Option key={index} value={item}>
                                {item}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name="WAN_priority_2"
                          label="2nd"
                          rules={[{ required: true, message: "required!" }]}
                        >
                          <Select
                            // loading={uploading || Nodeloading || Fileloading}
                            placeholder={"Priority"}
                            onChange={(value) => {
                              PriorityOptionsChange(value);
                            }}
                          >
                            {PriorityOrderOptions.map((item, index) => (
                              <Option key={index} value={item}>
                                {item}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name="WAN_priority_3"
                          label="3th"
                          rules={[{ required: true, message: "required!" }]}
                        >
                          <Select
                            // loading={uploading || Nodeloading || Fileloading}
                            placeholder={"Priority"}
                            onChange={(value) => {
                              PriorityOptionsChange(value);
                            }}
                          >
                            {PriorityOrderOptions.map((item, index) => (
                              <Option key={index} value={item}>
                                {item}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {WanPriority === "lte" && (
                          <Form.Item
                            name="WAN_lte_mode"
                            label="LTE Mode"
                            rules={[{ required: true, message: "required!" }]}
                          >
                            <Select>
                              <Option key={0} value={"bridge"}>
                                bridge
                              </Option>
                              <Option key={1} value={"router"}>
                                router
                              </Option>
                            </Select>
                          </Form.Item>
                        )}
                      </Col>
                    </Row>
                  )}
                </Col>

                <Col xs={24} sm={24} md={24} lg={10}>
                  <h2>Ethernet</h2>
                  <Divider className={styles.divider} />
                  <Form.Item
                    name="WAN_ethernet_type"
                    label="Ethernet Type"
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Select
                      onChange={(value) => {
                        setWanEthernetType(value);
                      }}
                    >
                      <Option key={1} value={"dhcp"}>
                        DHCP Client
                      </Option>
                      <Option key={2} value={"pppoe"}>
                        PPPoE Client
                      </Option>
                      <Option key={3} value={"static"}>
                        Static IPv4
                      </Option>
                    </Select>
                  </Form.Item>

                  {WanEthernetType === "dhcp" && (
                    <Fragment>
                      <h3>DNS Server Configuration</h3>

                      <Form.Item
                        name="WAN_ipv4_type_1"
                        label="IPv4 DNS Server #1"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Select
                          onChange={(value) => {
                            setWanDHCPServer1(value);
                          }}
                        >
                          <Option key={1} value={"ISP"}>
                            ISP
                          </Option>
                          <Option key={2} value={"manual"}>
                            Manual
                          </Option>
                          <Option key={3} value={"none"}>
                            None
                          </Option>
                        </Select>
                      </Form.Item>
                      {WanDHCPServer1 === "ISP" && (
                        <Form.Item
                          name="WAN_ipv4_address_1"
                          label="Address #1"
                          rules={[{ required: true, message: "required!" }]}
                        >
                          <Input
                            placeholder="Input adress"
                            disabled={WanDHCPServer1 !== "ISP"}
                          />
                        </Form.Item>
                        // </Col>
                      )}
                      <Form.Item
                        name="WAN_ipv4_type_2"
                        label="IPv4 DNS Server #2"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Select
                          onChange={(value) => {
                            setWanDHCPServer2(value);
                          }}
                        >
                          <Option key={1} value={"ISP"}>
                            ISP
                          </Option>
                          <Option key={2} value={"manual"}>
                            Manual
                          </Option>
                          <Option key={3} value={"none"}>
                            None
                          </Option>
                        </Select>
                      </Form.Item>
                      {WanDHCPServer2 === "ISP" && (
                        <Form.Item
                          name="WAN_ipv4_address_2"
                          label="Address #2"
                          rules={[{ required: true, message: "required!" }]}
                        >
                          <Input
                            placeholder="Input adress"
                            disabled={WanDHCPServer2 !== "ISP"}
                          />
                        </Form.Item>
                        // </Col>
                      )}

                      <Form.Item
                        name="WAN_ipv4_type_3"
                        label="IPv4 DNS Server #3"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Select
                          onChange={(value) => {
                            setWanDHCPServer3(value);
                          }}
                        >
                          <Option key={1} value={"ISP"}>
                            ISP
                          </Option>
                          <Option key={2} value={"manual"}>
                            Manual
                          </Option>
                          <Option key={3} value={"none"}>
                            None
                          </Option>
                        </Select>
                      </Form.Item>
                      {WanDHCPServer3 === "ISP" && (
                        // <Col xs={24} sm={24} md={24} lg={7}>
                        <Form.Item
                          name="WAN_ipv4_address_3"
                          label="Address #3"
                          rules={[{ required: true, message: "required!" }]}
                        >
                          <Input
                            placeholder="Input adress"
                            disabled={WanDHCPServer3 !== "ISP"}
                          />
                        </Form.Item>
                      )}
                      {/* </Row> */}
                    </Fragment>
                  )}

                  {WanEthernetType === "pppoe" && (
                    <Fragment>
                      <h3>PPPoE Client Configuration</h3>
                      <Form.Item
                        name="WAN_username"
                        label="username"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="Input username" />
                      </Form.Item>
                      <Form.Item
                        name="WAN_password"
                        label="password"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="Input password" />
                      </Form.Item>
                      <Form.Item
                        name="WAN_service_name"
                        label="service_name"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="Input service_name" />
                      </Form.Item>
                    </Fragment>
                  )}

                  {WanEthernetType === "static" && (
                    <Fragment>
                      <h3>Static IPv4 Configuration</h3>
                      <Form.Item
                        name="WAN_static_ipv4_address"
                        label="IP Address"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="Input adress" />
                      </Form.Item>
                      <Form.Item
                        name="WAN_static_netmask"
                        label="IP Mask"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="Input netmask" />
                      </Form.Item>
                      <Form.Item
                        name="WAN_static_gateway"
                        label="static_gateway"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="Input gateway" />
                      </Form.Item>
                      <h3>DNS Server Configuration</h3>
                      <Form.Item
                        name="WAN_static_ipv4_dns_address1"
                        label="IPv4 DNS Server #1"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="Input dns adress" />
                      </Form.Item>
                      <Form.Item
                        name="WAN_static_ipv4_dns_address2"
                        label="IPv4 DNS Server #2"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="Input dns adress" />
                      </Form.Item>
                      <Form.Item
                        name="WAN_static_ipv4_dns_address3"
                        label="IPv4 DNS Server #3"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="Input dns adress" />
                      </Form.Item>
                    </Fragment>
                  )}
                </Col>
              </Row>
            </div>
          </Form>
        )}
      </Card>

      <Card
        className={styles.Card}
        title="LTE"
        headStyle={{
          boxShadow: "1px 1px 3px lightgray",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        bodyStyle={showLte ? {} : { padding: 0 }}
        extra={
          showLte ? (
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowLte(false)}
            />
          ) : (
            <FcPlus
              className={styles.AddIcon}
              onClick={() => setShowLte(true)}
            />
          )
        }
      >
        {showLte && (
          <Form onFinish={SubmitConfigonFinish} form={form}>
            <div className={styles.FormWrapper}>
              <Row gutter={24} justify="space-around">
                <Col xs={24} sm={24} md={24} lg={10}>
                  <h2>Ethernet</h2>
                  <Divider className={styles.divider} />
                  <Form.Item
                    name="LTE_mode"
                    label="LTE Config"
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Select>
                      <Option key={0} value={"auto"}>
                        Auto
                      </Option>
                      <Option key={1} value={"2G-only"}>
                        2G-only
                      </Option>
                      <Option key={3} value={"3G-only"}>
                        3G-only
                      </Option>
                      <Option key={4} value={"4G-only"}>
                        4G-only
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={"LTE_mtu"}
                    label="MTU"
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={10}>
                  <h2>APN Config</h2>
                  <Divider className={styles.divider} />
                  <h3>SIM Configuration</h3>
                  <Form.Item
                    name={"LTE_pin_enabled"}
                    label="PIN Enable"
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Select
                      onChange={(value) => {
                        setLTEPinEnable(value);
                      }}
                    >
                      <Option key={0} value={true}>
                        ON
                      </Option>
                      <Option key={1} value={false}>
                        OFF
                      </Option>
                    </Select>
                  </Form.Item>

                  {LTEPinEnable && (
                    <Row gutter={24} justify="space-around">
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name={"LTE_pin"}
                          label="PIN"
                          rules={[{ required: true, message: "required!" }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name={"LTE_puk"}
                          label="PUK"
                          rules={[{ required: true, message: "required!" }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  <h3>APN1</h3>

                  <Form.Item name={"LTE_apn"} label="APN">
                    <Input />
                  </Form.Item>
                  <Form.Item name={"LTE_username"} label="UserName">
                    <Input />
                  </Form.Item>
                  <Form.Item name={"LTE_password"} label="Password">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="LTE_auth"
                    label="Auth Type"
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Select>
                      <Option key={0} value={"none"}>
                        NONE
                      </Option>
                      <Option key={1} value={"pap"}>
                        PAP
                      </Option>
                      <Option key={3} value={"chap"}>
                        CHAP
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={"LTE_ipv6_enabled"}
                    label="Enable IPv6"
                    initialValue={false}
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Select
                      onChange={(value) => {
                        setLTEIpv6Enable(value);
                      }}
                    >
                      <Option key={0} value={true}>
                        ON
                      </Option>
                      <Option key={1} value={false}>
                        OFF
                      </Option>
                    </Select>
                    {/* <Switch /> */}
                  </Form.Item>

                  <h3>Data Limitation</h3>

                  <Form.Item
                    name={"LTE_limit_enabled"}
                    label="limit enabled"
                    initialValue={false}
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Select
                      onChange={(value) => {
                        setLTEDataLimitEnable(value);
                      }}
                    >
                      <Option key={0} value={true}>
                        ON
                      </Option>
                      <Option key={1} value={false}>
                        OFF
                      </Option>
                    </Select>
                  </Form.Item>
                  {LTEDataLimitEnable && (
                    <Fragment>
                      <Form.Item
                        name={"LTE_limit_mbyte"}
                        label="Max Data Limitation (MB)"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="0" />
                      </Form.Item>
                      <Form.Item
                        name={"LTE_reset_day"}
                        label="Reset Day"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="31" />
                      </Form.Item>
                      <Form.Item
                        name={"LTE_reset_hour"}
                        label="Hour"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="23" />
                      </Form.Item>
                      <Form.Item
                        name={"LTE_reset_minute"}
                        label="Minute"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="0" />
                      </Form.Item>
                      <Form.Item
                        name={"LTE_reset_second"}
                        label="Second"
                        rules={[{ required: true, message: "required!" }]}
                      >
                        <Input placeholder="0" />
                      </Form.Item>
                    </Fragment>
                  )}

                  <h3>Connect Policy</h3>
                  <Form.Item
                    name={"LTE_roaming"}
                    label="Roaming"
                    initialValue={false}
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Select
                      onChange={(value) => {
                        setLTERoamingEnable(value);
                      }}
                    >
                      <Option key={0} value={true}>
                        ON
                      </Option>
                      <Option key={1} value={false}>
                        OFF
                      </Option>
                    </Select>
                  </Form.Item>

                  <h3>Recover APN1</h3>
                  <Form.Item
                    name={"LTE_recovery_apn_enabled"}
                    label="Recover APN1"
                    initialValue={false}
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Select
                      onChange={(value) => {
                        setLTERecoverAPN1(value);
                      }}
                    >
                      <Option key={0} value={true}>
                        ON
                      </Option>
                      <Option key={1} value={false}>
                        OFF
                      </Option>
                    </Select>
                  </Form.Item>

                  {LTERecoverAPN1 && (
                    <Fragment>
                      <Form.Item
                        name={"LTE_recovery_down_time"}
                        label="Recover DownTimes"
                        rules={[{ required: true, message: "required!" }]}
                        initialValue=""
                      >
                        <Input placeholder="3 ~ 15" />
                      </Form.Item>
                      <Form.Item
                        name="LTE_recovery_apn_action"
                        label="Recover action"
                        rules={[{ required: true, message: "required!" }]}
                        initialValue=""
                      >
                        <Select>
                          <Option key={0} value={"reboot"}>
                            Reboot
                          </Option>
                          <Option key={1} value={"default-apn"}>
                            Recover to default APN
                          </Option>
                          <Option key={3} value={"previous-apn"}>
                            Recover to previous working APN
                          </Option>
                        </Select>
                      </Form.Item>
                    </Fragment>
                  )}
                </Col>
              </Row>
            </div>
          </Form>
        )}
      </Card>
    </Fragment>
  );
};

export const BulkConfigMF = React.memo(BulkConfigF);
