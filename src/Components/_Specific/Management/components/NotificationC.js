import React, { useContext, useEffect, useState } from "react";
import {
  Radio,
  Card,
  Form,
  Input,
  Select,
  Button,
  Collapse,
  Switch,
  Modal,
  message
} from "antd";
import axios from "axios";
import Context from "../../../../Utility/Reduxx";
import styles from "../management.module.scss";
import useURLloader from "../../../../hook/useURLloader";

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const { Option } = Select;
const { Panel } = Collapse;

export const NotifiManageC = () => {
  const { state } = useContext(Context);
  const [form] = Form.useForm();
  const cid = localStorage.getItem("authUser.cid");
  const NotifiUrl =
    cid === "proscend"
      ? `/cmd?get={"notification":{"filter":{${state.Login.Cid}}}}`
      : `/cmd?get={"notification":{"filter":{"cid":"${cid}"}}}`;
  console.log(NotifiUrl);
  const [Notiloading, Notiresponse] = useURLloader(NotifiUrl);
  const [NotifiData, setNotifiData] = useState([]);

  useEffect(() => {
    if (Notiresponse) {
      let NotifiData = [];
      Notiresponse.response.notification.forEach((item, index) => {
        NotifiData.push({
          key: index,
          cid: item.cid,
          level: item.conditions.level,
          line_active: item.line.active,
          line_token: item.line.token,
          mail_active: item.mail.active,
          mail_from: item.mail.mail_from,
          mail_to: item.mail.mail_to,
          mail_token: item.mail.token,
          timezone: item.timezone,
        });
      });
      setNotifiData(NotifiData);
      console.log(NotifiData);
      form.setFieldsValue({ Notification: NotifiData });
    }
  }, [Notiresponse]);

  const onFinish = (values) => {
    // console.log("Success:", values);
    const OnfinishValues = values.Notification[values.Notification.length - 1];
    console.log(OnfinishValues);
    const SetNotifiUrl =
      cid === "proscend" && state.Login.Cid !== ""
        ? `/cmd?set={"notification":[{${state.Login.Cid}, "timezone":"${
            OnfinishValues.timezone
          }", "conditions":{"level":"${
            OnfinishValues.level
          }"}, "mail":{"active":"${OnfinishValues.mail_active}", "mail_from":"${
            OnfinishValues.mail_from
          }","mail_to":${JSON.stringify(OnfinishValues.mail_to)}, "token":"${
            OnfinishValues.mail_token
          }"},"line":{"active":"${OnfinishValues.line_active}","token":"${
            OnfinishValues.line_token
          }"}}]}`
        : `/cmd?set={"notification":[{"cid":"${cid}", "timezone":"${
            OnfinishValues.timezone
          }", "conditions":{"level":"${
            OnfinishValues.level
          }"}, "mail":{"active":"${OnfinishValues.mail_active}", "mail_from":"${
            OnfinishValues.mail_from
          }","mail_to":${JSON.stringify(OnfinishValues.mail_to)}, "token":"${
            OnfinishValues.mail_token
          }"},"line":{"active":"${OnfinishValues.line_active}","token":"${
            OnfinishValues.line_token
          }"}}]}`;
    console.log(SetNotifiUrl);
    axios.get(SetNotifiUrl).then((res) => {
      console.log(res);
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card loading={Notiloading}>
      <Collapse defaultActiveKey={["0"]} accordion>
        {NotifiData.map((item, index) => {
          return (
            <Panel key={index} header={item.cid}>
              <div className={styles.NotifiForm}>
                <Form
                  {...layout}
                  name={["Notification", index]}
                  autoComplete="off"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  form={form}
                  key={index}
                >
                  <Form.Item
                    label="Time Zone"
                    name={["Notification", index, "timezone"]}
                  >
                    <Select name="timezone">
                      <Option value="Etc/GMT+12">
                        (GMT-12:00) International Date Line West
                      </Option>
                      <Option value="Pacific/Midway">
                        (GMT-11:00) Midway Island, Samoa
                      </Option>
                      <Option value="Pacific/Honolulu">
                        (GMT-10:00) Hawaii
                      </Option>
                      <Option value="US/Alaska">(GMT-09:00) Alaska</Option>
                      <Option value="America/Los_Angeles">
                        (GMT-08:00) Pacific Time (US & Canada)
                      </Option>
                      <Option value="America/Tijuana">
                        (GMT-08:00) Tijuana, Baja California
                      </Option>
                      <Option value="US/Arizona">(GMT-07:00) Arizona</Option>
                      <Option value="America/Chihuahua">
                        (GMT-07:00) Chihuahua, La Paz, Mazatlan
                      </Option>
                      <Option value="US/Mountain">
                        (GMT-07:00) Mountain Time (US & Canada)
                      </Option>
                      <Option value="America/Managua">
                        (GMT-06:00) Central America
                      </Option>
                      <Option value="US/Central">
                        (GMT-06:00) Central Time (US & Canada)
                      </Option>
                      <Option value="America/Mexico_City">
                        (GMT-06:00) Guadalajara, Mexico City, Monterrey
                      </Option>
                      <Option value="Canada/Saskatchewan">
                        (GMT-06:00) Saskatchewan
                      </Option>
                      <Option value="America/Bogota">
                        (GMT-05:00) Bogota, Lima, Quito, Rio Branco
                      </Option>
                      <Option value="US/Eastern">
                        (GMT-05:00) Eastern Time (US & Canada)
                      </Option>
                      <Option value="US/East-Indiana">
                        (GMT-05:00) Indiana (East)
                      </Option>
                      <Option value="Canada/Atlantic">
                        (GMT-04:00) Atlantic Time (Canada)
                      </Option>
                      <Option value="America/Caracas">
                        (GMT-04:00) Caracas, La Paz
                      </Option>
                      <Option value="America/Manaus">(GMT-04:00) Manaus</Option>
                      <Option value="America/Santiago">
                        (GMT-04:00) Santiago
                      </Option>
                      <Option value="Canada/Newfoundland">
                        (GMT-03:30) Newfoundland
                      </Option>
                      <Option value="America/Sao_Paulo">
                        (GMT-03:00) Brasilia
                      </Option>
                      <Option value="America/Argentina/Buenos_Aires">
                        (GMT-03:00) Buenos Aires, Georgetown
                      </Option>
                      <Option value="America/Godthab">
                        (GMT-03:00) Greenland
                      </Option>
                      <Option value="America/Montevideo">
                        (GMT-03:00) Montevideo
                      </Option>
                      <Option value="America/Noronha">
                        (GMT-02:00) Mid-Atlantic
                      </Option>
                      <Option value="Atlantic/Cape_Verde">
                        (GMT-01:00) Cape Verde Is.
                      </Option>
                      <Option value="Atlantic/Azores">
                        (GMT-01:00) Azores
                      </Option>
                      <Option value="Africa/Casablanca">
                        (GMT+00:00) Casablanca, Monrovia, Reykjavik
                      </Option>
                      <Option value="Etc/Greenwich">
                        (GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh,
                        Lisbon, London
                      </Option>
                      <Option value="Europe/Amsterdam">
                        (GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm,
                        Vienna
                      </Option>
                      <Option value="Europe/Belgrade">
                        (GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana,
                        Prague
                      </Option>
                      <Option value="Europe/Brussels">
                        (GMT+01:00) Brussels, Copenhagen, Madrid, Paris
                      </Option>
                      <Option value="Europe/Sarajevo">
                        (GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb
                      </Option>
                      <Option value="Africa/Lagos">
                        (GMT+01:00) West Central Africa
                      </Option>
                      <Option value="Asia/Amman">(GMT+02:00) Amman</Option>
                      <Option value="Europe/Athens">
                        (GMT+02:00) Athens, Bucharest, Istanbul
                      </Option>
                      <Option value="Asia/Beirut">(GMT+02:00) Beirut</Option>
                      <Option value="Africa/Cairo">(GMT+02:00) Cairo</Option>
                      <Option value="Africa/Harare">
                        (GMT+02:00) Harare, Pretoria
                      </Option>
                      <Option value="Europe/Helsinki">
                        (GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn,
                        Vilnius
                      </Option>
                      <Option value="Asia/Jerusalem">
                        (GMT+02:00) Jerusalem
                      </Option>
                      <Option value="Europe/Minsk">(GMT+02:00) Minsk</Option>
                      <Option value="Africa/Windhoek">
                        (GMT+02:00) Windhoek
                      </Option>
                      <Option value="Asia/Kuwait">
                        (GMT+03:00) Kuwait, Riyadh, Baghdad
                      </Option>
                      <Option value="Europe/Moscow">
                        (GMT+03:00) Moscow, St. Petersburg, Volgograd
                      </Option>
                      <Option value="Africa/Nairobi">
                        (GMT+03:00) Nairobi
                      </Option>
                      <Option value="Asia/Tbilisi">(GMT+03:00) Tbilisi</Option>
                      <Option value="Asia/Tehran">(GMT+03:30) Tehran</Option>
                      <Option value="Asia/Muscat">
                        (GMT+04:00) Abu Dhabi, Muscat
                      </Option>
                      <Option value="Asia/Baku">(GMT+04:00) Baku</Option>
                      <Option value="Asia/Yerevan">(GMT+04:00) Yerevan</Option>
                      <Option value="Asia/Kabul">(GMT+04:30) Kabul</Option>
                      <Option value="Asia/Yekaterinburg">
                        (GMT+05:00) Yekaterinburg
                      </Option>
                      <Option value="Asia/Karachi">
                        (GMT+05:00) Islamabad, Karachi, Tashkent
                      </Option>
                      <Option value="Asia/Calcutta">
                        (GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi
                      </Option>
                      <Option value="Asia/Calcutta">
                        (GMT+05:30) Sri Jayawardenapura
                      </Option>
                      <Option value="Asia/Katmandu">
                        (GMT+05:45) Kathmandu
                      </Option>
                      <Option value="Asia/Almaty">
                        (GMT+06:00) Almaty, Novosibirsk
                      </Option>
                      <Option value="Asia/Dhaka">
                        (GMT+06:00) Astana, Dhaka
                      </Option>
                      <Option value="Asia/Rangoon">
                        (GMT+06:30) Yangon (Rangoon)
                      </Option>
                      <Option value="Asia/Bangkok">
                        (GMT+07:00) Bangkok, Hanoi, Jakarta
                      </Option>
                      <Option value="Asia/Krasnoyarsk">
                        (GMT+07:00) Krasnoyarsk
                      </Option>
                      <Option value="Asia/Hong_Kong">
                        (GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi
                      </Option>
                      <Option value="Asia/Kuala_Lumpur">
                        (GMT+08:00) Kuala Lumpur, Singapore
                      </Option>
                      <Option value="Asia/Irkutsk">
                        (GMT+08:00) Irkutsk, Ulaan Bataar
                      </Option>
                      <Option value="Australia/Perth">(GMT+08:00) Perth</Option>
                      <Option value="Asia/Taipei">(GMT+08:00) Taipei</Option>
                      <Option value="Asia/Tokyo">
                        (GMT+09:00) Osaka, Sapporo, Tokyo
                      </Option>
                      <Option value="Asia/Seoul">(GMT+09:00) Seoul</Option>
                      <Option value="Asia/Yakutsk">(GMT+09:00) Yakutsk</Option>
                      <Option value="Australia/Adelaide">
                        (GMT+09:30) Adelaide
                      </Option>
                      <Option value="Australia/Darwin">
                        (GMT+09:30) Darwin
                      </Option>
                      <Option value="Australia/Brisbane">
                        (GMT+10:00) Brisbane
                      </Option>
                      <Option value="Australia/Canberra">
                        (GMT+10:00) Canberra, Melbourne, Sydney
                      </Option>
                      <Option value="Australia/Hobart">
                        (GMT+10:00) Hobart
                      </Option>
                      <Option value="Pacific/Guam">
                        (GMT+10:00) Guam, Port Moresby
                      </Option>
                      <Option value="Asia/Vladivostok">
                        (GMT+10:00) Vladivostok
                      </Option>
                      <Option value="Asia/Magadan">
                        (GMT+11:00) Magadan, Solomon Is., New Caledonia
                      </Option>
                      <Option value="Pacific/Auckland">
                        (GMT+12:00) Auckland, Wellington
                      </Option>
                      <Option value="Pacific/Fiji">
                        (GMT+12:00) Fiji, Kamchatka, Marshall Is.
                      </Option>
                      <Option value="Pacific/Tongatapu">
                        (GMT+13:00) Nuku'alofa
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={["Notification", index, "level"]}
                    label="Level to Inform"
                  >
                    <Radio.Group name={["Notification", index, "level"]}>
                      <Radio value="INFO">INFO</Radio>
                      <Radio value="WARN">WARN</Radio>
                      <Radio value="ERROR">ERROR</Radio>
                      <Radio value="FATAL">FATAL</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name={["Notification", index, "mail_active"]}
                    label="Mail active"
                    valuePropName="checked"
                    initialValue={false}
                    rules={[
                      {
                        required: true,
                        message: `equired.`,
                      },
                    ]}
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    label="Mail From"
                    name={["Notification", index, "mail_from"]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Mail To"
                    name={["Notification", index, "mail_to"]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Mail Token"
                    name={["Notification", index, "mail_token"]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["Notification", index, "line_active"]}
                    label="Line active"
                    valuePropName="checked"
                    initialValue={false}
                    rules={[
                      {
                        required: true,
                        message: `equired.`,
                      },
                    ]}
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    label="Line Token"
                    name={["Notification", index, "line_token"]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" key={index}>
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </Card>
  );
};

const NotifiModalC = ({
  record,
  NotifiModalvisible,
  setNotifiModalvisible,
}) => {
  const [form] = Form.useForm();
  const NotifiUrl = `/cmd?get={"notification":{"filter":{"cid":"${record.cid}"}}}`;
  const [Notiloading, Notiresponse] = useURLloader(NotifiUrl);
  const [uploading, setUploading] = useState(false)
  // const [NotifiData, setNotifiData] = useState([]);

  const EditNotifionFinish = (values) => {
    setUploading(true)
    console.log(values, record);
    console.log(values.mail_to.split(','))
    const SetNotifiUrl = `/cmd?set={"notification":[{"cid":"${
      record.cid
    }", "timezone":"${values.timezone}", "conditions":{"level":"${
      values.level
    }"}, "mail":{"active":"${values.mail_active}", "mail_from":"${
      values.mail_from
    }","mail_to":${JSON.stringify(values.mail_to.split(','))}, "token":"${
      values.mail_token
    }"},"line":{"active":"${values.line_active}","token":"${
      values.line_token
    }"}}]}`;
    console.log(SetNotifiUrl);
    axios.get(SetNotifiUrl).then((res) => {
      setUploading(false)
      message.success("update successfully.");
      console.log(res);
    }).catch((error)=>{
      setUploading(false)
      message.error("update fail.");
      console.log(error)
    })
  };

  useEffect(() => {
    if (Notiresponse) {
      const NotifiData = Notiresponse.response.notification[0];
      // setNotifiData(NotifiData);
      console.log('執行了 NotifiData');
      form.setFieldsValue({
        timezone: NotifiData.timezone,
        mail_active: NotifiData.mail.active,
        mail_from: NotifiData.mail.mail_from,
        mail_to: NotifiData.mail.mail_to,
        mail_token: NotifiData.mail.token,
        line_token: NotifiData.line.token,
        line_active: NotifiData.line.active,
        level: NotifiData.conditions.level,
      });
    }
  }, [Notiresponse]);

  return (
    <Modal
      visible={NotifiModalvisible}
      title="Notification Setting"
      onOk={() => setNotifiModalvisible(false)}
      onCancel={() => setNotifiModalvisible(false)}
      centered={true}
      width={"50%"}
      destroyOnClose={true}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={uploading}
          onClick={() => {
            form.submit();
          }}
        >
          Submit
        </Button>,
      ]}
    >
      <Card loading={Notiloading} bordered={false}>
        <Form
          {...layout}
          name="Notification"
          autoComplete="off"
          onFinish={EditNotifionFinish}
          // onFinishFailed={onFinishFailed}
          form={form}
        >
          <Form.Item label="Time Zone" name="timezone">
            <Select name="timezone">
              <Option value="Etc/GMT+12">
                (GMT-12:00) International Date Line West
              </Option>
              <Option value="Pacific/Midway">
                (GMT-11:00) Midway Island, Samoa
              </Option>
              <Option value="Pacific/Honolulu">(GMT-10:00) Hawaii</Option>
              <Option value="US/Alaska">(GMT-09:00) Alaska</Option>
              <Option value="America/Los_Angeles">
                (GMT-08:00) Pacific Time (US & Canada)
              </Option>
              <Option value="America/Tijuana">
                (GMT-08:00) Tijuana, Baja California
              </Option>
              <Option value="US/Arizona">(GMT-07:00) Arizona</Option>
              <Option value="America/Chihuahua">
                (GMT-07:00) Chihuahua, La Paz, Mazatlan
              </Option>
              <Option value="US/Mountain">
                (GMT-07:00) Mountain Time (US & Canada)
              </Option>
              <Option value="America/Managua">
                (GMT-06:00) Central America
              </Option>
              <Option value="US/Central">
                (GMT-06:00) Central Time (US & Canada)
              </Option>
              <Option value="America/Mexico_City">
                (GMT-06:00) Guadalajara, Mexico City, Monterrey
              </Option>
              <Option value="Canada/Saskatchewan">
                (GMT-06:00) Saskatchewan
              </Option>
              <Option value="America/Bogota">
                (GMT-05:00) Bogota, Lima, Quito, Rio Branco
              </Option>
              <Option value="US/Eastern">
                (GMT-05:00) Eastern Time (US & Canada)
              </Option>
              <Option value="US/East-Indiana">
                (GMT-05:00) Indiana (East)
              </Option>
              <Option value="Canada/Atlantic">
                (GMT-04:00) Atlantic Time (Canada)
              </Option>
              <Option value="America/Caracas">
                (GMT-04:00) Caracas, La Paz
              </Option>
              <Option value="America/Manaus">(GMT-04:00) Manaus</Option>
              <Option value="America/Santiago">(GMT-04:00) Santiago</Option>
              <Option value="Canada/Newfoundland">
                (GMT-03:30) Newfoundland
              </Option>
              <Option value="America/Sao_Paulo">(GMT-03:00) Brasilia</Option>
              <Option value="America/Argentina/Buenos_Aires">
                (GMT-03:00) Buenos Aires, Georgetown
              </Option>
              <Option value="America/Godthab">(GMT-03:00) Greenland</Option>
              <Option value="America/Montevideo">(GMT-03:00) Montevideo</Option>
              <Option value="America/Noronha">(GMT-02:00) Mid-Atlantic</Option>
              <Option value="Atlantic/Cape_Verde">
                (GMT-01:00) Cape Verde Is.
              </Option>
              <Option value="Atlantic/Azores">(GMT-01:00) Azores</Option>
              <Option value="Africa/Casablanca">
                (GMT+00:00) Casablanca, Monrovia, Reykjavik
              </Option>
              <Option value="Etc/Greenwich">
                (GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon,
                London
              </Option>
              <Option value="Europe/Amsterdam">
                (GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna
              </Option>
              <Option value="Europe/Belgrade">
                (GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague
              </Option>
              <Option value="Europe/Brussels">
                (GMT+01:00) Brussels, Copenhagen, Madrid, Paris
              </Option>
              <Option value="Europe/Sarajevo">
                (GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb
              </Option>
              <Option value="Africa/Lagos">
                (GMT+01:00) West Central Africa
              </Option>
              <Option value="Asia/Amman">(GMT+02:00) Amman</Option>
              <Option value="Europe/Athens">
                (GMT+02:00) Athens, Bucharest, Istanbul
              </Option>
              <Option value="Asia/Beirut">(GMT+02:00) Beirut</Option>
              <Option value="Africa/Cairo">(GMT+02:00) Cairo</Option>
              <Option value="Africa/Harare">
                (GMT+02:00) Harare, Pretoria
              </Option>
              <Option value="Europe/Helsinki">
                (GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius
              </Option>
              <Option value="Asia/Jerusalem">(GMT+02:00) Jerusalem</Option>
              <Option value="Europe/Minsk">(GMT+02:00) Minsk</Option>
              <Option value="Africa/Windhoek">(GMT+02:00) Windhoek</Option>
              <Option value="Asia/Kuwait">
                (GMT+03:00) Kuwait, Riyadh, Baghdad
              </Option>
              <Option value="Europe/Moscow">
                (GMT+03:00) Moscow, St. Petersburg, Volgograd
              </Option>
              <Option value="Africa/Nairobi">(GMT+03:00) Nairobi</Option>
              <Option value="Asia/Tbilisi">(GMT+03:00) Tbilisi</Option>
              <Option value="Asia/Tehran">(GMT+03:30) Tehran</Option>
              <Option value="Asia/Muscat">(GMT+04:00) Abu Dhabi, Muscat</Option>
              <Option value="Asia/Baku">(GMT+04:00) Baku</Option>
              <Option value="Asia/Yerevan">(GMT+04:00) Yerevan</Option>
              <Option value="Asia/Kabul">(GMT+04:30) Kabul</Option>
              <Option value="Asia/Yekaterinburg">
                (GMT+05:00) Yekaterinburg
              </Option>
              <Option value="Asia/Karachi">
                (GMT+05:00) Islamabad, Karachi, Tashkent
              </Option>
              <Option value="Asia/Calcutta">
                (GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi
              </Option>
              <Option value="Asia/Calcutta">
                (GMT+05:30) Sri Jayawardenapura
              </Option>
              <Option value="Asia/Katmandu">(GMT+05:45) Kathmandu</Option>
              <Option value="Asia/Almaty">
                (GMT+06:00) Almaty, Novosibirsk
              </Option>
              <Option value="Asia/Dhaka">(GMT+06:00) Astana, Dhaka</Option>
              <Option value="Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</Option>
              <Option value="Asia/Bangkok">
                (GMT+07:00) Bangkok, Hanoi, Jakarta
              </Option>
              <Option value="Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</Option>
              <Option value="Asia/Hong_Kong">
                (GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi
              </Option>
              <Option value="Asia/Kuala_Lumpur">
                (GMT+08:00) Kuala Lumpur, Singapore
              </Option>
              <Option value="Asia/Irkutsk">
                (GMT+08:00) Irkutsk, Ulaan Bataar
              </Option>
              <Option value="Australia/Perth">(GMT+08:00) Perth</Option>
              <Option value="Asia/Taipei">(GMT+08:00) Taipei</Option>
              <Option value="Asia/Tokyo">
                (GMT+09:00) Osaka, Sapporo, Tokyo
              </Option>
              <Option value="Asia/Seoul">(GMT+09:00) Seoul</Option>
              <Option value="Asia/Yakutsk">(GMT+09:00) Yakutsk</Option>
              <Option value="Australia/Adelaide">(GMT+09:30) Adelaide</Option>
              <Option value="Australia/Darwin">(GMT+09:30) Darwin</Option>
              <Option value="Australia/Brisbane">(GMT+10:00) Brisbane</Option>
              <Option value="Australia/Canberra">
                (GMT+10:00) Canberra, Melbourne, Sydney
              </Option>
              <Option value="Australia/Hobart">(GMT+10:00) Hobart</Option>
              <Option value="Pacific/Guam">
                (GMT+10:00) Guam, Port Moresby
              </Option>
              <Option value="Asia/Vladivostok">(GMT+10:00) Vladivostok</Option>
              <Option value="Asia/Magadan">
                (GMT+11:00) Magadan, Solomon Is., New Caledonia
              </Option>
              <Option value="Pacific/Auckland">
                (GMT+12:00) Auckland, Wellington
              </Option>
              <Option value="Pacific/Fiji">
                (GMT+12:00) Fiji, Kamchatka, Marshall Is.
              </Option>
              <Option value="Pacific/Tongatapu">(GMT+13:00) Nuku'alofa</Option>
            </Select>
          </Form.Item>
          <Form.Item name="level" label="Level to Inform">
            <Radio.Group>
              <Radio value="INFO">INFO</Radio>
              <Radio value="WARN">WARN</Radio>
              <Radio value="ERROR">ERROR</Radio>
              <Radio value="FATAL">FATAL</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="mail_active"
            label="Mail active"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item label="Mail From" name="mail_from">
            <Input />
          </Form.Item>
          
          <Form.Item label="Mail To" name="mail_to">
            <Input />
          </Form.Item>
          <p style={{marginLeft:'22%', marginTop:'-25px', color: 'gray'}}>(use <span style={{fontWeight:'500', color:'blue'}}>","</span>  to seperate different receivers)</p>
          <Form.Item label="Mail Token" name="mail_token">
            <Input />
          </Form.Item>
          <Form.Item
            name="line_active"
            label="Line active"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item label="Line Token" name="line_token">
            <Input />
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export const NotifiModalMC = React.memo(NotifiModalC)

// http://192.168.0.95:8000/cmd?get={"notification":{}}
// http://192.168.0.95:8000/cmd?get={"notification":{"filter":{"cid":"12345678901234567890123456789011"}}}
// http://192.168.0.95:8000/cmd?set={"notification":[{"cid":"12345678901234567890123456789011", "timezone":"Asia/Taipei", "conditions":{"level":"ERROR"}, "mail":{"active":"True", "mail_from":"from_1@gmail.com","mail_to":["to_1@gmail.com", "to_2@gmail.com", "to_3@gmail.com"], "token":"ajsrkwvfzgpwbyba"},"line":{"active":"False","token":"kdLz7PCTSKlWuUhMC4vFIwLm3t2YKGajBPY5VjXG7oL"}},{"cid":"12345678901234567890123456789011", "timezone":"America/New_York", "conditions":{"level":"WARM"}, "mail":{"active":"False", "mail_from":"from_2@gmail.com","mail_to":["to_4@gmail.com", "to_5@gmail.com", "to_6@gmail.com"], "token":"trsrkwvfzgpwbyba"},"line":{"active":"True","token":"abLz7PCTSKlWuUhMC4vFIwLm3t2YKGajBPY5VjXG7oL"}}]}
