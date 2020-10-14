import React from "react";
import styles from "../topology.module.scss";
import { LanSetting, WanSetting, LteSetting } from "./DeviceSettingF";
import {
  Table,
  Modal,
  Form,
  Tabs
} from "antd";

const { TabPane } = Tabs;
// function callback(key) {
//   console.log(key);
//   const url = `/cmd?get={"device_cfg":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{"${key}":{}}}}`;
//   console.log(url);
//   axios.get(url).then((res) => {
//     console.log(res.data);
//     if (key === "lan") {
//       let result = res.data.response.device_cfg[0].obj.lan;
//       setLan(result);
//       // form.setFieldsValue({
//       //   ipv4_address: result.ipv4.address,
//       //   ipv4_netmask: result.ipv4.netmask,
//       //   ipv4_dhcpmodel: result.ipv4.dhcp.model,
//       //   ipv4_dhcp_start: result.ipv4.dhcp.pool[0].start,
//       //   ipv4_dhcp_end: result.ipv4.dhcp.pool[0].end,
//       //   ipv6_type: result.ipv6.type,
//       //   ipv6_assignment: result.ipv6.dhcp.assignment,
//       // });
//     }
//     key === "wan" && setWan(res.data.response.device_cfg[0].obj.wan);
//     key === "lte" && setLte(res.data.response.device_cfg[0].obj.lte);
//   });
// }
const DeviceSettingC = ({ DeviceSettingvisible, setDeviceSettingvisible, DeviceStateloading, identity, DeviceSettingonFinish, layout }) => {
  const [form] = Form.useForm()
  const identitycolumns = [
    {
      title: "Items",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Data",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <Modal
    visible={DeviceSettingvisible}
    onOk={() => setDeviceSettingvisible(false)}
    onCancel={() => setDeviceSettingvisible(false)}
    okText="confirm"
    cancelText="cancel"
    centered={true}
    width={"50%"}
    className={styles.modal}
  >
    <Tabs defaultActiveKey="1" >
      <TabPane tab="Identity" key="identity" className={styles.tabpane}>
        <Table
          loading={DeviceStateloading}
          dataSource={identity}
          columns={identitycolumns}
          pagination={true}
        />
      </TabPane>
      <TabPane tab="LAN" key="lan" className={styles.tabpane}>
        <LanSetting layout={layout} form={form} onFinish={DeviceSettingonFinish} />
      </TabPane>
      <TabPane tab="WAN" key="wan" className={styles.tabpane}>
        <WanSetting layout={layout} form={form} onFinish={DeviceSettingonFinish} />
      </TabPane>
      <TabPane tab="LTE" key="lte" className={styles.tabpane}>
        <LteSetting layout={layout} form={form} onFinish={DeviceSettingonFinish} />
      </TabPane>
    </Tabs>
  </Modal>
  );
};

export default DeviceSettingC;
