import React, { useState, useEffect, useContext } from "react";
import styles from "./header.module.scss";
import { Menu, Select } from "antd";
import { FcManager, FcList } from "react-icons/fc";
import { FaLanguage } from "react-icons/fa";
import Context from "../../../Utility/Reduxx";
import { UserLogOut } from "../../../Utility/Fetch";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import i18n from 'i18next';
import { Translator } from '../../../i18n/index'

const { SubMenu } = Menu;
const { Option } = Select;

const Header = () => {
  const { state, dispatch } = useContext(Context);
  const [User, setUser] = useState(localStorage.getItem("authUser.name"));
  const history = useHistory()

  useEffect(() => {
    setUser(localStorage.getItem("authUser.name"));
  }, [state.Login.User]);

  function handleChange(value) {
    console.log(`selected ${value}`);
    dispatch({ type: "setCid", payload: { Cid: value } });
  }

  useEffect(() => {
  if (state.Global.Lang){ 
      i18n.changeLanguage(state.Global.Lang)
  };
}, [state.Global.Lang]);

  const logout = async () => {
    console.log('logout')
    localStorage.clear();
    await UserLogOut();
    // setAuth(false);
    Swal.fire({
      title: "Sign Out Success",
      icon: "success",
      showConfirmButton: false,
      timer: 1200,
    })
    dispatch({ type: "setUser", payload: { User: "" } });
    history.push("/login");
  };



  return (
    <div className={styles.head}>
      <FcList
        className={
          state.Global.IsMD
            ? styles.Reverse
            : `${styles.Reverse} ${styles.HideReverse}`
        }
        onClick={() => {
          dispatch({
            type: "setShowNav",
            payload: {
              showNav: !state.Global.showNav,
            },
          });
        }}
      />

      <Menu
        mode="horizontal"
        className={styles.menu}
      >
        <SubMenu
          key="user"
          icon={<FcManager className={styles.user} />}
          title={User}
        >
          <Menu.Item key="setting2" onClick={()=>{
            history.push('/mysetting')
          }}>{Translator("ISMS.Setting")}</Menu.Item>
          <Menu.Item key="setting3" onClick={()=>logout()}>{Translator("ISMS.LogOut")}</Menu.Item>
        </SubMenu>
      </Menu>

      {User === "super@proscend.com" && (
        <Menu
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
      )}
      <Menu
        mode="horizontal"
        className={styles.menu}
      >
        <SubMenu
          key="language"
          icon={<FaLanguage className={styles.language} />}
          onClick={ (item) => {
            const localeValue = item.key;
            if (!localeValue) {
              dispatch({ type: "setLang", payload: { Lang: 'en' } })
            } else {
              dispatch({ type: "setLang", payload: { Lang: localeValue } })
            }
          } }
        >
          <Menu.Item key="zh-TW">ZH 繁體中文</Menu.Item>
          <Menu.Item key="en">EN 英文</Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
};

export default Header;
