import React, { Fragment } from "react";
import styles from "../topology.module.scss";
import { Form, Select, Row, Col, Tag, Input, Divider } from "antd";

const { Option } = Select;
const { CheckableTag } = Tag;

const BulkConfigFLte = ({
  SubmitConfigonFinish,
  form,
  LTE1PinEnable,
  setLTE1PinEnable,
  LTE2PinEnable,
  setLTE2PinEnable,
  LTERecoverAPN1,
  setLTERecoverAPN1,
  LTE1DataLimitEnable,
  setLTE1DataLimitEnable,
  LTE2DataLimitEnable,
  setLTE2DataLimitEnable,
  showDualSim,
  SelectedSIM,
  setSelectedSIM,
  SelectedModel,
  M300model,
}) => {
  const tagsData = ["SIM1", "SIM2"];

  function handleTagChange(value) {
    setSelectedSIM(value);
  }
  return (
    <Form onFinish={SubmitConfigonFinish} form={form}>
      <div className={`${styles.FormWrapper} ${styles.BulkFormWrapper}`}>
        <Row gutter={24} justify="space-around">
          <Col xs={24} sm={24} md={24} lg={10}>
            <h2>Ethernet</h2>
            <Divider className={styles.divider} />
            <Form.Item
              name="LTE_mode"
              label="LTE Config"
              rules={[{ required: true, message: "required!" }]}
            >
              <Select placeholder={"Auto/2G/3G/4G..."}>
                <Option key={0} value={"auto"}>
                  Auto
                </Option>
                <Option key={1} value={"2G-only"}>
                  2G-only
                </Option>
                <Option key={3} value={"3G-only"}>
                  3G-only
                </Option>
                <Option key={4} value={"4G-only"}>
                  4G-only
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={"LTE_mtu"}
              label="MTU"
              rules={[{ required: true, message: "required!" }]}
            >
              <Input placeholder={"700 ~ 1500"} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={10}>
            <h2>APN Config</h2>
            <Divider className={styles.divider} />
            {showDualSim &&
              M300model.includes(SelectedModel) &&
              tagsData.map((tag) => (
                <CheckableTag
                  key={tag}
                  checked={SelectedSIM.indexOf(tag) > -1}
                  onChange={(checked) => handleTagChange(tag, checked)}
                >
                  {tag}
                </CheckableTag>
              ))}

            <h3>SIM Configuration</h3>
            {!M300model.includes(SelectedModel) && <Form.Item
              name={"LTE1_pin_enabled"}
              label="PIN Enable"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Select
                onChange={(value) => {
                  setLTE1PinEnable(value);
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
            </Form.Item>}

            <Form.Item
              name={"LTE1_pin"}
              label="PIN"
              // rules={[{ required: LTE1PinEnable, message: "required!" }]}
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Input disabled={!LTE1PinEnable} placeholder={"******"} />
            </Form.Item>
            <Form.Item
              name={"LTE1_puk"}
              label="PUK"
              // rules={[{ required: LTE1PinEnable, message: "required!" }]}
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Input disabled={!LTE1PinEnable} placeholder={"******"} />
            </Form.Item>

            {!M300model.includes(SelectedModel) && <Form.Item
              name={"LTE2_pin_enabled"}
              label="PIN Enable"
              initialValue={false}
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Select
                onChange={(value) => {
                  setLTE2PinEnable(value);
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
            </Form.Item>}

            <Form.Item
              name={"LTE2_pin"}
              label="PIN"
              // rules={[{ required: LTE2PinEnable, message: "required!" }]}
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Input disabled={!LTE2PinEnable} placeholder={"******"} />
            </Form.Item>
            <Form.Item
              name={"LTE2_puk"}
              label="PUK"
              // rules={[{ required: LTE2PinEnable, message: "required!" }]}
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Input disabled={!LTE2PinEnable} placeholder={"******"} />
            </Form.Item>

            <h3>APN1</h3>

            <Form.Item
              name={"LTE1_apn"}
              label="APN"
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Input placeholder={"APN Name"} />
            </Form.Item>
            <Form.Item
              name={"LTE1_username"}
              label="UserName"
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Input placeholder={"User"} />
            </Form.Item>
            <Form.Item
              name={"LTE1_password"}
              label="Password"
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Input placeholder={"Password"} />
            </Form.Item>
            <Form.Item
              name="LTE1_auth"
              label="Auth Type"
              // rules={[{ required: true, message: "required!" }]}
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Select placeholder={"PAP/CHAP"}>
                <Option key={0} value={"none"}>
                  NONE
                </Option>
                <Option key={1} value={"pap"}>
                  PAP
                </Option>
                <Option key={3} value={"chap"}>
                  CHAP
                </Option>
              </Select>
            </Form.Item>
            {!M300model.includes(SelectedModel) && <Form.Item
              name={"LTE1_ipv6_enabled"}
              label="Enable IPv6"
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Select placeholder={"ON/OFF"}>
                <Option key={0} value={true}>
                  ON
                </Option>
                <Option key={1} value={false}>
                  OFF
                </Option>
              </Select>
            </Form.Item>}

            <Form.Item
              name={"LTE2_apn"}
              label="APN"
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Input placeholder={"APN Name"} />
            </Form.Item>
            <Form.Item
              name={"LTE2_username"}
              label="UserName"
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Input placeholder={"User"} />
            </Form.Item>
            <Form.Item
              name={"LTE2_password"}
              label="Password"
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Input placeholder={"Password"} />
            </Form.Item>
            <Form.Item
              name="LTE2_auth"
              label="Auth Type"
              // rules={[{ required: true, message: "required!" }]}
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Select placeholder={"PAP/CHAP"}>
                <Option key={0} value={"none"}>
                  NONE
                </Option>
                <Option key={1} value={"pap"}>
                  PAP
                </Option>
                <Option key={3} value={"chap"}>
                  CHAP
                </Option>
              </Select>
            </Form.Item>
            {!M300model.includes(SelectedModel) && <Form.Item
              name={"LTE2_ipv6_enabled"}
              label="Enable IPv6"
              // initialValue={false}
              // rules={[{ required: true, message: "required!" }]}
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Select placeholder={"ON/OFF"}>
                <Option key={0} value={true}>
                  ON
                </Option>
                <Option key={1} value={false}>
                  OFF
                </Option>
              </Select>
            </Form.Item>}

            {/* <h3>APN2</h3>
            <Form.Item
              name={"LTE1_apn2"}
              label="APN"
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Input placeholder={"APN Name"} />
            </Form.Item>
            <Form.Item
              name={"LTE1_username2"}
              label="UserName"
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Input placeholder={"User"} />
            </Form.Item>
            <Form.Item
              name={"LTE1_password2"}
              label="Password"
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Input placeholder={"Password"} />
            </Form.Item>
            <Form.Item
              name="LTE1_auth2"
              label="Auth Type"
              // rules={[{ required: true, message: "required!" }]}
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Select placeholder={"PAP/CHAP"}>
                <Option key={0} value={"none"}>
                  NONE
                </Option>
                <Option key={1} value={"pap"}>
                  PAP
                </Option>
                <Option key={3} value={"chap"}>
                  CHAP
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={"LTE1_ipv6_enabled2"}
              label="Enable IPv6"
              style={SelectedSIM !== "SIM1" && { display: "none" }}
            >
              <Select placeholder={"ON/OFF"}>
                <Option key={0} value={true}>
                  ON
                </Option>
                <Option key={1} value={false}>
                  OFF
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={"LTE2_apn2"}
              label="APN"
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Input placeholder={"APN Name"} />
            </Form.Item>
            <Form.Item
              name={"LTE2_username2"}
              label="UserName"
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Input placeholder={"User"} />
            </Form.Item>
            <Form.Item
              name={"LTE2_password2"}
              label="Password"
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Input placeholder={"Password"} />
            </Form.Item>
            <Form.Item
              name="LTE2_auth2"
              label="Auth Type"
              // rules={[{ required: true, message: "required!" }]}
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Select placeholder={"PAP/CHAP"}>
                <Option key={0} value={"none"}>
                  NONE
                </Option>
                <Option key={1} value={"pap"}>
                  PAP
                </Option>
                <Option key={3} value={"chap"}>
                  CHAP
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={"LTE2_ipv6_enabled2"}
              label="Enable IPv6"
              style={SelectedSIM !== "SIM2" && { display: "none" }}
            >
              <Select placeholder={"ON/OFF"}>
                <Option key={0} value={true}>
                  ON
                </Option>
                <Option key={1} value={false}>
                  OFF
                </Option>
              </Select>
            </Form.Item> */}

            <h3>Data Limitation</h3>

            <Form.Item
              name={"LTE1_limit_enabled"}
              label="limit enabled"
              style={SelectedSIM !== "SIM1" && { display: "none" }}
              rules={[{ required: true, message: "required!" }]}
            >
              <Select
                onChange={(value) => {
                  setLTE1DataLimitEnable(value);
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
            {LTE1DataLimitEnable && (
              <Fragment>
                <Form.Item
                  name={"LTE1_limit_mbyte"}
                  label="Max Data Limitation (MB)"
                  rules={[{ required: true, message: "required!" }]}
                  style={SelectedSIM !== "SIM1" && { display: "none" }}
                >
                  <Input placeholder="1" />
                </Form.Item>
                <Form.Item
                  name={"LTE1_reset_day"}
                  label="Reset Day"
                  rules={[{ required: true, message: "required!" }]}
                  style={SelectedSIM !== "SIM1" && { display: "none" }}
                >
                  <Input placeholder="1" />
                </Form.Item>
                <Form.Item
                  name={"LTE1_reset_hour"}
                  label="Hour"
                  rules={[{ required: true, message: "required!" }]}
                  style={SelectedSIM !== "SIM1" && { display: "none" }}
                >
                  <Input placeholder="1" />
                </Form.Item>
                <Form.Item
                  name={"LTE1_reset_minute"}
                  label="Minute"
                  rules={[{ required: true, message: "required!" }]}
                  style={SelectedSIM !== "SIM1" && { display: "none" }}
                >
                  <Input placeholder="1" />
                </Form.Item>
                <Form.Item
                  name={"LTE1_reset_second"}
                  label="Second"
                  rules={[{ required: true, message: "required!" }]}
                  style={SelectedSIM !== "SIM1" && { display: "none" }}
                >
                  <Input placeholder="1" />
                </Form.Item>
              </Fragment>
            )}

            <Form.Item
              name={"LTE2_limit_enabled"}
              label="limit enabled"
              style={SelectedSIM !== "SIM2" && { display: "none" }}
              // rules={[{ required: true, message: "required!" }]}
              initialValue={false}
            >
              <Select
                onChange={(value) => {
                  setLTE2DataLimitEnable(value);
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
            {LTE2DataLimitEnable && (
              <Fragment>
                <Form.Item
                  name={"LTE2_limit_mbyte"}
                  label="Max Data Limitation (MB)"
                  rules={[{ required: true, message: "required!" }]}
                  style={SelectedSIM !== "SIM2" && { display: "none" }}
                >
                  <Input placeholder="1" />
                </Form.Item>
                <Form.Item
                  name={"LTE2_reset_day"}
                  label="Reset Day"
                  rules={[{ required: true, message: "required!" }]}
                  style={SelectedSIM !== "SIM2" && { display: "none" }}
                >
                  <Input placeholder="1" />
                </Form.Item>
                <Form.Item
                  name={"LTE2_reset_hour"}
                  label="Hour"
                  rules={[{ required: true, message: "required!" }]}
                  style={SelectedSIM !== "SIM2" && { display: "none" }}
                >
                  <Input placeholder="1" />
                </Form.Item>
                <Form.Item
                  name={"LTE2_reset_minute"}
                  label="Minute"
                  rules={[{ required: true, message: "required!" }]}
                  style={SelectedSIM !== "SIM2" && { display: "none" }}
                >
                  <Input placeholder="1" />
                </Form.Item>
                <Form.Item
                  name={"LTE2_reset_second"}
                  label="Second"
                  rules={[{ required: true, message: "required!" }]}
                  style={SelectedSIM !== "SIM2" && { display: "none" }}
                >
                  <Input placeholder="1" />
                </Form.Item>
              </Fragment>
            )}

            <h3>Connect Policy</h3>
            <Form.Item
              name={"LTE_roaming"}
              label="Roaming"
              initialValue={false}
              rules={[{ required: true, message: "required!" }]}
            >
              <Select
                // onChange={(value) => {
                //   setLTERoamingEnable(value);
                // }}
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

            <h3>Recover APN</h3>
            <Form.Item
              name={"LTE_recovery_apn_enabled"}
              label="Recover APN"
              initialValue={false}
              rules={[{ required: true, message: "required!" }]}
            >
              <Select
                onChange={(value) => {
                  setLTERecoverAPN1(value);
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

            {LTERecoverAPN1 && (
              <Fragment>
                <Form.Item
                  name={"LTE_recovery_down_time"}
                  label="Recover DownTimes"
                  rules={[{ required: true, message: "required!" }]}
                >
                  <Input placeholder="3 ~ 15" />
                </Form.Item>
                <Form.Item
                  name="LTE_recovery_apn_action"
                  label="Recover action"
                  rules={[{ required: true, message: "required!" }]}
                >
                  <Select placeholder={"Reboot/Recover"}>
                    <Option key={0} value={"reboot"}>
                      Reboot
                    </Option>
                    <Option key={1} value={"default-apn"}>
                      Recover to default APN
                    </Option>
                    <Option key={3} value={"previous-apn"}>
                      Recover to previous working APN
                    </Option>
                  </Select>
                </Form.Item>
              </Fragment>
            )}
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default BulkConfigFLte;

/////////////////////////////////////////////////////////////////////////////////////////////////////////

export function LteJSON(values, showDualSim, form) {
  //config
  // let configObj = {}
  // configObj.mode = values.LTE_mode
  // configObj.mtu = values.LTE_mtu

  //policy
  // let policyObj = {}
  // policyObj.roaming = values.LTE_roaming
  // let recoveryObj = {}
  // recoveryObj.down_times = values.LTE_recovery_down_time
  // let recovery_apn_obj = {}
  // if(values.LTE_recovery_apn_enabled){
  //   recovery_apn_obj.enabled = values.LTE_recovery_apn_enabled
  //   recovery_apn_obj.action = values.LTE_recovery_apn_action
  // }
  // policyObj.recover_apn = recovery_apn_obj form.isFieldTouched('LTE1_puk')

  let simArray = [];
  //SIM1
  //sim
  let sim1Obj = {};
  if (form.isFieldTouched("LTE1_pin")) {
    sim1Obj.pin = values.LTE1_pin;
  }
  if (form.isFieldTouched("LTE1_puk")) {
    sim1Obj.puk = values.LTE1_puk;
  }
  sim1Obj.pin_enabled = values.LTE1_pin_enabled || false;
  let apn1Array = [];
  let apn1Obj = {};
  // let apn1Obj2 = {};
  if (values.LTE1_apn) {
    apn1Obj.apn = values.LTE1_apn;
  }
  // if (values.LTE1_apn2) {
  //   apn1Obj2.apn = values.LTE1_apn2;
  // }
  apn1Obj.ipv6_enabled = values.LTE1_ipv6_enabled || false;
  // apn1Obj2.ipv6_enabled = values.LTE1_ipv6_enabled2 || false;

  let Auth1Obj = {};
  // let Auth1Obj2 = {};
  if (values.LTE1_username) {
    Auth1Obj.username = values.LTE1_username;
  }
  // if (values.LTE1_username2) {
  //   Auth1Obj2.username = values.LTE1_username2;
  // }

  if (values.LTE1_password) {
    Auth1Obj.password = values.LTE1_password;
  }
  // if (values.LTE1_password2) {
  //   Auth1Obj2.password = values.LTE1_password2;
  // }
  if (values.LTE1_auth) {
    Auth1Obj.type = values.LTE1_auth;
  }
  // if (values.LTE1_auth2) {
  //   Auth1Obj2.type = values.LTE1_auth2;
  // }
  apn1Obj.auth = Auth1Obj;
  // apn1Obj2.auth = Auth1Obj2;
  apn1Array.push(apn1Obj);
  // apn1Array.push(apn1Obj2);
  sim1Obj.apn = apn1Array;
  simArray.push(sim1Obj);
  //limit
  let limitArray = [];
  let sim1_limit_obj = {};
  sim1_limit_obj.enabled = values.LTE1_limit_enabled;
  sim1_limit_obj.limit_mbyte = values.LTE1_limit_mbyte;
  let rest_obj = {};
  rest_obj.day = values.LTE1_reset_day;
  rest_obj.hour = values.LTE1_reset_hour;
  rest_obj.minute = values.LTE1_reset_minute;
  rest_obj.second = values.LTE1_reset_second;
  sim1_limit_obj.reset = rest_obj;
  limitArray.push(sim1_limit_obj);

  //SIM2
  //sim
  if (showDualSim) {
    let sim2Obj = {};
    if (form.isFieldTouched("LTE2_pin")) {
      sim2Obj.pin = values.LTE2_pin;
    }
    if (form.isFieldTouched("LTE1_puk")) {
      sim2Obj.puk = values.LTE1_puk;
    }
    sim2Obj.pin_enabled = values.LTE2_pin_enabled || false;
    let apn2Array = [];
    let apn2Obj = {};
    // let apn2Obj2 = {};
    if (values.LTE2_apn) {
      apn2Obj.apn = values.LTE2_apn;
    }
    // if (values.LTE2_apn2) {
    //   apn2Obj2.apn = values.LTE2_apn2;
    // }
    apn2Obj.ipv6_enabled = values.LTE2_ipv6_enabled || false;
    // apn2Obj2.ipv6_enabled = values.LTE2_ipv6_enabled2 || false;
    let Auth2Obj = {};
    // let Auth2Obj2 = {};
    if (values.LTE2_username) {
      Auth2Obj.username = values.LTE2_username;
    }
    // if (values.LTE2_username2) {
    //   Auth2Obj2.username = values.LTE2_username2;
    // }
    if (values.LTE2_password) {
      Auth2Obj.password = values.LTE2_password;
    }
    // if (values.LTE2_password2) {
    //   Auth2Obj2.password = values.LTE2_password2;
    // }
    if (values.LTE2_auth) {
      Auth2Obj.type = values.LTE2_auth;
    }
    // if (values.LTE2_auth2) {
    //   Auth2Obj2.type = values.LTE2_auth2;
    // }
    apn2Obj.auth = Auth2Obj;
    // apn2Obj2.auth = Auth2Obj2;
    apn2Array.push(apn2Obj);
    // apn2Array.push(apn2Obj2);
    sim2Obj.apn = apn2Array;
    simArray.push(sim2Obj);
    // sim2-limitation
    let sim2_limit_obj = {};
    sim2_limit_obj.enabled = values.LTE2_limit_enabled;
    sim2_limit_obj.limit_mbyte = values.LTE2_limit_mbyte;
    let rest_obj = {};
    rest_obj.day = values.LTE2_reset_day;
    rest_obj.hour = values.LTE2_reset_hour;
    rest_obj.minute = values.LTE2_reset_minute;
    rest_obj.second = values.LTE2_reset_second;
    sim2_limit_obj.reset = rest_obj;
    limitArray.push(sim2_limit_obj);
  }
  // let lteData = {}
  // lteData.config = configObj
  // lteData.sim = simArray
  // lteData.limi = limitArray
  // lteData.policy = policyObj

  return `"lte":{"config":{"mode":"${values.LTE_mode}","mtu":${
    values.LTE_mtu
  }},"sim":${JSON.stringify(simArray)},"limit":[{"enabled":${
    values.LTE1_limit_enabled
  } ,"limit_mbyte":${values.LTE1_limit_mbyte || 0},"reset":{"day":${
    values.LTE1_reset_day || 31
  },"hour":${values.LTE1_reset_hour || 23},"minute":${
    values.LTE1_reset_minute || 0
  },"second":${values.LTE1_reset_second || 0}}}${
    showDualSim
      ? `,{"enabled":${values.LTE2_limit_enabled || false} ,"limit_mbyte":${
          values.LTE2_limit_mbyte|| 0
        },"reset":{"day":${values.LTE2_reset_day|| 31},"hour":${
          values.LTE2_reset_hour|| 23
        },"minute":${values.LTE2_reset_minute|| 0},"second":${
          values.LTE2_reset_second|| 0
        }}}`
      : ""
  }],"policy":{"roaming":${values.LTE_roaming},"recovery":{"down_times":${values.LTE_recovery_down_time || 3
  },"recover_apn":{"enabled":${values.LTE_recovery_apn_enabled},"action":"${values.LTE_recovery_apn_action || "reboot"
  }"}}}}`;
}
