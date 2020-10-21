import React, { useEffect, useState, useRef, useContext } from "react";
// import styles from "../topology.module.scss";
import { Form, Select, Tag, Button, Row, Col } from "antd";
import Context from '../../../../Utility/Reduxx'

const { Option } = Select;

const TopoFilterC = ({ setDataSource, dataSource }) => {
  const [form] = Form.useForm();
  const { state } = useContext(Context)
  const [restore, setRestore] = useState([]);
  const [modelOptions, setModelOptions] = useState("");
  let count = useRef(0);

  useEffect(() => {
    console.log(count.current);
    if (count.current !== 0) {
      return;
    }
    setRestore(dataSource);
    form.setFieldsValue({device:[],model:[],health:[],strength:[]})
  });
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
    if (restore.length!==0) {
      const set = new Set();
      restore.filter((item) =>
        !set.has(item.model) ? set.add(item.model) : false
      );
      let options = Array.from(set).map((item) => {
        return { value: item };
      });
      setModelOptions(options);
      // console.log(state.Topology)
      if(state.Topology.health){
        form.setFieldsValue({health:[`${state.Topology.health}`]})
        form.submit()
      }
      if(state.Topology.strength){
        form.setFieldsValue({strength:[`${state.Topology.strength}`]})
        form.submit()
      }
    }
  }, [restore]);

  // useEffect(()=>{
  //   onFinish({device: undefined, model: undefined, health: ["health"], strength: undefined})
  // }, [restore, ])

  // const onSearch = (deviceSearch) => {
  //   let serachResult = [...restore];
  //   serachResult.filter((device) => device.name.includes(deviceSearch));
  //   setDataSource(serachResult);
  // };

  const onFinish = (values) => {
    count.current++;
    let NewData = restore;
    console.log(values)
    // if (!values.health && !values.strength && !values.model && !values.device) {
    //   return;
    // }
    if (!values.health.length || !values.strength.length || !values.model.length || !values.device.length) {
      setDataSource(restore);
    }

    NewData = NewData.filter((item) => {
      return (
        (values.device.length
          ? values.device.includes(item.name) || values.device.includes(item.id)
          : true) &&
        (values.model.length ? values.model.includes(item.model) : true) &&
        (values.health.length ? values.health.includes(item.health) : true) &&
        (values.strength.length ? values.strength.includes(item.strength) : true)
      );
    });
    setDataSource(NewData);
  };

  function ColorSorter(label){
    if(label==='up'|| label==='excellent'){
      return "#28a745"
    }
    if(label==='critical'|| label==='good'){
      return "#ffc107"
    }
    if(label==='warning'|| label==='fair'){
      return  "#dc3545"
    }
    if(label==='offline'|| label==='poor'){
      return "#343a40"
    }else{
      return "gray"
    }
  }

  function tagRender({ label, value, closable, onClose }) {
    return (
      <Tag
        color= {ColorSorter(label)}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }

  return (
    <Form onFinish={onFinish} form={form}>
      <Row gutter={24} type="flex">
        <Col span={6}>
          <Form.Item name="device" label="Device">
            {/* <Input
              allowClear
              onChange={(e)=>{
                console.log(e.target.value)
              }}
            /> */}
            <Select
              mode="multiple"
              placeholder="search devices"
              showArrow
              tagRender={tagRender}
              onFocus={() => {}}
              // onChange={()=>form.submit()}
              onBlur={()=>form.submit()}
            >
              {restore.map((item, index) => {
                return (
                  <Option key={index} value={item.name ? item.name : item.id}>
                    {item.name ? item.name : item.id}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="model" label="Model">
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              style={{ width: "100%" }}
              options={modelOptions}
              onChange={()=>form.submit()}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="health" label="Health">
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              style={{ width: "100%" }}
              options={healthoptions}
              onChange={()=>form.submit()}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="strength" label="Strength">
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              style={{ width: "100%" }}
              options={strengthoptions}
              onChange={()=>form.submit()}
            />
          </Form.Item>
        </Col>
        <Col span={2}>
          <Form.Item>
            <Button
              onClick={() => {
                console.log(restore);
                setDataSource(restore);
                form.setFieldsValue({device:[],model:[],health:[],strength:[]})
              }}
            >
              Reset
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default TopoFilterC;
