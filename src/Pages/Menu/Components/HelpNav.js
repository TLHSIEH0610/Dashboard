import React from "react";
// import styles from "../menu.module.scss";

import {  Menu } from "antd";
// import { FcExternal } from "react-icons/fc";

import { AiFillSetting } from "react-icons/ai";
import { MdCastConnected } from "react-icons/md";
import { FaFileUpload, FaChartLine } from "react-icons/fa";
import { BsFillInfoSquareFill } from "react-icons/bs";

const { SubMenu } = Menu;

const HelpNav = ({ setCurrentDisplay }) => {
  return (
    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" style={{paddingTop:'30px'}}>
      <Menu.Item
        style={{margin:0}}
        key="Overview"
        icon={<BsFillInfoSquareFill style={{ fontSize: "1.3rem"}} />}
        onClick={() => setCurrentDisplay("Overview")}
      >
        Overview
      </Menu.Item>

      <Menu.Item
      style={{margin:0}}
        key="Dashboard"
        icon={<FaChartLine style={{ fontSize: "1.4rem" }} />}
        onClick={() => setCurrentDisplay("Dashboard")}
      >
        Dashboard
      </Menu.Item>

      <SubMenu
        key="sub2"
        icon={<MdCastConnected style={{ fontSize: "1.5rem", marginRight:'10px'}} />}
        title="TOPOLOGY"
      >
        <Menu.Item
          key="Devices"
          onClick={() => setCurrentDisplay("Devices")}
        >
          Devices
        </Menu.Item>
        <Menu.Item
          key="Router Status"
          onClick={() => setCurrentDisplay("Router Status")}
        >
          Router Status
        </Menu.Item>
        <Menu.Item key="Setting" onClick={() => setCurrentDisplay("Setting")}>
          Setting
        </Menu.Item>
      </SubMenu>
      <SubMenu
        key="sub3"
        icon={<FaFileUpload style={{ fontSize: "1.5rem", marginRight:'10px' }} />}
        title="UPGRADE"
      >
        <Menu.Item key="UPGRADE" onClick={() => setCurrentDisplay("UPGRADE")}>
        UPGRADE
        </Menu.Item>
        <Menu.Item
          key="FileRepository"
          onClick={() => setCurrentDisplay("FileRepository")}
        >
          File Repository
        </Menu.Item>
      </SubMenu>

      <Menu.Item
        key="Management"
        icon={<AiFillSetting style={{ fontSize: "1.6rem" }} />}
        onClick={() => setCurrentDisplay("Management")}
      >
        Management
      </Menu.Item>
    </Menu>
  );
};

export default HelpNav;
