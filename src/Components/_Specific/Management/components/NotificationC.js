import React, { useEffect, useState, useContext } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Spin,
  Alert,
  Row,
  Col,
  InputNumber,
} from "antd";
import axios from "axios";
import styles from "../management.module.scss";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { useTranslation } from "react-i18next";


const { Option } = Select;
// const GlobalTimeZone = [
//   { value: "Etc/GMT+12", name: "(GMT-12:00) International Date Line West" },
//   { value: "Pacific/Midway", name: "(GMT-11:00) Midway Island, Samoa" },
//   { value: "Pacific/Honolulu", name: "(GMT-10:00) Hawaii" },
//   { value: "US/Alaska", name: "(GMT-09:00) Alaska" },
//   {
//     value: "America/Los_Angeles",
//     name: "(GMT-08:00) Pacific Time (US & Canada)",
//   },
//   { value: "America/Tijuana", name: "(GMT-08:00) Tijuana, Baja California" },
//   { value: "US/Arizona", name: "(GMT-07:00) Arizona" },
//   {
//     value: "America/Chihuahua",
//     name: "(GMT-07:00) Chihuahua, La Paz, Mazatlan",
//   },
//   { value: "US/Mountain", name: "(GMT-07:00) Mountain Time (US & Canada)" },
//   { value: "America/Managua", name: "(GMT-06:00) Central America" },
//   { value: "US/Central", name: "(GMT-06:00) Central Time (US & Canada)" },
//   {
//     value: "America/Mexico_City",
//     name: "(GMT-06:00) Guadalajara, Mexico City, Monterrey",
//   },
//   { value: "Canada/Saskatchewan", name: "(GMT-06:00) Saskatchewan" },
//   {
//     value: "America/Bogota",
//     name: "(GMT-05:00) Bogota, Lima, Quito, Rio Branco",
//   },
//   { value: "US/Eastern", name: "(GMT-05:00) Eastern Time (US & Canada)" },
//   { value: "US/East-Indiana", name: "(GMT-05:00) Indiana (East)" },
//   { value: "Canada/Atlantic", name: "(GMT-04:00) Atlantic Time (Canada)" },
//   { value: "America/Caracas", name: "(GMT-04:00) Caracas, La Paz" },
//   { value: "America/Manaus", name: "(GMT-04:00) Manaus" },
//   { value: "America/Santiago", name: "(GMT-04:00) Santiago" },
//   { value: "Canada/Newfoundland", name: "(GMT-03:30) Newfoundland" },
//   { value: "America/Sao_Paulo", name: "(GMT-03:00) Brasilia" },
//   {
//     value: "America/Argentina/Buenos_Aires",
//     name: "(GMT-03:00) Buenos Aires, Georgetown",
//   },
//   { value: "America/Godthab", name: "(GMT-03:00) Greenland" },
//   { value: "America/Montevideo", name: "(GMT-03:00) Montevideo" },
//   { value: "America/Noronha", name: "(GMT-02:00) Mid-Atlantic" },
//   { value: "Atlantic/Cape_Verde", name: "(GMT-01:00) Cape Verde Is." },
//   { value: "Atlantic/Azores", name: "(GMT-01:00) Azores" },
//   {
//     value: "Africa/Casablanca",
//     name: "(GMT+00:00) Casablanca, Monrovia, Reykjavik",
//   },
//   {
//     value: "Etc/Greenwich",
//     name: "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh,Lisbon, London",
//   },
//   {
//     value: "Europe/Amsterdam",
//     name: "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm,Vienna",
//   },
//   {
//     value: "Europe/Belgrade",
//     name: "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana,Prague",
//   },
//   {
//     value: "Europe/Brussels",
//     name: "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris",
//   },
//   {
//     value: "Europe/Sarajevo",
//     name: "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
//   },
//   { value: "Africa/Lagos", name: "(GMT+01:00) West Central Africa" },
//   { value: "Asia/Amman", name: "(GMT+02:00) Amman" },
//   { value: "Europe/Athens", name: "(GMT+02:00) Athens, Bucharest, Istanbul" },
//   { value: "Asia/Beirut", name: "(GMT+02:00) Beirut" },
//   { value: "Africa/Cairo", name: "(GMT+02:00) Cairo" },
//   { value: "Africa/Harare", name: "(GMT+02:00) Harare, Pretoria" },
//   {
//     value: "Europe/Helsinki",
//     name: "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
//   },
//   { value: "Asia/Jerusalem", name: "(GMT+02:00) Jerusalem" },
//   { value: "Europe/Minsk", name: "(GMT+02:00) Minsk" },
//   { value: "Africa/Windhoek", name: "(GMT+02:00) Windhoek" },
//   { value: "Asia/Kuwait", name: "(GMT+03:00) Kuwait, Riyadh, Baghdad" },
//   {
//     value: "Europe/Moscow",
//     name: "(GMT+03:00) Moscow, St. Petersburg, Volgograd",
//   },
//   { value: "Africa/Nairobi", name: "(GMT+03:00) Nairobi" },
//   { value: "Asia/Tbilisi", name: "(GMT+03:00) Tbilisi" },
//   { value: "Asia/Tehran", name: "(GMT+03:30) Tehran" },
//   { value: "Asia/Muscat", name: "(GMT+04:00) Abu Dhabi, Muscat" },
//   { value: "Asia/Baku", name: "(GMT+04:00) Baku" },
//   { value: "Asia/Yerevan", name: "(GMT+04:00) Yerevan" },
//   { value: "Asia/Kabul", name: "(GMT+04:30) Kabul" },
//   { value: "Asia/Yekaterinburg", name: "(GMT+05:00) Yekaterinburg" },
//   { value: "Asia/Karachi", name: "(GMT+05:00) Islamabad, Karachi, Tashkent" },
//   {
//     value: "Asia/Calcutta",
//     name: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
//   },
//   { value: "Asia/Calcutta", name: "(GMT+05:30) Sri Jayawardenapura" },
//   { value: "Asia/Katmandu", name: "(GMT+05:45) Kathmandu" },
//   { value: "Asia/Almaty", name: "(GMT+06:00) Almaty, Novosibirsk" },
//   { value: "Asia/Dhaka", name: "(GMT+06:00) Astana, Dhaka" },
//   { value: "Asia/Rangoon", name: "(GMT+06:30) Yangon (Rangoon)" },
//   { value: "Asia/Bangkok", name: "(GMT+07:00) Bangkok, Hanoi, Jakarta" },
//   { value: "Asia/Krasnoyarsk", name: "(GMT+07:00) Krasnoyarsk" },
//   {
//     value: "Asia/Hong_Kong",
//     name: "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
//   },
//   { value: "Asia/Kuala_Lumpur", name: "(GMT+08:00) Kuala Lumpur, Singapore" },
//   { value: "Asia/Irkutsk", name: "(GMT+08:00) Irkutsk, Ulaan Bataar" },
//   { value: "Australia/Perth", name: "(GMT+08:00) Perth" },
//   { value: "Asia/Taipei", name: "(GMT+08:00) Taipei" },
//   { value: "Asia/Tokyo", name: "(GMT+09:00) Osaka, Sapporo, Tokyo" },
//   { value: "Asia/Seoul", name: "(GMT+09:00) Seoul" },
//   { value: "Asia/Yakutsk", name: "(GMT+09:00) Yakutsk" },
//   { value: "Australia/Adelaide", name: "(GMT+09:30) Adelaide" },
//   { value: "Australia/Darwin", name: "(GMT+09:30) Darwin" },
//   { value: "Australia/Brisbane", name: "(GMT+10:00) Brisbane" },
//   {
//     value: "Australia/Canberra",
//     name: "(GMT+10:00) Canberra, Melbourne, Sydney",
//   },
//   { value: "Australia/Hobart", name: "(GMT+10:00) Hobart" },
//   { value: "Pacific/Guam", name: "(GMT+10:00) Guam, Port Moresby" },
//   { value: "Asia/Vladivostok", name: "(GMT+10:00) Vladivostok" },
//   {
//     value: "Asia/Magadan",
//     name: "(GMT+11:00) Magadan, Solomon Is., New Caledonia",
//   },
//   { value: "Pacific/Auckland", name: "(GMT+12:00) Auckland, Wellington" },
//   { value: "Pacific/Fiji", name: "(GMT+12:00) Fiji, Kamchatka, Marshall Is." },
//   { value: "Pacific/Tongatapu", name: "(GMT+13:00) Nuku'alofa" },
// ];

const NotifiModalC = ({
  setRecord,
  record,
  NotifiModalvisible,
  setNotifiModalvisible,
}) => {
  const { dispatch } = useContext(Context);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [IsUpdate, setIsUpdate] = useState(false);
  const history = useHistory();
  const [MailActive, setMailActive] = useState(false);
  const [LineActive, setLineActive] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (record.cid) {
      setUploading(true);
      // const NotifiUrl = `/cmd?get={"notification":{"filter":{"cid":"${record.cid}"}}}`;
      const config = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/cmd",
        data: JSON.parse(
          `{"get":{"notification":{"filter":{"cid":"${record.cid}"}}}}`
        ),
      };
      axios(config)
        .then((res) => {
          console.log(res.data.response.notification[0]);
          const NotifiData = res.data.response.notification[0];
          setMailActive(NotifiData.mail.active || false)
          setLineActive(NotifiData.line.active || false)
          form.setFieldsValue({
            timezone: NotifiData.timezone,
            mail_active: NotifiData.mail.active || false,
            mail_from: NotifiData.mail.mail_from,
            mail_to: NotifiData.mail.mail_to,
            mail_token: NotifiData.mail.token,
            mail_server: NotifiData.mail.mail_server,
            mail_port: NotifiData.mail.mail_port,
            line_token: NotifiData.line.token,
            line_active: NotifiData.line.active || false,
            level: NotifiData.conditions.level || "INFO",
          });
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            dispatch({ type: "setLogin", payload: { IsLogin: false } });
            UserLogOut();
            history.push("/userlogin");
          }
          setUploading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.cid, IsUpdate]);

  const TestNotifionFinish = () =>{


    const values = form.getFieldsValue()


    setUploading(true);


    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"notification_test":{"mail_test":true, "mail_server":"${
          values.mail_server
        }", "mail_port":${values.mail_port}, "mail_from":"${
          values.mail_from
        }", "mail_token":"${
          values.mail_token
        }", "mail_to":${JSON.stringify(values.mail_to)}, "line_test":true, "line_token":"${
          values.line_token
        }"}}}`
      ),
    };



    axios(config)
    .then(() => {
      setUploading(false);
      message.success("Mail submited, please check your mailbox!!");
      // setIsUpdate(!IsUpdate);
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        dispatch({ type: "setLogin", payload: { IsLogin: false } });
        UserLogOut();
        history.push("/userlogin");
      }
      setUploading(false);
      message.error("Fail to send mail.");
      console.log(error);
    });

  }

  const EditNotifionFinish = (values) => {
    setUploading(true);
    // console.log(values, action);



    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"notification":[{"cid":"${record.cid}", "timezone":"${
          values.timezone || "Asia/Taipei"
        }", "conditions":{"level":"${
          values.level || "INFO"
        }"}, "mail":{"active":${values.mail_active},"mail_server":"${
          values.mail_server
        }", "mail_port": ${values.mail_port} ,"mail_from":"${
          values.mail_from
        }","mail_to":${JSON.stringify(values.mail_to)}, "token":"${
          values.mail_token
        }"},"line":{"active":${values.line_active},"token":"${
          values.line_token
        }"}}]}}`
      ),
    };



 

    axios(config)
      .then(() => {
        setUploading(false);

          message.success("update successfully.");
        setIsUpdate(!IsUpdate);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setUploading(false);
        message.error("update fail.");
        console.log(error);
      });
  };

  return (
    <Modal
      visible={NotifiModalvisible}
      title={t("ISMS.Notification")}
      // onOk={() => setNotifiModalvisible(false)}
      onCancel={() => {
        setNotifiModalvisible(false);
        setRecord({ cid: null });
        form.resetFields();
      }}
      centered={true}
      className={`${styles.modal} ${styles.Notification}`}
      destroyOnClose={true}
      footer={[
        <Button
          key="test"
          // type="primary"
          loading={uploading}
          onClick={async() => {
            await form.validateFields()
            TestNotifionFinish()
          }}
        >
          {t("ISMS.SendTest")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={uploading}
          onClick={() => {
            form.submit();
          }}
        >
          {t("ISMS.Submit")}
        </Button>,
      ]}
    >
      {/* <Card loading={Notiloading} bordered={false}> */}
      {uploading ? (
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
      ) : (
        <Form
          // {...layout}
          onFinish={EditNotifionFinish}
          // onFinishFailed={onFinishFailed}
          form={form}
          layout="vertical"
        >
          <div className={styles.formwrap}>
            <Row gutter={24} justify="center">
              <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                {/* <Form.Item label={t("ISMS.TimeZone")} name={"timezone"}>
                  <Select placeholder={t("ISMS.SelectaTimeZone")}>
                    {GlobalTimeZone.map((item, index) => (
                      <Option value={item.value} key={index}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item> */}
                <Form.Item name="level" label={t("ISMS.LeveltoInform")}>
                  <Select placeholder={t("ISMS.SelectLevel")}>
                    <Option value="INFO">All (INFO/ WARN/ ERROR/ FATAL)</Option>
                    <Option value="WARN">WARN/ ERROR/ FATAL</Option>
                    <Option value="ERROR">ERROR/ FATAL</Option>
                    <Option value="FATAL">FATAL</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="mail_active" label={t("ISMS.Mailactive")}>
                  <Select
                    onChange={(value) => {
                      setMailActive(value);
                      form.validateFields();
                    }}
                    placeholder="ON/OFF"
                  >
                    <Option value={true}>ON</Option>
                    <Option value={false}>OFF</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("ISMS.MailServer")}
                  name="mail_server"
                  rules={[{ required: MailActive, message: "required!" }]}
                >
                  <Input placeholder={t("ISMS.InputServer")} />
                </Form.Item>
                <Form.Item
                  label={t("ISMS.MailPort")}
                  name="mail_port"
                  rules={[{ required: MailActive, message: "required!" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={t("ISMS.InputPort")}
                  />
                </Form.Item>
                <Form.Item
                  label={t("ISMS.MailFrom")}
                  name="mail_from"
                  rules={[{ required: MailActive, message: "required!" }]}
                >
                  <Input placeholder={t("ISMS.MailAddress")} />
                </Form.Item>

                <Form.Item
                  label={t("ISMS.MailTo")}
                  name="mail_to"
                  rules={[{ required: MailActive, message: "required!" }]}
                >
                  <Select
                    placeholder={t("ISMS.MailAddress(multiple)")}
                    mode="tags"
                    style={{ width: "100%" }}
                    tokenSeparators={[","]}
                  ></Select>
                  {/* <Input /> */}
                </Form.Item>

                <Form.Item
                  label={t("ISMS.MailToken")}
                  name="mail_token"
                  rules={[{ required: MailActive, message: "required!" }]}
                >
                  <Input.Password placeholder={t("ISMS.InputaToken")} />
                </Form.Item>
                <Form.Item name="line_active" label={t("ISMS.Lineactive")}>
                  <Select
                    onChange={(value) => {
                      setLineActive(value);
                      form.validateFields();
                    }}
                    placeholder={"ON/OFF"}
                  >
                    <Option value={true}>ON</Option>
                    <Option value={false}>OFF</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("ISMS.LineToken")}
                  name="line_token"
                  rules={[{ required: LineActive, message: "required!" }]}
                >
                  <Input.Password placeholder={t("ISMS.InputaToken")} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      )}
      {/* </Card> */}
    </Modal>
  );
};

export const NotifiModalMC = React.memo(NotifiModalC);

// const { Panel } = Collapse;

// export const NotifiManageC = () => {
//   const { state } = useContext(Context);
//   const [form] = Form.useForm();
//   const cid = localStorage.getItem("authUser.cid");
//   const NotifiUrl =
//     cid === "proscend"
//       ? `/cmd?get={"notification":{"filter":{${state.Login.Cid}}}}`
//       : `/cmd?get={"notification":{"filter":{"cid":"${cid}"}}}`;
//   console.log(NotifiUrl);
//   const [Notiloading, Notiresponse] = useURLloader(NotifiUrl);
//   const [NotifiData, setNotifiData] = useState([]);

//   useEffect(() => {
//     if (Notiresponse) {
//       let NotifiData = [];
//       Notiresponse.response.notification.forEach((item, index) => {
//         NotifiData.push({
//           key: index,
//           cid: item.cid,
//           level: item.conditions.level,
//           line_active: item.line.active,
//           line_token: item.line.token,
//           mail_active: item.mail.active,
//           mail_from: item.mail.mail_from,
//           mail_to: item.mail.mail_to,
//           mail_token: item.mail.token,
//           timezone: item.timezone,
//         });
//       });
//       setNotifiData(NotifiData);
//       console.log(NotifiData);
//       form.setFieldsValue({ Notification: NotifiData });
//     }
//   }, [Notiresponse]);

//   const onFinish = (values) => {
//     // console.log("Success:", values);
//     const OnfinishValues = values.Notification[values.Notification.length - 1];
//     console.log(OnfinishValues);
//     const SetNotifiUrl =
//       cid === "proscend" && state.Login.Cid !== ""
//         ? `/cmd?set={"notification":[{${state.Login.Cid}, "timezone":"${
//             OnfinishValues.timezone
//           }", "conditions":{"level":"${
//             OnfinishValues.level
//           }"}, "mail":{"active":"${OnfinishValues.mail_active}", "mail_from":"${
//             OnfinishValues.mail_from
//           }","mail_to":${JSON.stringify(OnfinishValues.mail_to)}, "token":"${
//             OnfinishValues.mail_token
//           }"},"line":{"active":"${OnfinishValues.line_active}","token":"${
//             OnfinishValues.line_token
//           }"}}]}`
//         : `/cmd?set={"notification":[{"cid":"${cid}", "timezone":"${
//             OnfinishValues.timezone
//           }", "conditions":{"level":"${
//             OnfinishValues.level
//           }"}, "mail":{"active":"${OnfinishValues.mail_active}", "mail_from":"${
//             OnfinishValues.mail_from
//           }","mail_to":${JSON.stringify(OnfinishValues.mail_to)}, "token":"${
//             OnfinishValues.mail_token
//           }"},"line":{"active":"${OnfinishValues.line_active}","token":"${
//             OnfinishValues.line_token
//           }"}}]}`;
//     console.log(SetNotifiUrl);
//     axios.get(SetNotifiUrl).then((res) => {
//       console.log(res);
//     });
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.log("Failed:", errorInfo);
//   };

//   return (
//     <Card >
//       {Notiloading ? <div className={styles.spin}>
//     <Spin />
//   </div> : <Collapse defaultActiveKey={["0"]} accordion>
//         {NotifiData.map((item, index) => {
//           return (
//             <Panel key={index} header={item.cid}>
//               <div className={styles.NotifiForm}>
//                 <Form
//                   {...layout}
//                   name={["Notification", index]}
//                   autoComplete="off"
//                   onFinish={onFinish}
//                   onFinishFailed={onFinishFailed}
//                   form={form}
//                   key={index}
//                 >
//                   <Form.Item
//                     label="Time Zone"
//                     name={["Notification", index, "timezone"]}
//                   >
//                     <Select name="timezone">
//                       <Option value="Etc/GMT+12">
//                         (GMT-12:00) International Date Line West
//                       </Option>
//                       <Option value="Pacific/Midway">
//                         (GMT-11:00) Midway Island, Samoa
//                       </Option>
//                       <Option value="Pacific/Honolulu">
//                         (GMT-10:00) Hawaii
//                       </Option>
//                       <Option value="US/Alaska">(GMT-09:00) Alaska</Option>
//                       <Option value="America/Los_Angeles">
//                         (GMT-08:00) Pacific Time (US & Canada)
//                       </Option>
//                       <Option value="America/Tijuana">
//                         (GMT-08:00) Tijuana, Baja California
//                       </Option>
//                       <Option value="US/Arizona">(GMT-07:00) Arizona</Option>
//                       <Option value="America/Chihuahua">
//                         (GMT-07:00) Chihuahua, La Paz, Mazatlan
//                       </Option>
//                       <Option value="US/Mountain">
//                         (GMT-07:00) Mountain Time (US & Canada)
//                       </Option>
//                       <Option value="America/Managua">
//                         (GMT-06:00) Central America
//                       </Option>
//                       <Option value="US/Central">
//                         (GMT-06:00) Central Time (US & Canada)
//                       </Option>
//                       <Option value="America/Mexico_City">
//                         (GMT-06:00) Guadalajara, Mexico City, Monterrey
//                       </Option>
//                       <Option value="Canada/Saskatchewan">
//                         (GMT-06:00) Saskatchewan
//                       </Option>
//                       <Option value="America/Bogota">
//                         (GMT-05:00) Bogota, Lima, Quito, Rio Branco
//                       </Option>
//                       <Option value="US/Eastern">
//                         (GMT-05:00) Eastern Time (US & Canada)
//                       </Option>
//                       <Option value="US/East-Indiana">
//                         (GMT-05:00) Indiana (East)
//                       </Option>
//                       <Option value="Canada/Atlantic">
//                         (GMT-04:00) Atlantic Time (Canada)
//                       </Option>
//                       <Option value="America/Caracas">
//                         (GMT-04:00) Caracas, La Paz
//                       </Option>
//                       <Option value="America/Manaus">(GMT-04:00) Manaus</Option>
//                       <Option value="America/Santiago">
//                         (GMT-04:00) Santiago
//                       </Option>
//                       <Option value="Canada/Newfoundland">
//                         (GMT-03:30) Newfoundland
//                       </Option>
//                       <Option value="America/Sao_Paulo">
//                         (GMT-03:00) Brasilia
//                       </Option>
//                       <Option value="America/Argentina/Buenos_Aires">
//                         (GMT-03:00) Buenos Aires, Georgetown
//                       </Option>
//                       <Option value="America/Godthab">
//                         (GMT-03:00) Greenland
//                       </Option>
//                       <Option value="America/Montevideo">
//                         (GMT-03:00) Montevideo
//                       </Option>
//                       <Option value="America/Noronha">
//                         (GMT-02:00) Mid-Atlantic
//                       </Option>
//                       <Option value="Atlantic/Cape_Verde">
//                         (GMT-01:00) Cape Verde Is.
//                       </Option>
//                       <Option value="Atlantic/Azores">
//                         (GMT-01:00) Azores
//                       </Option>
//                       <Option value="Africa/Casablanca">
//                         (GMT+00:00) Casablanca, Monrovia, Reykjavik
//                       </Option>
//                       <Option value="Etc/Greenwich">
//                         (GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh,
//                         Lisbon, London
//                       </Option>
//                       <Option value="Europe/Amsterdam">
//                         (GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm,
//                         Vienna
//                       </Option>
//                       <Option value="Europe/Belgrade">
//                         (GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana,
//                         Prague
//                       </Option>
//                       <Option value="Europe/Brussels">
//                         (GMT+01:00) Brussels, Copenhagen, Madrid, Paris
//                       </Option>
//                       <Option value="Europe/Sarajevo">
//                         (GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb
//                       </Option>
//                       <Option value="Africa/Lagos">
//                         (GMT+01:00) West Central Africa
//                       </Option>
//                       <Option value="Asia/Amman">(GMT+02:00) Amman</Option>
//                       <Option value="Europe/Athens">
//                         (GMT+02:00) Athens, Bucharest, Istanbul
//                       </Option>
//                       <Option value="Asia/Beirut">(GMT+02:00) Beirut</Option>
//                       <Option value="Africa/Cairo">(GMT+02:00) Cairo</Option>
//                       <Option value="Africa/Harare">
//                         (GMT+02:00) Harare, Pretoria
//                       </Option>
//                       <Option value="Europe/Helsinki">
//                         (GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn,
//                         Vilnius
//                       </Option>
//                       <Option value="Asia/Jerusalem">
//                         (GMT+02:00) Jerusalem
//                       </Option>
//                       <Option value="Europe/Minsk">(GMT+02:00) Minsk</Option>
//                       <Option value="Africa/Windhoek">
//                         (GMT+02:00) Windhoek
//                       </Option>
//                       <Option value="Asia/Kuwait">
//                         (GMT+03:00) Kuwait, Riyadh, Baghdad
//                       </Option>
//                       <Option value="Europe/Moscow">
//                         (GMT+03:00) Moscow, St. Petersburg, Volgograd
//                       </Option>
//                       <Option value="Africa/Nairobi">
//                         (GMT+03:00) Nairobi
//                       </Option>
//                       <Option value="Asia/Tbilisi">(GMT+03:00) Tbilisi</Option>
//                       <Option value="Asia/Tehran">(GMT+03:30) Tehran</Option>
//                       <Option value="Asia/Muscat">
//                         (GMT+04:00) Abu Dhabi, Muscat
//                       </Option>
//                       <Option value="Asia/Baku">(GMT+04:00) Baku</Option>
//                       <Option value="Asia/Yerevan">(GMT+04:00) Yerevan</Option>
//                       <Option value="Asia/Kabul">(GMT+04:30) Kabul</Option>
//                       <Option value="Asia/Yekaterinburg">
//                         (GMT+05:00) Yekaterinburg
//                       </Option>
//                       <Option value="Asia/Karachi">
//                         (GMT+05:00) Islamabad, Karachi, Tashkent
//                       </Option>
//                       <Option value="Asia/Calcutta">
//                         (GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi
//                       </Option>
//                       <Option value="Asia/Calcutta">
//                         (GMT+05:30) Sri Jayawardenapura
//                       </Option>
//                       <Option value="Asia/Katmandu">
//                         (GMT+05:45) Kathmandu
//                       </Option>
//                       <Option value="Asia/Almaty">
//                         (GMT+06:00) Almaty, Novosibirsk
//                       </Option>
//                       <Option value="Asia/Dhaka">
//                         (GMT+06:00) Astana, Dhaka
//                       </Option>
//                       <Option value="Asia/Rangoon">
//                         (GMT+06:30) Yangon (Rangoon)
//                       </Option>
//                       <Option value="Asia/Bangkok">
//                         (GMT+07:00) Bangkok, Hanoi, Jakarta
//                       </Option>
//                       <Option value="Asia/Krasnoyarsk">
//                         (GMT+07:00) Krasnoyarsk
//                       </Option>
//                       <Option value="Asia/Hong_Kong">
//                         (GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi
//                       </Option>
//                       <Option value="Asia/Kuala_Lumpur">
//                         (GMT+08:00) Kuala Lumpur, Singapore
//                       </Option>
//                       <Option value="Asia/Irkutsk">
//                         (GMT+08:00) Irkutsk, Ulaan Bataar
//                       </Option>
//                       <Option value="Australia/Perth">(GMT+08:00) Perth</Option>
//                       <Option value="Asia/Taipei">(GMT+08:00) Taipei</Option>
//                       <Option value="Asia/Tokyo">
//                         (GMT+09:00) Osaka, Sapporo, Tokyo
//                       </Option>
//                       <Option value="Asia/Seoul">(GMT+09:00) Seoul</Option>
//                       <Option value="Asia/Yakutsk">(GMT+09:00) Yakutsk</Option>
//                       <Option value="Australia/Adelaide">
//                         (GMT+09:30) Adelaide
//                       </Option>
//                       <Option value="Australia/Darwin">
//                         (GMT+09:30) Darwin
//                       </Option>
//                       <Option value="Australia/Brisbane">
//                         (GMT+10:00) Brisbane
//                       </Option>
//                       <Option value="Australia/Canberra">
//                         (GMT+10:00) Canberra, Melbourne, Sydney
//                       </Option>
//                       <Option value="Australia/Hobart">
//                         (GMT+10:00) Hobart
//                       </Option>
//                       <Option value="Pacific/Guam">
//                         (GMT+10:00) Guam, Port Moresby
//                       </Option>
//                       <Option value="Asia/Vladivostok">
//                         (GMT+10:00) Vladivostok
//                       </Option>
//                       <Option value="Asia/Magadan">
//                         (GMT+11:00) Magadan, Solomon Is., New Caledonia
//                       </Option>
//                       <Option value="Pacific/Auckland">
//                         (GMT+12:00) Auckland, Wellington
//                       </Option>
//                       <Option value="Pacific/Fiji">
//                         (GMT+12:00) Fiji, Kamchatka, Marshall Is.
//                       </Option>
//                       <Option value="Pacific/Tongatapu">
//                         (GMT+13:00) Nuku'alofa
//                       </Option>
//                     </Select>
//                   </Form.Item>
//                   <Form.Item
//                     name={["Notification", index, "level"]}
//                     label="Level to Inform"
//                   >
//                     <Radio.Group name={["Notification", index, "level"]}>
//                       <Radio value="INFO">INFO</Radio>
//                       <Radio value="WARN">WARN</Radio>
//                       <Radio value="ERROR">ERROR</Radio>
//                       <Radio value="FATAL">FATAL</Radio>
//                     </Radio.Group>
//                   </Form.Item>
//                   <Form.Item
//                     name={["Notification", index, "mail_active"]}
//                     label="Mail active"
//                     valuePropName="checked"
//                     initialValue={false}
//                     rules={[
//                       {
//                         required: true,
//                         message: `equired.`,
//                       },
//                     ]}
//                   >
//                     <Switch />
//                   </Form.Item>
//                   <Form.Item
//                     label="Mail From"
//                     name={["Notification", index, "mail_from"]}
//                   >
//                     <Input />
//                   </Form.Item>
//                   <Form.Item
//                     label="Mail To"
//                     name={["Notification", index, "mail_to"]}
//                   >
//                     <Input />
//                   </Form.Item>
//                   <Form.Item
//                     label="Mail Token"
//                     name={["Notification", index, "mail_token"]}
//                   >
//                     <Input />
//                   </Form.Item>
//                   <Form.Item
//                     name={["Notification", index, "line_active"]}
//                     label="Line active"
//                     valuePropName="checked"
//                     initialValue={false}
//                     rules={[
//                       {
//                         required: true,
//                         message: `equired.`,
//                       },
//                     ]}
//                   >
//                     <Switch />
//                   </Form.Item>
//                   <Form.Item
//                     label="Line Token"
//                     name={["Notification", index, "line_token"]}
//                   >
//                     <Input />
//                   </Form.Item>
//                   <Form.Item {...tailLayout}>
//                     <Button type="primary" htmlType="submit" key={index}>
//                       Submit
//                     </Button>
//                   </Form.Item>
//                 </Form>
//               </div>
//             </Panel>
//           );
//         })}
//       </Collapse>}
//     </Card>
//   );
// };
