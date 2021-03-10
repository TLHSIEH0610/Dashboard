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
  Tooltip,
} from "antd";
import styles from "../topology.module.scss";
import axios from "axios";
// import useURLloader from "../../../../hook/useURLloader";
import { ViewAllStatusFilterMC } from "./ViewAllStatusFilterC";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { FcEngineering, FcSynchronize } from "react-icons/fc";

import { useTranslation } from "react-i18next";
import { FaAutoprefixer } from "react-icons/fa";

const { Column, ColumnGroup } = Table;

const ViewAllStatusC = ({ groups, models, cities, IsUpdate }) => {
  const [form] = Form.useForm();
  const [AutoRefresh, setAutoRefresh] = useState(false);
  const [AllrouterTableIsUpdate, setAllrouterTableIsUpdate] = useState(false);
  const [DeviceStatus, setDeviceStatus] = useState([]);
  const [uploading, setUploading] = useState(false);
  const history = useHistory();
  const { dispatch } = useContext(Context);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const { state } = useContext(Context);
  const [BtnVisible, setBtnVisible] = useState(false);
  const [Restore, setRestore] = useState();
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [showColum, setShowColum] = useState({
    Identity: false,
    IMEI: true,
    bootloader_version: false,
    hardware_mcsv: false,
    hostname: false,
    lan_eth_mac: false,
    modem_firmware_version: false,
    serial_number: false,
    wan_eth_mac: false,
    wifi_ap_mac: false,
    LTE_Usage: true,
    statistic_lte_up_kbps: false,
    statistic_lte_down_kbps: false,
    statistic_lte_tx_kbytes: true,
    statistic_lte_rx_kbytes: true,
    statistic_lte_tx_dropped_pkts: false,
    statistic_lte_rx_dropped_pkts: false,
    SIM1: true,
    sim1_status: false,
    sim1_EARFCN: false,
    sim1_IMSI: false,
    sim1_ICCID: true,
    sim1_PLMN: false,
    sim1_access: true,
    sim1_active: false,
    sim1_band: false,
    sim1_operator: false,
    sim1_phone_number: false,
    sim1_rssi_dbm: true,
    sim1_roaming: true,
    SIM2: true,
    sim2_status: false,
    sim2_EARFCN: false,
    sim2_IMSI: false,
    sim2_ICCID: true,
    sim2_PLMN: false,
    sim2_access: true,
    sim2_active: false,
    sim2_band: false,
    sim2_operator: false,
    sim2_phone_number: false,
    sim2_rssi_dbm: true,
    sim2_roaming: true,
    LAN: true,
    lan_ipv4_address: true,
    lan_ipv4_netmask: false,
    lan_ipv6_adress: false,
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
    GPS: false,
    gps_latitude: false,
    gps_longitude: false,
    gps_horizontal: false,
    gps_altitude: false,
    gps_date: false,
    gps_utctime: false,
    gps_satellite: false,
  });

  useEffect(() => {
    if (!AutoRefresh) {
      return;
    }
    console.log("有執行2");
    // setIsUpdate(!IsUpdate)
    setAllrouterTableIsUpdate(!AllrouterTableIsUpdate);
    const stateInterval = setInterval(() => {
      setCount((prevState) => prevState + 1);
    }, 10000);

    return () => clearInterval(stateInterval);
              // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AutoRefresh, count]);

  useEffect(() => {
    const showColumRecord = JSON.parse(localStorage.getItem("auth.router"));
    if (showColumRecord) {
      setShowColum(showColumRecord);
      form.setFieldsValue(showColumRecord);
    } else {
      form.setFieldsValue(showColum);
    }
              // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      newshowColum.lan_ipv6_adress = !newshowColum.lan_ipv6_adress;
      newshowColum.lan_ipv6_uptime = !newshowColum.lan_ipv6_uptime;
      setShowColum(newshowColum);
      form.setFieldsValue({
        LAN: newshowColum.LAN,
        lan_ipv4_address: newshowColum.LAN,
        lan_ipv4_netmask: newshowColum.LAN,
        lan_ipv6_adress: newshowColum.LAN,
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
    } else if (e.target.id === "SIM1") {
      newshowColum.SIM1 = !newshowColum.SIM1;
      newshowColum.sim1_EARFCN = !newshowColum.sim1_EARFCN;
      newshowColum.sim1_status = !newshowColum.sim1_status;
      newshowColum.sim1_IMSI = !newshowColum.sim1_IMSI;
      newshowColum.sim1_PLMN = !newshowColum.sim1_PLMN;
      newshowColum.sim1_access = !newshowColum.sim1_access;
      newshowColum.sim1_active = !newshowColum.sim1_active;
      newshowColum.sim1_band = !newshowColum.sim1_band;
      newshowColum.sim1_operator = !newshowColum.sim1_operator;
      newshowColum.sim1_phone_number = !newshowColum.sim1_phone_number;
      newshowColum.sim1_rssi_dbm = !newshowColum.sim1_rssi_dbm;
      newshowColum.sim1_roaming = !newshowColum.sim1_roaming;
      setShowColum(newshowColum);
      form.setFieldsValue({
        SIM1: newshowColum.SIM1,
        sim1_EARFCN: newshowColum.SIM1,
        sim1_status: newshowColum.SIM1,
        sim1_IMSI: newshowColum.SIM1,
        sim1_ICCID: newshowColum.SIM2,
        sim1_PLMN: newshowColum.SIM1,
        sim1_access: newshowColum.SIM1,
        sim1_active: newshowColum.SIM1,
        sim1_band: newshowColum.SIM1,
        sim1_operator: newshowColum.SIM1,
        sim1_phone_number: newshowColum.SIM1,
        sim1_rssi_dbm: newshowColum.SIM1,
        sim1_roaming: newshowColum.SIM1,
      });
    } else if (e.target.id === "SIM2") {
      newshowColum.SIM2 = !newshowColum.SIM2;
      newshowColum.sim2_EARFCN = !newshowColum.sim2_EARFCN;
      newshowColum.sim2_status = !newshowColum.sim2_status;
      newshowColum.sim2_IMSI = !newshowColum.sim2_IMSI;
      newshowColum.sim2_PLMN = !newshowColum.sim2_PLMN;
      newshowColum.sim2_access = !newshowColum.sim2_access;
      newshowColum.sim2_active = !newshowColum.sim2_active;
      newshowColum.sim2_band = !newshowColum.sim2_band;
      newshowColum.sim2_operator = !newshowColum.sim2_operator;
      newshowColum.sim2_phone_number = !newshowColum.sim2_phone_number;
      newshowColum.sim2_rssi_dbm = !newshowColum.sim2_rssi_dbm;
      newshowColum.sim2_roaming = !newshowColum.sim2_roaming;
      setShowColum(newshowColum);
      form.setFieldsValue({
        SIM2: newshowColum.SIM2,
        sim2_EARFCN: newshowColum.SIM2,
        sim2_status: newshowColum.SIM2,
        sim2_IMSI: newshowColum.SIM2,
        sim2_ICCID: newshowColum.SIM2,
        sim2_PLMN: newshowColum.SIM2,
        sim2_access: newshowColum.SIM2,
        sim2_active: newshowColum.SIM2,
        sim2_band: newshowColum.SIM2,
        sim2_operator: newshowColum.SIM2,
        sim2_phone_number: newshowColum.SIM2,
        sim2_rssi_dbm: newshowColum.SIM2,
        sim2_roaming: newshowColum.SIM2,
      });
    } else if (e.target.id === "GPS") {
      newshowColum.GPS = !newshowColum.GPS;
      newshowColum.gps_latitude = !newshowColum.gps_latitude;
      newshowColum.gps_longitude = !newshowColum.gps_longitude;
      newshowColum.gps_horizontal = !newshowColum.gps_horizontal;
      newshowColum.gps_altitude = !newshowColum.gps_altitude;
      newshowColum.gps_date = !newshowColum.gps_date;
      newshowColum.gps_utctime = !newshowColum.gps_utctime;
      newshowColum.gps_satellite = !newshowColum.gps_satellite;
      setShowColum(newshowColum);
      form.setFieldsValue({
        GPS: newshowColum.GPS,
        gps_latitude: newshowColum.GPS,
        gps_longitude: newshowColum.GPS,
        gps_horizontal: newshowColum.GPS,
        gps_altitude: newshowColum.GPS,
        gps_date: newshowColum.GPS,
        gps_utctime: newshowColum.GPS,
        gps_satellite: newshowColum.GPS,
      });
    }
  };

  const content = (
    <Form
      onFinish={(value) => {
        setShowColum(value);
        localStorage.setItem("auth.router", JSON.stringify(value));
      }}
      form={form}
    >
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
            name="SIM1"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>SIM1</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="sim1_status"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Status</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_EARFCN"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>EARFCN</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_IMSI"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IMSI</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_ICCID"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>ICCID</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_PLMN"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>PLMN</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_access"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Access</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_active"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Active</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_band"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Band</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_operator"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Operator</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_phone_number"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>PhoneNum</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_roaming"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Roaming</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim1_rssi_dbm"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Rssi</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>

      <Divider style={{ margin: "3px" }} />
      <Row gutter={24} style={{ width: "100%" }}>
        <Col xs={10} sm={7} md={5} lg={3}>
          <Form.Item
            name="SIM2"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>SIM2</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="sim2_status"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Status</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_EARFCN"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>EARFCN</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_IMSI"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IMSI</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_ICCID"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>ICCID</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_PLMN"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>PLMN</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_access"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Access</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_active"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Active</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_band"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Band</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_operator"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Operator</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_phone_number"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>PhoneNum</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_roaming"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Roaming</Checkbox>
            </Form.Item>
            <Form.Item
              name="sim2_rssi_dbm"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Rssi</Checkbox>
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
              name="lan_ipv6_adress"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>IPV6_Adress</Checkbox>
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

      <Divider style={{ margin: "3px" }} />
      <Row gutter={24} style={{ width: "100%" }}>
        <Col xs={10} sm={7} md={5} lg={3}>
          <Form.Item
            name="GPS"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
            onChange={(e) => onChange(e)}
          >
            <Checkbox>GPS</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={14} sm={17} md={19} lg={19}>
          <Row gutter={24}>
            <Form.Item
              name="gps_latitude"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Latitude</Checkbox>
            </Form.Item>
            <Form.Item
              name="gps_longitude"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Longitude</Checkbox>
            </Form.Item>
            <Form.Item
              name="gps_horizontal"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Horizontal</Checkbox>
            </Form.Item>
            <Form.Item
              name="gps_altitude"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Altitude</Checkbox>
            </Form.Item>
            <Form.Item
              name="gps_date"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Date</Checkbox>
            </Form.Item>
            <Form.Item
              name="gps_utctime"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>UTC-Time</Checkbox>
            </Form.Item>
            <Form.Item
              name="gps_satellite"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>satellite</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>

      <Divider style={{ marginBottom: "10px", marginTop: 0 }} />
      <Form.Item style={{ marginBottom: 0 }}>
        <Button htmlType="submit" onClick={() => setBtnVisible(false)}>
          {t("ISMS.Confirm")}
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
          console.log(acct.data);
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
                lat: item.obj?.status?.gps?.latitude,
                log: item.obj?.status?.gps?.longitude,
                city: item.nodeInf.city,
                strength: item.nodeInf.sim,
                id: item.nodeInf.id,
                gid: item.nodeInf.gid,
                name: item.nodeInf.name,
                model: item.nodeInf.model,
                IMEI: item.identity?.[0]?.obj?.identity?.IMEI,
                bootloader_version:
                  item.identity?.[0]?.obj?.identity?.bootloader_version,
                hardware_mcsv: item.identity?.[0]?.obj?.identity?.hardware_mcsv,
                hostname: item.identity?.[0]?.obj?.identity?.hostname,
                lan_eth_mac: item.identity?.[0]?.obj?.identity?.lan_eth_mac,
                modem_firmware_version:
                  item.identity?.[0]?.obj?.identity?.modem_firmware_version,
                serial_number: item.identity?.[0]?.obj?.identity?.serial_number,
                wan_eth_mac: item.identity?.[0]?.obj?.identity?.wan_eth_mac,
                wifi_ap_mac: item.identity?.[0]?.obj?.identity?.wifi_ap_mac, //
                lan_ipv4_address:
                  item.obj?.status?.connection?.lan.ipv4.address,
                lan_ipv4_netmask:
                  item.obj?.status?.connection?.lan.ipv4.netmask,
                lan_ipv6_adress: item.obj?.status?.connection?.lan.ipv6.address,
                lan_ipv6_uptime: item.obj?.status?.connection?.lan.ipv6.uptime,
                lte_active: item.obj?.status?.connection?.lte.active,
                lte_apn_ipv4_address:
                  item.obj?.status?.connection?.lte.apn[0].ipv4.address,
                lte_apn_ipv4_gateway:
                  item.obj?.status?.connection?.lte.apn[0].ipv4.gateway,
                lte_apn_ipv4_netmask:
                  item.obj?.status?.connection?.lte.apn[0].ipv4.netmask,
                lte_apn_ipv4_uptime:
                  item.obj?.status?.connection?.lte.apn[0].ipv4.uptime,
                lte_ipv4_address:
                  item.obj?.status?.connection?.lte.ipv4.address,
                lte_ipv4_gateway:
                  item.obj?.status?.connection?.lte.ipv4.gateway,
                lte_ipv4_netmask:
                  item.obj?.status?.connection?.lte.ipv4.netmask,
                lte_ipv4_uptime: item.obj?.status?.connection?.lte.ipv4.uptime,
                wan_active: item.obj?.status?.connection?.wan.active,
                wan_ipv4_address:
                  item.obj?.status?.connection?.wan.ipv4.address,
                wan_ipv4_gateway:
                  item.obj?.status?.connection?.wan.ipv4.gateway,
                wan_ipv4_netmask:
                  item.obj?.status?.connection?.wan.ipv4.netmask,
                wan_ipv4_uptime: item.obj?.status?.connection?.wan.ipv4.uptime,
                wwan_active: item.obj?.status?.connection?.wwan?.active,
                wwan_ipv4_MAC: item.obj?.status?.connection?.wwan?.ipv4.MAC,
                wwan_ipv4_SSID: item.obj?.status?.connection?.wwan?.ipv4.SSID,
                wwan_ipv4_address:
                  item.obj?.status?.connection?.wwan?.ipv4.address,
                wwan_ipv4_channel:
                  item.obj?.status?.connection?.wwan?.ipv4.channel,
                wwan_ipv4_gateway:
                  item.obj?.status?.connection?.wwan?.ipv4.gateway,
                wwan_ipv4_netmask:
                  item.obj?.status?.connection?.wwan?.ipv4.netmask,
                wwan_ipv4_uptime:
                  item.obj?.status?.connection?.wwan?.ipv4.uptime,
                dns_wan_ipv4_0: item.obj?.status?.dns.wan[0].ipv4[0],
                dns_wan_ipv4_1: item.obj?.status?.dns.wan[0].ipv4[1],
                dns_wan_ipv4_2: item.obj?.status?.dns.wan[0].ipv4[2],
                dns_wan_ipv6_0: item.obj?.status?.dns.wan[0].ipv6[0],
                dns_wan_ipv6_1: item.obj?.status?.dns.wan[0].ipv6[1],
                dns_wan_ipv6_2: item.obj?.status?.dns.wan[0].ipv6[2],
                statistic_lte_up_kbps: item.obj?.status?.statistic?.lte.up_kbps,
                statistic_lte_down_kbps:
                  item.obj?.status?.statistic?.lte.down_kbps,
                statistic_lte_tx_kbytes:
                  item.obj?.status?.statistic?.lte.tx_kbytes,
                statistic_lte_rx_kbytes:
                  item.obj?.status?.statistic?.lte.rx_kbytes,
                statistic_lte_tx_dropped_pkts:
                  item.obj?.status?.statistic?.lte.tx_dropped_pkts,
                statistic_lte_rx_dropped_pkts:
                  item.obj?.status?.statistic?.lte.rx_dropped_pkts,
                sim1_status: item.obj?.status?.sim?.[0]?.status,
                sim1_EARFCN: item.obj?.status?.sim?.[0]?.EARFCN,
                sim1_IMSI: item.obj?.status?.sim?.[0]?.IMSI,
                sim1_ICCID: item.obj?.status?.sim?.[0]?.ICCID,
                sim1_PLMN: item.obj?.status?.sim?.[0]?.PLMN,
                sim1_access: item.obj?.status?.sim?.[0]?.access,
                sim1_active: item.obj?.status?.sim?.[0]?.active,
                sim1_band: item.obj?.status?.sim?.[0]?.band,
                sim1_operator: item.obj?.status?.sim?.[0]?.operator,
                sim1_phone_number: item.obj?.status?.sim?.[0]?.phone_number,
                sim1_roaming: item.obj?.status?.sim?.[0]?.roaming,
                sim1_rssi_dbm: item.obj?.status?.sim?.[0]?.rssi_dbm,
                sim2_status: item.obj?.status?.sim?.[1]?.status || "",
                sim2_EARFCN: item.obj?.status?.sim?.[1]?.EARFCN || "",
                sim2_IMSI: item.obj?.status?.sim?.[1]?.IMSI || "",
                sim2_ICCID: item.obj?.status?.sim?.[1]?.ICCID || "",
                sim2_PLMN: item.obj?.status?.sim?.[1]?.PLMN || "",
                sim2_access: item.obj?.status?.sim?.[1]?.access || "",
                sim2_active: item.obj?.status?.sim?.[1]?.active,
                sim2_band: item.obj?.status?.sim?.[1]?.band || "",
                sim2_operator: item.obj?.status?.sim?.[1]?.operator || "",
                sim2_phone_number:
                  item.obj?.status?.sim?.[1]?.phone_number || "",
                sim2_roaming: item.obj?.status?.sim?.[1]?.roaming,
                sim2_rssi_dbm: item.obj?.status?.sim?.[1]?.rssi_dbm,
                lan_rx_dropped_pkts:
                  item.obj?.status?.statistic?.lan.rx_dropped_pkts,
                lan_rx_kbytes: item.obj?.status?.statistic?.lan.rx_kbytes,
                lan_tx_dropped_pkts:
                  item.obj?.status?.statistic?.lan.tx_dropped_pkts,
                lan_tx_kbytes: item.obj?.status?.statistic?.lan.tx_kbytes,
                lan_up_kbps: item.obj?.status?.statistic?.lan.up_kbps,
                wan_down_kbps: item.obj?.status?.statistic?.wan.down_kbps,
                wan_rx_dropped_pkts:
                  item.obj?.status?.statistic?.wan.rx_dropped_pkts,
                wan_rx_kbytes: item.obj?.status?.statistic?.wan.rx_kbytes,
                wan_tx_dropped_pkts:
                  item.obj?.status?.statistic?.wan.tx_dropped_pkts,
                wan_tx_kbytes: item.obj?.status?.statistic?.wan.tx_kbytes,
                wan_up_kbps: item.obj?.status?.statistic?.wan.up_kbps,
                lte_down_kbps: item.obj?.status?.statistic?.lte.down_kbps,
                lte_rx_dropped_pkts:
                  item.obj?.status?.statistic?.lte.rx_dropped_pkts,
                lte_rx_kbytes: item.obj?.status?.statistic?.lte.rx_kbytes,
                lte_tx_dropped_pkts:
                  item.obj?.status?.statistic?.lte.tx_dropped_pkts,
                lte_tx_kbytes: item.obj?.status?.statistic?.lte.tx_kbytes,
                lte_up_kbps: item.obj?.status?.statistic?.lte.up_kbps,
                gps_latitude: item.obj?.status?.gps?.latitude,
                gps_longitude: item.obj?.status?.gps?.longitude,
                gps_horizontal: item.obj?.status?.gps?.horizontal,
                gps_altitude: item.obj?.status?.gps?.altitude,
                gps_date: item.obj?.status?.gps?.date,
                gps_utctime: item.obj?.status?.gps?.["utc-time"],
                gps_satellite: item.obj?.status?.gps?.satellite,
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
  }, [state.Login.Cid, IsUpdate, AllrouterTableIsUpdate]);

  return (
    <Fragment>
      <ViewAllStatusFilterMC
        setDeviceStatus={setDeviceStatus}
        groups={groups}
        Restore={Restore}
        models={models}
        cities={cities}
      />
      <Card
        title={t("ISMS.RoutersStatus")}
        className={styles.AllStatusCard}
        extra={
          <div className={styles.IconWrapper}>
            <Tooltip title={t("ISMS.Refresh")}>
              <Button
                className={styles.refreshIcon}
                // style={{ fontSize: "1.7rem" }}
                icon={<FcSynchronize style={{ fontSize: "1.7rem" }} />}
                onClick={() =>
                  setAllrouterTableIsUpdate(!AllrouterTableIsUpdate)
                }
              />
            </Tooltip>

            <Tooltip title={t("ISMS.AutoRefresh")}>
              <Button
                style={AutoRefresh ? { background: "#FFEFD5" } : null}
                onClick={() => setAutoRefresh(!AutoRefresh)}
                icon={
                  <div className={styles.autoRefresh}>
                    <FcSynchronize style={{ fontSize: "1.7rem" }} />
                    <FaAutoprefixer className={styles.alphet} />
                  </div>
                }
              />
            </Tooltip>

            <Tooltip title={t("ISMS.Setting")}>
              <Popover
                placement="left"
                trigger="click"
                onVisibleChange={(visible) => setBtnVisible(visible)}
                content={content}
                visible={BtnVisible}
                style={{ width: "55%", overflowY: "auto" }}
              >
                <Button
                  icon={<FcEngineering style={{ fontSize: "1.6rem" }} />}
                />
              </Popover>
            </Tooltip>

            {/* <div className={styles.IconWrapper}>
              <Tooltip title={t("ISMS.Refresh")}>
                <Button
                  icon={<FcSynchronize style={{ fontSize: "1.7rem" }} />}
                  onClick={() => setAllrouterTableIsUpdate(!AllrouterTableIsUpdate)}
                />
              </Tooltip>
            </div> */}
          </div>
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
          <Column
            title={"Location"}
            dataIndex="city"
            sorter={(a, b) => a.city.length - b.city.length}
            sortDirections={["descend", "ascend"]}
            render={(text, record) => {
              // console.log(record)
              if (record.city) {
                return text;
              } else if (record.lat) {
                return `${record.lat},${record.log}`;
              } else {
                return "No GPS Data";
              }
            }}
          />
          <Column
            title="Device"
            dataIndex="id"
            render={(_, record) =>
              record.name !== "" ? record.name : record.id
            }
            sorter={(a, b) => a.id.length - b.id.length}
            sortDirections={["descend", "ascend"]}
          />
          <Column
            title="Model"
            dataIndex="model"
            sorter={(a, b) => a.model.length - b.model.length}
            sortDirections={["descend", "ascend"]}
          />
          <Column
            title="Health"
            dataIndex="health"
            sorter={(a, b) => a.health.length - b.health.length}
            sortDirections={["descend", "ascend"]}
          />
          {/* <Column title="Signal" dataIndex="strength" /> */}
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
          {(showColum.sim1_EARFCN ||
            showColum.sim1_status ||
            showColum.sim1_IMSI ||
            showColum.sim1_ICCID ||
            showColum.sim1_PLMN ||
            showColum.sim1_access ||
            showColum.sim1_band ||
            showColum.sim1_operator ||
            showColum.sim1_phone_number ||
            showColum.sim1_rssi_dbm ||
            showColum.sim1_roaming) && (
            <ColumnGroup title="SIM1" fixed="left">
              {showColum.sim1_EARFCN && (
                <Column title="EARFCN" dataIndex="sim1_EARFCN" />
              )}
              {showColum.sim1_status && (
                <Column title="Status" dataIndex="sim1_status" />
              )}
              {showColum.sim1_IMSI && (
                <Column title="IMSI" dataIndex="sim1_IMSI" />
              )}
              {showColum.sim1_ICCID && (
                <Column title="ICCID" dataIndex="sim1_ICCID" />
              )}
              {showColum.sim1_PLMN && (
                <Column title="PLMN" dataIndex="sim1_PLMN" />
              )}
              {showColum.sim1_access && (
                <Column title="Access" dataIndex="sim1_access" />
              )}
              {showColum.sim1_active && (
                <Column
                  title="Active"
                  dataIndex="sim1_active"
                  render={(_, record) =>
                    `${
                      record.sim1_active
                        ? record.sim1_active
                        : record.sim1_active === false
                        ? false
                        : ""
                    }`
                  }
                />
              )}
              {showColum.sim1_band && (
                <Column title="Band" dataIndex="sim1_band" />
              )}
              {showColum.sim1_operator && (
                <Column title="Operator" dataIndex="sim1_operator" />
              )}
              {showColum.sim1_phone_number && (
                <Column title="PhoneNumber" dataIndex="sim1_phone_number" />
              )}
              {showColum.sim1_rssi_dbm && (
                <Column title="Rssi" dataIndex="sim1_rssi_dbm" />
              )}
              {showColum.sim1_roaming && (
                <Column
                  title="Roaming"
                  dataIndex="sim1_roaming"
                  render={(_, record) =>
                    `${
                      record.sim1_roaming
                        ? record.sim1_roaming
                        : record.sim1_roaming === false
                        ? false
                        : ""
                    }`
                  }
                />
              )}
            </ColumnGroup>
          )}
          {(showColum.sim2_EARFCN ||
            showColum.sim2_IMSI ||
            showColum.sim2_status ||
            showColum.sim2_ICCID ||
            showColum.sim2_PLMN ||
            showColum.sim2_access ||
            showColum.sim2_band ||
            showColum.sim2_operator ||
            showColum.sim2_phone_number ||
            showColum.sim2_rssi_dbm ||
            showColum.sim2_roaming) && (
            <ColumnGroup title="SIM2" fixed="left">
              {showColum.sim2_EARFCN && (
                <Column title="EARFCN" dataIndex="sim2_EARFCN" />
              )}
              {showColum.sim2_status && (
                <Column title="Status" dataIndex="sim2_status" />
              )}
              {showColum.sim2_IMSI && (
                <Column title="IMSI" dataIndex="sim2_IMSI" />
              )}
              {showColum.sim2_ICCID && (
                <Column title="ICCID" dataIndex="sim2_ICCID" />
              )}
              {showColum.sim2_PLMN && (
                <Column title="PLMN" dataIndex="sim2_PLMN" />
              )}
              {showColum.sim2_access && (
                <Column title="Access" dataIndex="sim2_access" />
              )}
              {showColum.sim2_active && (
                <Column
                  title="Active"
                  dataIndex="sim2_active"
                  render={(_, record) =>
                    `${
                      record.sim2_active
                        ? record.sim2_active
                        : record.sim2_active === false
                        ? false
                        : ""
                    }`
                  }
                />
              )}
              {showColum.sim2_band && (
                <Column title="Band" dataIndex="sim2_band" />
              )}
              {showColum.sim2_operator && (
                <Column title="Operator" dataIndex="sim2_operator" />
              )}
              {showColum.sim2_phone_number && (
                <Column title="PhoneNumber" dataIndex="sim2_phone_number" />
              )}
              {showColum.sim2_rssi_dbm && (
                <Column title="Rssi" dataIndex="sim2_rssi_dbm" />
              )}
              {showColum.sim2_roaming && (
                <Column
                  title="Roaming"
                  dataIndex="sim2_roaming"
                  render={(_, record) =>
                    `${
                      record.sim2_roaming
                        ? record.sim2_roaming
                        : record.sim2_roaming === false
                        ? false
                        : ""
                    }`
                  }
                />
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
            showColum.lan_ipv6_adress ||
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
              {(showColum.lan_ipv6_adress || showColum.lan_ipv6_uptime) && (
                <ColumnGroup title="ipv6">
                  {showColum.lan_ipv6_adress && (
                    <Column title="Adress" dataIndex="lan_ipv6_adress" />
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
                  render={(_, record) =>
                    `${
                      record.lte_active
                        ? record.lte_active
                        : record.lte_active === false
                        ? false
                        : ""
                    }`
                  }
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
                  <Column title="Address" dataIndex="wan_ipv4_address" />
                )}
                {showColum.wan_ipv4_gateway && (
                  <Column title="Gateway" dataIndex="wan_ipv4_gateway" />
                )}
                {showColum.wan_ipv4_netmask && (
                  <Column title="Netmask" dataIndex="wan_ipv4_netmask" />
                )}
                {showColum.wan_ipv4_uptime && (
                  <Column title="Uptime" dataIndex="wan_ipv4_uptime" />
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
                  render={(_, record) =>
                    `${
                      record.wwan_active
                        ? record.wwan_active
                        : record.wwan_active === false
                        ? false
                        : ""
                    }`
                  }
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
          {(showColum.gps_latitude ||
            showColum.gps_longitude ||
            showColum.gps_horizontal ||
            showColum.gps_altitude ||
            showColum.gps_date ||
            showColum.gps_utctime ||
            showColum.gps_satellite) && (
            <ColumnGroup title="GPS">
              {showColum.gps_latitude && (
                <Column title="Latitude" dataIndex="gps_latitude" />
              )}
              {showColum.gps_longitude && (
                <Column title="Longitude" dataIndex="gps_longitude" />
              )}
              {showColum.gps_horizontal && (
                <Column title="Horizontal" dataIndex="gps_horizontal" />
              )}
              {showColum.gps_altitude && (
                <Column title="Altitude" dataIndex="gps_altitude" />
              )}
              {showColum.gps_date && (
                <Column title="Date" dataIndex="gps_date" />
              )}
              {showColum.gps_utctime && (
                <Column title="UTC-Time" dataIndex="gps_utctime" />
              )}
              {showColum.gps_satellite && (
                <Column title="Satellite" dataIndex="gps_satellite" />
              )}
            </ColumnGroup>
          )}
        </Table>
      </Card>
    </Fragment>
  );
};

export const ViewAllStatusMC = React.memo(ViewAllStatusC);
