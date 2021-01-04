import React, { useEffect, useContext, useState } from "react";
import styles from "./header.module.scss";
import { Menu, Select } from "antd";
import { FcList } from "react-icons/fc";
import { FaLanguage } from "react-icons/fa";
import Context from "../../../Utility/Reduxx";
import axios from "axios";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import i18n from "i18next";
// import { UserLogOut } from "../../../Utility/Fetch";
import { Translator } from "../../../i18n/index";
// import useURLloader from "../../../hook/useURLloader";

const { SubMenu } = Menu;
const { Option } = Select;

const Header = () => {
  const { state, dispatch } = useContext(Context);
  const User = localStorage.getItem("authUser.name");
  // const [User, setUser] = useState(localStorage.getItem("authUser.name"));
  const history = useHistory();

  const level = localStorage.getItem("authUser.level");
  // const CustomerListUrl = `/inf_mgnt?list_inf={}`;
  // const [CustomerListloading, CustomerListResponse] = useURLloader(CustomerListUrl, state.Login.Cid);
  const [CustomerList, setCustomerList] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [PieData, setPieData] = useState(undefined);
  // const [CurrentAlarm, setCurrentAlarm] = useState(null);
  const [HealthSum, setHealthSum] = useState();
  const [SignalSum, setSignalSum] = useState();

  useEffect(() => {
    const level = localStorage.getItem("authUser.level");

    if (level === "super_super") {
      setUploading(true);
      const config1 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/inf_mgnt",
        data: JSON.parse(`{"list_inf":{}}`),
      };

      axios(config1)
        .then((res) => {
          setUploading(false);
          setCustomerList(res.data);
        })
        .catch((error) => {
          setUploading(false);
          console.log(error.status);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.Global.IsUpdate]);

  useEffect(() => {
    setUploading(true);
    const cid = localStorage.getItem("authUser.cid");
    const config1 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"statistic":{"filter":{${
          level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
        }}}}}`
      ),
    };

    axios(config1)
      .then(((res) => {
          setUploading(false);
          const PieData = res.data.response.statistic.obj;
          setPieData(PieData);
          const HealthSum = (() =>
            [
              PieData.health?.up,
              PieData.health?.warning,
              PieData.health?.critical,
              PieData.health?.offline,
            ].reduce(function (a, b) {
              return a + b;
            }, 0))();
          setHealthSum(HealthSum);

          const SimSum = (() =>
            [
              PieData.sim?.excellent,
              PieData.sim?.good,
              PieData.sim?.fair,
              PieData.sim?.poor,
            ].reduce(function (a, b) {
              return a + b;
            }, 0))();
          setSignalSum(SimSum);

          dispatch({
            type: "setPieData",
            payload: { PieData: PieData, HealthSum: HealthSum, SimSum: SimSum },
          });
        })
      )
      .catch((error) => {
        setUploading(false);
        console.log(error.status);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.Global.IsUpdate, state.Login.Cid]);

  function handleChange(value) {
    console.log(`selected ${value}`);
    dispatch({ type: "setCid", payload: { Cid: value } });
  }

  useEffect(() => {
    if (state.Global.Lang) {
      i18n.changeLanguage(state.Global.Lang);
    }
  }, [state.Global.Lang]);

  return (
    <div className={styles.head}>
      {state.Login.IsLogin && PieData && state.Global.innerWidth > 768 && (
        <p className={styles.headerStatistic}>
          UP: {PieData?.health?.up}/{HealthSum}, EXCELLENT:{" "}
          {PieData?.sim?.excellent}/{SignalSum}
        </p>
      )}
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

      {/* <Menu mode="horizontal" className={styles.menu}>
        {state.Login.IsLogin  && <SubMenu
          key="Notification"
          icon={
            <Fragment>
              <FaBell className={styles.NotiIcon} />
              {CurrentAlarm?.length && <Tag color="#f50" className={styles.NotiTag}>
                {CurrentAlarm.length}
              </Tag>}
            </Fragment>
          }
          onClick={() => {}}
        >
           <Menu.Item onClick={() => history.push('./alarm')}>View all Alarm</Menu.Item>
          {CurrentAlarm &&
            CurrentAlarm.map((item, index) => {
              let time = new Date(item.trigger_time * 1000);
              return (
                <Menu.Item
                  key={index}
                  icon={
                    item.level === "CRITICAL" ? (
                      <AiFillWarning className={styles.critical} />
                    ) : (
                      <AiFillWarning className={styles.warning} />
                    )
                  }
                  onClick={
                    () => {
                      dispatch({
                        type: "setMaptoTopo",
                        payload: { device: item.id },
                      });
                      history.push('./topology');
                    }
                    // =>history.push('./alarm')
                  }
                >
                  {item.id} | {time.getFullYear()}-{time.getMonth() + 1}-
                  {time.getDate()}
                </Menu.Item>
              );
            })}
        </SubMenu>}
      </Menu> */}

      <Menu mode="horizontal" className={styles.menu}>
        <SubMenu
          key="user"
          icon={
            <img
              className={styles.usericon}
              src={require("../../../image/user.png")}
              alt=''
            />
          }
          title={state.Login.IsLogin && User}
        >
          {/* <Menu.Item key="setting2" onClick={()=>{
            history.push('/management')
          }}>{Translator("ISMS.Setting")}</Menu.Item> */}
          <Menu.Item
            key="setting3"
            onClick={() => {
              console.log("執行");
              axios
                .post("/logout", { credentials: "include" })
                .then(() => {
                  console.log("回復");
                  localStorage.clear();

                  Swal.fire({
                    title: "Sign Out Success",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1200,
                  });
                  history.push("/userlogin");
                })
                .then(() => {
                  dispatch({ type: "setLogin", payload: { IsLogin: false } });
                });
            }}
          >
            {Translator("ISMS.LogOut")}
          </Menu.Item>
        </SubMenu>
      </Menu>

      {level === "super_super" && state.Login.IsLogin && (
        <Menu mode="horizontal" className={styles.menu}>
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
                CustomerList.response.map((item, index) => {
                  return (
                    <Option key={index} value={`"cid":"${item.cid}"`}>
                      {item.inf_list.company}
                    </Option>
                  );
                })}
            </Select>
          </Menu.Item>
        </Menu>
      )}
      {state.Global.innerWidth > 490 && (
        <Menu mode="horizontal" className={styles.menu}>
          <SubMenu
            key="language"
            icon={<FaLanguage className={styles.language} />}
            onClick={(item) => {
              const localeValue = item.key;
              if (!localeValue) {
                dispatch({ type: "setLang", payload: { Lang: "en" } });
              } else {
                dispatch({ type: "setLang", payload: { Lang: localeValue } });
              }
            }}
          >
            <Menu.Item key="zh-TW">ZH 繁體中文</Menu.Item>
            <Menu.Item key="en">EN 英文</Menu.Item>
          </SubMenu>
        </Menu>
      )}
    </div>
  );
};

export default Header;
