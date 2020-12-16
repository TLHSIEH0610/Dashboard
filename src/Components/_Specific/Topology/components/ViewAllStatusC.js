import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Checkbox, Popover, Form, Button, Divider } from "antd";
import styles from "../topology.module.scss";
import axios from "axios";
// import useURLloader from "../../../../hook/useURLloader";

import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { FcSettings } from "react-icons/fc";
// const { TabPane } = Tabs;
const { Column, ColumnGroup } = Table;

const ViewAllStatusC = () => {
  const [DeviceStatus, setDeviceStatus] = useState([]);
  const [uploading, setUploading] = useState(false);
  // const [DeviceIdentity, setDeviceIdentity] = useState([]);
  const history = useHistory();
  const { dispatch } = useContext(Context);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const { state } = useContext(Context);
  const [BtnVisible, setBtnVisible] = useState(false)
  const [showColum, setShowColum] = useState({
    Identity: true,
    Lan: true,
    Lte: true,
    Wan: true,
    Wwan: true,
    DNS: true,
  });
  const text = <p style={{ marginBottom: 0 }}>Column</p>;
  const content = (
    <Form onFinish={(value) => setShowColum(value)}>
      <Form.Item
        name="Identity"
        valuePropName="checked"
        style={{ marginBottom: 0 }}
        initialValue={true}
      >
        <Checkbox>Identity</Checkbox>
      </Form.Item>
      <Form.Item name="Lan" valuePropName="checked" style={{ marginBottom: 0 }} initialValue={true}>
        <Checkbox>LAN</Checkbox>
      </Form.Item>
      <Form.Item name="Lte" valuePropName="checked" style={{ marginBottom: 0 }} initialValue={true}>
        <Checkbox>LTE</Checkbox>
      </Form.Item>
      <Form.Item name="Wan" valuePropName="checked" style={{ marginBottom: 0 }} initialValue={true}>
        <Checkbox>WAN</Checkbox>
      </Form.Item>
      <Form.Item
        name="Wwan"
        valuePropName="checked"
        style={{ marginBottom: 0 }}
        initialValue={true}
      >
        <Checkbox>WWAN</Checkbox>
      </Form.Item>
      <Form.Item name="DNS" valuePropName="checked" initialValue={true}>
        <Checkbox>DNS</Checkbox>
      </Form.Item>
      <Divider style={{ marginTop: '-25px', marginBottom:5}}/>
      <Form.Item style={{ marginBottom: 0}}>
        <Button  htmlType="submit" onClick={()=>setBtnVisible(false)}>
          Confirm
        </Button>
      </Form.Item>
    </Form>
  );

  useEffect(() => {
    setUploading(true);
    const config1 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"device_status":{"filter":{${
          level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
        }},"nodeInf":{},"obj":{}}}}`
      ),
    };
    const config2 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"device_identity":{"filter":{${
          level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
        }},"nodeInf":{},"obj":{}}}}`
      ),
    };
    function DeviceStatusUrl() {
      return axios(config1);
    }
    function DeviceIdentityUrl() {
      return axios(config2);
    }
    axios
      .all([DeviceStatusUrl(), DeviceIdentityUrl()])
      .then(
        axios.spread((acct, perms) => {
          let DeviceStatus = acct.data.response.device_status;
          let DeviceIdentity = perms.data.response.device_identity;
          for (let i = 0; i < DeviceStatus.length; i++) {
            DeviceStatus[i].identity = DeviceIdentity.filter((item) => {
              return item.nodeInf.id === DeviceStatus[i].nodeInf.id;
            });
          }
          DeviceStatus = DeviceStatus.map((item) => {
            return {
              id: item.nodeInf.id,
              name: item.nodeInf.name,
              model: item.nodeInf.model,
              IMEI: item.identity[0].obj.identity.IMEI,
              bootloader_version:
                item.identity[0].obj.identity.bootloader_version,
              hardware_mcsv: item.identity[0].obj.identity.hardware_mcsv,
              hostname: item.identity[0].obj.identity.hostname,
              lan_eth_mac: item.identity[0].obj.identity.lan_eth_mac,
              modem_firmware_version:
                item.identity[0].obj.identity.modem_firmware_version,
              serial_number: item.identity[0].obj.identity.serial_number,
              wan_eth_mac: item.identity[0].obj.identity.wan_eth_mac,
              wifi_ap_mac: item.identity[0].obj.identity.wifi_ap_mac, //
              lan_ipv4_address: item.obj.status.connection.lan.ipv4.address,
              lan_ipv4_netmask: item.obj.status.connection.lan.ipv4.netmask,
              lan_ipv6_netmask: item.obj.status.connection.lan.ipv6.address,
              lan_ipv6_uptime: item.obj.status.connection.lan.ipv6.uptime,
              lte_active: item.obj.status.connection.lte.active,
              lte_apn_ipv4_address:
                item.obj.status.connection.lte.apn[0].ipv4.address,
              lte_apn_ipv4_gateway:
                item.obj.status.connection.lte.apn[0].ipv4.gateway,
              lte_apn_ipv4_netmask:
                item.obj.status.connection.lte.apn[0].ipv4.netmask,
              lte_apn_ipv4_uptime:
                item.obj.status.connection.lte.apn[0].ipv4.uptime,
              lte_ipv4_address: item.obj.status.connection.lte.ipv4.address,
              lte_ipv4_gateway: item.obj.status.connection.lte.ipv4.gateway,
              lte_ipv4_netmask: item.obj.status.connection.lte.ipv4.netmask,
              lte_ipv4_uptime: item.obj.status.connection.lte.ipv4.uptime,
              wan_active: item.obj.status.connection.wan.active,
              wan_ipv4_address: item.obj.status.connection.wan.ipv4.address,
              wan_ipv4_gateway: item.obj.status.connection.wan.ipv4.gateway,
              wan_ipv4_netmask: item.obj.status.connection.wan.ipv4.netmask,
              wan_ipv4_uptime: item.obj.status.connection.wan.ipv4.uptime,
              wwan_active: item.obj.status.connection.wwan.active,
              wwan_ipv4_MAC: item.obj.status.connection.wwan.ipv4.MAC,
              wwan_ipv4_SSID: item.obj.status.connection.wwan.ipv4.SSID,
              wwan_ipv4_address: item.obj.status.connection.wwan.ipv4.address,
              wwan_ipv4_channel: item.obj.status.connection.wwan.ipv4.channel,
              wwan_ipv4_gateway: item.obj.status.connection.wwan.ipv4.gateway,
              wwan_ipv4_netmask: item.obj.status.connection.wwan.ipv4.netmask,
              wwan_ipv4_uptime: item.obj.status.connection.wwan.ipv4.uptime,
              dns_wan_ipv4_0: item.obj.status.dns.wan[0].ipv4[0],
              dns_wan_ipv4_1: item.obj.status.dns.wan[0].ipv4[1],
              dns_wan_ipv4_2: item.obj.status.dns.wan[0].ipv4[2],
              dns_wan_ipv6_0: item.obj.status.dns.wan[0].ipv6[0],
              dns_wan_ipv6_1: item.obj.status.dns.wan[0].ipv6[1],
              dns_wan_ipv6_2: item.obj.status.dns.wan[0].ipv6[2],
              sim_EARFCN: item.obj.status.sim[0].EARFCN,
              sim_IMSI: item.obj.status.sim[0].IMSI,
              sim_PLMN: item.obj.status.sim[0].PLMN,
              sim_access: item.obj.status.sim[0].access,
              sim_active: item.obj.status.sim[0].active,
              sim_band: item.obj.status.sim[0].band,
              sim_operator: item.obj.status.sim[0].operator,
              sim_phone_number: item.obj.status.sim[0].phone_number,
              sim_roaming: item.obj.status.sim[0].roaming,
              sim_rssi_dbm: item.obj.status.sim[0].rssi_dbm,
              sim_status: item.obj.status.sim[0].status,
              lan_down_kbps: item.obj.status.statistic.lan.down_kbps,
              lan_rx_dropped_pkts:
                item.obj.status.statistic.lan.rx_dropped_pkts,
              lan_rx_kbytes: item.obj.status.statistic.lan.rx_kbytes,
              lan_tx_dropped_pkts:
                item.obj.status.statistic.lan.tx_dropped_pkts,
              lan_tx_kbytes: item.obj.status.statistic.lan.tx_kbytes,
              lan_up_kbps: item.obj.status.statistic.lan.up_kbps,
              wan_down_kbps: item.obj.status.statistic.wan.down_kbps,
              wan_rx_dropped_pkts:
                item.obj.status.statistic.wan.rx_dropped_pkts,
              wan_rx_kbytes: item.obj.status.statistic.wan.rx_kbytes,
              wan_tx_dropped_pkts:
                item.obj.status.statistic.wan.tx_dropped_pkts,
              wan_tx_kbytes: item.obj.status.statistic.wan.tx_kbytes,
              wan_up_kbps: item.obj.status.statistic.wan.up_kbps,
              lte_down_kbps: item.obj.status.statistic.lte.down_kbps,
              lte_rx_dropped_pkts:
                item.obj.status.statistic.lte.rx_dropped_pkts,
              lte_rx_kbytes: item.obj.status.statistic.lte.rx_kbytes,
              lte_tx_dropped_pkts:
                item.obj.status.statistic.lte.tx_dropped_pkts,
              lte_tx_kbytes: item.obj.status.statistic.lte.tx_kbytes,
              lte_up_kbps: item.obj.status.statistic.lte.up_kbps,
            };
          });
          console.log(DeviceStatus);
          setDeviceStatus(DeviceStatus);
          setUploading(false);
        })
      )
      .catch((error) => {
        console.error(error);
        setUploading(false);
        if (error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card title='Routers Status' extra={<Popover placement="bottomLeft" trigger="click" onVisibleChange={(visible)=>setBtnVisible(visible)} title={text} content={content} trigger="click" visible={BtnVisible}>
    <FcSettings className={styles.columnSettingIcon}/>
  </Popover>}> 
      
      <Table
        loading={uploading}
        pagination={true}
        bordered
        // columns={columns}
        // sticky
        dataSource={DeviceStatus}
        scroll={{ x: "calc(700px + 50%)" }}
        className={styles.allstatusTable}
        rowKey={(record) => record.id}
      >
        <Column
          title="Device"
          dataIndex="id"
          render={(_, record) => (record.name !== "" ? record.name : record.id)}
        />

        {showColum.Identity && (
          <ColumnGroup title="Identity" fixed="left">
            <Column title="IMEI" dataIndex="IMEI" />
            <Column title="Bootloader Version" dataIndex="bootloader_version" />
            <Column title="Hardware MCSV" dataIndex="hardware_mcsv" />
            <Column title="Hostname" dataIndex="hostname" />
            <Column title="LAN_Eth_MAC" dataIndex="lan_eth_mac" />
            <Column
              title="Firmware Version"
              dataIndex="modem_firmware_version"
            />
            <Column title="Serial Number" dataIndex="serial_number" />
            <Column title="WAN_Eth_MAC" dataIndex="wan_eth_mac" />
            <Column title="WiFi_AP_MAC" dataIndex="wifi_ap_mac" />
          </ColumnGroup>
        )}

        {showColum.Lan && (
          <ColumnGroup title="LAN">
            <ColumnGroup title="ipv4">
              <Column title="Address" dataIndex="lan_ipv4_address" />
              <Column title="Netmask" dataIndex="lan_ipv4_netmask" />
            </ColumnGroup>
            <ColumnGroup title="ipv6">
              <Column title="Netmask" dataIndex="lan_ipv6_netmask" />
              <Column title="Uptime" dataIndex="lan_ipv6_uptime" />
            </ColumnGroup>
          </ColumnGroup>
        )}

        {showColum.Lte && (
          <ColumnGroup title="LTE">
            <Column title="active" dataIndex="lte_active" />
            <ColumnGroup title="ipv4(apn)">
              <Column title="Address" dataIndex="lte_apn_ipv4_address" />
              <Column title="Gateway" dataIndex="lte_apn_ipv4_gateway" />
              <Column title="Netmask" dataIndex="lte_apn_ipv4_netmask" />
              <Column title="Uptime" dataIndex="lte_apn_ipv4_uptime" />
            </ColumnGroup>
            <ColumnGroup title="ipv4">
              <Column title="Address" dataIndex="lte_ipv4_address" />
              <Column title="Gateway" dataIndex="lte_ipv4_gateway" />
              <Column title="Netmask" dataIndex="lte_ipv4_netmask" />
              <Column title="Uptime" dataIndex="lte_ipv4_uptime" />
            </ColumnGroup>
          </ColumnGroup>
        )}

        {showColum.Wan && (
          <ColumnGroup title="WAN">
            <ColumnGroup title="ipv4">
              <Column title="address" dataIndex="wan_ipv4_address" />
              <Column title="gateway" dataIndex="wan_ipv4_gateway" />
              <Column title="netmask" dataIndex="wan_ipv4_netmask" />
              <Column title="uptime" dataIndex="wan_ipv4_uptime" />
            </ColumnGroup>
          </ColumnGroup>
        )}

        {showColum.Wwan && (
          <ColumnGroup title="WWAN">
            <Column title="active" dataIndex="wwan_active" />
            <ColumnGroup title="ipv4">
              <Column title="MAC" dataIndex="wwan_ipv4_MAC" />
              <Column title="SSID" dataIndex="wwan_ipv4_SSID" />
              <Column title="Address" dataIndex="wwan_ipv4_address" />
              <Column title="Channel" dataIndex="wwan_ipv4_channel" />
              <Column title="Gateway" dataIndex="wwan_ipv4_gateway" />
              <Column title="Netmask" dataIndex="wwan_ipv4_netmask" />
              <Column title="Uptime" dataIndex="wwan_ipv4_uptime" />
            </ColumnGroup>
          </ColumnGroup>
        )}

        {showColum.DNS && (
          <ColumnGroup title="DNS_WAN">
            <ColumnGroup title="ipv4">
              <Column title="1st" dataIndex="dns_wan_ipv4_0" />
              <Column title="2nd" dataIndex="dns_wan_ipv4_1" />
              <Column title="3th" dataIndex="dns_wan_ipv4_2" />
            </ColumnGroup>
            <ColumnGroup title="ipv6">
              <Column title="1st" dataIndex="dns_wan_ipv6_0" />
              <Column title="2nd" dataIndex="dns_wan_ipv6_1" />
              <Column title="3th" dataIndex="dns_wan_ipv6_2" />
            </ColumnGroup>
          </ColumnGroup>
        )}
      </Table>
    </Card>
  );
};

export const ViewAllStatusMC = React.memo(ViewAllStatusC);
