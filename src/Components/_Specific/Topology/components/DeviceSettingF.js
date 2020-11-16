import React, { useEffect } from "react";
import styles from "../topology.module.scss";
import { Form, Input, Switch, Radio, Descriptions, Button, message } from "antd";
import axios from "axios";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};



const LanSetting = ({ DeviceConfig, id, setUploading, uploading }) => {
  const [form] = Form.useForm();
  const lan = DeviceConfig.lan;
  const onFinish = (values) => {
    setUploading(true)
    const LanSetUrl = `/cmd?get={"device_cfg":{"filter":{"id":"${id}"},"nodeInf":{},"obj":{"lan":{"ipv4":{"address":"${values.ipv4_address}","netmask":"${values.ipv4_netmask}","dhcp":{"mode":"${values.ipv4_dhcpmode}","pool":[{"start":"${values.ipv4_dhcp_start}","end":"${values.ipv4_dhcp_end}","fixed_ip":[]}]}},"ipv6":{"type":"${values.ipv6_type}","static":{"address":"${values.ipv6_adress}"},"dhcp":{"assigment":"${values.ipv6_assignment}"}}}}}}`;
    axios
      .get(LanSetUrl)
      .then((res) => {
        console.log(res);
        setUploading(false)
        message.success("update successfully.");
      })
      .catch((error) => {
        console.log(error);
        setUploading(false)
        message.error("update fail.");
      });
  };

  useEffect(() => {
    if (lan.ipv4) {
      console.log(DeviceConfig)
      form.setFieldsValue({
        ipv4_address: lan.ipv4.address,
        ipv4_netmask: lan.ipv4.netmask,
        ipv4_dhcpmode: lan.ipv4.dhcp.mode,
        ipv4_dhcp_start: lan.ipv4.dhcp.pool[0].start,
        ipv4_dhcp_end: lan.ipv4.dhcp.pool[0].end,
        ipv6_type: lan.ipv6.type,
        ipv6_adress: lan.ipv6.static.address,
        ipv6_assignment: lan.ipv6.dhcp.assigment,
      });
    }
  }, [lan.ipv4]);

  return (
    <Form {...layout} onFinish={onFinish} form={form}>
      <Form.Item
        name={"ipv4_address"}
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
        name={"ipv4_netmask"}
        label="ipv4_netmask"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"ipv4_dhcpmode"}
        label="ipv4_dhcpmode"
        valuePropName="checked"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Switch defaultChecked />
      </Form.Item>
      <Form.Item
        name={"ipv4_dhcp_start"}
        label="ipv4_dhcp_start"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"ipv4_dhcp_end"}
        label="ipv4_dhcp_end"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"ipv6_type"}
        label="ipv6_type"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Radio.Group>
          <Radio value="delegate-prefix-from-wan">
            delegate-prefix-from-wan
          </Radio>
          <Radio value="static">static</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name={"ipv6_adress"}
        label="ipv6_adress"
        // rules={[
        //   {
        //     required: true,
        //   },
        // ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"ipv6_assignment"}
        label="ipv6_assignment"
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
      <Form.Item wrapperCol={{ span: 6, offset: 18 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={uploading}
          //   className={styles.clickBtn}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};



export const LanSettingMF = React.memo(LanSetting);

const WanSetting = ({ DeviceConfig, id, setUploading, uploading }) => {
  const [form] = Form.useForm();
  const wan = DeviceConfig.wan;
  const onFinish = (values) => {
    setUploading(true)
    const WanSetUrl = `/cmd?set={"device_cfg":{"filter":{"id":"${id}"},"nodeInf":{},"obj":{"wan":{"priority":{"order":["${values.priority_1}","${values.priority_2}","${values.priority_3}"],"lte":{"mode":"${values.lte_mode}"}},"ethernet":{"type":"${values.ethernet_type}","dhcp":{"dns":{"ipv4":[{"type":"${values.ipv4_type_1}","address":"${values.ipv4_address_1}"},{"type":"${values.ipv4_type_2}","address":"${values.ipv4_address_3}"},{"type":"${values.ipv4_type_3}","address":"${values.ipv4_address_2}"}]}},"pppoe":{"username":"${values.username}","password":"********","service_name":"${values.service_name}"},"static":{"ipv4":{"address":"${values.static_ipv4_address}","netmask":"${values.static_netmask}","gateway":"${values.static_gateway}","dns":[{"address":"${values.static_ipv4_dns_address1}"},{"address":"${values.static_ipv4_dns_address2}"},{"address":"${values.static_ipv4_dns_address3}"}]}}}}}}}`;
    axios.get(WanSetUrl).then((res)=>{
      console.log(res)
      setUploading(false)
      message.success("update successfully.");
    })
    .catch((error)=>{
      console.log(error)
      setUploading(false)
      message.error("update fail.");
    })
  };

  useEffect(() => {
    if (wan.ethernet) {
      form.setFieldsValue({
        ipv4_type_1: wan.ethernet.dhcp.dns.ipv4[0].type,
        ipv4_address_1: wan.ethernet.dhcp.dns.ipv4[0].address,
        ipv4_type_2: wan.ethernet.dhcp.dns.ipv4[1].type,
        ipv4_address_2: wan.ethernet.dhcp.dns.ipv4[1].address,
        ipv4_type_3: wan.ethernet.dhcp.dns.ipv4[2].type,
        ipv4_address_3: wan.ethernet.dhcp.dns.ipv4[2].address,
        username: wan.ethernet.pppoe.username,
        password: wan.ethernet.pppoe.password,
        service_name: wan.ethernet.pppoe.service_name,
        priority_1: wan.priority.order[0],
        priority_2: wan.priority.order[1],
        priority_3: wan.priority.order[2],
        lte_mode: wan.priority.lte.mode,
        ethernet_type: wan.ethernet.type,
        static_ipv4_address: wan.ethernet.static.ipv4.address,
        static_ipv4_dns_address1: wan.ethernet.static.ipv4.dns[0].address,
        static_ipv4_dns_address2: wan.ethernet.static.ipv4.dns[1].address,
        static_ipv4_dns_address3: wan.ethernet.static.ipv4.dns[2].address,
        static_gateway: wan.ethernet.static.ipv4.gateway,
        static_netmask: wan.ethernet.static.ipv4.netmask,
      });
    }
  }, [wan.ethernet]);

  return (
    <Form {...layout} onFinish={onFinish} form={form}>
      <Form.Item label="Ethernet dhcp dns">
        <Input.Group compact>
          <Form.Item name="ipv4_type_1">
            <Radio.Group>
              <Radio value="ISP">ISP</Radio>
              <Radio value="manual">Manual</Radio>
              <Radio value="nonec">none</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="ipv4_address_1" noStyle>
            <Input placeholder="Input adress" />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item name="ipv4_type_2">
            <Radio.Group>
              <Radio value="ISP">ISP</Radio>
              <Radio value="manual">Manual</Radio>
              <Radio value="nonec">none</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="ipv4_address_2" noStyle>
            <Input placeholder="Input adress" />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item name="ipv4_type_3">
            <Radio.Group>
              <Radio value="ISP">ISP</Radio>
              <Radio value="manual">Manual</Radio>
              <Radio value="nonec">none</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="ipv4_address_3" noStyle>
            <Input placeholder="Input adress" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item name="username" label="username">
            <Input placeholder="Input username" />
      </Form.Item>
      <Form.Item name="password" label="password">
            <Input placeholder="Input password" />
      </Form.Item>
      <Form.Item name="service_name" label="service_name">
            <Input placeholder="Input service_name" />
      </Form.Item>
      <Form.Item label="Priority Order">
        <Input.Group compact>
          <Form.Item
            name="priority_1"
            noStyle
            // label="1"
            // rules={[{ required: true, message: "adress is required" }]}
          >
            <Radio.Group>
              <Radio value="lte">lte</Radio>
              <Radio value="eth">eth</Radio>
              <Radio value="wifi-2.4G">wifi-2.4G</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="priority_2"
            noStyle
            // label="2"
            // rules={[{ required: true, message: "adress is required" }]}
          >
            <Radio.Group>
              <Radio value="lte">lte</Radio>
              <Radio value="eth">eth</Radio>
              <Radio value="wifi-2.4G">wifi-2.4G</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="priority_3"
            noStyle
            // label="3"
            // rules={[{ required: true, message: "adress is required" }]}
          >
            <Radio.Group>
              <Radio value="lte">lte</Radio>
              <Radio value="eth">eth</Radio>
              <Radio value="wifi-2.4G">wifi-2.4G</Radio>
            </Radio.Group>
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item name="lte_mode" label="LTE Mode">
        <Radio.Group>
          <Radio value="bridge">bridge</Radio>
          <Radio value="router">router</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="ethernet_type" label="Ethernet Type">
        <Radio.Group>
          <Radio value="dhcp">dhcp</Radio>
          <Radio value="pppoe">pppoe</Radio>
          <Radio value="static">static</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="static_ipv4_address" label="static_ipv4_address">
        <Input placeholder="Input adress" />
      </Form.Item>
      <Form.Item name="static_ipv4_dns_address1" label="static_dns_address">
        <Input placeholder="Input dns adress" />
      </Form.Item>
      <Form.Item name="static_ipv4_dns_address2" label="static_dns_address">
        <Input placeholder="Input dns adress" />
      </Form.Item>
      <Form.Item name="static_ipv4_dns_address3" label="static_dns_address">
        <Input placeholder="Input dns adress" />
      </Form.Item>
      <Form.Item name="static_gateway" label="static_gateway">
        <Input placeholder="Input gateway" />
      </Form.Item>
      <Form.Item name="static_netmask" label="static_netmask">
        <Input placeholder="Input netmask" />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 6, offset: 18 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={uploading}
          //   className={styles.clickBtn}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export const WanSettingMF = React.memo(WanSetting);

const LteSetting = ({ DeviceConfig, id, setUploading, uploading  }) => {
  const [form] = Form.useForm();
  const lte = DeviceConfig.lte;
  useEffect(() => {
    if (lte) {
      form.setFieldsValue({
        mode: lte.config.mode,
        mtu: lte.config.mtu,
        pin: lte.sim[0].pin,
        puk: lte.sim[0].puk,
        pin_enabled: lte.sim[0].pin_enabled,
        apn: lte.sim[0].apn[0].apn,
        ipv6_enabled: lte.sim[0].apn[0].ipv6_enabled,
        auth: lte.sim[0].apn[0].auth.type,
        username: lte.sim[0].apn[0].auth.username,
        password: lte.sim[0].apn[0].auth.password,
        limit_mbyte: lte.limit[0].limit_mbyte,
        limit_enabled: lte.limit[0].enabled,
        reset_day: lte.limit[0].reset.day,
        reset_hour: lte.limit[0].reset.hour,
        reset_minute: lte.limit[0].reset.minute,
        reset_second: lte.limit[0].reset.second,
        roaming: lte.policy.roaming,
        recovery_down_time: lte.policy.recovery.down_times,
        recovery_apn_enabled: lte.policy.recovery.recover_apn.enabled,
        recovery_apn_action: lte.policy.recovery.recover_apn.action,
      });
    }
  }, [lte]);

  const onFinish = (values) => {
    setUploading(true)
    const LteSetUrl = `/cmd?set={"device_cfg":{"filter":{"id":"${id}"},"nodeInf":{},"obj":{"lte":{"config":{"mode":"${values.mode}","mtu":${values.mtu}},"sim":[{"pin":"${values.pin}","puk":"${values.puk}","pin_enabled":${values.pin_enabled},"apn":[{"apn":"${values.apn}","ipv6_enabled":${values.ipv6_enabled},"auth":{"type":"${values.auth}","username":"${values.username}","password":"${values.password}"}}]}],"limit":[{"enabled":${values.limit_enabled},"limit_mbyte":${values.limit_mbyte},"reset":{"day":${values.reset_day},"hour":${values.reset_hour},"minute":${values.reset_minute},"second":${values.reset_second}}}],"policy":{"roaming":${values.roaming},"recovery":{"down_times":${values.recovery_down_time},"recover_apn":{"enabled":${values.recovery_apn_enabled},"action":"${values.recovery_apn_action}"}}}}}}}`;
    console.log(LteSetUrl)
    axios.get(LteSetUrl).then((res)=>{
      console.log(res)
      setUploading(false)
      message.success("update successfully.");
    })
    .catch((error)=>{
      console.log(error)
      setUploading(false)
      message.error("update fail.");
    })
  }

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
      <Form.Item name="mode" label="Mode">
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
      <Form.Item name={"reset_day"} label="Reset Day">
        <Input />
      </Form.Item>
      <Form.Item name={"reset_hour"} label="Reset Hour">
        <Input />
      </Form.Item>
      <Form.Item name={"reset_minute"} label="Reset Minute">
        <Input />
      </Form.Item>
      <Form.Item name={"reset_second"} label="Reset Second">
        <Input />
      </Form.Item>
      <Form.Item valuePropName="checked" name={"roaming"} label="Roaming">
        <Switch onChange={roamingonChange} />
      </Form.Item>
      <Form.Item name={"recovery_down_time"} label="Recovery DownTimes">
        <Input />
      </Form.Item>
      <Form.Item
        valuePropName="checked"
        name={"recovery_apn_enabled"}
        label="Recovery apn"
      >
        <Switch onChange={apnonChange} />
      </Form.Item>
      <Form.Item name="recovery_apn_action" label="Recovery apn action">
        <Radio.Group>
          <Radio value="reboot">reboot</Radio>
          <Radio value="default-apn">default-apn</Radio>
          <Radio value="previous-apn">previous-apn</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item  wrapperCol={{ span: 6, offset: 18 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={uploading}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export const LteSettingMF = React.memo(LteSetting);



const PeriodSetting = ({ DeviceConfig, id, setUploading, uploading  }) => {
  const [form] = Form.useForm();
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
  }, [Period]);

  const onFinish = (values) => {
    setUploading(true)
    const SetPeriodUrl = `/cmd?set={"device_cfg":{"filter":{"id":"${id}"},"obj":{"report_period":{"alive":${values.alive},"timeout":${values.timeout},
    "status":${values.status},"iot":${values.iot},"gps":${values.gps}}}}}`;
    console.log(SetPeriodUrl)
    axios.get(SetPeriodUrl).then((res)=>{
      console.log(res)
      setUploading(false)
      message.success("update successfully.");
    })
    .catch((error)=>{
      console.log(error)
      setUploading(false)
      message.error("update fail.");
    })
  }


  return (
    <Form {...layout} onFinish={onFinish} form={form}>
      <Form.Item name={"alive"} label="Alive">
        <Input />
      </Form.Item>
      <Form.Item name={"status"} label="Status">
        <Input />
      </Form.Item>
      <Form.Item name={"iot"} label="IoT">
        <Input />
      </Form.Item>
      <Form.Item name={"gps"} label="GPS">
        <Input />
      </Form.Item>
      <Form.Item name={"timeout"} label="Timeout">
        <Input />
      </Form.Item>
      <Form.Item  wrapperCol={{ span: 6, offset: 18 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={uploading}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export const PeriodSettingMF = React.memo(PeriodSetting);
