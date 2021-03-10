import React, { useState } from "react";
import styles from "../topology.module.scss";
import { Form, Select, Button, Row, Col, Input, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const BulkConfigFLan = ({
  SubmitConfigonFinish,
  form,
  LANIPV6Static,
  setLANIPV6Static,
  // LanStatisticIPEnable,
  // setLanStatisticIPEnable,
  DeviceNum,
}) => {
  const [Count, setCount] = useState(0);
  return (
    <Form onFinish={SubmitConfigonFinish} form={form}>
      <div className={`${styles.FormWrapper} ${styles.BulkFormWrapper}`}>
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
                  <Input placeholder="192.0.0.0" />
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
                  // initialValue={false}
                  rules={[{ required: true }]}
                >
                  <Select
                    // onChange={(value) => {
                    //   setLanDHCServerEnable(value);
                    // }}
                    placeholder={"ON/OFF"}
                  >
                    <Option key={0} value={"on"}>
                      ON
                    </Option>
                    <Option key={1} value={"off"}>
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
                  <Input placeholder="192.0.0.0" />
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
                  <Input placeholder="192.0.0.0" />
                </Form.Item>
              </Col>

              {/* // */}
              {DeviceNum.length <= 1 && (
                <Form.List name="StaticIP">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Row gutter={24} justify="space-around" key={field.key}>
                          <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                            lg={{ span: 7 }}
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, "enabled"]}
                              fieldKey={[field.fieldKey, "enabled"]}
                              label="Statistic"
                              style={{ minWidth: "100px" }}
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <Select
                                // onChange={(value) => {
                                //   setLanStatisticIPEnable(value);
                                // }}
                                placeholder={"ON/OFF"}
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
                            <Col xs={24} sm={24} md={24} lg={24} xl={7}>
                            <Form.Item
                              {...field}
                              name={[field.name, "mac"]}
                              fieldKey={[field.fieldKey, "mac"]}
                              label="MAC"
                              // initialValue={'aa:bb:cc:dd:ee:ff'}
                              // rules={[
                              //   {
                              //     required: LanStatisticIPEnable,
                              //   },
                              // ]}
                            >
                              <Input
                                placeholder="aa:bb:cc:dd:ee:ff"
                                // disabled={!LanStatisticIPEnable}
                              />
                            </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={7}>
                            <Form.Item
                              {...field}
                              name={[field.name, "ip"]}
                              fieldKey={[field.fieldKey, "ip"]}
                              label="IP"
                              // rules={[
                              //   {
                              //     required: LanStatisticIPEnable,
                              //   },
                              // ]}
                              // initialValue={"192.0.0.0"}
                            >
                              <Input
                                placeholder="192.0.0.0"
                                // disabled={!LanStatisticIPEnable}
                              />
                            </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={2}>
                            <MinusCircleOutlined
                              onClick={() => {
                                setCount(Count - 1);
                                remove(field.name);
                              }}
                            />
                          </Col>
                        </Row>
                      ))}
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        lg={{ span: 24 }}
                      >
                        <Form.Item>
                          <Button
                            type="dashed"
                            disabled={DeviceNum.length > 1 || Count === 16}
                            onClick={() => {
                              setCount(Count + 1);
                              add();
                            }}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Static IP
                          </Button>
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Form.List>
              )}
              {/* // */}
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
                  form.validateFields()
                }}
                placeholder="delegate/static"
              >
                <Option key={0} value={"delegate-prefix-from-wan"}>
                  Delegate Prefix from WAN
                </Option>
                <Option key={1} value={"static"}>
                  Static Address
                </Option>
              </Select>
            </Form.Item>
            {/* {LANIPV6Static === "static" && ( */}
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name={"LAN_ipv6_adress"}
                  label="Static Address"
                  rules={[
                    {
                      required: LANIPV6Static === "static",
                    },
                  ]}
                  // initialValue="192.0.0.0"
                >
                  <Input
                    disabled={LANIPV6Static !== "static"}
                    placeholder="2001::1"
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* )} */}
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
                placeholder={"Stateful/Stateless"}
              >
                <Option key={0} value={"stateful"}>
                  Stateful
                </Option>
                <Option key={1} value={"stateless"}>
                  Stateless
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default BulkConfigFLan;

////////////////////////////////////////////////////////

export function LanJSON(values) {

  return `"lan":{"ipv4":{"address":"${values.LAN_ipv4_address}","netmask":"${
    values.LAN_ipv4_netmask
  }","dhcp":{"mode":"${values.LAN_ipv4_dhcpmode}","pool":[{"start":"${
    values.LAN_ipv4_dhcp_start
  }","end":"${values.LAN_ipv4_dhcp_end}","fixed_ip":${JSON.stringify(
    values.StaticIP || []
  )}}]}},"ipv6":{"type":"${values.LAN_ipv6_type}"  ${
    values.LAN_ipv6_type === "static"
      ? `,"static":{"address":"${values.LAN_ipv6_adress}"}`
      : ""
  }  ,"dhcp":{"assigment":"${values.LAN_ipv6_assignment}"}}}`;
}
