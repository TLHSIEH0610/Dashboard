import React, { useEffect, useContext, useState, Fragment } from "react";
import styles from "../topology.module.scss";
import {
  Form,
  Input,
  Switch,
  Radio,
  Row,
  message,
  Col,
  Divider,
  Select,
} from "antd";
import axios from "axios";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";

const { Option } = Select;

const LanSetting = ({
  DeviceConfig,
  id,
  setIsUpdate,
  IsUpdate,
  form,
  setUploading,
}) => {
  const history = useHistory();
  const lan = DeviceConfig.lan;
  const { dispatch } = useContext(Context);
  const [LANIPV6Static, setLANIPV6Static] = useState("");

  const onFinish = (values) => {
    setUploading(true);
    // const LanSetUrl = `/cmd?set={"device_cfg":{"filter":{"id":"${id}"},"nodeInf":{},"obj":{"lan":{"ipv4":{"address":"${values.ipv4_address}","netmask":"${values.ipv4_netmask}","dhcp":{"mode":"${values.ipv4_dhcpmode}","pool":[{"start":"${values.ipv4_dhcp_start}","end":"${values.ipv4_dhcp_end}","fixed_ip":[]}]}},"ipv6":{"type":"${values.ipv6_type}","static":{"address":"${values.ipv6_adress}"},"dhcp":{"assigment":"${values.ipv6_assignment}"}}}}}}`;
    // console.log(LanSetUrl);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"device_cfg":{"filter":{"id":"${id}"},"nodeInf":{},"obj":{"lan":{"ipv4":{"address":"${
          values.LAN_ipv4_address
        }","netmask":"${values.LAN_ipv4_netmask}","dhcp":{"mode":${
          values.LAN_ipv4_dhcpmode
        },"pool":[{"start":"${values.LAN_ipv4_dhcp_start}","end":"${
          values.LAN_ipv4_dhcp_end
        }","fixed_ip":[]}]}},"ipv6":{"type":"${
          values.LAN_ipv6_type
        }","static":{${
          values.LAN_ipv6_type === "static"
            ? `"address":"${values.LAN_ipv6_adress}"`
            : ""
        }},"dhcp":{"assigment":"${values.LAN_ipv6_assignment}"}}}}}}}`
      ),
    };
    console.log(config.data);
    axios(config)
      .then(() => {
        // console.log(res);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("update successfully.");
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("update fail.");
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
      });
  };

  useEffect(() => {
    if (lan.ipv4) {
      setLANIPV6Static(lan.ipv6.type);
      form.setFieldsValue({
        LAN_ipv4_address: lan.ipv4.address,
        LAN_ipv4_netmask: lan.ipv4.netmask,
        LAN_ipv4_dhcpmode: lan.ipv4.dhcp.mode,
        LAN_ipv4_dhcp_start: lan.ipv4.dhcp.pool[0].start,
        LAN_ipv4_dhcp_end: lan.ipv4.dhcp.pool[0].end,
        LAN_ipv6_type: lan.ipv6.type,
        LAN_ipv6_adress: lan.ipv6.static.address,
        LAN_ipv6_assignment: lan.ipv6.dhcp.assigment,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lan.ipv4]);

  return (
    <Form onFinish={onFinish} form={form}>
      <div className={styles.FormWrapper}>
        <h2>IPv4</h2>
        <Divider className={styles.divider} />
        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={7}>
            <Form.Item
              name={"LAN_ipv4_address"}
              label="IP Address"
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
        </Row>
        <h3>DHCP Server Configuration</h3>
        <Form.Item
          name={"LAN_ipv4_dhcpmode"}
          label="DHCP Server"
          valuePropName="checked"
          initialValue={false}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Switch />
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
            <Radio value="delegate-prefix-from-wan">
              Delegate Prefix from WAN
            </Radio>
            <Radio value="static">Static</Radio>
          </Radio.Group>
        </Form.Item>
        {LANIPV6Static === "static" && (
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
          <Radio.Group>
            <Radio value="stateful">stateful</Radio>
            <Radio value="stateless">stateless</Radio>
          </Radio.Group>
        </Form.Item>
      </div>
    </Form>
  );
};

export const LanSettingMF = React.memo(LanSetting);

const WanSetting = ({
  DeviceConfig,
  id,
  setIsUpdate,
  IsUpdate,
  form,
  setUploading,
}) => {
  const { dispatch } = useContext(Context);
  const history = useHistory();
  const wan = DeviceConfig.wan;
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

  const PriorityOptionsChange = (value) => {
    setPriorityOrderOptions(
      PriorityOrderOptions.filter((item) => item !== value)
    );
  };

  const onFinish = (values) => {
    setUploading(true);
    // const WanSetUrl = `/cmd?set={"device_cfg":{"filter":{"id":"${id}"},"nodeInf":{},"obj":{"wan":{"priority":{"order":["${values.priority_1}","${values.priority_2}","${values.priority_3}"],"lte":{"mode":"${values.lte_mode}"}},"ethernet":{"type":"${values.ethernet_type}","dhcp":{"dns":{"ipv4":[{"type":"${values.ipv4_type_1}","address":"${values.ipv4_address_1}"},{"type":"${values.ipv4_type_2}","address":"${values.ipv4_address_3}"},{"type":"${values.ipv4_type_3}","address":"${values.ipv4_address_2}"}]}},"pppoe":{"username":"${values.username}","password":"********","service_name":"${values.service_name}"},"static":{"ipv4":{"address":"${values.static_ipv4_address}","netmask":"${values.static_netmask}","gateway":"${values.static_gateway}","dns":[{"address":"${values.static_ipv4_dns_address1}"},{"address":"${values.static_ipv4_dns_address2}"},{"address":"${values.static_ipv4_dns_address3}"}]}}}}}}}`;
    // console.log(WanSetUrl);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"device_cfg":{"filter":{"id":"${id}"},"nodeInf":{},"obj":{"wan":{"priority":{"order":[ ${
          WanPriority === "Auto"
            ? `"${values.WAN_priority_1}","${values.WAN_priority_2}","${values.WAN_priority_3}"`
            : `"${WanPriority}"`
        }],"lte":{${
          WanPriority === "lte" ? `"mode":"${values.WAN_lte_mode}" ` : ""
        }}},"ethernet":{"type":"${values.WAN_ethernet_type}","dhcp":{${
          WanEthernetType === "dhcp"
            ? `"dns":{"ipv4":[{"type":"${values.WAN_ipv4_type_1}","address":"${values.WAN_ipv4_address_1}"},{"type":"${values.WAN_ipv4_type_2}","address":"${values.WAN_ipv4_address_3}"},{"type":"${values.WAN_ipv4_type_3}","address":"${values.WAN_ipv4_address_2}"}]}`
            : ""
        }},"pppoe":{${
          WanEthernetType === "pppoe"
            ? `"username":"${values.WAN_username}","password":"********","service_name":"${values.WAN_service_name}"`
            : ""
        } },"static":{ ${
          WanEthernetType === "static"
            ? `"ipv4":{"address":"${values.WAN_static_ipv4_address}","netmask":"${values.WAN_static_netmask}","gateway":"${values.WAN_static_gateway}","dns":[{"address":"${values.WAN_static_ipv4_dns_address1}"},{"address":"${values.WAN_static_ipv4_dns_address2}"},{"address":"${values.WAN_static_ipv4_dns_address3}"}]}`
            : ""
        } }}}}}}}`
      ),
    };
    console.log(config);
    axios(config)
      .then((res) => {
        console.log(res.data);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("update successfully.");
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setUploading(false);
        message.error("update fail.");
      });
  };

  useEffect(() => {
    if (wan.ethernet) {
      console.log(wan.priority.order, wan.priority.order.length)
      if (wan.priority.order.length === 3) {
        setWanPriority("Auto");
        form.setFieldsValue({ Priority: "Auto" });
      } else {
        setWanPriority(wan.priority.order[0]);
        form.setFieldsValue({ Priority: wan.priority.order[0] });
      }

      setWanEthernetType(wan.ethernet.type);
      setWanDHCPServer1(wan.ethernet.dhcp.dns.ipv4[0].type);
      setWanDHCPServer2(wan.ethernet.dhcp.dns.ipv4[1].type);
      setWanDHCPServer3(wan.ethernet.dhcp.dns.ipv4[2].type);

      form.setFieldsValue({
        WAN_ipv4_type_1: wan.ethernet.dhcp.dns.ipv4[0].type,
        WAN_ipv4_address_1: wan.ethernet.dhcp.dns.ipv4[0].address,
        WAN_ipv4_type_2: wan.ethernet.dhcp.dns.ipv4[1].type,
        WAN_ipv4_address_2: wan.ethernet.dhcp.dns.ipv4[1].address,
        WAN_ipv4_type_3: wan.ethernet.dhcp.dns.ipv4[2].type,
        WAN_ipv4_address_3: wan.ethernet.dhcp.dns.ipv4[2].address,
        WAN_username: wan.ethernet.pppoe.username,
        WAN_password: wan.ethernet.pppoe.password,
        WAN_service_name: wan.ethernet.pppoe.service_name,
        WAN_priority_1: wan.priority.order[0],
        WAN_priority_2: wan.priority.order[1],
        WAN_priority_3: wan.priority.order[2],
        WAN_lte_mode: wan.priority.lte.mode,
        WAN_ethernet_type: wan.ethernet.type,
        WAN_static_ipv4_address: wan.ethernet.static.ipv4.address,
        WAN_static_ipv4_dns_address1: wan.ethernet.static.ipv4.dns[0].address,
        WAN_static_ipv4_dns_address2: wan.ethernet.static.ipv4.dns[1].address,
        WAN_static_ipv4_dns_address3: wan.ethernet.static.ipv4.dns[2].address,
        WAN_static_gateway: wan.ethernet.static.ipv4.gateway,
        WAN_static_netmask: wan.ethernet.static.ipv4.netmask,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wan.ethernet]);

  return (
    <Form onFinish={onFinish} form={form}>
      <div className={styles.FormWrapper}>
      <h2>Priority</h2>
      <Divider className={styles.divider} />

      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={7}>
          <Form.Item label="Priority" name="Priority">
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

      {WanPriority === "lte" && (
        <Form.Item name="WAN_lte_mode" label="LTE Mode">
          <Radio.Group>
            <Radio value="bridge">bridge</Radio>
            <Radio value="router">router</Radio>
          </Radio.Group>
        </Form.Item>
      )}

      {WanPriority === "wifi-2.4G" && (
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
              <Form.Item name="WAN_ipv4_type_1" label="IPv4 DNS Server #1">
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
            {WanDHCPServer1 === "ISP" && (
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item name="WAN_ipv4_address_1">
                  <Input
                    placeholder="Input adress"
                    disabled={WanDHCPServer1 !== "ISP"}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={7}>
              <Form.Item name="WAN_ipv4_type_2" label="IPv4 DNS Server #2">
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
            {WanDHCPServer2 === "ISP" && (
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item name="WAN_ipv4_address_2">
                  <Input
                    placeholder="Input adress"
                    disabled={WanDHCPServer2 !== "ISP"}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={7}>
              <Form.Item name="WAN_ipv4_type_3" label="IPv4 DNS Server #3">
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
            {WanDHCPServer3 === "ISP" && (
              <Col xs={24} sm={24} md={24} lg={7}>
                <Form.Item name="WAN_ipv4_address_3">
                  <Input
                    placeholder="Input adress"
                    disabled={WanDHCPServer3 !== "ISP"}
                  />
                </Form.Item>
              </Col>
            )}
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
              <Form.Item name="WAN_static_ipv4_address" label="IP Address">
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
      </div>

    </Form>
  );
};

export const WanSettingMF = React.memo(WanSetting);

const LteSetting = ({
  DeviceConfig,
  id,
  setIsUpdate,
  IsUpdate,
  form,
  setUploading,
}) => {
  const { dispatch } = useContext(Context);
  const history = useHistory();
  const lte = DeviceConfig.lte;
  const [LTEPinEnable, setLTEPinEnable] = useState("");
  const [LTERecoverAPN1, setLTERecoverAPN1] = useState("");
  const [LTEDataLimitEnable, setLTEDataLimitEnable] = useState("");

  useEffect(() => {
    if (lte) {
      setLTEPinEnable(lte.sim[0].pin_enabled)
      setLTERecoverAPN1(lte.policy.recovery.recover_apn.enabled)
      setLTEDataLimitEnable(lte.limit[0].enabled)
      form.setFieldsValue({
        LTE_mode: lte.config.mode,
        LTE_mtu: lte.config.mtu,
        LTE_pin: lte.sim[0].pin,
        LTE_puk: lte.sim[0].puk,
        LTE_pin_enabled: lte.sim[0].pin_enabled,
        LTE_apn: lte.sim[0].apn[0].apn,
        LTE_ipv6_enabled: lte.sim[0].apn[0].ipv6_enabled,
        LTE_auth: lte.sim[0].apn[0].auth.type,
        LTE_username: lte.sim[0].apn[0].auth.username,
        LTE_password: lte.sim[0].apn[0].auth.password,
        LTE_limit_mbyte: lte.limit[0].limit_mbyte,
        LTE_limit_enabled: lte.limit[0].enabled,
        LTE_reset_day: lte.limit[0].reset.day,
        LTE_reset_hour: lte.limit[0].reset.hour,
        LTE_reset_minute: lte.limit[0].reset.minute,
        LTE_reset_second: lte.limit[0].reset.second,
        LTE_roaming: lte.policy.roaming,
        LTE_recovery_down_time: lte.policy.recovery.down_times,
        LTE_recovery_apn_enabled: lte.policy.recovery.recover_apn.enabled,
        LTE_recovery_apn_action: lte.policy.recovery.recover_apn.action,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lte]);

  const onFinish = (values) => {
    setUploading(true);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"device_cfg":{"filter":{"id":"${id}"},"nodeInf":{},"obj":{"lte":{"config":{"mode":"${values.LTE_mode}","mtu":${values.LTE_mtu}},"sim":[{${LTEPinEnable? `"pin":"${values.LTE_pin}","puk":"${values.LTE_puk}",` : ''}"pin_enabled":${values.LTE_pin_enabled},"apn":[{"apn":"${values.LTE_apn}","ipv6_enabled":${values.LTE_ipv6_enabled},"auth":{"type":"${values.LTE_auth}","username":"${values.LTE_username}","password":"${values.LTE_password}"}}]}],"limit":[{"enabled":${values.LTE_limit_enabled} ${LTEDataLimitEnable? `,"limit_mbyte":${values.LTE_limit_mbyte},"reset":{"day":${values.LTE_reset_day},"hour":${values.LTE_reset_hour},"minute":${values.LTE_reset_minute},"second":${values.LTE_reset_second}}` :''}}],"policy":{"roaming":${values.LTE_roaming},"recovery":{"down_times":${values.LTE_recovery_down_time},"recover_apn":{"enabled":"${values.LTE_recovery_apn_enabled}","action":"${values.LTE_recovery_apn_action}"}}}}}}}}`
      ),
    };
    console.log(config.data)
    axios(config)
      .then((res) => {
        console.log(res);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("update successfully.");
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setUploading(false);
        message.error("update fail.");
      });
  };

  return (
    <Form onFinish={onFinish} form={form}>
       <div className={styles.FormWrapper}>
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
        initialValue={false}
      >
        <Switch />
      </Form.Item>

      <h3>Data Limitation</h3>

      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={7}>
          <Form.Item
            valuePropName="checked"
            name={"LTE_limit_enabled"} 
            label="limit enabled"
            initialValue={false}
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
      <Form.Item valuePropName="checked" name={"LTE_roaming"} label="Roaming" initialValue={false}>
        <Switch />
      </Form.Item>

      <h3>Recover APN1</h3>
      <Form.Item
        valuePropName="checked"
        name={"LTE_recovery_apn_enabled"}
        label="Recover APN1"
        initialValue={false}
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
          <Form.Item name="LTE_recovery_apn_action" label="Recover action">
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
       </div>
    </Form>
  );
};

export const LteSettingMF = React.memo(LteSetting);

const PeriodSetting = ({
  DeviceConfig,
  id,
  setIsUpdate,
  IsUpdate,
  form,
  setUploading,
}) => {
  const { dispatch } = useContext(Context);
  const history = useHistory();
  const Period = DeviceConfig.report_period;

  useEffect(() => {
    if (Period) {
      form.setFieldsValue({
        alive: Period.alive,
        gps: Period.gps,
        iot: Period.iot,
        status: Period.status,
        timeout: Period.timeout,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Period]);

  const onFinish = (values) => {
    setUploading(true);
    // const SetPeriodUrl = `/cmd?set={"device_cfg":{"filter":{"id":"${id}"},"obj":{"report_period":{"alive":${values.alive},"timeout":${values.timeout},
    // "status":${values.status},"iot":${values.iot},"gps":${values.gps}}}}}`;
    // console.log(SetPeriodUrl);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(`{"set":{"device_cfg":{"filter":{"id":"${id}"},"obj":{"report_period":{"alive":${values.alive},"timeout":${values.timeout},
      "status":${values.status},"iot":${values.iot},"gps":${values.gps}}}}}}`),
    };
    axios(config)
      .then((res) => {
        console.log(res);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("update successfully.");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
        setUploading(false);
        message.error("update fail.");
      });
  };

  return (
    <Form onFinish={onFinish} form={form}>
      <Row gutter={24}>
        <Col xs={10} sm={10} md={10} lg={8} xl={8}>
          <Form.Item name={"alive"} label="Alive">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={10} sm={10} md={10} lg={8} xl={8}>
          <Form.Item name={"status"} label="Status">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={10} sm={10} md={10} lg={8} xl={8}>
          <Form.Item name={"iot"} label="IoT">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={10} sm={10} md={10} lg={8} xl={8}>
          <Form.Item name={"gps"} label="GPS">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={10} sm={10} md={10} lg={8} xl={8}>
          <Form.Item name={"timeout"} label="Timeout">
            <Input />
          </Form.Item>
        </Col>
        {/* <Form.Item  wrapperCol={{ span: 6, offset: 18 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={uploading}
        >
          Submit
        </Button>
      </Form.Item> */}
      </Row>
    </Form>
  );
};

export const PeriodSettingMF = React.memo(PeriodSetting);
