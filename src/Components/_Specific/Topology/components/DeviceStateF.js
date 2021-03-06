import React, { Fragment, useState } from "react";
import { Descriptions, Row, Col, Radio } from "antd";
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
        <Descriptions.Item label="Bootloader Version">
          {DeviceIdentity.bootloader_version}
        </Descriptions.Item>
        <Descriptions.Item label="Hardware MCSV">
          {DeviceIdentity.hardware_mcsv}
        </Descriptions.Item>
        <Descriptions.Item label="Hostname">
          {DeviceIdentity.hostname}
        </Descriptions.Item>
        <Descriptions.Item label="LAN Eth Mac">
          {DeviceIdentity.lan_eth_mac}
        </Descriptions.Item>
        <Descriptions.Item label="Modem Firmware Version">
          {DeviceIdentity.modem_firmware_version}
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number">
          {DeviceIdentity.serial_number}
        </Descriptions.Item>
        <Descriptions.Item label="WAN Eth Mac">
          {DeviceIdentity.wan_eth_mac}
        </Descriptions.Item>
        <Descriptions.Item label="Wifi AP Mac">
          {DeviceIdentity.wifi_ap_mac}
        </Descriptions.Item>
      </Descriptions>
    )
  );
};

export const IdentityTableMF = React.memo(IdentityTable);

const StatusStrength = ({ DeviceStatus }) => {
  const statistic = DeviceStatus.status.sim[0];
  const statistic2 = DeviceStatus.status?.sim?.[1];
  console.log(statistic.roaming);
  return (
    <div>
      
      <Descriptions
        // title="Signal Cofiguration"
        column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        bordered
        className={styles.desc}
        title='* SIM1 / SIM2'
      >
        <Descriptions.Item label="EARFCN">
          {statistic.EARFCN} {statistic2 ? `/${statistic2.EARFCN}` : ""}
        </Descriptions.Item>
        <Descriptions.Item label="IMSI">
          {statistic.IMSI} {statistic2 ? `/${statistic2.IMSI}` : ""}
        </Descriptions.Item>
        <Descriptions.Item label="ICCID">
          {statistic.ICCID} {statistic2 ? `/${statistic2.ICCID}` : ""}
        </Descriptions.Item>
        {/* <Descriptions.Item label="ICCID(SIM2)">{Sim2ICCID? Sim2ICCI }`D: ''} </Descriptions.Item> */}
        <Descriptions.Item label="PLMN">
          {statistic.PLMN} {statistic2 ? `/${statistic2.PLMN}` : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Access">
          {statistic.access} {statistic2 ? `/${statistic2.access}` : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Active">
          {`${statistic.active}`}{" "}
          {`${statistic2 ? `/${statistic2.active}` : ""}`}
        </Descriptions.Item>
        <Descriptions.Item label="Band">
          {statistic.band} {statistic2 ? `/${statistic2.band}` : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Operator">
          {statistic.operator} {statistic2 ? `/${statistic2.operator}` : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {statistic.phone_number}{" "}
          {statistic2 ? `/${statistic2.phone_number}` : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Roaming">
          {`${statistic.roaming}`} {statistic2 ? `/${statistic2.roaming}` : ""}
        </Descriptions.Item>
        <Descriptions.Item label="RSSI (dbm)">
          {statistic.rssi_dbm} {statistic2 ? `/${statistic2.rssi_dbm}` : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {statistic.status} {statistic2 ? `/${statistic2.status}` : ""}
        </Descriptions.Item>
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
        <Descriptions.Item label="Altitude">{gps.altitude}</Descriptions.Item>
        <Descriptions.Item label="Date">{gps.date}</Descriptions.Item>
        <Descriptions.Item label="horizontal">
          {gps.horizontal}
        </Descriptions.Item>
        <Descriptions.Item label="Latitude">{gps.latitude}</Descriptions.Item>
        <Descriptions.Item label="Longitude">{gps.longitude}</Descriptions.Item>
        <Descriptions.Item label="Satellite">{gps.satellite}</Descriptions.Item>
        <Descriptions.Item label="UTC-time">
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
        title='WAN'
      >
        <Descriptions.Item label="IPv4_1">
          {dns.wan[0].ipv4[0]}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4_2">
          {dns.wan[0].ipv4[1]}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4_3">
          {dns.wan[0].ipv4[2]}
        </Descriptions.Item>
        <Descriptions.Item label="IPv6_1">
          {dns.wan[0].ipv6[0]}
        </Descriptions.Item>
        <Descriptions.Item label="IPv6_2">
          {dns.wan[0].ipv6[1]}
        </Descriptions.Item>
        <Descriptions.Item label="IPv6_3">
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
    <Fragment>
      <Descriptions
        bordered
        className={styles.desc}
        column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        title={'LAN'}
      >
        <Descriptions.Item label="IPv4 Address">
          {connection.lan?.ipv4.address}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Netmask">
          {connection.lan?.ipv4.netmask}
        </Descriptions.Item>
        <Descriptions.Item label="IPv6 Address">
          {connection.lan?.ipv6.address}
        </Descriptions.Item>
        <Descriptions.Item label="IPv6 Uptime">
          {connection.lan?.ipv6.uptime}
        </Descriptions.Item>
      </Descriptions>
    
      <Descriptions
        bordered
        className={styles.desc}
        column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        title={'LTE'}
      >
        <Descriptions.Item label="Active">
          {connection.lte?.active === true ? 'true' : 'false'}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 APN Address">
          {connection.lte?.apn[0].ipv4.address}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 APN Gateway">
          {connection.lte?.apn[0].ipv4.gateway}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 APN Netmask">
          {connection.lte?.apn[0].ipv4.netmask}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 APN Uptime">
          {connection.lte?.apn[0].ipv4.uptime}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Address">
          {connection.lte?.ipv4.address}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Gateway">
          {connection.lte?.ipv4.gateway}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Netmask">
          {connection.lte?.ipv4.netmask}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Uptime">
          {connection.lte?.ipv4.uptime}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        bordered
        className={styles.desc}
        column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        title={'WAN'}
      >
        <Descriptions.Item label="Active">
          {connection.wan?.active === true ? 'true' : 'false' }
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Address">
          {connection.wan?.ipv4.address}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Gateway">
          {connection.wan?.ipv4.gateway}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Netmask">
          {connection.wan?.ipv4.netmask}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Uptime">
          {connection.wan?.ipv4.uptime}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        bordered
        className={styles.desc}
        column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        title={'WWAN'}
      >
        <Descriptions.Item label="Active">
          {connection.wwan?.active === true ? 'true' : 'false' }
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 MAC">
          {connection.wwan?.ipv4.MAC}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 SSID">
          {connection.wwan?.ipv4.SSID}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Address">
          {connection.wwan?.ipv4.address}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Channel">
          {connection.wwan?.ipv4.channel}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Gateway">
          {connection.wwan?.ipv4.gateway}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Netmask">
          {connection.wwan?.ipv4.netmask}
        </Descriptions.Item>
        <Descriptions.Item label="IPv4 Uptime">
          {connection.wwan?.ipv4.uptime}
        </Descriptions.Item>
      </Descriptions>
    </Fragment>
  );
};

export const StatusConnectionMF = React.memo(StatusConnection);

const TxRxStatistic = ({ DeviceStatus }) => {
  const [currentValue, setCurrentValue] = useState("Tx/Rx");
  const statistic = DeviceStatus.status.statistic;
  const getOption = () => {
    const option = {
      title: {
        show: true,
        text: "",
        textStyle: { fontWeight: "bold", fontFamily: "sans-serif" },
        right: "auto",
        left: "auto",
      },
      legend: { show: true, right: "10%" },
      tooltip: {},
      xAxis: { type: "category" },
      yAxis: { name: "kbytes" },
    };

    if (currentValue === "Tx/Rx") {
      option.dataset = {
        source: [
          ["product", "tx", "rx"],
          ["LTE", statistic?.lte.tx_kbytes, statistic?.lte.rx_kbytes],
          [
            "LTE(APN)",
            statistic?.lte.apn[0].tx_kbytes,
            statistic?.lte.apn[0].rx_kbytes,
          ],
          ["WAN", statistic?.wan.tx_kbytes, statistic?.wan.rx_kbytes],
          ["LAN", statistic?.lan.tx_kbytes, statistic?.lan.rx_kbytes],
        ],
      };
      option.series = [{ type: "bar" }, { type: "bar" }];
    } else if (currentValue === "Tx/Rx Dropped") {
      option.dataset = {
        source: [
          ["product", "tx", "rx"],
          [
            "LTE",
            statistic?.lte.tx_dropped_pkts,
            statistic?.lte.rx_dropped_pkts,
          ],
          [
            "LTE(APN)",
            statistic?.lan.tx_dropped_pkts,
            statistic?.lan.rx_dropped_pkts,
          ],
          [
            "WAN",
            statistic?.lan.tx_dropped_pkts,
            statistic?.lan.rx_dropped_pkts,
          ],
          [
            "LAN",
            statistic?.lan.tx_dropped_pkts,
            statistic?.lan.rx_dropped_pkts,
          ],
        ],
      };
      option.series = [{ type: "bar" }, { type: "bar" }];
    } else {
      option.xAxis.data = ["LTE", "LTE(APN)", "WAN", "LAN"];
      option.series = [
        {
          data:
            currentValue === "Uplink Speed"
              ? [
                  statistic?.lte.up_kbps,
                  statistic?.lte.apn[0].up_kbps,
                  statistic?.wan.up_kbps,
                  statistic?.lan.up_kbps,
                ]
              : [
                  statistic?.lte.down_kbps,
                  statistic?.lte.apn[0].down_kbps,
                  statistic?.wan.down_kbps,
                  statistic?.lan.down_kbps,
                ],
          type: "bar",
        },
      ];
    }
    return option;
  };

  const onChange = (e) => {
    setCurrentValue(e.target.value);
  };

  return (
    <Fragment>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Radio.Group onChange={(e) => onChange(e)} value={currentValue}>
            <Radio value={"Tx/Rx"}>Tx/Rx</Radio>
            <Radio value={"Tx/Rx Dropped"}>Tx/Rx Dropped</Radio>
            <Radio value={"Uplink Speed"}>Uplink Speed</Radio>
            <Radio value={"Downlink Speed"}>Downlink Speed</Radio>
          </Radio.Group>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <ReactEchartsCore
            echarts={echarts}
            option={getOption()}
            notMerge={true}
            lazyUpdate={true}
            theme={"theme_name"}
            className={styles.echartBar}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

export const TxRxStatisticMF = React.memo(TxRxStatistic);
