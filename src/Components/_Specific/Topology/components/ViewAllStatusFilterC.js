import React from "react";
import styles from "../topology.module.scss";
import { Form, Select, Tag, Button, Row, Col, Card } from "antd";
// import Context from "../../../../Utility/Reduxx";
import { Translator } from "../../../../i18n/index";

const { Option } = Select;


const ViewAllStatusFilterC = ({ setDeviceStatus, uploading, groups, Restore, models }) => {
  const [form] = Form.useForm();
  // const { state, dispatch } = useContext(Context);

  console.log(models)


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
    
    NewData = NewData.filter((item) => {
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
        (groupfilter?.length ? true : (!values.groups?.length))
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
    <Card style={{ marginBottom: "10px" }} className={styles.TopoTableCard}>
    <Form onFinish={onFinish} form={form} layout={"vertical"}>
      <div className={styles.FormWrapper}>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={9} xl={9}>
            <Form.Item
              name="device"
              label={Translator("ISMS.Device")}
              // className={styles.FilterDevice}
              initialValue={[]}
            >
              <Select
                loading={uploading}
                disabled={uploading}
                maxTagCount={1}
                mode="multiple"
                // mode="tags"
                placeholder={Translator("ISMS.Search")}
                showArrow
                tagRender={tagRender}
                onChange={() => form.submit()}
                // onBlur={() => form.submit()}
              >
                {Restore?.map((item, index) => {
                  return (
                    <Option key={index} value={item.name ? item.name : item.id}>
                      {item.name ? item.name : item.id}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={5}>
            <Form.Item
            initialValue={[]}
              name="model"
              label={Translator("ISMS.Model")}
              className={styles.FilterModel}
            >
              <Select
                loading={uploading}
                disabled={uploading}
                mode="multiple"
                maxTagCount={1}
                showArrow
                placeholder={Translator("ISMS.Search")}
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
          <Col xs={24} sm={24} md={10} lg={5}>
            <Form.Item
            initialValue={[]}
              name="health"
              label={Translator("ISMS.Health")}
              className={styles.FilterHealth}
            >
              <Select
                loading={uploading}
                disabled={uploading}
                maxTagCount={1}
                mode="multiple"
                placeholder={Translator("ISMS.Search")}
                showArrow
                tagRender={tagRender}
                // style={{ width: "100%" }}
                options={healthoptions}
                onChange={() => form.submit()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={5}>
            <Form.Item
            initialValue={[]}
              name="strength"
              label={Translator("ISMS.Strength")}
              className={styles.FilterStrength}
            >
              <Select
                loading={uploading}
                disabled={uploading}
                mode="multiple"
                placeholder={Translator("ISMS.Search")}
                showArrow
                maxTagCount={1}
                tagRender={tagRender}
                // style={{ width: "100%" }}
                options={strengthoptions}
                onChange={() => form.submit()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={5}>
            <Form.Item name="groups" label={"Group"} initialValue={[]}>
              <Select
                loading={uploading}
                disabled={uploading}
                mode="multiple"
                placeholder={Translator("ISMS.Search")}
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
          <Col xs={24} sm={4} md={3} lg={3}>
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
                  });
                }}
              >
                {Translator("ISMS.Reset")}
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
