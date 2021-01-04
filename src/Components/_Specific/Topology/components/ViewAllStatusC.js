import React, { useEffect, useState, useContext, Fragment } from "react";
import {
  Card,
  Table,
  Checkbox,
  Popover,
  Form,
  Button,
  Divider,
  Row,
  Col,
} from "antd";
import styles from "../topology.module.scss";
import axios from "axios";
// import useURLloader from "../../../../hook/useURLloader";
import { ViewAllStatusFilterMC } from "./ViewAllStatusFilterC";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { FcSettings } from "react-icons/fc";
// const { TabPane } = Tabs;
const { Column, ColumnGroup } = Table;
// const { Option } = Select;

const ViewAllStatusC = ({ groups, models }) => {
  const [form] = Form.useForm();
  const [DeviceStatus, setDeviceStatus] = useState([]);
  const [uploading, setUploading] = useState(false);
  // const [DeviceIdentity, setDeviceIdentity] = useState([]);
  const history = useHistory();
  const { dispatch } = useContext(Context);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const { state } = useContext(Context);
  const [BtnVisible, setBtnVisible] = useState(false);
  const [Restore, setRestore] = useState();

  const [showColum, setShowColum] = useState({
    Identity: false,
    IMEI: false,
    bootloader_version: false,
    hardware_mcsv: false,
    hostname: false,
    lan_eth_mac: false,
    modem_firmware_version: false,
    serial_number: false,
    wan_eth_mac: false,
    wifi_ap_mac: false,
    LTE_Usage: true,
    statistic_lte_up_kbps: true,
    statistic_lte_down_kbps: false,
    statistic_lte_tx_kbytes: false,
    statistic_lte_rx_kbytes: false,
    statistic_lte_tx_dropped_pkts: false,
    statistic_lte_rx_dropped_pkts: false,
    SIM: true,
    sim_EARFCN: false,
    sim_IMSI: false,
    sim_PLMN: false,
    sim_access: true,
    sim_active: false,
    sim_band: false,
    sim_operator: false,
    sim_phone_number: false,
    LAN: true,
    lan_ipv4_address: true,
    lan_ipv4_netmask: false,
    lan_ipv6_netmask: false,
    lan_ipv6_uptime: false,
    Lte: false,
    lte_active: false,
    lte_apn_ipv4_address: false,
    lte_apn_ipv4_gateway: false,
    lte_apn_ipv4_netmask: false,
    lte_apn_ipv4_uptime: false,
    lte_ipv4_address: false,
    lte_ipv4_gateway: false,
    lte_ipv4_netmask: false,
    lte_ipv4_uptime: false,
    Wan: false,
    wan_ipv4_address: false,
    wan_ipv4_gateway: false,
    wan_ipv4_netmask: false,
    wan_ipv4_uptime: false,
    Wwan: false,
    wwan_active: false,
    wwan_ipv4_MAC: false,
    wwan_ipv4_SSID: false,
    wwan_ipv4_address: false,
    wwan_ipv4_channel: false,
    wwan_ipv4_gateway: false,
    wwan_ipv4_netmask: false,
    wwan_ipv4_uptime: false,
    DNS: false,
    dns_wan_ipv4_0: false,
    dns_wan_ipv4_1: false,
    dns_wan_ipv4_2: false,
    dns_wan_ipv6_0: false,
    dns_wan_ipv6_1: false,
    dns_wan_ipv6_2: false,
  });

  const onChange = (e) => {
    // console.log(e.target.id)
    let newshowColum = showColum;
    if (e.target.id === "Identity") {
      newshowColum.Identity = !newshowColum.Identity;
      newshowColum.IMEI = !newshowColum.IMEI;
      newshowColum.bootloader_version = !newshowColum.bootloader_version;
      newshowColum.hardware_mcsv = !newshowColum.hardware_mcsv;
      newshowColum.hostname = !newshowColum.hostname;
      newshowColum.lan_eth_mac = !newshowColum.lan_eth_mac;
      newshowColum.modem_firmware_version = !newshowColum.modem_firmware_version;
      newshowColum.serial_number = !newshowColum.serial_number;
      newshowColum.wan_eth_mac = !newshowColum.wan_eth_mac;
      newshowColum.wifi_ap_mac = !newshowColum.wifi_ap_mac;
      setShowColum(newshowColum);
      form.setFieldsValue({
        Identity: newshowColum.Identity,
        IMEI: newshowColum.Identity,
        bootloader_version: newshowColum.Identity,
        hardware_mcsv: newshowColum.Identity,
        hostname: newshowColum.Identity,
        lan_eth_mac: newshowColum.Identity,
        modem_firmware_version: newshowColum.Identity,
        serial_number: newshowColum.Identity,
        wan_eth_mac: newshowColum.Identity,
        wifi_ap_mac: newshowColum.Identity,
      });
    } else if (e.target.id === "LAN") {
      newshowColum.LAN = !newshowColum.LAN;
      newshowColum.lan_ipv4_address = !newshowColum.lan_ipv4_address;
      newshowColum.lan_ipv4_netmask = !newshowColum.lan_ipv4_netmask;
      newshowColum.lan_ipv6_netmask = !newshowColum.lan_ipv6_netmask;
      newshowColum.lan_ipv6_uptime = !newshowColum.lan_ipv6_uptime;
      setShowColum(newshowColum);
      form.setFieldsValue({
        LAN: newshowColum.LAN,
        lan_ipv4_address: newshowColum.LAN,
        lan_ipv4_netmask: newshowColum.LAN,
        lan_ipv6_netmask: newshowColum.LAN,
        lan_ipv6_uptime: newshowColum.LAN,
      });
    } else if (e.target.id === "Lte") {
      newshowColum.Lte = !newshowColum.Lte;
      newshowColum.lte_active = !newshowColum.lte_active;
      newshowColum.lte_apn_ipv4_address = !newshowColum.lte_apn_ipv4_address;
      newshowColum.lte_apn_ipv4_gateway = !newshowColum.lte_apn_ipv4_gateway;
      newshowColum.lte_apn_ipv4_netmask = !newshowColum.lte_apn_ipv4_netmask;
      newshowColum.lte_apn_ipv4_uptime = !newshowColum.lte_apn_ipv4_uptime;
      newshowColum.lte_ipv4_address = !newshowColum.lte_ipv4_address;
      newshowColum.lte_ipv4_gateway = !newshowColum.lte_ipv4_gateway;
      newshowColum.lte_ipv4_netmask = !newshowColum.lte_ipv4_netmask;
      newshowColum.lte_ipv4_uptime = !newshowColum.lte_ipv4_uptime;
      setShowColum(newshowColum);
      form.setFieldsValue({
        Lte: newshowColum.Lte,
        lte_active: newshowColum.Lte,
        lte_apn_ipv4_address: newshowColum.Lte,
        lte_apn_ipv4_gateway: newshowColum.Lte,
        lte_apn_ipv4_netmask: newshowColum.Lte,
        lte_apn_ipv4_uptime: newshowColum.Lte,
        lte_ipv4_address: newshowColum.Lte,
        lte_ipv4_gateway: newshowColum.Lte,
        lte_ipv4_netmask: newshowColum.Lte,
        lte_ipv4_uptime: newshowColum.Lte,
      });
    } else if (e.target.id === "Wan") {
      newshowColum.Wan = !newshowColum.Wan;
      newshowColum.wan_ipv4_address = !newshowColum.wan_ipv4_address;
      newshowColum.wan_ipv4_gateway = !newshowColum.wan_ipv4_gateway;
      newshowColum.wan_ipv4_netmask = !newshowColum.wan_ipv4_netmask;
      newshowColum.wan_ipv4_uptime = !newshowColum.wan_ipv4_uptime;
      setShowColum(newshowColum);
      form.setFieldsValue({
        Wan: newshowColum.Wan,
        wan_ipv4_address: newshowColum.Wan,
        wan_ipv4_gateway: newshowColum.Wan,
        wan_ipv4_netmask: newshowColum.Wan,
        wan_ipv4_uptime: newshowColum.Wan,
      });
    } else if (e.target.id === "Wwan") {
      newshowColum.Wwan = !newshowColum.Wwan;
      newshowColum.wwan_active = !newshowColum.wwan_active;
      newshowColum.wwan_ipv4_MAC = !newshowColum.wwan_ipv4_MAC;
      newshowColum.wwan_ipv4_SSID = !newshowColum.wwan_ipv4_SSID;
      newshowColum.wwan_ipv4_address = !newshowColum.wwan_ipv4_address;
      newshowColum.wwan_ipv4_channel = !newshowColum.wwan_ipv4_channel;
      newshowColum.wwan_ipv4_gateway = !newshowColum.wwan_ipv4_gateway;
      newshowColum.wwan_ipv4_netmask = !newshowColum.wwan_ipv4_netmask;
      newshowColum.wwan_ipv4_uptime = !newshowColum.wwan_ipv4_uptime;
      setShowColum(newshowColum);
      form.setFieldsValue({
        Wwan: newshowColum.Wwan,
        wwan_active: newshowColum.Wwan,
        wwan_ipv4_MAC: newshowColum.Wwan,
        wwan_ipv4_SSID: newshowColum.Wwan,
        wwan_ipv4_address: newshowColum.Wwan,
        wwan_ipv4_channel: newshowColum.Wwan,
        wwan_ipv4_gateway: newshowColum.Wwan,
        wwan_ipv4_netmask: newshowColum.Wwan,
        wwan_ipv4_uptime: newshowColum.Wwan,
      });
    } else if (e.target.id === "DNS") {
      newshowColum.DNS = !newshowColum.DNS;
      newshowColum.dns_wan_ipv4_0 = !newshowColum.dns_wan_ipv4_0;
      newshowColum.dns_wan_ipv4_1 = !newshowColum.dns_wan_ipv4_1;
      newshowColum.dns_wan_ipv4_2 = !newshowColum.dns_wan_ipv4_2;
      newshowColum.dns_wan_ipv6_0 = !newshowColum.dns_wan_ipv6_0;
      newshowColum.dns_wan_ipv6_1 = !newshowColum.dns_wan_ipv6_1;
      newshowColum.dns_wan_ipv6_2 = !newshowColum.dns_wan_ipv6_2;
      setShowColum(newshowColum);
      form.setFieldsValue({
        DNS: newshowColum.DNS,
        dns_wan_ipv4_0: newshowColum.DNS,
        dns_wan_ipv4_1: newshowColum.DNS,
        dns_wan_ipv4_2: newshowColum.DNS,
        dns_wan_ipv6_0: newshowColum.DNS,
        dns_wan_ipv6_1: newshowColum.DNS,
        dns_wan_ipv6_2: newshowColum.DNS,
      });
    } else if (e.target.id === "LTE_Usage") {
      newshowColum.LTE_Usage = !newshowColum.LTE_Usage;
      newshowColum.statistic_lte_up_kbps = !newshowColum.statistic_lte_up_kbps;
      newshowColum.statistic_lte_down_kbps = !newshowColum.statistic_lte_down_kbps;
      newshowColum.statistic_lte_tx_kbytes = !newshowColum.statistic_lte_tx_kbytes;
      newshowColum.statistic_lte_rx_kbytes = !newshowColum.statistic_lte_rx_kbytes;
      newshowColum.statistic_lte_tx_dropped_pkts = !newshowColum.statistic_lte_tx_dropped_pkts;
      newshowColum.statistic_lte_rx_dropped_pkts = !newshowColum.statistic_lte_rx_dropped_pkts;
      setShowColum(newshowColum);
      form.setFieldsValue({
        LTE_Usage: newshowColum.LTE_Usage,
        statistic_lte_up_kbps: newshowColum.LTE_Usage,
        statistic_lte_down_kbps: newshowColum.LTE_Usage,
        statistic_lte_tx_kbytes: newshowColum.LTE_Usage,
        statistic_lte_rx_kbytes: newshowColum.LTE_Usage,
        statistic_lte_tx_dropped_pkts: newshowColum.LTE_Usage,
        statistic_lte_rx_dropped_pkts: newshowColum.LTE_Usage,
      });
    } else if (e.target.id === "SIM") {
      newshowColum.SIM = !newshowColum.SIM;
      newshowColum.sim_EARFCN = !newshowColum.sim_EARFCN;
      newshowColum.sim_IMSI = !newshowColum.sim_IMSI;
      newshowColum.sim_PLMN = !newshowColum.sim_PLMN;
      newshowColum.sim_access = !newshowColum.sim_access;
      newshowColum.sim_active = !newshowColum.sim_active;
      newshowColum.sim_band = !newshowColum.sim_band;
      newshowColum.sim_operator = !newshowColum.sim_operator;
      newshowColum.sim_phone_number = !newshowColum.sim_phone_number;
      setShowColum(newshowColum);
      form.setFieldsValue({
        SIM: newshowColum.SIM,
        sim_EARFCN: newshowColum.SIM,
        sim_IMSI: newshowColum.SIM,
        sim_PLMN: newshowColum.SIM,
        sim_access: newshowColum.SIM,
        sim_active: newshowColum.SIM,
        sim_band: newshowColum.SIM,
        sim_operator: newshowColum.SIM,
        sim_phone_number: newshowColum.SIM,
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue(showColum);
  }, []);

  const content = (
    <Form onFinish={(value) => setShowColum(value)} form={form}>
      {/* <Row gutter={24} style={{ width: "100%" }}> */}
      <Row gutter={24} style={{ width: "100%" }}>
        <Col xs={10} sm={7} md={5} lg={3}>
          <Form.Item
            name="Identity"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>Identity</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="IMEI"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IMEI</Checkbox>
            </Form.Item>
            <Form.Item
              name="bootloader_version"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Bootloader_Version</Checkbox>
            </Form.Item>
            <Form.Item
              name="hardware_mcsv"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Hardware_MCSV</Checkbox>
            </Form.Item>
            <Form.Item
              name="hostname"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Hostname</Checkbox>
            </Form.Item>
            <Form.Item
              name="lan_eth_mac"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>LAN_Eth_Mac</Checkbox>
            </Form.Item>
            <Form.Item
              name="modem_firmware_version"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Firmware Version</Checkbox>
            </Form.Item>
            <Form.Item
              name="serial_number"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Serial Number</Checkbox>
            </Form.Item>
            <Form.Item
              name="wan_eth_mac"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>WAN_Eth_Mac</Checkbox>
            </Form.Item>
            <Form.Item
              name="wifi_ap_mac"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Wifi_Ap_Mac</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: "3px" }} />
      <Row gutter={24} style={{ width: "100%" }}>
        <Col xs={10} sm={7} md={5} lg={3}>
          <Form.Item
            name="LTE_Usage"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>Usage</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="statistic_lte_up_kbps"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Up</Checkbox>
            </Form.Item>
            <Form.Item
              name="statistic_lte_down_kbps"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Down</Checkbox>
            </Form.Item>
            <Form.Item
              name="statistic_lte_tx_kbytes"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Tx</Checkbox>
            </Form.Item>
            <Form.Item
              name="statistic_lte_rx_kbytes"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Rx</Checkbox>
            </Form.Item>
            <Form.Item
              name="statistic_lte_tx_dropped_pkts"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Tx(Dropped)</Checkbox>
            </Form.Item>
            <Form.Item
              name="statistic_lte_rx_dropped_pkts"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Rx(Dropped)</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: "3px" }} />
      <Row gutter={24} style={{ width: "100%" }}>
        <Col xs={10} sm={7} md={5} lg={3}>
          <Form.Item
            name="SIM"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>SIM</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="sim_EARFCN"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>EARFCN</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim_IMSI"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IMSI</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim_PLMN"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>PLMN</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim_access"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Acess</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim_active"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Active</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim_band"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Band</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim_operator"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Operator</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim_phone_number"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>PhoneNum</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>

      <Divider style={{ margin: "3px" }} />
      <Row gutter={24} style={{ width: "100%" }}>
        <Col xs={10} sm={7} md={5} lg={3}>
          <Form.Item
            name="LAN"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>LAN</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="lan_ipv4_address"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Address</Checkbox>
            </Form.Item>
            <Form.Item
              name="lan_ipv4_netmask"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_NetMask</Checkbox>
            </Form.Item>
            <Form.Item
              name="lan_ipv6_netmask"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV6_NetMask</Checkbox>
            </Form.Item>
            <Form.Item
              name="lan_ipv6_uptime"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV6_Uptime</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: "3px" }} />
      <Row gutter={24} style={{ width: "100%" }}>
        <Col xs={10} sm={7} md={5} lg={3}>
          <Form.Item
            name="Lte"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>LTE</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="lte_active"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Active</Checkbox>
            </Form.Item>
            <Form.Item
              name="lte_apn_ipv4_address"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Adress(APN)</Checkbox>
            </Form.Item>
            <Form.Item
              name="lte_apn_ipv4_gateway"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_GateWay(APN)</Checkbox>
            </Form.Item>
            <Form.Item
              name="lte_apn_ipv4_netmask"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_NetMask(APN)</Checkbox>
            </Form.Item>
            <Form.Item
              name="lte_apn_ipv4_uptime"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Uptime(APN)</Checkbox>
            </Form.Item>
            <Form.Item
              name="lte_ipv4_address"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Address</Checkbox>
            </Form.Item>
            <Form.Item
              name="lte_ipv4_gateway"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_GateWay</Checkbox>
            </Form.Item>
            <Form.Item
              name="lte_ipv4_netmask"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_NetMask</Checkbox>
            </Form.Item>
            <Form.Item
              name="lte_ipv4_uptime"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Uptime</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: "3px" }} />
      <Row gutter={24} style={{ width: "100%" }}>
        <Col xs={10} sm={7} md={5} lg={3}>
          <Form.Item
            name="Wan"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>WAN</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="wan_ipv4_address"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Address</Checkbox>
            </Form.Item>
            <Form.Item
              name="wan_ipv4_gateway"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_GateWay</Checkbox>
            </Form.Item>
            <Form.Item
              name="wan_ipv4_netmask"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_NetMask</Checkbox>
            </Form.Item>
            <Form.Item
              name="wan_ipv4_uptime"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Uptime</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: "3px" }} />
      <Row gutter={24} style={{ width: "100%" }}>
        <Col xs={10} sm={7} md={5} lg={3}>
          <Form.Item
            name="Wwan"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>WWAN</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="wwan_active"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Active</Checkbox>
            </Form.Item>
            <Form.Item
              name="wwan_ipv4_MAC"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Mac</Checkbox>
            </Form.Item>
            <Form.Item
              name="wwan_ipv4_SSID"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_SSID</Checkbox>
            </Form.Item>
            <Form.Item
              name="wwan_ipv4_address"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Address</Checkbox>
            </Form.Item>
            <Form.Item
              name="wwan_ipv4_channel"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Channel</Checkbox>
            </Form.Item>
            <Form.Item
              name="wwan_ipv4_gateway"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_GateWay</Checkbox>
            </Form.Item>
            <Form.Item
              name="wwan_ipv4_netmask"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_NetMask</Checkbox>
            </Form.Item>
            <Form.Item
              name="wwan_ipv4_uptime"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_Uptime</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: "3px" }} />
      <Row gutter={24} style={{ width: "100%" }}>
        <Col xs={10} sm={7} md={5} lg={3}>
          <Form.Item
            name="DNS"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>DNS</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="dns_wan_ipv4_0"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_#1</Checkbox>
            </Form.Item>
            <Form.Item
              name="dns_wan_ipv4_1"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IIPV4_#2</Checkbox>
            </Form.Item>
            <Form.Item
              name="dns_wan_ipv4_2"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV4_#3</Checkbox>
            </Form.Item>
            <Form.Item
              name="dns_wan_ipv6_0"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV6_#1</Checkbox>
            </Form.Item>
            <Form.Item
              name="dns_wan_ipv6_1"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV6_#2</Checkbox>
            </Form.Item>
            <Form.Item
              name="dns_wan_ipv6_2"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV6_#3</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>

      <Divider style={{ marginBottom: "10px", marginTop: 0 }} />
      <Form.Item style={{ marginBottom: 0 }}>
        <Button htmlType="submit" onClick={() => setBtnVisible(false)}>
          Confirm
        </Button>
      </Form.Item>
      {/* </Row> */}
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
        axios.spread(async (acct, perms) => {
          let DeviceStatus = acct.data.response?.device_status;
          let DeviceIdentity = perms.data.response?.device_identity;
          if (DeviceStatus) {
            for (let i = 0; i < DeviceStatus.length; i++) {
              DeviceStatus[i].identity = DeviceIdentity.filter((item) => {
                return item.nodeInf.id === DeviceStatus[i].nodeInf.id;
              });
            }
            DeviceStatus = DeviceStatus.map((item) => {
              return {
                health: item.nodeInf.health,
                strength: item.nodeInf.sim,
                id: item.nodeInf.id,
                gid: item.nodeInf.gid,
                name: item.nodeInf.name,
                model: item.nodeInf.model,
                IMEI: item.identity[0].obj.identity?.IMEI,
                bootloader_version:
                  item.identity[0].obj.identity?.bootloader_version,
                hardware_mcsv: item.identity[0].obj.identity?.hardware_mcsv,
                hostname: item.identity[0].obj.identity?.hostname,
                lan_eth_mac: item.identity[0].obj.identity?.lan_eth_mac,
                modem_firmware_version:
                  item.identity[0].obj.identity?.modem_firmware_version,
                serial_number: item.identity[0].obj.identity?.serial_number,
                wan_eth_mac: item.identity[0].obj.identity?.wan_eth_mac,
                wifi_ap_mac: item.identity[0].obj.identity?.wifi_ap_mac, //
                lan_ipv4_address: item.obj.status?.connection.lan.ipv4.address,
                lan_ipv4_netmask: item.obj.status?.connection.lan.ipv4.netmask,
                lan_ipv6_netmask: item.obj.status?.connection.lan.ipv6.address,
                lan_ipv6_uptime: item.obj.status?.connection.lan.ipv6.uptime,
                lte_active: item.obj.status?.connection.lte.active,
                lte_apn_ipv4_address:
                  item.obj.status?.connection.lte.apn[0].ipv4.address,
                lte_apn_ipv4_gateway:
                  item.obj.status?.connection.lte.apn[0].ipv4.gateway,
                lte_apn_ipv4_netmask:
                  item.obj.status?.connection.lte.apn[0].ipv4.netmask,
                lte_apn_ipv4_uptime:
                  item.obj.status?.connection.lte.apn[0].ipv4.uptime,
                lte_ipv4_address: item.obj.status?.connection.lte.ipv4.address,
                lte_ipv4_gateway: item.obj.status?.connection.lte.ipv4.gateway,
                lte_ipv4_netmask: item.obj.status?.connection.lte.ipv4.netmask,
                lte_ipv4_uptime: item.obj.status?.connection.lte.ipv4.uptime,
                wan_active: item.obj.status?.connection.wan.active,
                wan_ipv4_address: item.obj.status?.connection.wan.ipv4.address,
                wan_ipv4_gateway: item.obj.status?.connection.wan.ipv4.gateway,
                wan_ipv4_netmask: item.obj.status?.connection.wan.ipv4.netmask,
                wan_ipv4_uptime: item.obj.status?.connection.wan.ipv4.uptime,
                wwan_active: item.obj.status?.connection.wwan?.active,
                wwan_ipv4_MAC: item.obj.status?.connection.wwan?.ipv4.MAC,
                wwan_ipv4_SSID: item.obj.status?.connection.wwan?.ipv4.SSID,
                wwan_ipv4_address:
                  item.obj.status?.connection.wwan?.ipv4.address,
                wwan_ipv4_channel:
                  item.obj.status?.connection.wwan?.ipv4.channel,
                wwan_ipv4_gateway:
                  item.obj.status?.connection.wwan?.ipv4.gateway,
                wwan_ipv4_netmask:
                  item.obj.status?.connection.wwan?.ipv4.netmask,
                wwan_ipv4_uptime: item.obj.status?.connection.wwan?.ipv4.uptime,
                dns_wan_ipv4_0: item.obj.status?.dns.wan[0].ipv4[0],
                dns_wan_ipv4_1: item.obj.status?.dns.wan[0].ipv4[1],
                dns_wan_ipv4_2: item.obj.status?.dns.wan[0].ipv4[2],
                dns_wan_ipv6_0: item.obj.status?.dns.wan[0].ipv6[0],
                dns_wan_ipv6_1: item.obj.status?.dns.wan[0].ipv6[1],
                dns_wan_ipv6_2: item.obj.status?.dns.wan[0].ipv6[2],
                statistic_lte_up_kbps: item.obj.status?.statistic?.lte.up_kbps,
                statistic_lte_down_kbps:
                  item.obj.status?.statistic?.lte.down_kbps,
                statistic_lte_tx_kbytes:
                  item.obj.status?.statistic?.lte.tx_kbytes,
                statistic_lte_rx_kbytes:
                  item.obj.status?.statistic?.lte.rx_kbytes,
                statistic_lte_tx_dropped_pkts:
                  item.obj.status?.statistic?.lte.tx_dropped_pkts,
                statistic_lte_rx_dropped_pkts:
                  item.obj.status?.statistic?.lte.rx_dropped_pkts,
                sim_EARFCN: item.obj.status?.sim[0].EARFCN,
                sim_IMSI: item.obj.status?.sim[0].IMSI,
                sim_PLMN: item.obj.status?.sim[0].PLMN,
                sim_access: item.obj.status?.sim[0].access,
                sim_active: item.obj.status?.sim[0].active,
                sim_band: item.obj.status?.sim[0].band,
                sim_operator: item.obj.status?.sim[0].operator,
                sim_phone_number: item.obj.status?.sim[0].phone_number,
                lan_rx_dropped_pkts:
                  item.obj.status?.statistic?.lan.rx_dropped_pkts,
                lan_rx_kbytes: item.obj.status?.statistic?.lan.rx_kbytes,
                lan_tx_dropped_pkts:
                  item.obj.status?.statistic?.lan.tx_dropped_pkts,
                lan_tx_kbytes: item.obj.status?.statistic?.lan.tx_kbytes,
                lan_up_kbps: item.obj.status?.statistic?.lan.up_kbps,
                wan_down_kbps: item.obj.status?.statistic?.wan.down_kbps,
                wan_rx_dropped_pkts:
                  item.obj.status?.statistic?.wan.rx_dropped_pkts,
                wan_rx_kbytes: item.obj.status?.statistic?.wan.rx_kbytes,
                wan_tx_dropped_pkts:
                  item.obj.status?.statistic?.wan.tx_dropped_pkts,
                wan_tx_kbytes: item.obj.status?.statistic?.wan.tx_kbytes,
                wan_up_kbps: item.obj.status?.statistic?.wan.up_kbps,
                lte_down_kbps: item.obj.status?.statistic?.lte.down_kbps,
                lte_rx_dropped_pkts:
                  item.obj.status?.statistic?.lte.rx_dropped_pkts,
                lte_rx_kbytes: item.obj.status?.statistic?.lte.rx_kbytes,
                lte_tx_dropped_pkts:
                  item.obj.status?.statistic?.lte.tx_dropped_pkts,
                lte_tx_kbytes: item.obj.status?.statistic?.lte.tx_kbytes,
                lte_up_kbps: item.obj.status?.statistic?.lte.up_kbps,
              };
            });
            setDeviceStatus(DeviceStatus);
            setRestore(DeviceStatus);
          }

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
  }, [state.Login.Cid]);

  return (
    <Fragment>
      <ViewAllStatusFilterMC
        setDeviceStatus={setDeviceStatus}
        groups={groups}
        Restore={Restore}
        models={models}
      />
      <Card
        title="Routers Status"
        className={styles.AllStatusCard}
        headStyle={{}}
        extra={
          <Fragment>
            <Popover
              placement="left"
              trigger="click"
              onVisibleChange={(visible) => setBtnVisible(visible)}
              // title={text}
              content={content}
              trigger="click"
              visible={BtnVisible}
              style={{ width: "55%", overflowY: "auto" }}
            >
              <FcSettings className={styles.columnSettingIcon} />
            </Popover>
          </Fragment>
        }
      >
        <Table
          loading={uploading}
          pagination={true}
          bordered
          dataSource={DeviceStatus}
          scroll={{ x: "calc(700px + 50%)" }}
          className={styles.allstatusTable}
          rowKey={(record) => record.id}
        >
          <Column title="District" dataIndex="district" />
          <Column
            title="Device"
            dataIndex="id"
            render={(_, record) =>
              record.name !== "" ? record.name : record.id
            }
          />
          <Column title="Model" dataIndex="model" />

          <Column title="Health" dataIndex="health" />
          <Column title="Signal" dataIndex="strength" />

          {(showColum.IMEI ||
            showColum.hardware_mcsv ||
            showColum.hostname ||
            showColum.lan_eth_mac ||
            showColum.modem_firmware_version ||
            showColum.serial_number ||
            showColum.wan_eth_mac ||
            showColum.wifi_ap_mac) && (
            <ColumnGroup title="Identity" fixed="left">
              {showColum.IMEI && <Column title="IMEI" dataIndex="IMEI" />}
              {showColum.bootloader_version && (
                <Column
                  title="Bootloader Version"
                  dataIndex="bootloader_version"
                />
              )}
              {showColum.hardware_mcsv && (
                <Column title="Hardware MCSV" dataIndex="hardware_mcsv" />
              )}
              {showColum.hostname && (
                <Column title="Hostname" dataIndex="hostname" />
              )}
              {showColum.lan_eth_mac && (
                <Column title="LAN_Eth_MAC" dataIndex="lan_eth_mac" />
              )}
              {showColum.modem_firmware_version && (
                <Column
                  title="Firmware Version"
                  dataIndex="modem_firmware_version"
                />
              )}
              {showColum.serial_number && (
                <Column title="Serial Number" dataIndex="serial_number" />
              )}
              {showColum.wan_eth_mac && (
                <Column title="WAN_Eth_MAC" dataIndex="wan_eth_mac" />
              )}
              {showColum.wifi_ap_mac && (
                <Column title="WiFi_AP_MAC" dataIndex="wifi_ap_mac" />
              )}
            </ColumnGroup>
          )}

          {(showColum.sim_EARFCN ||
            showColum.sim_IMSI ||
            showColum.sim_PLMN ||
            showColum.sim_access ||
            showColum.sim_band ||
            showColum.sim_operator ||
            showColum.sim_phone_number) && (
            <ColumnGroup title="SIM" fixed="left">
              {showColum.sim_EARFCN && (
                <Column title="EARFCN" dataIndex="sim_EARFCN" />
              )}
              {showColum.sim_IMSI && (
                <Column title="IMSI" dataIndex="sim_IMSI" />
              )}
              {showColum.sim_PLMN && (
                <Column title="PLMN" dataIndex="sim_PLMN" />
              )}
              {showColum.sim_access && (
                <Column title="Access" dataIndex="sim_access"  />
              )}
              {showColum.sim_active && (
                <Column
                  title="Active"
                  dataIndex="sim_active"
                  render={(_, record) => `${record.sim_active}`}
                />
              )}
              {showColum.sim_band && (
                <Column title="Band" dataIndex="sim_band" />
              )}
              {showColum.sim_operator && (
                <Column title="Operator" dataIndex="sim_operator" />
              )}
              {showColum.sim_phone_number && (
                <Column title="PhoneNumber" dataIndex="sim_phone_number" />
              )}
            </ColumnGroup>
          )}

          {(showColum.statistic_lte_up_kbps ||
            showColum.statistic_lte_down_kbps ||
            showColum.statistic_lte_tx_kbytes ||
            showColum.statistic_lte_rx_kbytes ||
            showColum.statistic_lte_tx_dropped_pkts ||
            showColum.statistic_lte_rx_dropped_pkts) && (
            <ColumnGroup title="LTE Usage" fixed="left">
              {showColum.statistic_lte_up_kbps && (
                <Column title="Up(Kbps)" dataIndex="statistic_lte_up_kbps" />
              )}
              {showColum.statistic_lte_down_kbps && (
                <Column title="Down" dataIndex="statistic_lte_down_kbps" />
              )}
              {showColum.statistic_lte_tx_kbytes && (
                <Column title="Tx" dataIndex="statistic_lte_tx_kbytes" />
              )}
              {showColum.statistic_lte_rx_kbytes && (
                <Column title="Rx" dataIndex="statistic_lte_rx_kbytes" />
              )}
              {showColum.statistic_lte_tx_dropped_pkts && (
                <Column
                  title="Tx Dropped"
                  dataIndex="statistic_lte_tx_dropped_pkts"
                />
              )}
              {showColum.statistic_lte_rx_dropped_pkts && (
                <Column
                  title="Rx Dropped"
                  dataIndex="statistic_lte_rx_dropped_pkts"
                />
              )}
            </ColumnGroup>
          )}

          {(showColum.lan_ipv4_address ||
            showColum.lan_ipv4_netmask ||
            showColum.lan_ipv6_netmask ||
            showColum.lan_ipv6_uptime) && (
            <ColumnGroup title="LAN">
              {(showColum.lan_ipv4_address || showColum.lan_ipv4_netmask) && (
                <ColumnGroup title="ipv4">
                  {showColum.lan_ipv4_address && (
                    <Column title="Address" dataIndex="lan_ipv4_address" />
                  )}
                  {showColum.lan_ipv4_netmask && (
                    <Column title="Netmask" dataIndex="lan_ipv4_netmask" />
                  )}
                </ColumnGroup>
              )}
              {(showColum.lan_ipv6_netmask || showColum.lan_ipv6_uptime) && (
                <ColumnGroup title="ipv6">
                  {showColum.lan_ipv6_netmask && (
                    <Column title="Netmask" dataIndex="lan_ipv6_netmask" />
                  )}
                  {showColum.lan_ipv6_uptime && (
                    <Column title="Uptime" dataIndex="lan_ipv6_uptime" />
                  )}
                </ColumnGroup>
              )}
            </ColumnGroup>
          )}

          {(showColum.lte_active ||
            showColum.lte_apn_ipv4_address ||
            showColum.lte_apn_ipv4_gateway ||
            showColum.lte_apn_ipv4_netmask ||
            showColum.lte_apn_ipv4_uptime ||
            showColum.lte_ipv4_address ||
            showColum.lte_ipv4_gateway ||
            showColum.lte_ipv4_netmask ||
            showColum.lte_ipv4_uptime) && (
            <ColumnGroup title="LTE">
              {showColum.lte_active && (
                <Column
                  title="active"
                  dataIndex="lte_active"
                  render={(_, record) => `${record.lte_active}`}
                />
              )}
              <ColumnGroup title="ipv4(apn)">
                {showColum.lte_apn_ipv4_address && (
                  <Column title="Address" dataIndex="lte_apn_ipv4_address" />
                )}
                {showColum.lte_apn_ipv4_gateway && (
                  <Column title="Gateway" dataIndex="lte_apn_ipv4_gateway" />
                )}
                {showColum.lte_apn_ipv4_netmask && (
                  <Column title="Netmask" dataIndex="lte_apn_ipv4_netmask" />
                )}
                {showColum.lte_apn_ipv4_uptime && (
                  <Column title="Uptime" dataIndex="lte_apn_ipv4_uptime" />
                )}
              </ColumnGroup>
              <ColumnGroup title="ipv4">
                {showColum.lte_ipv4_address && (
                  <Column title="Address" dataIndex="lte_ipv4_address" />
                )}
                {showColum.lte_ipv4_gateway && (
                  <Column title="Gateway" dataIndex="lte_ipv4_gateway" />
                )}
                {showColum.lte_ipv4_netmask && (
                  <Column title="Netmask" dataIndex="lte_ipv4_netmask" />
                )}
                {showColum.lte_ipv4_uptime && (
                  <Column title="Uptime" dataIndex="lte_ipv4_uptime" />
                )}
              </ColumnGroup>
            </ColumnGroup>
          )}

          {(showColum.wan_ipv4_address ||
            showColum.wan_ipv4_gateway ||
            showColum.wan_ipv4_netmask ||
            showColum.wan_ipv4_uptime) && (
            <ColumnGroup title="WAN">
              <ColumnGroup title="ipv4">
                {showColum.wan_ipv4_address && (
                  <Column title="address" dataIndex="wan_ipv4_address" />
                )}
                {showColum.wan_ipv4_gateway && (
                  <Column title="gateway" dataIndex="wan_ipv4_gateway" />
                )}
                {showColum.wan_ipv4_netmask && (
                  <Column title="netmask" dataIndex="wan_ipv4_netmask" />
                )}
                {showColum.wan_ipv4_uptime && (
                  <Column title="uptime" dataIndex="wan_ipv4_uptime" />
                )}
              </ColumnGroup>
            </ColumnGroup>
          )}

          {(showColum.wwan_active ||
            showColum.wwan_ipv4_MAC ||
            showColum.wwan_ipv4_SSID ||
            showColum.wwan_ipv4_address ||
            showColum.wwan_ipv4_channel ||
            showColum.wwan_ipv4_gateway ||
            showColum.wwan_ipv4_netmask ||
            showColum.wwan_ipv4_uptime) && (
            <ColumnGroup title="WWAN">
              {showColum.wwan_active && (
                <Column
                  title="active"
                  dataIndex="wwan_active"
                  render={(_, record) => `${record.wwan_active}`}
                />
              )}
              <ColumnGroup title="ipv4">
                {showColum.wwan_ipv4_MAC && (
                  <Column title="MAC" dataIndex="wwan_ipv4_MAC" />
                )}
                {showColum.wwan_ipv4_SSID && (
                  <Column title="SSID" dataIndex="wwan_ipv4_SSID" />
                )}
                {showColum.wwan_ipv4_address && (
                  <Column title="Address" dataIndex="wwan_ipv4_address" />
                )}
                {showColum.wwan_ipv4_channel && (
                  <Column title="Channel" dataIndex="wwan_ipv4_channel" />
                )}
                {showColum.wwan_ipv4_gateway && (
                  <Column title="Gateway" dataIndex="wwan_ipv4_gateway" />
                )}
                {showColum.wwan_ipv4_netmask && (
                  <Column title="Netmask" dataIndex="wwan_ipv4_netmask" />
                )}
                {showColum.wwan_ipv4_uptime && (
                  <Column title="Uptime" dataIndex="wwan_ipv4_uptime" />
                )}
              </ColumnGroup>
            </ColumnGroup>
          )}

          {(showColum.dns_wan_ipv4_0 ||
            showColum.dns_wan_ipv4_1 ||
            showColum.dns_wan_ipv4_2 ||
            showColum.dns_wan_ipv6_0 ||
            showColum.dns_wan_ipv6_1 ||
            showColum.dns_wan_ipv6_2) && (
            <ColumnGroup title="DNS_WAN">
              <ColumnGroup title="ipv4">
                {showColum.dns_wan_ipv4_0 && (
                  <Column title="1st" dataIndex="dns_wan_ipv4_0" />
                )}
                {showColum.dns_wan_ipv4_1 && (
                  <Column title="2nd" dataIndex="dns_wan_ipv4_1" />
                )}
                {showColum.dns_wan_ipv4_2 && (
                  <Column title="3th" dataIndex="dns_wan_ipv4_2" />
                )}
              </ColumnGroup>
              <ColumnGroup title="ipv6">
                {showColum.dns_wan_ipv6_0 && (
                  <Column title="1st" dataIndex="dns_wan_ipv6_0" />
                )}
                {showColum.dns_wan_ipv6_1 && (
                  <Column title="2nd" dataIndex="dns_wan_ipv6_1" />
                )}
                {showColum.dns_wan_ipv6_2 && (
                  <Column title="3th" dataIndex="dns_wan_ipv6_2" />
                )}
              </ColumnGroup>
            </ColumnGroup>
          )}
        </Table>
      </Card>
    </Fragment>
  );
};

export const ViewAllStatusMC = React.memo(ViewAllStatusC);
