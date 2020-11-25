import React, { useEffect, useContext, useState } from "react";
import styles from "./header.module.scss";
import { Menu, Select } from "antd";
import { FcManager, FcList } from "react-icons/fc";
import { FaLanguage } from "react-icons/fa";
import Context from "../../../Utility/Reduxx";
import axios from 'axios'
// import Swal from "sweetalert2";
// import { useHistory } from "react-router-dom";
import i18n from 'i18next';
// import { Translator } from '../../../i18n/index'
// import useURLloader from "../../../hook/useURLloader";

const { SubMenu } = Menu;
const { Option } = Select;

const Header = () => {
  const { state, dispatch } = useContext(Context);
  const User = localStorage.getItem("authUser.name")
  // const [User, setUser] = useState(localStorage.getItem("authUser.name"));
  // const history = useHistory()
  const level = localStorage.getItem('authUser.level')
  // const CustomerListUrl = `/inf_mgnt?list_inf={}`;
  // const [CustomerListloading, CustomerListResponse] = useURLloader(CustomerListUrl, state.Login.Cid);
  const [CustomerList, setCustomerList] = useState(null)
  const [uploading, setUploading] = useState(false)
  // console.log(CustomerListResponse)

  // setAuth(localStorage.getItem("auth.isAuthed"));


  useEffect(() => {
    setUploading(true)
    const CustomerListUrl = `/inf_mgnt?list_inf={}`;
    axios.post(CustomerListUrl).then((res)=>{
      setUploading(false)
      setCustomerList(res.data)
    })
    .catch((error)=>{
      setUploading(false)
      console.log(error)
    })
  }, [state.Login.Cid, state.Global.IsUpdate]);

  function handleChange(value) {
    console.log(`selected ${value}`);
    dispatch({ type: "setCid", payload: { Cid: value } });
  }

  useEffect(() => {
  if (state.Global.Lang){ 
      i18n.changeLanguage(state.Global.Lang)
  };
}, [state.Global.Lang]);

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
          title={state.Login.IsLogin && User}
        >
          {/* <Menu.Item key="setting2" onClick={()=>{
            history.push('/management')
          }}>{Translator("ISMS.Setting")}</Menu.Item> */}
          {/* <Menu.Item key="setting3" onClick={()=>Logout()}>{Translator("ISMS.LogOut")}</Menu.Item> */}
        </SubMenu>
      </Menu>

      {(level === "super_super" && state.Login.IsLogin) && (
        <Menu
          mode="horizontal"
          className={styles.menu}
        >
          <Menu.Item key="s1" className={styles.superSelect}>
            <Select
              defaultValue="All Customer"
              style={{ width: 130 }}
              onChange={handleChange}
              loading={uploading}
              disabled={uploading}
            >
              <Option value="">All Customer</Option>
              {CustomerList &&
                CustomerList.response.map((item, index)=>{
                  return(
                  <Option key={index} value={`"cid":"${item.cid}"`}>{item.inf_list.company}</Option>
                  )
                })
              }
            </Select>
          </Menu.Item>
        </Menu>
      )}
      {state.Global.innerWidth > 490 && <Menu
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
      </Menu>}
    </div>
  );
};

export default Header;
