import React, { useEffect, useContext, useState, Fragment } from "react";
import styles from "../topology.module.scss";
import { Form, Input, Row, message, Col, Divider, Select } from "antd";
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
  const [LanStatisticIPEnable, setLanStatisticIPEnable] = useState("");
  const [LanDHCServerEnable, setLanDHCServerEnable] = useState("");

  const onFinish = (values) => {
    setUploading(true);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"device_cfg":{"filter":{"id":"${id}"},"nodeInf":{},"obj":{"lan":{"ipv4":{"address":"${
          values.LAN_ipv4_address
        }","netmask":"${values.LAN_ipv4_netmask}","dhcp":{"mode":"${
          values.LAN_ipv4_dhcpmode
        }","pool":[{"start":"${values.LAN_ipv4_dhcp_start}","end":"${
          values.LAN_ipv4_dhcp_end
        }","fixed_ip":[{ "enabled":${values.LAN_ipv4_fixed_enabled}, "mac": "${
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
    console.log(config.data);
    axios(config)
      .then((res) => {
        console.log(res.data);
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
      setLanStatisticIPEnable(lan.ipv4.dhcp.pool[0].fixed_ip?.[0]?.enabled);
      setLanDHCServerEnable(lan.ipv4.dhcp.mode);
      form.setFieldsValue({
        LAN_ipv4_address: lan.ipv4.address,
        LAN_ipv4_netmask: lan.ipv4.netmask,
        LAN_ipv4_dhcpmode: lan.ipv4.dhcp.mode,
        LAN_ipv4_dhcp_start: lan.ipv4.dhcp.pool[0].start,
        LAN_ipv4_dhcp_end: lan.ipv4.dhcp.pool[0].end,
        LAN_ipv4_fixed_enabled: lan.ipv4.dhcp.pool[0].fixed_ip?.[0]?.enabled,
        LAN_ipv4_fixed_mac: lan.ipv4.dhcp.pool[0].fixed_ip?.[0]?.mac,
        LAN_ipv4_fixed_IP: lan.ipv4.dhcp.pool[0].fixed_ip?.[0]?.ip,
        LAN_ipv6_type: lan.ipv6.type,
        LAN_ipv6_adress: lan.ipv6.static.address,
        LAN_ipv6_assignment: lan.ipv6.dhcp.assigment,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lan.ipv4]);

  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
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
      console.log(wan.priority.order, wan.priority.order.length);
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
    <Form onFinish={onFinish} form={form} layout="vertical">
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
                {/* </Col> */}
                {WanDHCPServer1 === "ISP" && (
                  <Form.Item
                    name="WAN_ipv4_address_1"
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
                {/* </Col> */}
                {WanDHCPServer2 === "ISP" && (
                  // <Col xs={24} sm={24} md={24} lg={7}>
                  <Form.Item
                    name="WAN_ipv4_address_2"
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Input
                      placeholder="Input adress"
                      disabled={WanDHCPServer2 !== "ISP"}
                    />
                  </Form.Item>
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
                  <Form.Item
                    name="WAN_ipv4_address_3"
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
  const [LTEIpv6Enable, setLTEIpv6Enable] = useState("");
  const [LTERoamingEnable, setLTERoamingEnable] = useState("");
  useEffect(() => {
    if (lte) {
      setLTEPinEnable(lte.sim[0].pin_enabled);
      setLTERecoverAPN1(lte.policy.recovery.recover_apn.enabled);
      setLTEDataLimitEnable(lte.limit[0].enabled);
      setLTEIpv6Enable(lte.sim[0].apn[0].ipv6_enabled);
      setLTERoamingEnable(lte.policy.roaming);
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
        LTE_reset_day: lte.limit[0].reset?.day,
        LTE_reset_hour: lte.limit[0].reset?.hour,
        LTE_reset_minute: lte.limit[0].reset?.minute,
        LTE_reset_second: lte.limit[0].reset?.second,
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
        `{"set":{"device_cfg":{"filter":{"id":"${id}"},"nodeInf":{},"obj":{"lte":{"config":{"mode":"${
          values.LTE_mode
        }","mtu":${values.LTE_mtu}},"sim":[{${
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
        }"}}}}}}}}}`
      ),
    };
    console.log(config.data);
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
    <Form onFinish={onFinish} form={form} layout="vertical">
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
              <Row gutter={24}>
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
    console.log(values)
    setUploading(true);
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
    <Form onFinish={onFinish} form={form} layout="vertical">
      <div className={styles.FormWrapper}>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Form.Item name={"alive"} label="Alive">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Form.Item name={"status"} label="Status">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Form.Item name={"iot"} label="IoT">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Form.Item name={"gps"} label="GPS">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Form.Item name={"timeout"} label="Timeout">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export const PeriodSettingMF = React.memo(PeriodSetting);

const GPSSetting = ({
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
  const [GPSEnable, setGPSEnable] = useState("");
  const [GPSReference, setGPSReference] = useState("");

  // useEffect(() => {
  //   if (Period) {
  //     form.setFieldsValue({
  //       alive: Period.alive,
  //       gps: Period.gps,
  //       iot: Period.iot,
  //       status: Period.status,
  //       timeout: Period.timeout,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [Period]);

  const GPSonFinish = (values) => {
    console.log(values);
    const testData = `"geofence": {
      "alarm_enabled": ${values.gps_enabled},
      "radius_m": ${values.gps_radius},
      "latitude": ${values.gps_latitude},
      "longitude": ${values.gps_latitude},
      "auto_detect": ${values.gps_reference},
    }`;
    console.log(testData);
    useEffect(()=>{
      form.setFieldsValue({
        gps_enabled: false,
        gps_reference: false
      })
    },[])
    // setUploading(true);
    // const config = {
    //   method: "post",
    //   headers: { "Content-Type": "application/json" },
    //   url: "/cmd",
    //   data: JSON.parse(`{"set":{"device_cfg":{"filter":{"id":"${id}"},"obj":{"report_period":{"alive":${values.alive},"timeout":${values.timeout},
    //   "status":${values.status},"iot":${values.iot},"gps":${values.gps}}}}}}`),
    // };
    // axios(config)
    //   .then((res) => {
    //     console.log(res);
    //     setUploading(false);
    //     setIsUpdate(!IsUpdate);
    //     message.success("update successfully.");
    //   })
    //   .catch((error) => {
    //     if (error.response && error.response.status === 401) {
    //       dispatch({ type: "setLogin", payload: { IsLogin: false } });
    //       UserLogOut();
    //       history.push("/userlogin");
    //     }
    //     console.log(error);
    //     setUploading(false);
    //     message.error("update fail.");
    //   });
  };

  return (
    <Form onFinish={GPSonFinish} form={form} layout="vertical">
      <div className={styles.FormWrapper}>
        <h2>GPS Alarm Setting</h2>
        <Divider className={styles.divider} />
        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Form.Item
              name={"gps_enabled"}
              label="Detection Enable"
              rules={[{ required: true, message: "required!" }]}
              initialValue={false}
            >
              <Select
                onChange={(value) => {
                  setGPSEnable(value);
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
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Form.Item
              name={"gps_radius"}
              label="Radius(m)"
              placeholder="100~100000"
              rules={[{ required: true, message: "required!" }]}
              initialValue={150}
            >
              <Input disabled={!GPSEnable} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Form.Item
              name="gps_reference"
              label="Reference"
              rules={[{ required: true, message: "required!" }]}
              initialValue={true}
            >
              <Select
                disabled={!GPSEnable}
                onChange={(value) => {
                  setGPSReference(value);
                }}
              >
                <Option key={0} value={true}>
                  Auto Detect
                </Option>
                <Option key={1} value={false}>
                  Self Define
                </Option>
              </Select>
            </Form.Item>
          </Col>
          {GPSReference === false && (
            <Fragment>
              <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                <Form.Item
                  name={"gps_latitude"}
                  label="Latitude"
                  placeholder="11.111111"
                  rules={[{ required: true, message: "required!" }]}
                  initialValue={''}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                <Form.Item
                  name={"gps_longitude"}
                  label="Longitude"
                  placeholder="11.111111"
                  rules={[{ required: true, message: "required!" }]}
                  initialValue={''}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Fragment>
          )}
        </Row>
      </div>
    </Form>
  );
};

export const GPSSettingMF = React.memo(GPSSetting);
