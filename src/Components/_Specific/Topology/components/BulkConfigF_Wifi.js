import React, { useState } from "react";
import styles from "../topology.module.scss";
import { Form, Select, InputNumber, Row, Col, Input, Divider, Tag } from "antd";
import { CountryCodeData } from "./BulkConfigF_Wifi_2";

const { Option } = Select;
const { CheckableTag } = Tag;
const tagsData = ["SSID-1", "SSID-2"];
const VLANOptions = [
  { value: 1, name: "NET1" },
  { value: 2, name: "NET2" },
  { value: 3, name: "NET3" },
  { value: 4, name: "NET4" },
  { value: 5, name: "NET5" },
  { value: 6, name: "NET6" },
  { value: 7, name: "NET7" },
  { value: 8, name: "NET8" },
];

const BulkConfigFWifi = ({
  SubmitConfigonFinish,
  form,
  SelectedWPS,
  setSelectedWPS,
}) => {
  function handleTagChange(value) {
    setSelectedWPS(value);
  }

  const [SelectedCountryCode, setSelectedCountryCode] = useState(undefined);

  return (
    <Form onFinish={SubmitConfigonFinish} form={form}>
      <div className={`${styles.FormWrapper} ${styles.BulkFormWrapper}`}>
        <Row gutter={24} justify="space-around">
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 10 }}
          >
            <h2>Network Config</h2>
            <Divider className={styles.divider} />
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name={"Wifi1_ap_enable"}
                  label="AP Enable"
                  className={styles.FormItem}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    // onChange={(value) => {

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
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name={"Wifi1_bt_lwps"}
                  label="WPS Button"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    // onChange={(value) => {

                    // }}
                    placeholder={"None/SSID-1/SSID-2"}
                  >
                    <Option key={0} value={"None"}>
                      None
                    </Option>
                    <Option key={1} value={"SSID-1"}>
                      SSID-1
                    </Option>
                    <Option key={2} value={"SSID-2"}>
                      SSID-2
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name={"Wifi1_txpower"}
                  label="Tx Power"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="1~100"
                    min={1}
                    max={100}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 10 }}
          >
            <h2>SSID</h2>
            <Divider className={styles.divider} />
            {tagsData.map((tag) => (
              <CheckableTag
                key={tag}
                checked={SelectedWPS.indexOf(tag) > -1}
                onChange={(checked) => handleTagChange(tag, checked)}
                className={styles.SSIDtag}
              >
                {tag}
              </CheckableTag>
            ))}

            {/* SSID-1 */}

            <Form.Item
              name={"Wifi1_ap_isolate"}
              label="Isolate"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-1" && { display: "none" }}
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
              name={"Wifi1_btw"}
              label="HT Mode"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-1" && { display: "none" }}
            >
              <Select
                // onChange={(value) => {
                //   setLTE1PinEnable(value);
                // }}
                placeholder={"20M/40M"}
              >
                <Option key={0} value={"20M"}>
                  20M
                </Option>
                <Option key={1} value={"40M"}>
                  40M
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={"Wifi1_CountryCode"}
              label="Country Code"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-1" && { display: "none" }}
            >
              <Select
                onChange={(value) => {
                  let SelectedCountryCode = CountryCodeData.filter(
                    (item) => item.val === value
                  );
                  // console.log(value, SelectedCountryCode)
                  setSelectedCountryCode(SelectedCountryCode);
                }}
                placeholder={"Select a country"}
              >
                {CountryCodeData.map((item, index) => (
                  <Option key={index} value={item.val}>
                    {item.Code} {item.Country}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={"Wifi1_channel_id"}
              label="Channel"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-1" && { display: "none" }}
            >
              <Select
                // onChange={(value) => {
                //   setLTE1PinEnable(value);
                // }}
                placeholder={"Select a Channel"}
              >
                {SelectedCountryCode?.[0]?.channel_ids?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item ===0 ? 'Auto' :item}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name={"Wifi1_ssid"}
              label="Name(SSID)"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-1" && { display: "none" }}
            >
              <Input placeholder={"Name"} />
            </Form.Item>

            <Form.Item
              name={"Wifi1_hidden_ssid"}
              label="Hidden SSID"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-1" && { display: "none" }}
            >
              <Select
                // onChange={(value) => {
                //   setLTE1PinEnable(value);
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

            <Form.Item
              name={"Wifi1_auth"}
              label="Encryption"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-1" && { display: "none" }}
            >
              <Select
                // onChange={(value) => {
                //   setLTE1PinEnable(value);
                // }}
                placeholder={"None/WPA2-PSK-AES"}
              >
                <Option key={0} value={"None"}>
                  None
                </Option>
                <Option key={1} value={"WPA2-PSK-AES"}>
                  WPA2-PSK-AES
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={"Wifi1_passphrase"}
              label="Passphrase"
              // rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-1" && { display: "none" }}
            >
              <Input placeholder={"8~63 characters or 8~64 HEX"} />
            </Form.Item>

            <Form.Item
              name={"Wifi1_rekey"}
              label="Key Update"
              // rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-1" && { display: "none" }}
            >
              <InputNumber  style={{ width: "100%" }} placeholder={"0 no update, or 30~86400(sec)"} />
            </Form.Item>

            <Form.Item
              name={"Wifi1_vlan"}
              label="VLAN Subnet"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-1" && { display: "none" }}
            >
              <Select placeholder={"Net1-8"}>
                {VLANOptions.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* SSID-2 */}

            <Form.Item
              name={"Wifi2_enable"}
              label="Enable"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-2" && { display: "none" }}
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
              name={"Wifi2_ap_isolate"}
              label="Isolate"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-2" && { display: "none" }}
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
              name={"Wifi2_ssid"}
              label="Name(SSID)"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-2" && { display: "none" }}
            >
              <Input placeholder={"Name"} />
            </Form.Item>

            <Form.Item
              name={"Wifi2_hidden_ssid"}
              label="Hidden SSID"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-2" && { display: "none" }}
            >
              <Select
                // onChange={(value) => {
                //   setLTE1PinEnable(value);
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

            <Form.Item
              name={"Wifi2_auth"}
              label="Encryption"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-2" && { display: "none" }}
            >
              <Select
                // onChange={(value) => {
                //   setLTE1PinEnable(value);
                // }}
                placeholder={"None/WPA2-PSK-AES"}
              >
                <Option key={0} value={"None"}>
                  None
                </Option>
                <Option key={1} value={"WPA2-PSK-AES"}>
                  WPA2-PSK-AES
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={"Wifi2_passphrase"}
              label="Passphrase"
              // rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-2" && { display: "none" }}
            >
              <Input placeholder={"8~63 characters or 8~64 HEX"} />
            </Form.Item>

            <Form.Item
              name={"Wifi2_rekey"}
              label="Key Update"
              // rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-2" && { display: "none" }}
            >
              <InputNumber  style={{ width: "100%" }} placeholder={"0 no update, or 30~86400(sec)"} />
            </Form.Item>

            <Form.Item
              name={"Wifi2_vlan"}
              label="VLAN Subnet"
              rules={[{ required: true, message: "required!" }]}
              style={SelectedWPS !== "SSID-2" && { display: "none" }}
            >
              <Select placeholder={"Net1-8"}>
                {VLANOptions.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default BulkConfigFWifi;

////////////////////////////////////////////////////////

export function WifiJSON(values) {

  //Wifi1
  let wpaObj1 ={}
  if(values.Wifi1_auth){
    wpaObj1.auth = values.Wifi1_auth
  }
  // if(values.Wifi1_rekey){
    wpaObj1.rekey = values.Wifi1_rekey
  // }
  if(values.Wifi1_passphrase){
    wpaObj1.passphrase = values.Wifi1_passphrase
  }

  //Wifi2
  let wpaObj2 ={}
  if(values.Wifi2_auth){
    wpaObj2.auth = values.Wifi2_auth
  }
  // if(values.Wifi2_rekey){
    wpaObj2.rekey = values.Wifi2_rekey
  // }
  if(values.Wifi2_passphrase){
    wpaObj2.passphrase = values.Wifi2_passphrase
  }


  return `"wifi": {
    "wifi_config": {
      "ap_enable": ${values.Wifi1_ap_enable},
      "txpower": ${values.Wifi1_txpower},
      "btw": "${values.Wifi1_btw}",
      "CountryCode": ${values.Wifi1_CountryCode},
      "bt_lwps": "${values.Wifi1_bt_lwps}",
      "port": [
        {
          "basic": {
            "enable": ${values.Wifi1_enable || true},
            "ssid": "${values.Wifi1_ssid}",
            "hidden_ssid": ${values.Wifi1_hidden_ssid},
            "channel_id": ${values.Wifi1_channel_id},
            "ap_isolate": ${values.Wifi1_ap_isolate},
            "vlan": ${values.Wifi1_vlan}
          },
          "security": {
            "wpa": ${JSON.stringify(wpaObj1)}
          }
        },
        {
          "basic": {
            "enable": ${values.Wifi2_enable},
            "ssid": "${values.Wifi2_ssid}",
            "hidden_ssid": ${values.Wifi2_hidden_ssid},
            "channel_id": ${values.Wifi2_channel_id || 0},
            "ap_isolate": ${values.Wifi2_ap_isolate},
            "vlan": ${values.Wifi2_vlan}
          },
          "security": {
            "wpa": ${JSON.stringify(wpaObj2)}
          }
        }
      ]
    }
  }`;
}


