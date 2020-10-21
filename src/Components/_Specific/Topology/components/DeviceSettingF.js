import React from "react";
import styles from "../topology.module.scss";
import { Form, Input, Switch, Radio, Select, Descriptions } from "antd";

const { Option } = Select;

export const IdentityTable = ({ identity }) => {
  return(
    <Descriptions
    bordered
    column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
    className={styles.desc}
  >
    <Descriptions.Item label="Identity">
      IMEI: {identity.IMEI}
      <br />
      bootloader_version: {identity.bootloader_version}
      <br />
      hardware_mcsv: {identity.hardware_mcsv}
      <br />
      hostname: {identity.hostname}
      <br />
      lan_eth_mac: {identity.lan_eth_mac}
      <br />
      modem_firmware_version: {identity.modem_firmware_version}
      <br />
      serial_number: {identity.serial_number}
      <br />
      wan_eth_mac: {identity.wan_eth_mac}
      <br />
      wifi_ap_mac: {identity.wifi_ap_mac}
      <br />
    </Descriptions.Item>
  </Descriptions>
  )
};

export const LanSetting = ({ layout, onFinish }) => {
  const [form] = Form.useForm()
  return (
    <Form {...layout} onFinish={onFinish} form={form}>
      <Form.Item
        name={"ip4_address"}
        label="ipv4_address"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"ip4_netmask"}
        label="ip4_netmask"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"ip4_dhcpmodel"}
        label="ip4_dhcpmodel"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"ip4_dhcp_start"}
        label="ip4_dhcp_start"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"ip4_dhcp_end"}
        label="ip4_dhcp_end"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"ip6_type"}
        label="ip6_type"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"ip6_assignment"}
        label="ip6_assignment"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export const WanSetting = ({ layout, onFinish }) => {
  const [form] = Form.useForm()
  return (
    <Form {...layout} onFinish={onFinish} form={form}>
      <Form.Item label="Ethernet dhcp dns(1)">
        <Input.Group compact>
          <Form.Item name="ipv4_type">
            <Radio.Group>
              <Radio value="ISP">ISP</Radio>
              <Radio value="manual">Manual</Radio>
              <Radio value="nonec">none</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name={["ip4", "adress"]} noStyle>
            <Input style={{ width: "50%" }} placeholder="Input adress" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label="ethernet_dhcp_dns_2">
        <Input.Group compact>
          <Form.Item name="ipv4_type">
            <Radio.Group>
              <Radio value="ISP">ISP</Radio>
              <Radio value="manual">Manual</Radio>
              <Radio value="nonec">none</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={["ip4", "adress"]}
            noStyle
            // rules={[{ required: true, message: "adress is required" }]}
          >
            <Input style={{ width: "50%" }} placeholder="Input adress" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label="ethernet_dhcp_dns_3">
        <Input.Group compact>
          <Form.Item name="ipv4_type">
            <Radio.Group>
              <Radio value="ISP">ISP</Radio>
              <Radio value="manual">Manual</Radio>
              <Radio value="nonec">none</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={["ip4", "adress"]}
            noStyle
            // rules={[{ required: true, message: "adress is required" }]}
          >
            <Input style={{ width: "50%" }} placeholder="Input adress" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label="Priority Order">
        <Input.Group compact>
          <Form.Item
            name="1"
            noStyle
            label="1"
            // rules={[{ required: true, message: "adress is required" }]}
          >
            <Select placeholder="Please select">
              <Option value="lte">lte</Option>
              <Option value="eth">eth</Option>
              <Option value="wifi-2.4G">wifi-2.4G</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="2"
            noStyle
            label="2"
            // rules={[{ required: true, message: "adress is required" }]}
          >
            <Select placeholder="Please select">
              <Option value="lte">lte</Option>
              <Option value="eth">eth</Option>
              <Option value="wifi-2.4G">wifi-2.4G</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="3"
            noStyle
            label="3"
            // rules={[{ required: true, message: "adress is required" }]}
          >
            <Select placeholder="Please select">
              <Option value="lte">lte</Option>
              <Option value="eth">eth</Option>
              <Option value="wifi-2.4G">wifi-2.4G</Option>
            </Select>
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item name="LTE Model" label="LTE Model">
        <Radio.Group>
          <Radio value="bridge">bridge</Radio>
          <Radio value="router">router</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="Ethernet Type" label="Ethernet Type">
        <Radio.Group>
          <Radio value="dhcp">dhcp</Radio>
          <Radio value="pppoe">pppoe</Radio>
          <Radio value="static">static</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export const LteSetting = ({ layout, onFinish }) => {
  const [form] = Form.useForm()
  function pinonChange(checked) {
    console.log(`switch to ${checked}`);
  }
  function ipv6onChange(checked) {
    console.log(`switch to ${checked}`);
  }
  function roamingonChange(checked) {
    console.log(`switch to ${checked}`);
  }
  function apnonChange(checked) {
    console.log(`switch to ${checked}`);
  }

  return (
    <Form {...layout} onFinish={onFinish} form={form}>
      <Form.Item name="mode" label="Model">
        <Radio.Group>
          <Radio value="auto">Auto</Radio>
          <Radio value="2G-only">2G-only</Radio>
          <Radio value="3G-only">3G-only</Radio>
          <Radio value="4G-only">4G-only</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name={"mtu"} label="mtu">
        <Input />
      </Form.Item>
      <Form.Item name={"pin"} label="pin">
        <Input />
      </Form.Item>
      <Form.Item name={"puk"} label="puk">
        <Input />
      </Form.Item>
      <Form.Item
        valuePropName="checked"
        name={"pin_enabled"}
        label="pin enabled"
      >
        <Switch defaultChecked onChange={pinonChange} />
      </Form.Item>
      <Form.Item name={"apn"} label="apn">
        <Input />
      </Form.Item>
      <Form.Item
        valuePropName="checked"
        name={"ipv6_enabled"}
        label="ipv6 enabled"
      >
        <Switch defaultChecked onChange={ipv6onChange} />
      </Form.Item>
      <Form.Item name="auth" label="Auth Type">
        <Radio.Group>
          <Radio value="none">none</Radio>
          <Radio value="pap">pap</Radio>
          <Radio value="chap">chap</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name={"username"} label="Auth_UserName">
        <Input />
      </Form.Item>
      <Form.Item name={"password"} label="Auth_Password">
        <Input />
      </Form.Item>
      <Form.Item
        valuePropName="checked"
        name={"limit_enabled"}
        label="limit enabled"
      >
        <Switch onChange={ipv6onChange} />
      </Form.Item>
      <Form.Item name={"limit_mbyte"} label="Mbyte">
        <Input />
      </Form.Item>
      <Form.Item name={"limit_mbyte"} label="Reset Day">
        <Input />
      </Form.Item>
      <Form.Item name={"limit_mbyte"} label="Reset Hour">
        <Input />
      </Form.Item>
      <Form.Item name={"limit_mbyte"} label="Reset Minute">
        <Input />
      </Form.Item>
      <Form.Item name={"limit_mbyte"} label="Reset Second">
        <Input />
      </Form.Item>
      <Form.Item valuePropName="checked" name={"roaming"} label="Roaming">
        <Switch onChange={roamingonChange} />
      </Form.Item>
      <Form.Item name={"limit_mbyte"} label="Recovery DownTimes">
        <Input />
      </Form.Item>
      <Form.Item valuePropName="checked" name={"roaming"} label="Recovery apn">
        <Switch onChange={apnonChange} />
      </Form.Item>
      <Form.Item name="action" label="Recovery apn action">
        <Radio.Group>
          <Radio value="reboot">reboot</Radio>
          <Radio value="default-apn">default-apn</Radio>
          <Radio value="previous-apn">previous-apn</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};
