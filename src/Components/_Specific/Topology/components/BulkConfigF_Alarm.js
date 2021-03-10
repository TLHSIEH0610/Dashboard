import React, { Fragment } from "react";
import styles from "../topology.module.scss";
import {
  Form,
  Select,
  Row,
  Col,
  Input,
  Divider,
} from "antd";

const { Option } = Select;


const BulkConfigFAlarm= ({SubmitConfigonFinish, form, AlarmEnable, setAlarmEnable, AlarmType, setAlarmType, GPSReference, setGPSReference }) => {
  const Type = [
    { value: "sms", name: "SMS" },
    { value: "vpn-disconnect", name: "VPN-Disconnect" },
    { value: "wan-disconnect", name: "WAN-Disconnect" },
    { value: "reboot", name: "Reboot" },
    { value: "lan-wifi-disconnect", name: "LAN-Wifi-Disconnect" },
    { value: "lan-eth-disconnect", name: "LAN-ETH-Disconnect" },
    { value: "di", name: "Di" },
    { value: "geofence", name: "GPS" },
  ];


    return(
      <Form onFinish={SubmitConfigonFinish} form={form}>
      <div className={`${styles.FormWrapper} ${styles.BulkFormWrapper}`}>
        <Row gutter={24} justify="space-around">
          <Col xs={24} sm={24} md={24} lg={24} xl={10}>
            <h2>Type</h2>
            <Divider className={styles.divider} />
            <Form.Item
              name={"alarm_enabled"}
              label="Alarm Enable"
              rules={[{ required: true, message: "required!" }]}
              // initialValue={false}
              // dependencies={['alarm_input']}
            >
              <Select
                onChange={(value) => {
                  setAlarmEnable(value);
                  form.validateFields()
                }}
                placeholder={"ON/OFF"}
              >
                <Option key={0} value={true}>
                  ON
                </Option>
                <Option key={1} value={false}>
                  OFF
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={"alarm_input"}
              label="Type"
              rules={[{ required: AlarmEnable, message: "required!" }]}
              // initialValue={Type.map((item)=>item.value)}
              // validateTrigger={['alarm_enabled']}
            >
              <Select
                onChange={(value) => {
                  setAlarmType(value);
                  form.validateFields()
                }}
                mode="multiple"
                maxTagCount={1}
                placeholder={"GPS, SMS ...."}
                
                disabled={!AlarmEnable}
              >
                {Type.map((item, index) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={10}>
            <h2>GPS Detection</h2>
            <Divider className={styles.divider} />
            <Form.Item
              name={"gps_radius"}
              label="Radius(m)"
              rules={[
                {
                  required: AlarmType?.includes("geofence"),
                  message: "required!",
                },
              ]}
              initialValue={150}
            >
              <Input
                placeholder="100~100000"
                disabled={
                  !AlarmEnable || !AlarmType?.includes("geofence")
                }
              />
            </Form.Item>

            <Form.Item
              name="gps_reference"
              label="Reference"
              rules={[
                {
                  required: AlarmType?.includes("geofence"),
                  message: "required!",
                },
              ]}
              initialValue={true}
            >
              <Select
                disabled={
                  !AlarmEnable || !AlarmType?.includes("geofence")
                }
                onChange={(value) => {
                  setGPSReference(value);
                }}
                placeholder={"Manual/Auto"}
              >
                <Option key={0} value={true}>
                  Auto Detect
                </Option>
                <Option key={1} value={false}>
                  Self Define
                </Option>
              </Select>
            </Form.Item>
            {GPSReference === false && (
              <Fragment>
                <Form.Item
                  name={"gps_latitude"}
                  label="Latitude"
                  rules={[
                    {
                      required: true && AlarmType?.includes("geofence"),
                      message: "required!",
                    },
                  ]}
                >
                  <Input
                    placeholder="-90~90"
                    disabled={
                      !AlarmType?.includes("geofence") || !AlarmEnable
                    }
                  />
                </Form.Item>
                <Form.Item
                  name={"gps_longitude"}
                  label="Longitude"
                  rules={[
                    {
                      required: true && AlarmType?.includes("geofence"),
                      message: "required!",
                    },
                  ]}
                >
                  <Input
                    placeholder="-180~180"
                    disabled={
                      !AlarmType?.includes("geofence") || !AlarmEnable
                    }
                  />
                </Form.Item>
              </Fragment>
            )}
          </Col>
        </Row>
      </div>
    </Form>

    )

}

export default BulkConfigFAlarm



////////////////////////////////////////////

export   function AlarmJSON(values) {
  return `"system": {
      "alarm": {
        "mode": ${values.alarm_enabled}
        ${
          values.alarm_enabled
            ? `,"inputs": ${JSON.stringify(values.alarm_input)}`
            : `,"inputs":["geofence"]`
        }
        ,"geofence": {
          "radius_m": ${values.gps_radius || 150},
          ${
            !values.gps_reference
              ? `"latitude": ${values.gps_latitude || 10.123456},
          "longitude": ${values.gps_longitude || 10.123456},`
              : ""
          }
          "auto_detect": ${values.gps_reference || false}
        }
      }
    }`;
}