import React from "react";
import { Descriptions } from "antd";
import styles from '../topology.module.scss'
import "echarts/lib/chart/bar";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";


export const StatusStrength = ({ dataSource }) => {

  const statistic = dataSource.sim[0];
  
  return (
    <div>
      <Descriptions
        // title="Signal Cofiguration"
        bordered
        className={styles.desc}
      >
        <Descriptions.Item label="Strength">
          EARFCN:{statistic.EARFCN}
          <br />
          IMSI: {statistic.IMSI}
          <br />
          PLMN : {statistic.PLMN}
          <br />
          access : {statistic.access}
          <br />
          active : {statistic.active}
          <br />
          band: {statistic.band}
          <br />
          operator: {statistic.operator}
          <br />
          phone_number: {statistic.phone_number}
          <br />
          roaming: {statistic.roaming}
          <br />
          rssi_dbm:{statistic.rssi_dbm}
          <br />
          status:{statistic.status}
          <br />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export const StatusGPS = ({ dataSource }) => {

  const gps = dataSource.gps;
  return (
    <div>
      <Descriptions
        bordered
        className={styles.desc}
      >
        <Descriptions.Item label="GPS">
        altitude:{gps.altitude}
          <br />
          date: {gps.date}
          <br />
          horizontal : {gps.horizontal}
          <br />
          latitude : {gps.latitude}
          <br />
          longitude : {gps.longitude}
          <br />
          satellite: {gps.satellite}
          <br />
          utc-time: {gps['utc-time']}
          <br />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export const StatusDNS = ({ dataSource }) => {

  const dns = dataSource.dns;

  return (
    <div>
      <Descriptions
        bordered
        className={styles.desc}
      >
        <Descriptions.Item label="DNS">
        wan_ip4_1:{dns.wan[0].ipv4[0]}
          <br />
          wan_ip4_2: {dns.wan[0].ipv4[1]}
          <br />
          wan_ip4_3:{dns.wan[0].ipv4[2]}
          <br />
          wan_ip6_1:{dns.wan[0].ipv6[0]}
          <br />
          wan_ip6_2: {dns.wan[0].ipv6[1]}
          <br />
          wan_ip6_3: {dns.wan[0].ipv6[2]}
          <br />

        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};


export const StatusConnection = ({ dataSource }) => {

  const connection = dataSource.connection

return (
  <div>
  <Descriptions
    bordered
    className={styles.desc}
  >
    <Descriptions.Item label="LAN">
      ip4_adress: {connection.lan.ipv4.adress}
      <br />
      ip4_netmask: {connection.lan.ipv4.netmask}
      <br />
      ip6_adress: {connection.lan.ipv6.address}
      <br />
      ip6_up_time:{connection.lan.ipv6.uptime}  
      <br />
    </Descriptions.Item>
  </Descriptions>
  <Descriptions
    bordered
    className={styles.desc}
  >
    <Descriptions.Item label="LTE">
      active: {connection.lte.active}
      <br />
      ip4_apn_address: {connection.lte.apn[0].ipv4.address}
      <br />
      ip4_apn_gateway: {connection.lte.apn[0].ipv4.gateway}
      <br />
      ip4_apn_netmask: {connection.lte.apn[0].ipv4.netmask}
      <br />
      ip4_apn_uptime: {connection.lte.apn[0].ipv4.uptime}
      <br />
      ip4_address: {connection.lte.ipv4.address}
      <br />
      ip4_gateway: {connection.lte.ipv4.gateway}
      <br />
      ip4_netmask: {connection.lte.ipv4.netmask}
      <br />
      ip4_uptime: {connection.lte.ipv4.uptime}
      <br />
    </Descriptions.Item>
  </Descriptions>
  <Descriptions
    bordered
    className={styles.desc}
  >
    <Descriptions.Item label="WAN">
      active: {connection.wan.active}
      <br />
      ip4_address: {connection.wan.ipv4.address}
      <br />
      ip4_gateway: {connection.wan.ipv4.gateway}
      <br />
      ip4_netmask:{connection.wan.ipv4.netmask}  
      <br />
      ip4_up_time:{connection.wan.ipv4.uptime}  
      <br />
    </Descriptions.Item>
  </Descriptions>
  <Descriptions
    bordered
    className={styles.desc}
  >
    <Descriptions.Item label="WWAN">
      active: {connection.wwan.active}
      <br />
      ip4_MAC: {connection.wwan.ipv4.MAC}
      <br />
      ip4_SSID: {connection.wwan.ipv4.SSID}
      <br />
      ip4_address:{connection.wwan.ipv4.address}  
      <br />
      ip4_channel:{connection.wwan.ipv4.channel}  
      <br />
      ip4_gateway:{connection.wwan.ipv4.gateway}  
      <br />
      ip4_netmask:{connection.wwan.ipv4.netmask}  
      <br />
      ip4_up_time:{connection.wwan.ipv4.uptime}  
      <br />
    </Descriptions.Item>
  </Descriptions>
</div>
)
}  


export const TxRxStatistic = ({ dataSource }) => {

  const statistic = dataSource.statistic
  const getOption = () => {

    const option = {
      title: {show: true, text:'DataUsage', textStyle:{fontWeight:'bold', fontFamily: 'sans-serif'},right:'auto',left:'auto' },
      legend: {show:true, right:'10%'},
      tooltip: {},
      dataset: {
          source: [
              ['product', 'tx', 'rx'],
              ['LTE', statistic.lte.tx_kbytes, statistic.lte.rx_kbytes],
              ['WAN', statistic.wan.tx_kbytes, statistic.wan.rx_kbytes],
              ['LAN', statistic.lan.tx_kbytes, statistic.lan.rx_kbytes]
          ]
      },
      xAxis: {type: 'category'},
      yAxis: {},
      series: [
          {type: 'bar'},
          {type: 'bar'}
      ]
    }    
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

