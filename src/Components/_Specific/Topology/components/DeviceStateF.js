import React from "react";
import { Descriptions } from "antd";
import styles from "../topology.module.scss";
import "echarts/lib/chart/bar";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";



const IdentityTable = ({ DeviceIdentity }) => {
  return (
    DeviceIdentity && (
      <Descriptions
        bordered
        column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        className={styles.desc}
      >
        <Descriptions.Item label="IMEI">
          {DeviceIdentity.IMEI}
        </Descriptions.Item>
        <Descriptions.Item label="bootloader_version">
          {DeviceIdentity.bootloader_version}
        </Descriptions.Item>
        <Descriptions.Item label="hardware_mcsv">
          {DeviceIdentity.hardware_mcsv}
        </Descriptions.Item>
        <Descriptions.Item label="hostname">
          {DeviceIdentity.hostname}
        </Descriptions.Item>
        <Descriptions.Item label="lan_eth_mac">
          {DeviceIdentity.lan_eth_mac}
        </Descriptions.Item>
        <Descriptions.Item label="modem_firmware_version">
          {DeviceIdentity.modem_firmware_version}
        </Descriptions.Item>
        <Descriptions.Item label="serial_number">
          {DeviceIdentity.serial_number}
        </Descriptions.Item>
        <Descriptions.Item label="wan_eth_mac">
          {DeviceIdentity.wan_eth_mac}
        </Descriptions.Item>
        <Descriptions.Item label="wifi_ap_mac">
          {DeviceIdentity.wifi_ap_mac}
        </Descriptions.Item>
      </Descriptions>
    )
  );
};

export const IdentityTableMF = React.memo(IdentityTable);

const StatusStrength = ({ DeviceStatus }) => {
  const statistic = DeviceStatus.status.sim[0];
  console.log(statistic.roaming);
  return (
    <div>
      <Descriptions
        // title="Signal Cofiguration"
        column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        bordered
        className={styles.desc}
      >
        <Descriptions.Item label="EARFCN">{statistic.EARFCN}</Descriptions.Item>
        <Descriptions.Item label="IMSI">{statistic.IMSI}</Descriptions.Item>
        <Descriptions.Item label="PLMN">{statistic.PLMN}</Descriptions.Item>
        <Descriptions.Item label="access">{statistic.access}</Descriptions.Item>
        <Descriptions.Item label="active">{`${statistic.active}`}</Descriptions.Item>
        <Descriptions.Item label="band">{statistic.band}</Descriptions.Item>
        <Descriptions.Item label="operator">
          {statistic.operator}
        </Descriptions.Item>
        <Descriptions.Item label="phone_number">
          {statistic.phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="roaming">{`${statistic.roaming}`}</Descriptions.Item>
        <Descriptions.Item label="rssi_dbm">
          {statistic.rssi_dbm}
        </Descriptions.Item>
        <Descriptions.Item label="status">{statistic.status}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export const StatusStrengthMF = React.memo(StatusStrength);

const StatusGPS = ({ DeviceStatus }) => {
  const gps = DeviceStatus.status.gps;
  return (
    <div>
      <Descriptions
        bordered
        className={styles.desc}
        column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="altitude">{gps.altitude}</Descriptions.Item>
        <Descriptions.Item label="date">{gps.date}</Descriptions.Item>
        <Descriptions.Item label="horizontal">
          {gps.horizontal}
        </Descriptions.Item>
        <Descriptions.Item label="latitude">{gps.latitude}</Descriptions.Item>
        <Descriptions.Item label="longitude">{gps.longitude}</Descriptions.Item>
        <Descriptions.Item label="satellite">{gps.satellite}</Descriptions.Item>
        <Descriptions.Item label="utc-time">
          {gps["utc-time"]}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export const StatusGPSMF = React.memo(StatusGPS);

const StatusDNS = ({ DeviceStatus }) => {
  const dns = DeviceStatus.status.dns;

  return (
    <div>
      <Descriptions
        bordered
        className={styles.desc}
        column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="wan_ip4">
          {dns.wan[0].ipv4[0]}
        </Descriptions.Item>
        <Descriptions.Item label="wan_ip4">
          {dns.wan[0].ipv4[1]}
        </Descriptions.Item>
        <Descriptions.Item label="wan_ip4">
          {dns.wan[0].ipv4[2]}
        </Descriptions.Item>
        <Descriptions.Item label="wan_ip6">
          {dns.wan[0].ipv6[0]}
        </Descriptions.Item>
        <Descriptions.Item label="wan_ip6">
          {dns.wan[0].ipv6[1]}
        </Descriptions.Item>
        <Descriptions.Item label="wan_ip6">
          {dns.wan[0].ipv6[2]}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export const StatusDNSMF = React.memo(StatusDNS);

const StatusConnection = ({ DeviceStatus }) => {
  const connection = DeviceStatus.status.connection;

  return (

      
        <Descriptions
          bordered
          className={[styles.desc,styles['override-ant-descriptions-view']]}
          column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="LAN_ip4_adress">
            {connection.lan.ipv4.adress}
          </Descriptions.Item>
          <Descriptions.Item label="LAN_ip4_netmask">
            {connection.lan.ipv4.netmask}
          </Descriptions.Item>
          <Descriptions.Item label="LAN_ip6_adress">
            {connection.lan.ipv6.address}
          </Descriptions.Item>
          <Descriptions.Item label="LAN_ip6_up_time">
            {connection.lan.ipv6.uptime}{" "}
          </Descriptions.Item>
        {/* </Descriptions> */}
        {/* <Descriptions
          bordered
           className={[styles.desc,styles['override-ant-descriptions-view']]}
          column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        > */}
          <Descriptions.Item label="LTE_active">
            {connection.lte.active}
          </Descriptions.Item>
          <Descriptions.Item label="LTE_ip4_apn_address">
            {connection.lte.apn[0].ipv4.address}
          </Descriptions.Item>
          <Descriptions.Item label="LTE_ip4_apn_gateway">
            {connection.lte.apn[0].ipv4.gateway}
          </Descriptions.Item>
          <Descriptions.Item label="LTE_ip4_apn_netmask">
            {connection.lte.apn[0].ipv4.netmask}
          </Descriptions.Item>
          <Descriptions.Item label="LTE_ip4_apn_uptime">
            {connection.lte.apn[0].ipv4.uptime}
          </Descriptions.Item>
          <Descriptions.Item label="LTE_ip4_address">
            {connection.lte.ipv4.address}
          </Descriptions.Item>
          <Descriptions.Item label="LTE_ip4_gateway">
            {connection.lte.ipv4.gateway}
          </Descriptions.Item>
          <Descriptions.Item label="LTE_ip4_netmask">
            {connection.lte.ipv4.netmask}
          </Descriptions.Item>
          <Descriptions.Item label="LTE_ip4_uptime">
            {connection.lte.ipv4.uptime}
          </Descriptions.Item>
        {/* // </Descriptions>
        // <Descriptions */}
        {/* //   bordered
        //    className={[styles.desc,styles['override-ant-descriptions-view']]}
        //   column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        // > */}
          <Descriptions.Item label="WAN_active">
            {connection.wan.active}
          </Descriptions.Item>
          <Descriptions.Item label="WAN_ip4_address">
            {connection.wan.ipv4.address}
          </Descriptions.Item>
          <Descriptions.Item label="WAN_ip4_gateway">
            {connection.wan.ipv4.gateway}
          </Descriptions.Item>
          <Descriptions.Item label="WAN_ip4_netmask">
            {connection.wan.ipv4.netmask}{" "}
          </Descriptions.Item>
          <Descriptions.Item label="WAN_ip4_up_time">
            {connection.wan.ipv4.uptime}{" "}
          </Descriptions.Item>
        {/* // </Descriptions>
        // <Descriptions */}
        {/* //   bordered
        //    className={[styles.desc,styles['override-ant-descriptions-view']]}
        //   column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        // > */}
          <Descriptions.Item label="WWAN_active">
            {connection.wwan.active}
          </Descriptions.Item>
          <Descriptions.Item label="WWAN_ip4_MAC">
            {connection.wwan.ipv4.MAC}
          </Descriptions.Item>
          <Descriptions.Item label="WWAN_ip4_SSID">
            {connection.wwan.ipv4.SSID}
          </Descriptions.Item>
          <Descriptions.Item label="WWAN_ip4_address">
            {connection.wwan.ipv4.address}{" "}
          </Descriptions.Item>
          <Descriptions.Item label="WWAN_ip4_channel">
            {connection.wwan.ipv4.channel}{" "}
          </Descriptions.Item>
          <Descriptions.Item label="WWAN_ip4_gateway">
            {connection.wwan.ipv4.gateway}{" "}
          </Descriptions.Item>
          <Descriptions.Item label="WWAN_ip4_netmask">
            {connection.wwan.ipv4.netmask}{" "}
          </Descriptions.Item>
          <Descriptions.Item label="WWAN_ip4_up_time">
            {connection.wwan.ipv4.uptime}{" "}
          </Descriptions.Item>
        </Descriptions>

  );
};

export const StatusConnectionMF = React.memo(StatusConnection);

const TxRxStatistic = ({ DeviceStatus }) => {
  const statistic = DeviceStatus.status.statistic;
  const getOption = () => {
    const option = {
      title: {
        show: true,
        text: "DataUsage",
        textStyle: { fontWeight: "bold", fontFamily: "sans-serif" },
        right: "auto",
        left: "auto",
      },
      legend: { show: true, right: "10%" },
      tooltip: {},
      dataset: {
        source: [
          ["product", "tx", "rx"],
          ["LTE", statistic.lte.tx_kbytes, statistic.lte.rx_kbytes],
          ["WAN", statistic.wan.tx_kbytes, statistic.wan.rx_kbytes],
          ["LAN", statistic.lan.tx_kbytes, statistic.lan.rx_kbytes],
        ],
      },
      xAxis: { type: "category" },
      yAxis: {},
      series: [{ type: "bar" }, { type: "bar" }],
    };
    return option;
  };

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={getOption()}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
      className={styles.echartBar}
    />
  );
};

export const TxRxStatisticMF = React.memo(TxRxStatistic);
