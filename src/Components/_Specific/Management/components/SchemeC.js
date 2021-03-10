import React, { Fragment, useEffect, useState, useContext } from "react";
import {
  Form,
  Descriptions,
  Modal,
  Button,
  message,
  Spin,
  Alert,
  InputNumber,
} from "antd";
import styles from "../management.module.scss";
import axios from "axios";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { useTranslation } from "react-i18next";

export const SchemeModalC = ({
  SchemeModalvisible,
  setSchemeModalvisible,
  record,
  setRecord,
}) => {
  const [form] = Form.useForm();
  const [SchemeData, setSchemeData] = useState({});
  const [Editable, setEditable] = useState(false);
  const level = localStorage.getItem("authUser.level");
  const [IsCreate, setIsCreate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [IsUpdate, setIsUpdate] = useState(false);
  const history = useHistory();
  const { dispatch } = useContext(Context);
  const { t } = useTranslation();

  useEffect(() => {
    if (record.cid) {
      setUploading(true);
      // const SchemeUrl = `/scheme_mgnt?list_scheme={"cid":"${record.cid}"}`;
      const config = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/scheme_mgnt",
        data: JSON.parse(`{"list_scheme":{"cid":"${record.cid}"}}`),
      };
      axios(config)
        .then((res) => {
          let SchemeData = res.data.response[0].scheme_list;
          let expire = new Date(SchemeData.expire * 1000);
          SchemeData.expire = `${expire.getFullYear()}-${
            expire.getMonth() + 1
          }-${expire.getDate()}`;

          let expires = new Date(SchemeData.expires * 1000);
          SchemeData.expires = `${expires.getFullYear()}-${
            expires.getMonth() + 1
          }-${expires.getDate()}`;
          setSchemeData(SchemeData);

          form.setFieldsValue({
            user: SchemeData.user,
            device: SchemeData.device,
            group: SchemeData.group,
            iot: SchemeData.iot,
            iot_poor: SchemeData.iot_poor,
            tracking: SchemeData.tracking,
            tracking_pool: SchemeData.tracking_pool,
            // period_alive:SchemeData.period_alive,
            period_status: SchemeData.period_status,
            period_iot: SchemeData.period_iot,
            period_gps: SchemeData.period_gps,
            alive_timeout: SchemeData.alive_timeout,
            expire: SchemeData.expire,
          });
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          setUploading(false);
          if (error.response && error.response.status === 401) {
            dispatch({ type: "setLogin", payload: { IsLogin: false } });
            UserLogOut();
            history.push("/userlogin");
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.cid, IsUpdate]);

  const EditSchemeOnFinish = (values) => {
    setUploading(true);
    const config1 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/scheme_mgnt",
      data: JSON.parse(
        `{"${IsCreate ? "create" : "modify"}_scheme":{"cid":"${
          record.cid
        }","scheme_list":{"user":${values.user || 10},"group":${
          values.group || 50
        },"device":${values.device || 1000},"expire":${
          Date.parse(values.expire || "2030-12-31") / 1000
        },"tracking":${123},"tracking_pool":${123},"iot":${123},"iot_poor":${123},"period_alive":${
          values.period_alive
        },"alive_timeout":${values.period_alive + 30},"period_status":${
          values.period_status
        },"period_gps":${values.period_gps},"period_iot":${
          values.period_iot
        }}}}`
      ),
    };
    const config2 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(`{"set":{"device_cfg":{"filter":{"cid":"${
        record.cid
      }"},"obj":{"report_period":{"alive":${values.period_alive},"timeout":${
        values.period_alive + 30
      },
      "status":${values.period_status},"iot":${values.period_iot},"gps":${
        values.period_gps
      }}}}}}`),
    };
    console.log(config1.data);
    function EditSchemeUrl() {
      return axios(config1);
    }
    function setAllScheme() {
      return axios(config2);
    }

    axios
      .post([EditSchemeUrl(), setAllScheme()])
      .then(
        axios.spread(() => {
          setUploading(false);
          message.success("update successfully.");
          setIsCreate(false);
          setEditable(false);
          setIsUpdate(!IsUpdate);
        })
      )
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setUploading(false);
        console.log(error);
        message.error("update fail.");
        setIsCreate(false);
        setEditable(false);
        form.resetFields();
      });
  };

  return (
    <Modal
      visible={SchemeModalvisible}
      // onOk={() => setSchemeModalvisible(false)}
      onCancel={() => {
        setSchemeModalvisible(false);
        setIsCreate(false);
        setRecord({ cid: null });
        setEditable(false);
        form.resetFields();
      }}
      centered={true}
      className={styles.modal}
      title={t("ISMS.Scheme(Period)")}
      destroyOnClose={true}
      footer={[
        level === "super_super" && Editable && (
          <Button
            key="Submit"
            loading={uploading}
            onClick={() => {
              form.submit();
            }}
          >
            {t("ISMS.Submit")}
          </Button>
        ),
        !Editable && (
          <Button
            key="Confirm"
            type="primary"
            loading={uploading}
            onClick={() => {
              setSchemeModalvisible(false);
            }}
          >
            {t("ISMS.Confirm")}
          </Button>
        ),
      ]}
    >
      {uploading ? (
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
      ) : (
        SchemeData && (
          <Fragment>
            {level === "super_super" && (
              <Fragment>
                {SchemeData.user !== "" && (
                  <Button
                    key="Edit"
                    loading={uploading}
                    onClick={() => {
                      setEditable(!Editable);
                    }}
                    style={{ marginRight: "5px", marginBottom: "10px" }}
                  >
                    {t("ISMS.Edit")}
                  </Button>
                )}
                {SchemeData.user === "" && (
                  <Button
                    key="Create"
                    loading={uploading}
                    onClick={() => {
                      setEditable(!Editable);
                      setIsCreate(true);
                    }}
                    style={{ marginRight: "5px", marginBottom: "10px" }}
                  >
                    {t("ISMS.Create")}
                  </Button>
                )}
              </Fragment>
            )}
            <Form onFinish={EditSchemeOnFinish} form={form}>
              {/* <p>*Format: {Editable? <span style={{fontWeight:'bold'}}>total</span> : <span style={{fontWeight:'bold'}}>remain / total</span>}</p> */}
              <Descriptions
                bordered
                className={styles.desc}
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
              >
                {/* <Descriptions.Item key='user' label="user">
              {Editable ? (
                  <Form.Item name={"user"}  rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  `${SchemeData.users}/${SchemeData.user}`
                )}
              </Descriptions.Item>
              <Descriptions.Item key='device' label="device">
                {Editable ? (
                  <Form.Item name={"device"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  `${SchemeData.devices}/${SchemeData.device}`
                )}
              </Descriptions.Item>
              <Descriptions.Item key='group' label="group">
                {Editable ? (
                  <Form.Item name={"group"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  `${SchemeData.groups}/${SchemeData.group}`
                )}
              </Descriptions.Item> */}

                <Descriptions.Item
                  key="period_alive"
                  label={t("ISMS.AlivePeriod(s)")}
                  // label={'Alive Period (s)'}
                >
                  {Editable ? (
                    <Fragment>
                      <Form.Item
                        name={"period_alive"}
                        initialValue={30}
                        rules={[
                          {
                            required: true,
                            message: "number is required",
                            type: "number",
                          },
                        ]}
                      >
                        <InputNumber
                          className={styles.SchemeInput}
                          min={30}
                          step={30}
                        />
                      </Form.Item>
                    </Fragment>
                  ) : (
                    SchemeData.period_alive
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  key="period_status"
                  label={t("ISMS.StatusPeriod(s)")}
                  // label={'Status Period (s)'}
                >
                  {Editable ? (
                    <Form.Item
                      name={"period_status"}
                      rules={[{ required: true, message: "required" }]}
                    >
                      <InputNumber className={styles.SchemeInput} min={0}/>
                    </Form.Item>
                  ) : (
                    SchemeData.period_status
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  key="period_iot"
                  label={t("ISMS.IoTPeriod(s)")}
                  // label={'IoT Period (s)'}
                >
                  {Editable ? (
                    <Form.Item
                      name={"period_iot"}
                      rules={[{ required: true, message: "required" }]}
                    >
                      <InputNumber className={styles.SchemeInput} min={0}/>
                    </Form.Item>
                  ) : (
                    SchemeData.period_iot
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  key="period_gps"
                  label={t("ISMS.GPSPeriod(s)")}
                  // label={'GPS Period (s)'}
                >
                  {Editable ? (
                    <Form.Item
                      name={"period_gps"}
                      rules={[{ required: true, message: "required" }]}
                    >
                      <InputNumber className={styles.SchemeInput} min={0}/>
                    </Form.Item>
                  ) : (
                    SchemeData.period_gps
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  key="alive_timeout"
                  label={t("ISMS.AliveTimeout(s)")}
                  // label="alive_timeout"
                  style={{ display: "none" }}
                >
                  {Editable ? (
                    <Form.Item name={"alive_timeout"}>
                      <InputNumber className={styles.SchemeInput} />
                    </Form.Item>
                  ) : (
                    SchemeData.alive_timeout
                  )}
                </Descriptions.Item>
                {/* <Descriptions.Item key='expire' label="expire" >
                {Editable ? (
                  <Form.Item name={"expire"} rules={[{ required: true, message: "required" }]}>
                    <Input style={{width:'130px'}} placeholder='2020-12-12'/>
                  </Form.Item>
                ) : (
                  SchemeData.expire
                )}
              </Descriptions.Item> */}
              </Descriptions>
            </Form>
          </Fragment>
        )
      )}
    </Modal>
  );
};
