import React, { useEffect, useState, Fragment, useContext } from "react";
import {
  Modal,
  Descriptions,
  Form,
  Input,
  message,
  Button,
  Spin,
  Alert,
  Popconfirm,
  Tooltip,
  Tabs,
  Row,
  Col,
  Select,
} from "antd";
import styles from "../management.module.scss";
import axios from "axios";
// import { Translator } from "../../../../i18n/index";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { ImCross } from "react-icons/im";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;
const { Option } = Select;

export const TokenModelC = ({
  Tokenvisible,
  setTokenvisible,
  record,
  setRecord,
}) => {
  const [form] = Form.useForm();
  const [apiform] = Form.useForm();
  const [TokenList, setTokenList] = useState([]);
  const [Editable, setEditable] = useState(false);
  const level = localStorage.getItem("authUser.level");
  const [uploading, setUploading] = useState(false);
  const [IsUpdate, setIsUpdate] = useState(false);
  const history = useHistory();
  const { state, dispatch } = useContext(Context);
  const [currentPage, setCurrentPage] = useState("Device Token");
  const { t } = useTranslation();

  useEffect(() => {
    if (record.cid) {
      setUploading(true);
      // const GetTokenUrl = `/device_mgnt/token?list_token={"cid":"${record.cid}"}`;
      const config1 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/device_mgnt/token",
        data: JSON.parse(`{"list_token":{"cid":"${record.cid}"}}`),
      };

      const config2 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/cmd",
        data: JSON.parse(
          `{"get":{"geocoding_inf":{"filter":{"cid":"${record.cid}"}}}}`
        ),
      };

      function TokenUrl() {
        return axios(config1);
      }
      function APIKeyUrl() {
        return axios(config2);
      }

      console.log(config2.data);
      axios
        .all([TokenUrl(), APIKeyUrl()])
        .then(
          axios.spread((acct, perms) => {
            setTokenList(acct.data.response[0].token_list);
            console.log(perms.data);
            form.setFieldsValue({ token: acct.data.response[0].token_list });
            const keyData = perms.data.response.geocoding_inf[0];
            apiform.setFieldsValue({
              city_api: keyData.key,
              city_language: keyData.language,
            });
            setUploading(false);
          })
        )
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            dispatch({ type: "setLogin", payload: { IsLogin: false } });
            UserLogOut();
            history.push("/userlogin");
          }
          console.log(error);
          setUploading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.cid, IsUpdate]);

  const TokenOnFinish = (values) => {
    console.log(values);
    setUploading(true);
    let token_list = "";
    for (let i = 0; i < values.token.length; i++) {
      if (values.token[i] !== undefined) {
        token_list += `{"old_token":"${TokenList[i]}","new_token":"${values.token[i]}"},`;
      }
    }
    // const ModifyTokeUrl = `/device_mgnt/token?modify_token={"cid":"${
    //   record.cid
    // }", "token_list":[${token_list.substring(0, token_list.length - 1)}]}`;

    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/device_mgnt/token",
      data: JSON.parse(
        `{"modify_token":{"cid":"${
          record.cid
        }", "token_list":[${token_list.substring(0, token_list.length - 1)}]}}`
      ),
    };

    axios(config)
      .then((res) => {
        console.log(res);
        setUploading(false);
        message.success("modify successfully");
        form.resetFields();
        // setTokenvisible(false);
        setEditable(false);
        setIsUpdate(!IsUpdate);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
        setUploading(false);
        message.success("modify fail");
        form.resetFields();
        setEditable(false);
      });
  };

  const CreateToken = async () => {
    setUploading(true);
    // const generateTokenUrl = `/device_mgnt/token?generate_token={}`;
    let newToken;
    const config1 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/device_mgnt/token",
      data: JSON.parse(`{"generate_token":{}}`),
    };
    await axios(config1).then((res) => {
      newToken = res.data.response.token;
    });
    const config2 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/device_mgnt/token",
      data: JSON.parse(
        `{"create_token":{"cid":"${record.cid}", "token_list":["${newToken}"]}}`
      ),
    };
    axios(config2)
      .then((resu) => {
        console.log(resu);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("Create successfully");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
        setUploading(false);
        message.error("Create fail");
      });
  };

  const DeleteToken = (item) => {
    setUploading(true);
    // const deleteTokenUrl = `/device_mgnt/token?delete_token={"cid":"${record.cid}", "token_list":["${item}"]}`;
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/device_mgnt/token",
      data: JSON.parse(
        `{"delete_token":{"cid":"${record.cid}", "token_list":["${item}"]}}`
      ),
    };
    axios(config)
      .then((resu) => {
        console.log(resu);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("Delete successfully");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
        setUploading(false);
        message.error("Delete fail");
      });
  };

  function ChangeTab(value) {
    // console.log(value);
    setCurrentPage(value);
  }

  function CreateAPIonFinish(value) {
    console.log(value);
    setUploading(true);

    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"geocoding_inf":[{"cid":"${record.cid}", "key":"${value.city_api}", "language":"${value.city_language}"}]}}`
      ),
    };

    console.log(config);

    axios(config)
      .then((res) => {
        console.log(res.data);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        // setEditCityVisible(false);
        message.success("Add successfully.");
      })
      .catch((error) => {
        console.error(error);
        setUploading(false);
        if (error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
          message.error("Add failed");
        }
      });
  }

  return (
    <Modal
      visible={Tokenvisible}
      // onOk={() => setTokenvisible(false)}
      onCancel={() => {
        setTokenvisible(false);
        setRecord({ cid: null });
        apiform.resetFields();
        setEditable(false);
      }}
      centered={true}
      className={`${styles.modal} ${styles.Key}`}
      destroyOnClose={true}
      title={t("ISMS.KeyManagement")}
      footer={[
        currentPage === "Device Token" ? (
          Editable ? (
            <Button
              key="Submit"
              type="primary"
              loading={uploading}
              onClick={() => {
                form.submit();
              }}
            >
              {t("ISMS.Submit")}
            </Button>
          ) : (
            !Editable && (
              <Button
                key="Confirm"
                type="primary"
                loading={uploading}
                onClick={() => {
                  setTokenvisible(false);
                }}
              >
                {t("ISMS.Confirm")}
              </Button>
            )
          )
        ) : (
          ((
            <Button
              loading={uploading}
              key="Cancel"
              onClick={() => setTokenvisible(false)}
            >
               {t("ISMS.Cancel")}
            </Button>
          ),
          (
            <Button
              key="Save"
              type="primary"
              loading={uploading}
              onClick={() => apiform.submit()}
            >
              {t("ISMS.Submit")}
            </Button>
          ))
        ),
      ]}
    >
      {!uploading ? (
        <Fragment>
          <Tabs
            defaultActiveKey="Device Token"
            onChange={(value) => ChangeTab(value)}
          >
            <TabPane tab={t("ISMS.DeviceToken")} key="Device Token">
              {level === "super_super" && state.Login.Cid === "" && (
                <Fragment key="123">
                  {
                    <Button
                      key="Edit"
                      loading={uploading}
                      onClick={() => {
                        setEditable(!Editable);
                      }}
                      style={{ marginRight: "5px", marginBottom: "10px" }}
                      disabled={!TokenList.length}
                    >
                      {t("ISMS.Edit")}
                    </Button>
                  }
                  {!Editable && (
                    <Button
                      key="Create"
                      loading={uploading}
                      onClick={() => {
                        CreateToken();
                      }}
                    >
                      {t("ISMS.Create")}
                    </Button>
                  )}
                </Fragment>
              )}
              <Form onFinish={TokenOnFinish} form={form}>
                <Descriptions bordered className={styles.desc}>
                  <Descriptions.Item label={t("ISMS.Token")}>
                    {TokenList.map((item, index) => {
                      return Editable ? (
                        <Form.Item name={["token", index]} key={index}>
                          <Input />
                        </Form.Item>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          key={index}
                        >
                          <p key={index}>{item}</p>
                          {level === "super_super" && state.Login.Cid === "" && (
                            <Tooltip title="Delete Token">
                              <Popconfirm
                                title={t("ISMS.Suretodelete")}
                                okText={t("ISMS.OK")}
                                cancelText={t("ISMS.Cancel")}
                                onConfirm={() => {
                                  DeleteToken(item);
                                }}
                              >
                                <ImCross className={styles.trashIcon} />
                              </Popconfirm>
                            </Tooltip>
                          )}
                        </div>
                      );
                    })}
                    <br />
                  </Descriptions.Item>
                </Descriptions>
              </Form>
            </TabPane>
            <TabPane tab={t("ISMS.APIKey")} key="API Key">
              <Form
                form={apiform}
                layout="vertical"
                onFinish={CreateAPIonFinish}
              >
                <div
                  className={`${styles.FormWrapper} ${styles.BulkFormWrapper}`}
                >
                  <Row gutter={24} justify="flex-start">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Fragment>
                        <Form.Item
                          name={"city_api"}
                          label={t("ISMS.APIKey")}
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input.Password
                            placeholder={t("ISMS.YourGoogleAPIkey")}
                          />
                        </Form.Item>
                        <Form.Item
                          name={"city_language"}
                          label={t("ISMS.Language")}
                          initialValue="en"
                          style={{ marginTop: "15px" }}
                        >
                          <Select>
                            <Option value={"zh-TW"}>
                              Chinese (Traditional)
                            </Option>
                            <Option value={"en"}>English</Option>
                          </Select>
                        </Form.Item>
                      </Fragment>
                    </Col>
                  </Row>
                </div>
              </Form>
            </TabPane>
          </Tabs>
        </Fragment>
      ) : (
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
      )}
    </Modal>
  );
};
