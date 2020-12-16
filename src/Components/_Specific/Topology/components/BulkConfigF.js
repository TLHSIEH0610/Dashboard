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
  Switch,
  Card,
  Divider,
} from "antd";
import Context from "../../../../Utility/Reduxx";
import { Translator } from "../../../../i18n/index";
import { ImCross } from "react-icons/im";
import { FcDownload } from "react-icons/fc";
import axios from "axios";

const { Option } = Select;

const BulkConfigF = ({ NodeData, ModelList, FileRepository, Nodeloading }) => {
  const [form] = Form.useForm();
  // const { state, dispatch } = useContext(Context);
  // const [restore, setRestore] = useState([]);
  // const [modelOptions, setModelOptions] = useState("");
  const [value, setValue] = React.useState("New");
  const [NodebyModel, setNodebyModel] = useState(null);
  const [showLan, setShowLan] = useState(true);
  const [showWan, setShowWan] = useState(true);
  const [showLte, setShowLte] = useState(true);
  const [LANIPV6Static, setLANIPV6Static] = useState("");
  const [WanPriority, setWanPriority] = useState("");
  const [WanEthernetType, setWanEthernetType] = useState("");
  const [WanDHCPServer1, setWanDHCPServer1] = useState("");
  const [WanDHCPServer2, setWanDHCPServer2] = useState("");
  const [WanDHCPServer3, setWanDHCPServer3] = useState("");
  const [LTEPinEnable, setLTEPinEnable] = useState("");
  const [LTERecoverAPN1, setLTERecoverAPN1] = useState("");
  const [LTEDataLimitEnable, setLTEDataLimitEnable] = useState("");
  const [PriorityOrderOptions, setPriorityOrderOptions] = useState([
    "LTE",
    "ETH",
    "WiFi",
  ]);

  const PriorityOptionsChange = (value) => {
    setPriorityOrderOptions(
      PriorityOrderOptions.filter((item) => item !== value)
    );
  };

  function handleFileChange(value) {
    console.log(`selected ${value}`);
    axios.get("api/BulkConfig.json").then((res) => {
      let data = res.data.response.device_cfg[0].obj;
      console.log(res);
      setLANIPV6Static(data.lan.ipv6.type);
      setWanEthernetType(data.wan.ethernet.type);
      setLTEPinEnable(data.lte.sim[0].pin_enabled);
      setLTERecoverAPN1(data.lte.policy.recovery.recover_apn.enabled);
      setLTEDataLimitEnable(data.lte.sim[0].apn[0].ipv6_enabled);

      form.setFieldsValue({
        Model: "M330",
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
    });
  }

  const ImportonChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
    form.resetFields();
  };

  const SubmitConfigonFinish = (values) => {
    console.log(values);
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

  const onFinish = () => {};

  return (
    <Fragment>
      <Card className={styles.Card}>
        <Form onFinish={SubmitConfigonFinish} form={form}>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={4}>
              <Radio.Group onChange={ImportonChange} value={value}>
                <Radio value={"New"}>New Config</Radio>
                <Radio value={"Import"}>Import</Radio>
              </Radio.Group>
            </Col>
            <Col xs={24} sm={24} md={24} lg={7}>
              <Form.Item name="Import">
                <Select
                  // defaultValue="lucy"
                  // style={{ width: 120 }}
                  placeholder="Select from FileRepository"
                  onChange={handleFileChange}
                  disabled={value !== "Import"}
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
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={6}>
              {/* <div className={styles.formDiv}> */}
              <p>{Translator("ISMS.Model")}</p>
              <Form.Item
                // label='Model'
                name="Model"
                className={styles.formitem}
                rules={[{ required: true, message: "Model is required" }]}
              >
                <Select
                  loading={Nodeloading}
                  showSearch
                  showArrow
                  // className={styles.modelinput}
                  placeholder={Translator("ISMS.Select")}
                  disabled={value !== "New"}
                  //   optionFilterProp="children"
                  onChange={(value) => {
                    form.resetFields([["Device_ID"]]);
                    let NodebyModel = NodeData.filter(
                      (item) => value === item.model
                    );
                    // let DevicebyModel = [];
                    // DevicebyModel.push("All");
                    // NodeData.forEach((item) => {
                    //   if (item.model === value && item.name === "") {
                    //     DevicebyModel.push(item.id);
                    //   } else if (item.model === value && item.name !== "") {
                    //     DevicebyModel.push(item.name);
                    //   }
                    // });
                    setNodebyModel(NodebyModel);
                    // setSelectedModel(value);
                  }}
                  onFocus={() => {
                    // setUserModel(Array.from(ModelList));
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
            {/* </div> */}
            <Col xs={24} sm={24} md={24} lg={9}>
              <p>{Translator("ISMS.Device")}</p>
              <Form.Item
                className={styles.formitem}
                name="Device_ID"
                rules={[{ required: true, message: "Deivce Id is required!" }]}
              >
                <Select
                  loading={Nodeloading}
                  mode="multiple"
                  placeholder={Translator("ISMS.Select")}
                  showArrow
                  tagRender={tagRender}
                  className={styles.deviceinput}
                  onFocus={() => {}}
                >
                  {NodebyModel &&
                    NodebyModel.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name !== "" ? item.name : item.id}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={5} className={styles.submitBtn}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  //   loading={uploading || Nodeloading || Fileloading}
                  disabled={!showLan && !showWan && !showLte}
                >
                  Submit
                </Button>
              </Form.Item>
              <Form.Item style={{ marginLeft: "5%" }}>
                <Button
                  //   loading={uploading || Nodeloading || Fileloading}
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
              <Button
                icon={<FcDownload />}
                className={styles.downloadIcon}
              ></Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {showLan && (
        <Card
          className={styles.Card}
          title="LAN"
          headStyle={{
            boxShadow: "3px 3px 3px lightgray",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
          extra={
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowLan(false)}
            />
          }
        >
          <Form onFinish={SubmitConfigonFinish} form={form}>
            <h2>IPv4</h2>
            <Divider className={styles.divider} />
            {/* <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowLan(false)}
            /> */}
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item
                  name={"LAN_ipv4_address"}
                  label="IP Mask"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item
                  name={"LAN_ipv4_netmask"}
                  label="IP Mask"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* <Col xs={24} sm={24} md={24} lg={7}>

          </Col> */}
            </Row>
            <h3>DHCP Server Configuration</h3>
            <Form.Item
              name={"LAN_ipv4_dhcpmode"}
              label="DHCP Server"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Switch defaultChecked />
            </Form.Item>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item
                  name={"LAN_ipv4_dhcp_start"}
                  label="IP Address Pool(From)"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item
                  name={"LAN_ipv4_dhcp_end"}
                  label="IP Address Pool(To)"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* <Col xs={24} sm={24} md={24} lg={7}>

          </Col> */}
            </Row>
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
              <Radio.Group
                onChange={(e) => {
                  setLANIPV6Static(e.target.value);
                }}
              >
                <Radio value="Delegate">Delegate Prefix from WAN</Radio>
                <Radio value="static">Static</Radio>
              </Radio.Group>
            </Form.Item>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item
                  name={"LAN_ipv6_adress"}
                  label="Static Address"

                  // rules={[
                  //   {
                  //     required: true,
                  //   },
                  // ]}
                >
                  <Input disabled={LANIPV6Static !== "static"} />
                </Form.Item>
              </Col>
              {/* <Col xs={24} sm={24} md={24} lg={7}>
          </Col> */}
            </Row>
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
              <Radio.Group>
                <Radio value="stateful">stateful</Radio>
                <Radio value="stateless">stateless</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
      )}

      {showWan && (
        <Card
          className={styles.Card}
          title="WAN"
          headStyle={{
            boxShadow: "3px 3px 3px lightgray",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
          extra={
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowWan(false)}
            />
          }
        >
          <Form onFinish={SubmitConfigonFinish} form={form}>
            <h2>Priority</h2>
            <Divider className={styles.divider} />

            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item label="Priority">
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
                    <Option key={1} value={"LTE"}>
                      LTE only
                    </Option>
                    <Option key={2} value={"ETH"}>
                      ETH only
                    </Option>
                    <Option key={3} value={"WiFi"}>
                      WiFi only
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {WanPriority === "Auto" && (
              <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={7}>
                  <Form.Item
                    name="WAN_priority_1"
                    label="1st"
                    // rules={[{ required: true, message: "adress is required" }]}
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
                </Col>
                <Col xs={24} sm={24} md={24} lg={7}>
                  <Form.Item
                    name="WAN_priority_2"
                    label="2nd"
                    // rules={[{ required: true, message: "adress is required" }]}
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
                </Col>
                <Col xs={24} sm={24} md={24} lg={7}>
                  <Form.Item
                    name="WAN_priority_3"
                    label="3th"
                    // rules={[{ required: true, message: "adress is required" }]}
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
                </Col>
              </Row>
            )}

            {WanPriority === "LTE" && (
              <Form.Item name="WAN_lte_mode" label="LTE Mode">
                <Radio.Group>
                  <Radio value="bridge">bridge</Radio>
                  <Radio value="router">router</Radio>
                </Radio.Group>
              </Form.Item>
            )}

            {WanPriority === "WiFi" && (
              <Form.Item name="WAN_wifi_mode" label="WiFi Mode">
                <Radio.Group>
                  <Radio value="bridge">bridge</Radio>
                  <Radio value="router">router</Radio>
                </Radio.Group>
              </Form.Item>
            )}

            <h2>Ethernet</h2>
            <Divider className={styles.divider} />
            <Form.Item name="WAN_ethernet_type" label="Ethernet Type">
              <Radio.Group
                onChange={(e) => {
                  setWanEthernetType(e.target.value);
                }}
              >
                <Radio value="dhcp">DHCP Client</Radio>
                <Radio value="pppoe">PPPoE Client </Radio>
                <Radio value="static">Static IPv4</Radio>
              </Radio.Group>
            </Form.Item>

            {WanEthernetType === "dhcp" && (
              <Fragment>
                <h3>DNS Server Configuration</h3>

                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item
                      name="WAN_ipv4_type_1"
                      label="IPv4 DNS Server #1"
                    >
                      <Select
                        // placeholder={"Priority"}
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
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item name="WAN_ipv4_address_1">
                      <Input
                        placeholder="Input adress"
                        disabled={WanDHCPServer1 !== "ISP"}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item
                      name="WAN_ipv4_type_2"
                      label="IPv4 DNS Server #2"
                    >
                      <Select
                        // placeholder={"Priority"}
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
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item name="WAN_ipv4_address_2">
                      <Input
                        placeholder="Input adress"
                        disabled={WanDHCPServer2 !== "ISP"}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item
                      name="WAN_ipv4_type_3"
                      label="IPv4 DNS Server #3"
                    >
                      <Select
                        // placeholder={"Priority"}
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
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item name="WAN_ipv4_address_3">
                      <Input
                        placeholder="Input adress"
                        disabled={WanDHCPServer3 !== "ISP"}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Fragment>
            )}

            {WanEthernetType === "pppoe" && (
              <Fragment>
                <h3>PPPoE Client Configuration</h3>
                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item name="WAN_username" label="username">
                      <Input placeholder="Input username" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item name="WAN_password" label="password">
                      <Input placeholder="Input password" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item name="WAN_service_name" label="service_name">
                      <Input placeholder="Input service_name" />
                    </Form.Item>
                  </Col>
                </Row>
              </Fragment>
            )}

            {WanEthernetType === "static" && (
              <Fragment>
                <h3>Static IPv4 Configuration</h3>
                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item
                      name="WAN_static_ipv4_address"
                      label="IP Address"
                    >
                      <Input placeholder="Input adress" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item name="WAN_static_netmask" label="IP Mask">
                      <Input placeholder="Input netmask" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item name="WAN_static_gateway" label="static_gateway">
                      <Input placeholder="Input gateway" />
                    </Form.Item>
                  </Col>
                </Row>
                <h3>DNS Server Configuration</h3>
                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item
                      name="WAN_static_ipv4_dns_address1"
                      label="static_dns_address"
                    >
                      <Input placeholder="Input dns adress" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item
                      name="WAN_static_ipv4_dns_address2"
                      label="static_dns_address"
                    >
                      <Input placeholder="Input dns adress" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item
                      name="WAN_static_ipv4_dns_address3"
                      label="static_dns_address"
                    >
                      <Input placeholder="Input dns adress" />
                    </Form.Item>
                  </Col>
                </Row>
              </Fragment>
            )}
          </Form>
        </Card>
      )}

      {showLte && (
        <Card
          className={styles.Card}
          title="LTE"
          headStyle={{
            boxShadow: "3px 3px 3px lightgray",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
          extra={
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowLte(false)}
            />
          }
        >
          <Form onFinish={SubmitConfigonFinish} form={form}>
            <h2>Ethernet</h2>
            <Divider className={styles.divider} />
            <Form.Item name="LTE_mode" label="LTE Config">
              <Radio.Group>
                <Radio value="auto">Auto</Radio>
                <Radio value="2G-only">2G-only</Radio>
                <Radio value="3G-only">3G-only</Radio>
                <Radio value="4G-only">4G-only</Radio>
              </Radio.Group>
            </Form.Item>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item name={"LTE_mtu"} label="MTU">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <h2>APN Config</h2>
            <Divider className={styles.divider} />
            <h3>SIM Configuration</h3>
            <Form.Item
              valuePropName="checked"
              name={"LTE_pin_enabled"}
              label="PIN Enable"
            >
              <Switch
                onChange={(value) => {
                  setLTEPinEnable(value);
                }}
              />
            </Form.Item>

            {LTEPinEnable && (
              <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={7}>
                  <Form.Item name={"LTE_pin"} label="PIN">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={7}>
                  <Form.Item name={"LTE_puk"} label="PUK">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <h3>APN1</h3>

            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item name={"LTE_apn"} label="APN">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item name={"LTE_username"} label="UserName">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item name={"LTE_password"} label="Password">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="LTE_auth" label="Auth Type">
              <Radio.Group>
                <Radio value="none">NONE</Radio>
                <Radio value="pap">PAP</Radio>
                <Radio value="chap">CHAP</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              valuePropName="checked"
              name={"LTE_ipv6_enabled"}
              label="Enable IPv6"
            >
              <Switch defaultChecked />
            </Form.Item>

            <h3>Data Limitation</h3>

            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item
                  valuePropName="checked"
                  name={"limit_enabled"}
                  label="limit enabled"
                >
                  <Switch
                    onChange={(value) => {
                      setLTEDataLimitEnable(value);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {LTEDataLimitEnable && (
              <Fragment>
                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={6}>
                    <Form.Item
                      name={"LTE_limit_mbyte"}
                      label="Max Data Limitation (MB)"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={6}>
                    <Form.Item name={"LTE_reset_day"} label="Reset Day">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={6}>
                    <Form.Item name={"LTE_reset_hour"} label="Hour">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={6}>
                    <Form.Item name={"LTE_reset_minute"} label="Minute">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={6}>
                    <Form.Item name={"LTE_reset_second"} label="Second">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Fragment>
            )}

            <h3>Connect Policy</h3>
            <Form.Item
              valuePropName="checked"
              name={"LTE_roaming"}
              label="Roaming"
            >
              <Switch />
            </Form.Item>

            <h3>Recover APN1</h3>
            <Form.Item
              valuePropName="checked"
              name={"LTE_recovery_apn_enabled"}
              label="Recover APN1"
            >
              <Switch
                onChange={(value) => {
                  setLTERecoverAPN1(value);
                }}
              />
            </Form.Item>

            {LTERecoverAPN1 && (
              <Fragment>
                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={7}>
                    <Form.Item
                      name={"LTE_recovery_down_time"}
                      label="Recover DownTimes"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="LTE_recovery_apn_action"
                  label="Recover action"
                >
                  <Radio.Group>
                    <Radio value="reboot">Reboot</Radio>
                    <Radio value="default-apn">Recover to default APN</Radio>
                    <Radio value="previous-apn">
                      Recover to previous working APN
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Fragment>
            )}
          </Form>
        </Card>
      )}
    </Fragment>
  );
};

export const BulkConfigMF = React.memo(BulkConfigF);
