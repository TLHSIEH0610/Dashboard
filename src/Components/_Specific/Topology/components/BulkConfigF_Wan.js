import React, { Fragment, useState } from "react";
import styles from "../topology.module.scss";
import { Form, Select, Row, Col, Input, Divider } from "antd";

const { Option } = Select;

const BulkConfigFWan = ({
  SubmitConfigonFinish,
  form,
  // PriorityOrderOptions,
  WanDHCPServer1,
  setWanDHCPServer1,
  WanDHCPServer2,
  setWanDHCPServer2,
  WanDHCPServer3,
  setWanDHCPServer3,
  // setPriorityOrderOptions,
  WanPriority,
  setWanPriority,
  setWanEthernetType,
  WanEthernetType,
  SelectedModel,
  M300model
}) => {

  const [firstPri, setFirstPri] = useState('')
  const [secondPri, setSecondPri] = useState('')
  
  

  return (
    <Form onFinish={SubmitConfigonFinish} form={form}>
      <div className={`${styles.FormWrapper} ${styles.BulkFormWrapper}`}>
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
                placeholder={"Auto/LTE/Wifi..."}
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
                        setFirstPri(value);
                        form.resetFields(['WAN_priority_2', 'WAN_priority_3'])
                      }}
                    >
                      <Option key={"lte"} value={"lte"}>
                        LTE
                      </Option>
                      <Option key={"eth"} value={"eth"}>
                        ETH
                      </Option>
                      {!M300model.includes(SelectedModel)&&<Option key={"wifi-2.4G"} value={"wifi-2.4G"}>
                        WiFi-2.4G
                      </Option>}
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
                        setSecondPri(value);
                        form.resetFields(['WAN_priority_3'])
                      }}
                    >
                      <Option
                        disabled={firstPri==='lte'}
                        key={"lte"}
                        value={"lte"}
                      >
                        LTE
                      </Option>
                      <Option
                        disabled={firstPri==='eth'}
                        key={"eth"}
                        value={"eth"}
                      >
                        ETH
                      </Option>
                      {!M300model.includes(SelectedModel)&&<Option
                        disabled={firstPri==='wifi-2.4G'}
                        key={"wifi-2.4G"}
                        value={"wifi-2.4G"}
                      >
                        WiFi-2.4G
                      </Option>}
                    </Select>
                  </Form.Item>
                  {!M300model.includes(SelectedModel)&&<Form.Item
                    name="WAN_priority_3"
                    label="3th"
                    rules={[{ required: true, message: "required!" }]}
                  >
                    <Select
                      // loading={uploading || Nodeloading || Fileloading}
                      placeholder={"Priority"}
                    >
                      <Option
                        disabled={firstPri==='lte' || secondPri==='lte'}
                        key={"lte"}
                        value={"lte"}
                      >
                        LTE
                      </Option>
                      <Option
                        disabled={firstPri==='eth' || secondPri==='eth'}
                        key={"eth"}
                        value={"eth"}
                      >
                        ETH
                      </Option>
                      <Option
                        disabled={firstPri==='wifi-2.4G' || secondPri==='wifi-2.4G'}
                        key={"wifi-2.4G"}
                        value={"wifi-2.4G"}
                      >
                        WiFi-2.4G
                      </Option>
                    </Select>
                  </Form.Item>}
                </Col>
              </Row>
            )}

            {WanPriority === "lte" && (
              <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name="WAN_lte_mode"
                  label="LTE Mode"
                  rules={[{ required: true, message: "required!" }]}
                >
                  <Select placeholder={'bridge/router'}>
                    <Option key={0} value={"bridge"}>
                      bridge
                    </Option>
                    <Option key={1} value={"router"}>
                      router
                    </Option>
                  </Select>
                </Form.Item>
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
                placeholder={"DHCP/PPPoE/Static"}
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
                  placeholder={"DNS Server"}
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
                {WanDHCPServer1 === "manual" && (
                  <Form.Item
                    name="WAN_ipv4_address_1"
                    label="Address #1"
                    rules={[{ required: true, message: "required!" }]}
                    initialValue={"192.0.0.0"}
                  >
                    <Input
                      placeholder="Input adress"
                      disabled={WanDHCPServer1 !== "manual"}
                    />
                  </Form.Item>
                  // </Col>
                )}
                <Form.Item
                  name="WAN_ipv4_type_2"
                  label="IPv4 DNS Server #2"
                  rules={[{ required: true, message: "required!" }]}
                  placeholder={"DNS Server"}
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
                {WanDHCPServer2 === "manual" && (
                  <Form.Item
                    name="WAN_ipv4_address_2"
                    label="Address #2"
                    rules={[{ required: true, message: "required!" }]}
                    initialValue={"192.0.0.0"}
                  >
                    <Input
                      placeholder="Input adress"
                      disabled={WanDHCPServer2 !== "manual"}
                    />
                  </Form.Item>
                  // </Col>
                )}

                <Form.Item
                  name="WAN_ipv4_type_3"
                  label="IPv4 DNS Server #3"
                  rules={[{ required: true, message: "required!" }]}
                  placeholder={"DNS Server"}
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
                {WanDHCPServer3 === "manual" && (
                  // <Col xs={24} sm={24} md={24} lg={7}>
                  <Form.Item
                    name="WAN_ipv4_address_3"
                    label="Address #3"
                    rules={[{ required: true, message: "required!" }]}
                    initialValue={"192.0.0.0"}
                  >
                    <Input
                      placeholder="Input adress"
                      disabled={WanDHCPServer3 !== "manual"}
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
                  <Input placeholder="username" />
                </Form.Item>
                <Form.Item
                  name="WAN_password"
                  label="password"
                  // rules={[{ required: true, message: "required!" }]}
                >
                  <Input placeholder="password" />
                </Form.Item>
                <Form.Item
                  name="WAN_service_name"
                  label="service_name"
                  rules={[{ required: true, message: "required!" }]}
                >
                  <Input placeholder="service_name" />
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
                  <Input placeholder="192.0.0.0" />
                </Form.Item>
                <Form.Item
                  name="WAN_static_netmask"
                  label="IP Mask"
                  rules={[{ required: true, message: "required!" }]}
                >
                  <Input placeholder="255.255.255.0" />
                </Form.Item>
                <Form.Item
                  name="WAN_static_gateway"
                  label="Static Gateway"
                  rules={[{ required: true, message: "required!" }]}
                >
                  <Input placeholder="192.0.0.0" />
                </Form.Item>
                <h3>DNS Server Configuration</h3>
                <Form.Item
                  name="WAN_static_ipv4_dns_address1"
                  label="IPv4 DNS Server #1"
                  rules={[{ required: true, message: "required!" }]}
                >
                  <Input placeholder="DNS adress" />
                </Form.Item>
                <Form.Item
                  name="WAN_static_ipv4_dns_address2"
                  label="IPv4 DNS Server #2"
                  // rules={[{ required: true, message: "required!" }]}
                >
                  <Input placeholder="DNS adress" />
                </Form.Item>
                <Form.Item
                  name="WAN_static_ipv4_dns_address3"
                  label="IPv4 DNS Server #3"
                  // rules={[{ required: true, message: "required!" }]}
                >
                  <Input placeholder="DNS adress" />
                </Form.Item>
              </Fragment>
            )}
          </Col>
        </Row>
      </div>
    </Form>
  );
};
export default BulkConfigFWan;





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export function WanJSON(values, M300model, SelectedModel) {
  //Ethernet
  let ethernetObj = {};
  ethernetObj.type = values.WAN_ethernet_type;
  if (ethernetObj.type === "dhcp") {
    let dhcpObj = {};
    let ipv4Array = [];
    //IPV4_1
    let ipv4Obj1 = {};
    ipv4Obj1.type = values.WAN_ipv4_type_1;
    // if (values.WAN_ipv4_type_1 === "manual") {
      ipv4Obj1.address = values.WAN_ipv4_address_1 || '8.8.8.8';
    // }
    ipv4Array.push(ipv4Obj1);
    //IPV4_2
    let ipv4Obj2 = {};
    ipv4Obj2.type = values.WAN_ipv4_type_2;
    // if (values.WAN_ipv4_type_2 === "manual") {
      ipv4Obj2.address = values.WAN_ipv4_address_2 || '8.8.8.8';
    // }
    ipv4Array.push(ipv4Obj2);
    //IPV4_3
    let ipv4Obj3 = {};
    ipv4Obj3.type = values.WAN_ipv4_type_3;
    // if (values.WAN_ipv4_type_3 === "manual") {
      ipv4Obj3.address = values.WAN_ipv4_address_3 || '8.8.8.8';
    // }
    ipv4Array.push(ipv4Obj3);
    dhcpObj.dns = {};
    dhcpObj.dns.ipv4 = ipv4Array;
    ethernetObj.dhcp = dhcpObj;
  } else if (ethernetObj.type === "pppoe") {
    let pppoeObj = {};
    pppoeObj.username = values.WAN_username;
    if (values.WAN_password) {
      pppoeObj.password = values.WAN_password;
    }
    pppoeObj.service_name = values.WAN_service_name;
    ethernetObj.pppoe = pppoeObj;
  } else if (ethernetObj.type === "static") {
    let ipv4 = {};
    ipv4.address = values.WAN_static_ipv4_address;
    ipv4.netmask = values.WAN_static_netmask;
    ipv4.gateway = values.WAN_static_gateway;
    let DNSArray = [];
    if (values.WAN_static_ipv4_dns_address1) {
      DNSArray.push({ address: values.WAN_static_ipv4_dns_address1 });
    }
    if (values.WAN_static_ipv4_dns_address2) {
      DNSArray.push({ address: values.WAN_static_ipv4_dns_address2 });
    }
    if (values.WAN_static_ipv4_dns_address3) {
      DNSArray.push({ address: values.WAN_static_ipv4_dns_address3 });
    }
    ipv4.dns = DNSArray;
    ethernetObj.static = {};
    ethernetObj.static.ipv4 = ipv4
  }
  //Order
  let priorityObj = {};
  let OrderArray = [];
  if (values.Priority === "Auto" && !M300model.includes(SelectedModel)) {
    OrderArray.push(
      values.WAN_priority_1,
      values.WAN_priority_2,
      values.WAN_priority_3
    );
  }else if(values.Priority === "Auto" && M300model.includes(SelectedModel)){
    OrderArray.push(
      values.WAN_priority_1,
      values.WAN_priority_2
    );
  } else if (values.Priority === "lte") {
    OrderArray.push(values.Priority);
    priorityObj.lte = { mode: values.WAN_lte_mode };
  } else {
    OrderArray.push(values.Priority);
  }
  priorityObj.order = OrderArray;


  return ` "wan":{"priority": ${JSON.stringify(
    priorityObj
  )},"ethernet":${JSON.stringify(ethernetObj)}} `;
}
