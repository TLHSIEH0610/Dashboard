import React, { Fragment } from "react";
import styles from "../menu.module.scss";
import {  Descriptions } from "antd";

const HelpRouterStatus = () => {
  return (
    <Fragment>
      <div className={styles.helpContainer}>
        <h2 className={styles.title}>Overview</h2>
        <p>Detailed information of routers, including Identity, Data Usage, SIM, LAN, LTE, WAN, WWAN, DNS, GPS</p>
        <img
        alt=''
          className={styles.repository}
          src={require("../../../image/routerStatus.png")}
        />
        {/* <h2 className={styles.title}>Action Request</h2> */}
        {/* <p>Allow user to batch upgrade/backup/restore</p> */}
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Item" className={styles.tableheader}>
            Description
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>1</span>
                <span>Column customerization</span>
              </Fragment>
            }
          >
            <p>
              Customize data columns that you want to show on the display table. Select items and
              click 'Confirm'
            </p>
            <img
            alt=''
              className={styles.routerStatusColumn}
              src={require("../../../image/routerStatusColumn.png")}
            />
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>Identity</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Item" className={styles.tableheader}>
            Description
          </Descriptions.Item>
          <Descriptions.Item label="IMEI">
            International Mobile Equipment Identity
          </Descriptions.Item>
          <Descriptions.Item label="Bootloader Version">
            bootloader version currently running on the device
          </Descriptions.Item>
          <Descriptions.Item label="Hardware MCSV">
            harware MCSV of the device
          </Descriptions.Item>
          <Descriptions.Item label="hostname">
            the host name or the host IP address
          </Descriptions.Item>
          <Descriptions.Item label="LAN Ethernet MAC ">
            MAC address of LAN interface
          </Descriptions.Item>
          <Descriptions.Item label="Modem Firmware Version">
            modem firmware version of the device
          </Descriptions.Item>
          <Descriptions.Item label="Serial Number">
            serial number of the device
          </Descriptions.Item>
          <Descriptions.Item label="WAN Ethernet MAC">
            MAC address of WAN interface
          </Descriptions.Item>
          <Descriptions.Item label="WiFi 2.4G MAC">
            MAC address of WiFi 2.4G interface
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>Usage</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Item" className={styles.tableheader}>
            Description
          </Descriptions.Item>
          <Descriptions.Item label="Uplink Speed Kbps">
            Uplink Speed in Kbps.
          </Descriptions.Item>
          <Descriptions.Item label="Downlink Speed Kbps">
            Downlink Speed in Kbps.
          </Descriptions.Item>
          <Descriptions.Item label="Tx/Rx KBytes">
            Accumulated TX/RX in KBytes.
          </Descriptions.Item>
          <Descriptions.Item label="TX/RX Dropped Packets">
            TX/RX Dropped Packets.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>SIM</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Item" className={styles.tableheader}>
            Description
          </Descriptions.Item>
          <Descriptions.Item label="SIM Status">
            <p>Ready: No PIN code protection or unlock already Unlock: Unlock pin </p>
            <p>code protection Locked: Locked by pin code Error: SIM operation</p>
            <p>error Blocked: PUK needed to unlock Not Inserted: No sim card</p>
            <p>Hardware Error: Unable to enable function Ignore: Ignore Specified</p>
            <p>SIM in dual sim device</p>
          </Descriptions.Item>
          <Descriptions.Item label="EARFCN">
            Absolute radio-frequency channel number
          </Descriptions.Item>
          <Descriptions.Item label="IMSI">
            The IMSI number of the SIM card.
          </Descriptions.Item>
          <Descriptions.Item label="ICCID">
            The ICCID number of the SIM card.
          </Descriptions.Item>
          <Descriptions.Item label="PLMN">
            Public LAN Mobile Network ID.
          </Descriptions.Item>
          <Descriptions.Item label="Access">
            The router to access protocol type.
          </Descriptions.Item>
          <Descriptions.Item label="Active">Active status</Descriptions.Item>
          <Descriptions.Item label="Band">
            The current connected Band.
          </Descriptions.Item>
          <Descriptions.Item label="Operator">Operator name.</Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            The phone number of the SIM card.
          </Descriptions.Item>
          <Descriptions.Item label="Roaming">Roaming status.</Descriptions.Item>
          <Descriptions.Item label="Rssi">
            Received Signal Strength Indication.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>LAN</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Item" className={styles.tableheader}>
            Description
          </Descriptions.Item>
          <Descriptions.Item label="IPv4-Adress/Mask">
            IP Address:192.168.1.1 IP Mask:255.255.255.0 Both of them are
            default, you can change them according to your local IP Address and
            IP Mask.
          </Descriptions.Item>
          <Descriptions.Item label="IPv6-Adress/Mask">
            This section provides two types, including Delegate Prefix from WAN
            and Static. Static Address: You need to input the static address
            when you select the static type.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>LTE</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Item" className={styles.tableheader}>
            Description
          </Descriptions.Item>
          <Descriptions.Item label="IPv4-Adress/Gateway/Netmask">
            IPv4 TCP Server Address/Gateway/Netmask.
          </Descriptions.Item>
          <Descriptions.Item label="IPv4-Adress/Gateway/Netmask(APN)">
            APN IPv4 TCP Server Address/Gateway/Netmask.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>WAN</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Item" className={styles.tableheader}>
            Description
          </Descriptions.Item>
          <Descriptions.Item label="IPv4-Adress/Gateway/Netmask">
            IPv4 Address/Gateway/Netmask.
          </Descriptions.Item>
        </Descriptions>

        {/* <h2 className={styles.title2}>WWAN</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Item" className={styles.tableheader}>
            Description
          </Descriptions.Item>
          <Descriptions.Item label=""></Descriptions.Item>
        </Descriptions> */}

        <h2 className={styles.title2}>DNS</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Item" className={styles.tableheader}>
            Description
          </Descriptions.Item>
          <Descriptions.Item label="IPv4/IPv6 DNS">
            DNS address
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>GPS</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Latitude">Latitude</Descriptions.Item>
          <Descriptions.Item label="Longitude">Longitude</Descriptions.Item>
          <Descriptions.Item label="Horizontal">
            Horizontal precision:0.5-99.9
          </Descriptions.Item>
          <Descriptions.Item label="Altitude">
            The altitude of antenna away from the sea level(unit: m), accurate
            to one decimal place
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            UTC date when fixing position
          </Descriptions.Item>
          <Descriptions.Item label="Time">
            UTC time when fixing position
          </Descriptions.Item>
          <Descriptions.Item label="Satellite">
            Number of satellites
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Fragment>
  );
};

export default HelpRouterStatus;
