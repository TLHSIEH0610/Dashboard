import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../topology.module.scss";
import { Form, Select, Tag, Button } from "antd";
import Context from '../../../../Utility/Reduxx'

import { Translator } from '../../../../i18n/index'

const { Option } = Select;

const TopoFilterC = ({ setDataSource, dataSource }) => {
  const [form] = Form.useForm();
  const { state } = useContext(Context)
  const [restore, setRestore] = useState([]);
  const [modelOptions, setModelOptions] = useState("");

  let count = useRef(0);

  useEffect(() => {
    if (count.current !== 0) {
      return;
    }
    setRestore(dataSource);
    form.setFieldsValue({device:[],model:[],health:[],strength:[]})
  },[count.current, dataSource]);

  const healthoptions = [
    // { value: "up" },
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
    // console.log(values)
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

    <Form onFinish={onFinish} form={form} className={styles.FilterForm}>
          <Form.Item name="device" label={Translator('ISMS.Device')} className={styles.FilterDevice}>
            <Select
              mode="multiple"
              placeholder={Translator('ISMS.Search')}
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
          <Form.Item name="model" label={Translator('ISMS.Model')} className={styles.FilterModel}>
            <Select
              mode="multiple"
              showArrow
              placeholder={Translator('ISMS.Search')}
              tagRender={tagRender}
              style={{ width: "100%" }}
              options={modelOptions}
              onChange={()=>form.submit()}
            />
          </Form.Item>
          <Form.Item name="health" label={Translator('ISMS.Health')} className={styles.FilterHealth}>
            <Select
              mode="multiple"
              placeholder={Translator('ISMS.Search')}
              showArrow
              tagRender={tagRender}
              style={{ width: "100%" }}
              options={healthoptions}
              onChange={()=>form.submit()}
            />
          </Form.Item>
          <Form.Item name="strength" label={Translator('ISMS.Strength')} className={styles.FilterStrength}>
            <Select
              mode="multiple"
              placeholder={Translator('ISMS.Search')}
              showArrow
              tagRender={tagRender}
              style={{ width: "100%" }}
              options={strengthoptions}
              onChange={()=>form.submit()}
            />
          </Form.Item>
          <Form.Item style={{ marginLeft:'15px'}}> 
            <Button
              onClick={() => {
                console.log(restore);
                setDataSource(restore);
                form.setFieldsValue({device:[],model:[],health:[],strength:[]})
              }}
            >
              {Translator('ISMS.Reset')}
            </Button>
          </Form.Item>
        {/* </Col> */}
      {/* </Row> */}
    </Form>

  );
};

export const TopoFilterMC = React.memo(TopoFilterC);
