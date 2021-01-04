import React, { useContext, useState } from "react";
import { Form, Input, Button, Card, Row, Col } from "antd";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import Context from "../../../Utility/Reduxx";
import styles from "./login.module.scss";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { Translator } from "../../../i18n/index";
import { useTranslation } from "react-i18next";

interface Ilogin {
  name: string;
  password: string;
}

const LoginInput = () => {
  const { state, dispatch } = useContext(Context);
  const [uploading, setUploading] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();
  const OnFinish = (values: Ilogin) => {
    setUploading(true);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/login",
      data: JSON.parse(
        `{"user":{"name":"${values.name}","password":"${values.password}"}}`
      ),
    };
    axios(config)
      .then((res) => {
        // console.log(res.data, res.data.response.name);
        Swal.fire({
          title: t("ISMS.SignInSuccess"),
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
        });
        localStorage.setItem("authUser.name", res.data.response.name);
        localStorage.setItem("authUser.cid", res.data.response.cid);
        localStorage.setItem("authUser.level", res.data.response.level);
        localStorage.setItem("auth.isAuthed", "true");
        setUploading(false);
        dispatch({
          type: "setUser",
          payload: { User: res.data.response.name },
        });
        dispatch({ type: "setCid", payload: { Cid: "" } });
        dispatch({ type: "setLogin", payload: { IsLogin: true } });
        if (state.Login.LogPath && state.Login.LogPath !== "/login") {
          history.push(state.Login.LogPath);
        } else {
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: t("ISMS.SignInError"),
          icon: "error",
          showConfirmButton: false,
          timer: 1200,
        });
        setUploading(false);
        history.push("/userlogin");
      });
  };

  return (
    <Card bodyStyle={{ width: "100%", height: "100%" }} className={styles.card}>
      <Row gutter={24}>
        <Col
          xs={{ span: 21, offset: 5 }}
          sm={{ span: 16, offset: 6 }}
          md={{ span: 10, offset: 9 }}
          lg={{ span: 8, offset: 9 }}
          xl={{ span: 8, offset: 9 }}
          xxl={{ span: 6, offset: 10 }}
        >
          <img
            src={require("../../../image/OsmartLogo.png")}
            className={styles.OsmartLogo}
            alt=''
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col
          xs={{ span: 21, offset: 5 }}
          sm={{ span: 16, offset: 6 }}
          md={{ span: 10, offset: 9 }}
          lg={{ span: 8, offset: 9 }}
          xl={{ span: 8, offset: 9 }}
          xxl={{ span: 6, offset: 10 }}
        >
          <img
            src={require("../../../image/OsmartLogo2.png")}
            className={styles.OsmartLogo2}
            alt=''
          />
        </Col>
      </Row>

      <Form
        // {...layout}
        className={styles.form}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={OnFinish}
      >
        <Row gutter={24}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 12, offset: 7 }}
            lg={{ span: 12, offset: 6 }}
            xl={{ span: 12, offset: 6 }}
            xxl={{ span: 10, offset: 7 }}
          >
            <Form.Item
              className={styles.item}
              name="name"
              rules={[
                {
                  required: true,
                  message: "username is required!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 12, offset: 7 }}
            lg={{ span: 12, offset: 6 }}
            xl={{ span: 12, offset: 6 }}
            xxl={{ span: 10, offset: 7 }}
          >
            <Form.Item
              className={styles.item}
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 12, offset: 7 }}
            lg={{ span: 12, offset: 6 }}
            xl={{ span: 12, offset: 6 }}
            xxl={{ span: 10, offset: 7 }}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={uploading}>
                {/* Log-in */}
                {Translator("ISMS.Login")}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default LoginInput;
