import React, { Fragment } from "react";
import { Descriptions, Divider } from "antd";
import { MdCastConnected } from "react-icons/md";
import styles from "../menu.module.scss";

import { RiAlarmWarningFill, RiEdit2Fill } from "react-icons/ri";
import { FcDocument, FcSettings } from "react-icons/fc";
import { FaMapMarkerAlt } from "react-icons/fa";

import { ImCancelCircle } from "react-icons/im";
import { AiFillWarning } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import {
  MdSignalCellularConnectedNoInternet0Bar,
  MdSignalCellular1Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
} from "react-icons/md";

const HelpTopologyC = () => {
  return (
    <div className={styles.helpContainer}>
      <h2 className={styles.title}>Overview</h2>
      <p>
        A brief view of your devices with a filter helps you pick up
        target devices easily
      </p>
      <img
        alt=''
        className={styles.dashboardIMG}
        src={require("../../../image/topology.png")}
      />

      <Descriptions
        // title="Location"
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
              <span>Tabs</span>
            </Fragment>
          }
        >
          Default at device overview tab. Click to switch pages.
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Fragment>
              <span className={styles.index}>2</span>
              <span>Filter</span>
            </Fragment>
          }
        >
          Help you quickly filter out devices you are looking for through
          inputting specific conditions.
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Fragment>
              <span className={styles.index}>3</span>
              <span>Location</span>
            </Fragment>
          }
        >
          <p>
            Editable location, can customized by self input, or get location
            from GPS. Click
            <a href="/#" style={{ fontWeight: "bold", marginBottom: "10px" }}>
              edit
            </a>{" "}
            to modify.
          </p>
          <p>1.Select devices then click 'Update'</p>
          <img
            alt=''
            className={styles.location1}
            src={require("../../../image/location1.png")}
          />
          <p>
            2.Select a method to update location:(a)Auto Input(get from GPS)
            (b)Manual Input(anywhere you want)
          </p>
          <img
            alt=''
            className={styles.location2}
            src={require("../../../image/location2.png")}
          />
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Fragment>
              <span className={styles.index}>4</span>
              <span>Device</span>
            </Fragment>
          }
        >
          {/* Default to show device name, however, if device name hasn't been setup it will show device id instead. */}
          <p>Show the device name if exist, otherwise, show device id</p>

          <p>
            <RiEdit2Fill className={styles.renameIcon} />
            Click the icon to set a name for your device
          </p>
          <img
            alt=''
            className={styles.deviceRename}
            src={require("../../../image/deviceRename.png")}
          />
          <p>Hover to view the device id</p>
          <img
            alt=''
            className={styles.topologyHover}
            src={require("../../../image/topologyHover.png")}
          />
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Fragment>
              <span className={styles.index}>5</span>
              <span>Model</span>
            </Fragment>
          }
        >
          Device's model
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Fragment>
              <span className={styles.index}>6</span>
              <span>Last Update</span>
            </Fragment>
          }
        >
          The last time O'smart received data from devices
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Fragment>
              <span className={styles.index}>7</span>
              <span>Information</span>
            </Fragment>
          }
        >
          <h3>Health</h3>
          <FaCheckCircle className={styles.up} />
          Up: Equal to "Up" state on the device
          <br />
          <AiFillWarning className={styles.critical} />
          Critical: Equal to "Fatal/Error" state on the device
          <br />
          <AiFillWarning className={styles.warning} />
          Warning: Equal to "Warning" state on the device
          <br />
          <ImCancelCircle className={styles.offline} />
          Offline: Equal to "Offline" state on the device
          <Divider />
          <h3>Signal</h3>
          <MdSignalCellular4Bar className={styles.up} />
          Excellent: rssi: larger than -65 dbm
          <br />
          <MdSignalCellular3Bar className={styles.critical} />
          Good: rssi: -75 dbm ~ - -65 dbm
          <br />
          <MdSignalCellular1Bar className={styles.warning} />
          Fair: rssi: -85 dbm ~ - -75 dbm
          <br />
          <MdSignalCellularConnectedNoInternet0Bar className={styles.offline} />
          Poor: rssi: smaller than -85 dbm
          <Divider />
          <h3>
            <RiAlarmWarningFill
              className={styles.alarmlog}
              style={{ color: "red" }}
            />
            <span>Alarm</span>
          </h3>
           Alarm log. View the current alarm and alarm log here.
          <Divider />
          <h3>
            <FcDocument className={styles.Status} />
            <span>Device Status</span>
          </h3>
          <p>
            A brief view of the device status such as Statistic, Connection, Strength, GPS, DNS,
            Identity
          </p>
          <Divider />
          <h3>
            <FaMapMarkerAlt className={styles.Map} />
            <span>GPS Track:</span>
          </h3>
          <p>
            Display current location on the map. Alternatively, you can choose a
            time period to track GPS history
          </p>
          <img
            alt=''
            className={styles.topologyMap}
            src={require("../../../image/topologyMap.png")}
          />
          <Divider />
          <h3>
            <MdCastConnected className={styles.IoT} />
            <span>IoT:</span>
          </h3>
          <p>View IoT Data if available</p>
          <Divider />
          <h3>
            <FcSettings className={styles.Setting} />
            <span>Setting:</span>
          </h3>
          <p>
            Link to setting page. Refer to 'Setting' instruction from the left sidebar.
          </p>
          <Divider />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default HelpTopologyC;
