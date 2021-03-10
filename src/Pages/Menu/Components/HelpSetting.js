import React, { Fragment } from "react";
import styles from "../menu.module.scss";
import {  Descriptions, Divider } from "antd";


const HelpSetting = () => {
  return (
    <Fragment>
      <div className={styles.helpContainer}>
        <h2 className={styles.title}>Overview</h2>
        <p>Get/Set/Reboot devices. Moreover, you can save a device config to the repository and import it as many times as you want</p>
        <img
          alt=''
          className={styles.setting}
          src={require("../../../image/setting.png")}
        />
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
                <span>Import/New</span>
              </Fragment>
            }
          >
            <p>
              Import a config either from repository or device. Alternatively,
              you can create a new one
            </p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>2</span>
                <span>Source</span>
              </Fragment>
            }
          >
            <p>The config source is from the repository or an existed device </p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>3</span>
                <span>Import Device/File</span>
              </Fragment>
            }
          >
            <p>Select a config file from the repository or any device that is available(up). </p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>4</span>
                <span>Model</span>
              </Fragment>
            }
          >
            <p>
              If you are creating a new config, select a specific model which
              you want to implement.
            </p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>5</span>
                <span>Group</span>
              </Fragment>
            }
          >
            <p>Filter devices you want by groups</p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>6</span>
                <span>Location</span>
              </Fragment>
            }
          >
            <p>Filter devices you want by location</p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>7</span>
                <span>Device</span>
              </Fragment>
            }
          >
            <p>Select devices you want to operate</p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>8</span>
                <span>Submit/Reboot</span>
              </Fragment>
            }
          >
            <p>Submit your new config to implement on devices, or click the reboot button to reboot devices</p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>8</span>
                <span>Clear/Save</span>
              </Fragment>
            }
          >
            <p>Clear form: Clear all setting</p>
            <p>Save Config: Save the current config to the repository as a YAML file.</p>
            <img
              alt=''
              className={styles.saveToRepository}
              src={require("../../../image/saveToRepository.png")}
            />
          </Descriptions.Item>
        </Descriptions>
          <Divider/>
        <h2 className={styles.title2}>LAN / IPv4</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="LAN IPv4">
            IP Address:192.168.1.1 IP Mask:255.255.255.0 Both of them are
            default, you can change them according to your local IP Address and
            IP Mask.
          </Descriptions.Item>
          <Descriptions.Item label="DHCP Server">
            Turn on/off DHCP Server Configuration. Enable to make router can
            lease IP address to DHCP clients which connect to LAN.
          </Descriptions.Item>
          <Descriptions.Item label="IP Address Pool">
            Define the beginning and the end of the pool of IP addresses which
            will lease to DHCP clients.
          </Descriptions.Item>
          <Descriptions.Item label="Static IP Addresses">
            DHCP server support static IP address assignment. The static IP
            address can be added by clicking the +Add Static IP Address button.
            Each static IP consist of mode(on/off), MAC and IP address.
            1.Mode:Turn on/off the static IP address 2.MAC: The MAC address of
            target host or PC 3.IP: The desired IP address for target host or PC
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>LAN / IPv6</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="LAN IPv6">
            This section provides two types, including Delegate Prefix from WAN
            and Static. Static Address: You need to input the static address
            when you select the static type.
          </Descriptions.Item>
          <Descriptions.Item label="Delegate Prefix from WAN">
            Select this option to automatically obtain an IPv6 network prefix
            from the service provider or an uplink router.
          </Descriptions.Item>
          <Descriptions.Item label="Static">
            Select this option to configure a fixed IPv6 address for the
            cellular router
          </Descriptions.Item>
          <Descriptions.Item label="Address Assign Setup">
            Stateless: The cellular router uses IPv6 stateless auto
            configuration. RADVD (Router Advertisement Daemon) is enabled to
            have the cellular router send IPv6 prefix information in router
            advertisements periodically and in response to router solicitations.
            Stateful: The cellular router uses IPv6 stateful auto configuration.
            The LAN IPv6 clients can obtain IPv6 addresses through DHCPv6.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>WAN / Priority</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Priority">
            Auto: Please specify the connection order. LTE Only: Only use LTE
            connection. ETH Only: Only use WAN Ethernet connection. WiFi Only:
            Only use WAN WiFi connection.
          </Descriptions.Item>
          <Descriptions.Item label="Connect Order">
            1st: The first priority of wan interface for connection. 2nd: The
            second priority of wan interface for connection. 3rd: The 3rd
            priority of wan interface for connection.
          </Descriptions.Item>
          <Descriptions.Item label="LTE Net Mode">
            Bridge Only: APN1 act as bridge for internet access. Router Only:
            APN1 act as router for internet access.
          </Descriptions.Item>
          <Descriptions.Item label="Address Assign Setup">
            Stateless: The cellular router uses IPv6 stateless auto
            configuration. RADVD (Router Advertisement Daemon) is enabled to
            have the cellular router send IPv6 prefix information in router
            advertisements periodically and in response to router solicitations.
            Stateful: The cellular router uses IPv6 stateful auto configuration.
            The LAN IPv6 clients can obtain IPv6 addresses through DHCPv6.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2} style={{marginBottom:'5px'}}>WAN / Ethernet</h2>
        <p className={styles.wordingBelowTitle} className={styles.wordingBelowTitle}>
          This section provides three options, including DHCP Client,PPPoE
          Client and Static IPv4.The default is DHCP Client.When selecting DHCP Client, you can set up DNS Server Configuration.For IPv4 DNS Server, it provides three options to set up and each
          option has provided with From ISP,User Defined and None to configure.
        </p>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="WAN Ethernet">
            DHCP Client: DHCP server-assigned IP address, netmask, gateway, and
            DNS. PPPoE Client: Your ISP will provide you with a username and
            password. This option is typically used for DSL services. Static
            IPv4: User-defined IP address, netmask, and gateway address.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2} style={{marginBottom:'5px'}}>WAN Ethernet / DHCP Client</h2>
        <p className={styles.wordingBelowTitle}>
          When you select PPPoE Client, the interface shows the item of
          configuration to fill in your User Name and Password. service name is
          an option setting          When you select Static IPv4, the interface shows the information of
          configuration, including IP Address, IP Mask and Gateway Address.
        </p>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="IPv4 DNS Server #1,#2,#3">
            Each setting DNS Server has three options, including From ISP, User
            Defined and None. When you select From ISP, the IPv4 DNS server IP
            is obtained from ISP. When you select User Defined, the IPv4 DNS
            server IP is input by user.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>WAN Ethernet/ Static IPv4</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="IP Address/Mask/Gateway ">
            Fill in the IP Address/Mask/Gateway .
          </Descriptions.Item>
          <Descriptions.Item label="IPv4 DNS Server #1,#2,#3">
            The IPv4 DNS server IP is input by user.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2} style={{marginBottom:'5px'}}>WAN Ethernet / DHCP Client</h2>
        <p className={styles.wordingBelowTitle}>
          When you select PPPoE Client, the interface shows the item of
          configuration to fill in your User Name and Password. service name is
          an option setting          When you select Static IPv4, the interface shows the information of
          configuration, including IP Address, IP Mask and Gateway Address.
        </p>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="IPv4 DNS Server #1,#2,#3">
            Each setting DNS Server has three options, including From ISP, User
            Defined and None. When you select From ISP, the IPv4 DNS server IP
            is obtained from ISP. When you select User Defined, the IPv4 DNS
            server IP is input by user.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>WAN Ethernet/ Static IPv4</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="IP Address/Mask/Gateway ">
            Fill in the IP Address/Mask/Gateway .
          </Descriptions.Item>
          <Descriptions.Item label="IPv4 DNS Server #1,#2,#3">
            The IPv4 DNS server IP is input by user.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2} style={{marginBottom:'5px'}}>WAN Ethernet / DHCP Client</h2>
        <p className={styles.wordingBelowTitle}>
          When you select PPPoE Client, the interface shows the item of
          configuration to fill in your User Name and Password. service name is
          an option setting. When you select Static IPv4, the interface shows the information of
          configuration, including IP Address, IP Mask and Gateway Address.
        </p>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="IPv4 DNS Server #1,#2,#3">
            Each setting DNS Server has three options, including From ISP, User
            Defined and None. When you select From ISP, the IPv4 DNS server IP
            is obtained from ISP. When you select User Defined, the IPv4 DNS
            server IP is input by user.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>LTE Ethernet</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Auto">
            Automatically connect the possible band.
          </Descriptions.Item>
          <Descriptions.Item label="4G Only">
            Connect to 4G network only.
          </Descriptions.Item>
          <Descriptions.Item label="3G Only">
            Connect to 3G network only.
          </Descriptions.Item>
          <Descriptions.Item label="2G Only">
            Connect to 2G network only.
          </Descriptions.Item>
          <Descriptions.Item label="MTU">
            Maximum Transmission Unit that can be sent over the LTE interface.
            It allows user to adjust the MTU size to fit into their existing
            network environment.
          </Descriptions.Item>
        </Descriptions>

        <h2 className={styles.title2}>LTE / APN Config </h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="SIM PIN enable">
            Enable to display SIM PIN setting. Disable to hide SIM PIN setting.
          </Descriptions.Item>
          <Descriptions.Item label="SIM PIN">
            A password personal identification number (PIN) for ordinary use to
            protect your SIM card.
          </Descriptions.Item>
          <Descriptions.Item label="SIM PUK">
            If user input the wrong SIM PIN more than 3 times, the user needs
            another password personal unblocking code (PUK) for PIN unlocking.
            Please check your operator for forgotten PUK number.
          </Descriptions.Item>
          <Descriptions.Item label="APN">
            The Access Point Name (APN) is the name for the settings to set up a
            connection to the gateway between your carrier's cellular network
            and the Public Internet. Leaving it empty will search internally
            database automatically by SIM card for connection.
          </Descriptions.Item>
          <Descriptions.Item label="Username">
            Username for authentication. The username can be input by user or
            the system will search from internal database if the APN setting is
            empty.
          </Descriptions.Item>
          <Descriptions.Item label="Password">
            Password for authentication. The password can be input by user or
            the system will search from internal database if the APN setting is
            empty.
          </Descriptions.Item>
          <Descriptions.Item label="Auth: (None/PAP/CHAP)">
            If Auth mode is not None, most servers require username and password
            above.
          </Descriptions.Item>
          <Descriptions.Item label="Enable IPv6">
            If IPv6 is not selected, then only pure IPv4 connection.
          </Descriptions.Item>
          <Descriptions.Item label="Data Limitation - Max Data Limitation (MB)">
            Configure maximum Data Limitation.
          </Descriptions.Item>
          <Descriptions.Item label="Data Limitation -Reset">
            Set up the reset time during the month..
          </Descriptions.Item>
          <Descriptions.Item label="Roaming">
            NO: make connection even device is in roaming mode. YES: Not to make
            connection when device is in roaming.
          </Descriptions.Item>
          <Descriptions.Item label="Recover APN">
            No: Not to recover when APN1 is continuous link down Yes: Recover
            APN1 by using specified method
          </Descriptions.Item>
          <Descriptions.Item label="Down Time">
            When link down number reach the specified number then the system
            will proceed recover action: Reboot: Reboot the system Recover to
            default APN: Replace active APN by using factory default APN Recover
            to previous working APN: Replace active APN by using previous
            working APN
          </Descriptions.Item>
        </Descriptions>


        <h2 className={styles.title2}>Wifi</h2>
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="AP Enable">
          Turn on/off all WiFi Network. Select from Disable or Enable. The default is Enable.
          </Descriptions.Item>
          <Descriptions.Item label="WPS Button">
          Hardware button for WPS. Select the SSID you want to bind.
          </Descriptions.Item>
          <Descriptions.Item label="Tx Power">
          The TX power setting specifies the strength of the signal.
          </Descriptions.Item>
          <Descriptions.Item label="Isolate">
          Isolation is a technique for preventing mobile devices connected to an AP from communicating directly with each other.
          </Descriptions.Item>
          <Descriptions.Item label="HT Mode (HT Capability)">
          20M: Only 20MHz Operation is Supported,40M: Both 20MHz and 40MHz Operation is Supported.
          </Descriptions.Item>
          <Descriptions.Item label="Country Code">
          Select Country Area for supported Channels.
          </Descriptions.Item>
          <Descriptions.Item label="Name(SSID)">
          SSID is WiFi indentification. The maximum length is 32.
          </Descriptions.Item>
          <Descriptions.Item label="Hidden SSID">
          SSID hiding is the process of hiding the network name from being publicly broadcast.
          </Descriptions.Item>
          <Descriptions.Item label="Channel">
          Auto (Automatically select the best channel) or manually select channel number.
          </Descriptions.Item>
          <Descriptions.Item label="Encryption">
          None / WPA2-PSK-AES.
          </Descriptions.Item>
          <Descriptions.Item label="Passphrase">
          Strings with a legal length of 8 to 63 or a length of 64 should belong to [0-9 A-F a-f].
          </Descriptions.Item>
          <Descriptions.Item label="Key Update">
          0 means no update or 30~86400 seconds update period.
          </Descriptions.Item>
          <Descriptions.Item label="VLAN Subnet">
          Select the VLAN Subnet you want to bind.
          </Descriptions.Item>
        </Descriptions>



      </div>
    </Fragment>
  );
};

export default HelpSetting;
