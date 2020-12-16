import React, { useContext, useState } from "react";
import { Form, Input, Button, Card } from "antd";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import Context from "../../../Utility/Reduxx";
import styles from "./login.module.scss";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { Translator } from '../../../i18n/index'
import { useTranslation } from 'react-i18next';

const layout = {
  wrapperCol: {
    xs: { span: 5, offset: 0 },
    sm: { span: 14, offset: 5 },
    md: { span: 14, offset: 5 },
    lg: { span: 14, offset: 5 },
    xl: { span: 10, offset: 6 },
  },
};

const LoginInput = () => {
  const { state, dispatch } = useContext(Context);
  const [uploading, setUploading] = useState(false)
  const history = useHistory();
  const { t } = useTranslation();
  const OnFinish = (values) => {
    // console.log(values);
    setUploading(true)
    // const LogInUrl = `/login?user={"name":"${values.name}","password":"${values.password}"}`;
    // console.log(LogInUrl);
    const config = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      url: '/login',
      data: JSON.parse(`{"user":{"name":"${values.name}","password":"${values.password}"}}`),
    }
    axios(config)
      .then((res) => {
        // console.log(res.data, res.data.response.name);
        Swal.fire({
          title: t("ISMS.SignInSuccess"), 
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
        })
        localStorage.setItem("authUser.name", res.data.response.name);
        localStorage.setItem("authUser.cid", res.data.response.cid);
        localStorage.setItem("authUser.level", res.data.response.level);
        localStorage.setItem("auth.isAuthed", true);
        setUploading(false)
        dispatch({ type: "setUser", payload: { User: res.data.response.name } });
        dispatch({ type: "setCid", payload: { Cid: "" } })
        dispatch({ type: "setLogin", payload: { IsLogin: true } });
        if (state.Login.LogPath && state.Login.LogPath!=='/login') {
          // console.log(state.Login.LogPath)
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
        })
        setUploading(false)
        history.push("/userlogin");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card bodyStyle={{ width: "100%" }} className={styles.card}>
      <Form
        {...layout}
        className={styles.form}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={OnFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          className={styles.item}
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>

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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={uploading}>
            {/* Log-in */}
            {Translator('ISMS.Login')}
          </Button>
        </Form.Item>
      </Form>
      {/* <div
        className={styles.registerBtn}
        onClick={() => {
          history.push("/register");
        }}
      >
        <span>{Translator('ISMS.goRegister1')}</span> {Translator('ISMS.goRegister2')}
        
      </div> */}
    </Card>
  );
};

export default LoginInput;
