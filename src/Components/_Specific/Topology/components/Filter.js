import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../topology.module.scss";
import { Form, Select, Tag, Button, Row, Col } from "antd";
import Context from "../../../../Utility/Reduxx";
import { Translator } from "../../../../i18n/index";

const { Option } = Select;

const TopoFilterC = ({ setDataSource, dataSource, uploading, groups, cities, restore }) => {
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(Context);
  // const [restore, setRestore] = useState([]);
  const [modelOptions, setModelOptions] = useState("");
  const [value, setvalue] = useState([])
  let count = useRef(0);


  useEffect(() => {
    if (count.current !== 0 && !uploading) {
      return;
    }
    // setRestore(dataSource);
    form.setFieldsValue({ device: [], model: [], health: [], strength: [], groups:[], cities:[] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count.current, dataSource, uploading]);

  useEffect(() => {
    count.current = 0;
  }, [state.Login.Cid]);

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

  useEffect(() => {
    if (restore && restore.length !== 0) {
      const set = new Set();
      restore.filter((item) =>
        !set.has(item.model) ? set.add(item.model) : false
      );
      let options = Array.from(set).map((item) => {
        return { value: item };
      });
      setModelOptions(options);
      // console.log(state.Topology)
      if (state.Topology.health) {
        form.setFieldsValue({ health: [`${state.Topology.health}`] });
        dispatch({ type: "setPietoTopo", payload: { health: "" } });
        form.submit();
      }
      if (state.Topology.strength) {
        form.setFieldsValue({ strength: [`${state.Topology.strength}`] });
        dispatch({ type: "setPietoTopo", payload: { strength: "" } });
        form.submit();
      }
      if (state.Topology.device) {
        form.setFieldsValue({ device: [`${state.Topology.device}`] });
        form.submit();
        dispatch({ type: "setMaptoTopo", payload: { device: "" } });
      }
      //記住value 避免refresh後重新整理
      form.setFieldsValue(value);
      form.submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restore, state.Topology.device]);
  // console.log(value)
  const onFinish = (values) => {
    setvalue(values)
    count.current++;
    let NewData = restore;
    if (
      !values.health.length ||
      !values.strength.length ||
      !values.model.length ||
      !values.device.length ||
      !values.groups.length ||
      !values.cities.length
    ) {
      setDataSource(restore);
    }

    NewData = NewData.filter((item) => {
      // console.log(values.groups)
      let groupfilter
      if(values.groups?.length){
        groupfilter = item.gid.filter(g=> values.groups.indexOf(g) > -1)
      }

      return (
        (values.device.length ? (values.device.includes(item.name) || values.device.includes(item.id)): true) &&
        (values.model.length ? values.model.includes(item.model) : true) &&
        (values.health.length ? values.health.includes(item.health) : true) &&
        (values.strength.length? values.strength.includes(item.strength): true) &&
        (values.cities.length? values.cities.includes(item.city): true) &&
        (groupfilter?.length ? true : (!values.groups?.length))
      );
    });
    setDataSource(NewData);
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
    <Form onFinish={onFinish} form={form} layout={"vertical"}>
      <div className={styles.FormWrapper}>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={9} xl={9} xxl={5} className={styles.colum}>
            <Form.Item
              name="device"
              label={Translator("ISMS.Device")}
              // className={styles.FilterDevice}
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
                onBlur={() => form.submit()}
              >
                {restore?.map((item, index) => {
                  return (
                    <Option key={index} value={item.id}>
                      {item.name ? item.name : item.id}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={5} xl={5} xxl={3} className={styles.colum}>
            <Form.Item
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
                // style={{ width: "100%" }}
                options={modelOptions}
                onChange={() => form.submit()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={5} xl={5} xxl={3} className={styles.colum}>
            <Form.Item
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
          <Col xs={24} sm={24} md={10} lg={5} xl={5} xxl={3} className={styles.colum}>
            <Form.Item
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
          <Col xs={24} sm={24} md={10} lg={5} xl={5} xxl={4} className={styles.colum}>
            <Form.Item name="groups" label={Translator("ISMS.Group")}>
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
          <Col xs={24} sm={24} md={10} lg={5} xl={5} xxl={4} className={styles.colum}>
            <Form.Item name="cities" label={Translator("ISMS.Location")}>
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
                  // console.log(restore);
                  setDataSource(restore);
                  form.setFieldsValue({
                    device: [],
                    model: [],
                    health: [],
                    strength: [],
                    groups: [],
                    cities: [],
                  });
                  setvalue([])
                }}
              >
                {Translator("ISMS.Clear")}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export const TopoFilterMC = React.memo(TopoFilterC);
