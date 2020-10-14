import React, { Fragment, useState, useEffect, useContext } from "react";
import styles from "./header.module.scss";
import { Menu, Badge, Select } from "antd";
import { FcManager } from "react-icons/fc";
import { AiTwotoneBell } from "react-icons/ai";
import { FaLanguage } from "react-icons/fa";
import Context from '../../../Utility/Reduxx'
const { SubMenu } = Menu;
const { Option } = Select;

const Header = () => {
  const { state, dispatch } = useContext(Context)
  const [current, setCurrent] = useState("mail");
  const [User, setUser] = useState(localStorage.getItem('authUser.cid'))

  useEffect(()=>{
      setUser(localStorage.getItem('authUser.cid'))
  },[state.Login.User])

  function handleChange(value) {
    console.log(`selected ${value}`);
    dispatch({type:'setCid', payload:{Cid: value}})
  }

  const handleClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Fragment>
      <div className={styles.head}>
        <Menu
          onClick={handleClick}
          selectedKeys={[current]}
          mode="horizontal"
          className={styles.menu}
        >
          <SubMenu
            key="inform"
            icon={
              <a href="#">
                <Badge count={1}>
                  <AiTwotoneBell className={styles.inform} />
                </Badge>
              </a>
            }
          >
            <Menu.Item key="test">
              New Alarm
              <br />
            </Menu.Item>
          </SubMenu>
        </Menu>
        <Menu
          onClick={handleClick}
          selectedKeys={[current]}
          mode="horizontal"
          className={styles.menu}
        >
          <SubMenu
            key="user"
            icon={<FcManager className={styles.user} />}
            title={User} 
          >
              <Menu.Item key="setting1">Profile</Menu.Item>
              <Menu.Item key="setting2">Setting</Menu.Item>
              <Menu.Item key="setting3">Log-out</Menu.Item>
          </SubMenu>
          </Menu>
         { User === 'proscend' && 
                 <Menu
                 onClick={handleClick}
                 selectedKeys={[current]}
                 mode="horizontal"
                 className={styles.menu}
               >
                 <Menu.Item key="s1" className={styles.superSelect}>
         <Select
            defaultValue="Super"
            style={{ width: 100 }}
            onChange={handleChange}
          >
            <Option value="">Super</Option>
            <Option value='"cid":"proscend"'>Proscend-1</Option>
            <Option value='"cid":"proscend-2"'>Proscend-2</Option>
            <Option value='"cid":"proscend-3"'>Proscend-3</Option>
          </Select>
          </Menu.Item>
          </Menu>
          }
          <Menu
          onClick={handleClick}
          selectedKeys={[current]}
          mode="horizontal"
          className={styles.menu}
        >
          <SubMenu
            key="language"
            icon={<FaLanguage className={styles.language} />}
            // title={UserName}
          >
            <Menu.Item key="traditionalChinese">ZH 繁體中文</Menu.Item>
            <Menu.Item key="English">EN 英文</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </Fragment>
  );
};

export default Header;
