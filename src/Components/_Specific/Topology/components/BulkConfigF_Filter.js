import React, { Fragment } from "react";
import styles from "../topology.module.scss";
import { Form, Select, Button, Row, Col, Divider, Tag, Radio } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const BulkConfigFilter = ({
  SubmitConfigonFinish,
  form,
  ImportFrom,
  setImportFrom,
  handleDeviceChange,
  setFilterData,
  // setShowLan,
  showLan,
  // setShowWan,
  showWan,
  // setShowLte,
  showLte,
  showAlarm,
  showWifi,
  // setShowAlarm,
  showPeriod,
  // setShowPeriod,
  // setShowWifi,
  // setPriorityOrderOptions,
  setSavevisible,
  loading,
  dataSource,
  handleFileChange,
  Fileloading,
  FileRepository,
  Nodeloading,
  groups,
  cities,
  models,
  filterData,
  OnChangeFilter,
  level,
  RebootDevices,
  NodeList,
  DeviceNum,
  setDeviceNum,
  setSelectedModel
}) => {
  const [value, setValue] = React.useState("New");
  const { t } = useTranslation();
  function tagRender(props) {
    const { label, _, closable, onClose } = props; // eslint-disable-line no-unused-vars
    return (
      <Tag
        color="black"
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }

  const ImportonChange = (e) => {
    // console.log("radio checked", e.target.value);
    setValue(e.target.value);
    form.resetFields();
    setImportFrom("");
  };

  function SelectAll() {
    const allDevice = NodeList?.map((item) => item.id);
    form.setFieldsValue({
      Device_ID: allDevice,
    });
  }

  function ClearAll() {
    form.resetFields(["Device_ID"]);
  }

  return (
    <Form onFinish={SubmitConfigonFinish} form={form} layout="vertical">
      <div className={`${styles.FormWrapper} ${styles.BulkFormWrapper}`}>
        <Row gutter={24} justify="flex-start">
          <Col xs={24} sm={24} md={24} lg={3} className={styles.ImportRadio}>
            <Radio.Group onChange={ImportonChange} value={value}>
              <Radio value={"New"}>{t("ISMS.NewConfig")}</Radio>
              <Radio value={"Import"}>{t("ISMS.Import")}</Radio>
            </Radio.Group>
          </Col>

          <Col xs={24} sm={24} md={24} lg={5} className={styles.colum}>
            <Form.Item name="ImportSelector" label={t("ISMS.Source")}>
              <Select
                placeholder={t("ISMS.Select")}
                onChange={(value) => {
                  setImportFrom(value);
                }}
                disabled={value !== "Import"}
              >
                <Option value={"Device"}>Device</Option>
                <Option value={"FileRepository"}>FileRepository</Option>
              </Select>
            </Form.Item>
          </Col>

          {ImportFrom === "Device" && (
            <Col xs={24} sm={24} md={24} lg={7} className={styles.colum}>
              <Form.Item name="device" label="Import Device">
                <Select
                  placeholder="Select a Device"
                  onChange={(value)=>handleDeviceChange(value)}
                  disabled={value !== "Import" || loading}
                  loading={loading}
                  showSearch
                >
                  {dataSource?.map((item, index) => {
                    return (
                      <Option key={index} value={item.id}>
                        {item.name !== "" ? item.name : item.id}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          )}

          {ImportFrom === "FileRepository" && (
            <Col xs={24} sm={24} md={24} lg={7}>
              <Form.Item name="FileRepository" label="Import File">
                <Select
                  placeholder="Select a File"
                  onChange={(value)=>handleFileChange(value)}
                  loading={loading || Fileloading}
                  disabled={loading || Fileloading}
                >
                  {/* <Option value={"demo"}>Bulk_Demo.yaml</Option> */}
                  {FileRepository?.map((item, index) => {
                    return (
                      <Option value={item.name} key={index}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={10} xl={4}>
            <Form.Item
              label={t("ISMS.Model")}
              name="models"
              // className={styles.formitem}
              rules={[{ required: true, message: "Model is required" }]}
            >
              <Select
                loading={Nodeloading || loading}
                showSearch
                showArrow
                disabled={Nodeloading || loading || value !== "New"}
                placeholder={t("ISMS.Select")}
                onChange={(value) => {
                  setSelectedModel(value)
                  form.resetFields([["Device_ID"]]);
                  let NewfilterData = filterData;
                  NewfilterData.models = value;
                  setFilterData(NewfilterData);
                  OnChangeFilter();
                }}
              >
                {models.map((item, index) => {
                  return (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={10} xl={6}>
            <Form.Item label={t("ISMS.Group")} name="group">
              <Select
                loading={Nodeloading || loading}
                showSearch
                showArrow
                disabled={Nodeloading || loading}
                mode="multiple"
                tagRender={tagRender}
                maxTagCount={1}
                placeholder={t("ISMS.Select")}
                onChange={(value) => {
                  form.resetFields([["Device_ID"]]);
                  let NewfilterData = filterData;
                  NewfilterData.groups = value;
                  setFilterData(NewfilterData);
                  OnChangeFilter();
                }}
              >
                {groups.map((item, index) => {
                  return (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={10} xl={5}>
            <Form.Item label={t("ISMS.Location")} name="cities">
              <Select
                loading={Nodeloading || loading}
                showSearch
                showArrow
                disabled={Nodeloading || loading}
                mode="multiple"
                tagRender={tagRender}
                maxTagCount={1}
                placeholder={t("ISMS.Select")}
                onChange={(value) => {
                  form.resetFields([["Device_ID"]]);
                  console.log(value);
                  let NewfilterData = filterData;
                  NewfilterData.cities = value;
                  setFilterData(NewfilterData);
                  OnChangeFilter();
                }}
              >
                {cities.map((item, index) => {
                  return (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={10} xl={9}>
            <Form.Item
              label={t("ISMS.Device")}
              // className={styles.formitem}
              name="Device_ID"
              rules={[{ required: true, message: "Deivce is required!" }]}
            >
              <Select
                loading={Nodeloading || loading}
                disabled={Nodeloading || loading}
                mode="multiple"
                placeholder={t("ISMS.Select")}
                showArrow
                tagRender={tagRender}
                maxTagCount={1}
                onChange={(value)=>setDeviceNum(value)}
                dropdownRender={(menu) => (
                  <Fragment>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <Button
                      onClick={() => SelectAll()}
                      style={{ margin: "5px", padding: "3px 5px" }}
                    >
                       {t("ISMS.SelectAll")}
                    </Button>
                    <Button
                      onClick={() => ClearAll()}
                      style={{ margin: "5px", padding: "3px 5px" }}
                    >
                       {t("ISMS.ClearAll")}
                    </Button>
                  </Fragment>
                )}
              >
                {NodeList?.map((item, index) => {
                  return (
                    <Option key={index} value={item.id}>
                      {item.name !== "" ? item.name : item.id}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} justify="space-between">
          <Col xs={24} sm={24} md={24} lg={10} xl={3} className={styles.submitBtn}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={Nodeloading || loading}
                disabled={
                  (!showLan &&
                    !showWan &&
                    !showLte &&
                    !showWifi &&
                    !showPeriod &&
                    !showAlarm) ||
                  level === "get"
                }
              >
                {t("ISMS.Submit")}
              </Button>
            </Form.Item>
            <Form.Item style={{ marginLeft: "5%" }}>
              <Button
                type="primary"
                // htmlType="reboot"
                danger
                onClick={() => RebootDevices("reboot")}
                loading={Nodeloading || loading}
                disabled={level === "get" || DeviceNum.length===0}
              >
                {t("ISMS.Reboot")}
              </Button>
            </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={10} xl={4} xxl={3} className={styles.submitBtn}>
            <Form.Item >
              <Button
              // style={{width:'78.38px'}}
                loading={Nodeloading || loading}
                onClick={() => {
                  form.resetFields();
                  // setShowLan(true);
                  // setShowWan(true);
                  // setShowLte(true);
                  // setShowAlarm(true)
                  // setShowWifi(true)
                  // setShowPeriod(true)
                  setDeviceNum([])
                  // setPriorityOrderOptions(["LTE", "ETH", "WiFi"]);
                }}
              >
                {t("ISMS.Clear")}
              </Button>
            </Form.Item>
            <Form.Item style={{ marginLeft: "15px" }}>
              <Button
              //  style={{width:'78.38px'}}
                loading={Nodeloading || loading}
                onClick={async () => {
                  await form.validateFields();

                  setSavevisible(true);
                }}
                disabled={
                  (!showLan &&
                    !showWan &&
                    !showLte &&
                    !showPeriod &&
                    !showWifi &&
                    !showAlarm) ||
                  level === "get"
                }
              >
                {t("ISMS.Save")}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default BulkConfigFilter;
