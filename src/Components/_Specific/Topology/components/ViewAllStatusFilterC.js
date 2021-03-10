import React, { useEffect, useState } from "react";
import styles from "../topology.module.scss";
import { Form, Select, Tag, Button, Row, Col, Card } from "antd";
// import Context from "../../../../Utility/Reduxx";
import { useTranslation } from "react-i18next";
const { Option } = Select;


const ViewAllStatusFilterC = ({ setDeviceStatus, uploading, groups, Restore, models, cities }) => {
  const [form] = Form.useForm();
  const [value, setvalue] = useState([])
  // const { state, dispatch } = useContext(Context);
  const { t } = useTranslation();
  // console.log(cities)
  useEffect(()=>{
    console.log(value)
    form.setFieldsValue(value);
    form.submit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  },[Restore])


  const healthoptions = [
    { value: "up" },
    { value: "critical" },
    { value: "warning" },
    { value: "offline" },
  ];
  const strengthoptions = [
    { value: "excellent" },
    { value: "good" },
    { value: "fair" },
    { value: "poor" },
  ];

  const onFinish = (values) => {
    console.log(values)
    setvalue(values)
    let NewData = Restore;
    // if (
    //   !values.health.length ||
    //   !values.strength.length ||
    //   !values.model.length ||
    //   !values.device.length ||
    //   !values.groups.length
    // ) {
    //   setDeviceStatus(Restore);
    // }
    
    NewData = NewData?.filter((item) => {
      let groupfilter
      if(values.groups?.length){
        groupfilter = item.gid.filter(g=> values.groups.indexOf(g) > -1)
      }
      // console.log(Restore)
      return (
        (values.device.length ? values.device.includes(item.name) || values.device.includes(item.id): true) &&
        (values.model.length ? values.model.includes(item.model) : true) &&
        (values.health.length ? values.health.includes(item.health) : true) &&
        (values.strength.length? values.strength.includes(item.strength): true) &&
        (groupfilter?.length ? true : (!values.groups?.length)) && (values.cities.length? values.cities.includes(item.city): true)
      );
    });
    setDeviceStatus(NewData);
  };

  function ColorSorter(label) {
    if (label === "up" || label === "excellent") {
      return "#28a745";
    }
    if (label === "critical" || label === "good") {
      return "#ffc107";
    }
    if (label === "warning" || label === "fair") {
      return "#dc3545";
    }
    if (label === "offline" || label === "poor") {
      return "#343a40";
    } else {
      return "gray";
    }
  }

  function tagRender({ label, _, closable, onClose }) {
    return (
      <Tag
        color={ColorSorter(label)}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }

  return (
    <Card style={{ marginBottom: "10px" }} className={styles.TopoTableCard} title={t("ISMS.Filter")}>
    <Form onFinish={onFinish} form={form} layout={"vertical"}>
      <div className={styles.FormWrapper}>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={9} xl={9} xxl={5}  className={styles.colum}>
            <Form.Item
              name="device"
              label={t("ISMS.Device")}
              // className={styles.FilterDevice}
              initialValue={[]}
            >
              <Select
                loading={uploading}
                disabled={uploading}
                maxTagCount={1}
                mode="multiple"
                // mode="tags"
                placeholder={t("ISMS.Search")}
                showArrow
                tagRender={tagRender}
                onChange={() => form.submit()}
                // onBlur={() => form.submit()}
              >
                {Restore?.map((item, index) => {
                  return (
                    <Option key={index} value={ item.id}>
                      {item.name ? item.name : item.id}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={5} xl={5} xxl={3} className={styles.colum}>
            <Form.Item
            initialValue={[]}
              name="model"
              label={t("ISMS.Model")}
              className={styles.FilterModel}
            >
              <Select
                loading={uploading}
                disabled={uploading}
                mode="multiple"
                maxTagCount={1}
                showArrow
                placeholder={t("ISMS.Search")}
                tagRender={tagRender}
                onChange={() => form.submit()}
              >
                {models?.map((item,index)=>
                  <Option key={index} value={item}>
                  {item}
                </Option>
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={5} xl={5} xxl={3} className={styles.colum}>
            <Form.Item
            initialValue={[]}
              name="health"
              label={t("ISMS.Health")}
              className={styles.FilterHealth}
            >
              <Select
                loading={uploading}
                disabled={uploading}
                maxTagCount={1}
                mode="multiple"
                placeholder={t("ISMS.Search")}
                showArrow
                tagRender={tagRender}
                // style={{ width: "100%" }}
                options={healthoptions}
                onChange={() => form.submit()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={5} xl={5} xxl={3} className={styles.colum}>
            <Form.Item
            initialValue={[]}
              name="strength"
              label={t("ISMS.Strength")}
              className={styles.FilterStrength}
            >
              <Select
                loading={uploading}
                disabled={uploading}
                mode="multiple"
                placeholder={t("ISMS.Search")}
                showArrow
                maxTagCount={1}
                tagRender={tagRender}
                // style={{ width: "100%" }}
                options={strengthoptions}
                onChange={() => form.submit()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={5} xl={5} xxl={4} className={styles.colum}>
            <Form.Item name="groups" label={t("ISMS.Group")} initialValue={[]}>
              <Select
                loading={uploading}
                disabled={uploading}
                mode="multiple"
                placeholder={t("ISMS.Search")}
                showArrow
                maxTagCount={1}
                tagRender={tagRender}
                onChange={() => form.submit()}
              >
                {groups?.map((item, index) => {
                  return (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={5} xl={5} xxl={4} className={styles.colum}>
            <Form.Item name="cities" label={t("ISMS.Location")} initialValue={[]}>
              <Select
                loading={uploading}
                disabled={uploading}
                mode="multiple"
                placeholder={t("ISMS.Search")}
                showArrow
                maxTagCount={1}
                tagRender={tagRender}
                onChange={() => form.submit()}
              >
                {cities?.map((item, index) => {
                  return (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={4} md={3} lg={3} xl={3} xxl={2} className={styles.colum}>
            <Form.Item style={{ marginLeft: "15px" }}>
              <Button
                type={"primary"}
                loading={uploading}
                disabled={uploading}
                onClick={() => {
                  // console.log(Restore);
                  setDeviceStatus(Restore);
                  form.setFieldsValue({
                    device: [],
                    model: [],
                    health: [],
                    strength: [],
                    groups:[],
                    cities:[]
                  });
                  setvalue([])
                }}
              >
                {t("ISMS.Clear")}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
    </Card>
  );
};

export const ViewAllStatusFilterMC = React.memo(ViewAllStatusFilterC);
