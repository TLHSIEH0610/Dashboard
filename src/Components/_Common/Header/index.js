import React, { useEffect, useContext, useState, Fragment } from "react";
import styles from "./header.module.scss";
import { Menu, Select, Form, Modal, Row, Col, Button, Input } from "antd";
import { FcList } from "react-icons/fc";
import { FaLanguage } from "react-icons/fa";
import Context from "../../../Utility/Reduxx";
import axios from "axios";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import i18n from "i18next";
import { UserLogOut } from "../../../Utility/Fetch";
// import useURLloader from "../../../hook/useURLloader";
import { useTranslation } from "react-i18next";

const { SubMenu } = Menu;
const { Option } = Select;

const Header = () => {
  const { state, dispatch } = useContext(Context);
  const User = localStorage.getItem("authUser.name");
  const cid = localStorage.getItem("authUser.cid");
  const [form] = Form.useForm();
  // const [User, setUser] = useState(localStorage.getItem("authUser.name"));
  const [PWloading, setPWloading] = useState(false)
  const history = useHistory();
  const { t } = useTranslation();
  const [level, setLevel] = useState(localStorage.getItem("authUser.level"));
  const [CustomerList, setCustomerList] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [PieData, setPieData] = useState(undefined);
  const [ChangePassVisible, setChangePassVisible] = useState(false);
  const [HealthSum, setHealthSum] = useState();
  const [SignalSum, setSignalSum] = useState();

  useEffect(() => {
    setLevel(localStorage.getItem("authUser.level"));
  }, [state.Login.Level]);

  useEffect(() => {
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
  }, [state.Global.IsUpdate, level, state.Login.IsLogin]);

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
      .then((res) => {
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
      .catch((error) => {
        setUploading(false);
        console.log(error.status);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.Global.IsUpdate, state.Login.Cid, state.Login.IsLogin, level]);

  function handleChange(value) {
    console.log(`selected ${value}`);
    dispatch({ type: "setCid", payload: { Cid: value } });
  }

  useEffect(() => {
    if (state.Global.Lang) {
      i18n.changeLanguage(state.Global.Lang);
    }
  }, [state.Global.Lang]);

  function ChangeonFinish(value) {
    console.log(value);
    setPWloading(true)
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/user_mgnt",
      data: JSON.parse(
        `{"modify_user":{"cid":"${cid}", "user_list": [{"name":"${User}", "password":"${value.password}", "level":"super_super", "gid":[]}]}}`
      ),
    };

    axios(config)
    .then((res) => {
      setPWloading(false);
     console.log(res.data)
    })
    .catch((error) => {
      setPWloading(false);
      console.log(error.status);
      if (error.response && error.response.status === 401) {
        dispatch({ type: "setLogin", payload: { IsLogin: false } });
        UserLogOut();
        history.push("/userlogin");
      }
    });

  }

  return (
    <Fragment>
      <Modal
        title={t("ISMS.Change Password for Super User")}
        visible={ChangePassVisible}
        // onOk={() => setVisible(false)}
        onCancel={() => {
          setChangePassVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button
            key="submit"
            type="primary"
            // disabled={fileList.length === 0}
            loading={PWloading}
            onClick={() => {
              // setSchemeModalvisible(false);
              form.submit();
            }}
          >
            {t("ISMS.Submit")}
          </Button>,
        ]}
      >
        <Form onFinish={ChangeonFinish} form={form} layout="vertical">
          <div className={styles.formwrap}>
            <Row gutter={24} justify="center">
              <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                <Form.Item
                  label={t("ISMS.Password")}
                  name={"password"}
                  rules={[{ required: true, message: "Input new password" }]}
                >
                  <Input placeholder={t("ISMS.InputPassword")} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>

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

        <Menu mode="horizontal" className={styles.menu}>
          <SubMenu
            key="user"
            icon={
              <img
                style={{ width: "35px", marginRight: "2px" }}
                className={styles.usericon}
                src={require("../../../image/user.png")}
                alt=""
              />
            }
            title={state.Login.IsLogin && User}
          >
            {state.Login.IsLogin && User && (
              <Menu.Item
                key="setting3"
                onClick={() => {
                  axios
                    .post("/logout", { credentials: "include" })
                    .then(() => {
                      // localStorage.clear();
                      localStorage.removeItem("authUser.name");
                      localStorage.removeItem("authUser.cid");
                      localStorage.removeItem("authUser.level");
                      localStorage.removeItem("auth.isAuthed");
                      Swal.fire({
                        title: "Sign Out Success",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1200,
                      });
                      history.push("/userlogin");
                    })
                    .then(() => {
                      dispatch({
                        type: "setLogin",
                        payload: { IsLogin: false },
                      });
                    });
                }}
              >
                {t("ISMS.LogOut")}
              </Menu.Item>
            )}
            {state.Login.IsLogin && level === "super_super" && (
              <Menu.Item onClick={() => setChangePassVisible(true)}>
                {t("ISMS.ChangePassword")}
              </Menu.Item>
            )}
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
                {CustomerList?.response?.map((item, index) => {
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
        {state.Global.innerWidth > 490 &&
          level === "super_super" &&
          state.Login.IsLogin && (
            <Menu mode="horizontal" className={styles.menu}>
              <SubMenu
                key="language"
                icon={<FaLanguage className={styles.language} />}
                onClick={(item) => {
                  const localeValue = item.key;
                  if (!localeValue) {
                    dispatch({ type: "setLang", payload: { Lang: "en" } });
                  } else {
                    dispatch({
                      type: "setLang",
                      payload: { Lang: localeValue },
                    });
                  }
                }}
              >
                <Menu.Item key="zh-TW">ZH 繁體中文</Menu.Item>
                <Menu.Item key="en">EN 英文</Menu.Item>
              </SubMenu>
            </Menu>
          )}

        {/* {state.Global.innerWidth > 490 && (
        <Tooltip placement="bottomLeft" title={"Help"}>
          <FcQuestions
            className={styles.helpIcon}
            onClick={() => {
              const w = window.open("about:blank");
              w.location.href = "/menu";
              // history.push("/menu");
            }}
          />
        </Tooltip>
      )} */}
      </div>
    </Fragment>
  );
};

export default Header;
