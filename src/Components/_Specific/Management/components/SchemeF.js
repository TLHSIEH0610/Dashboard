import React, { useContext } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  DatePicker
} from "antd";
import axios from "axios";
import styles from "../management.module.scss";
import useURLloader from "../../../../hook/useURLloader";
import { UserLogOut } from '../../../../Utility/Fetch'
import { useHistory } from 'react-router-dom'
import Context from "../../../../Utility/Reduxx";

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};

const { Option } = Select;


const CreateSchemeF = ({CreateSchemevisible, setCreateSchemevisible, uploading, setUploading}) => {
  const [form] = Form.useForm();
  const SchemeListUrl = `/scheme_mgnt?list_scheme={}`;
  const [SchemeLisloading, SchemeLisresponse] = useURLloader(SchemeListUrl);
  const history = useHistory()
  const { dispatch } = useContext(Context);
  
  const CreateSchemeOnFinish = (values) =>{
      setUploading(true)

      const CreateSchemeUrl = `scheme_mgnt?create_scheme={"cid":"${values.cid}", "scheme_list":{"user":${values.user},"group":${values.group},"device":${values.device},"expire":${values.expire._d.getTime()},"tracking":${values.tracking},"tracking_pool":${values.tracking_pool},"iot":${values.iot},"iot_poor":${values.iot_poor},"period_status":${values.period_status},"period_gps":${values.period_gps},"period_alive":${values.period_alive},"period_iot":${values.period_iot},"alive_timeout":${values.alive_timeout}}}`

      axios.post(CreateSchemeUrl).then((res)=>{
        console.log(res.data)
        setUploading(false)
        message.success("create successfully.");
        setCreateSchemevisible(false)
      })
      .catch((error)=>{
        console.log(error)
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");                                                                         
        } 
        setUploading(false)
        message.error("create fail.");
      })
  }

  return (
    <Modal
      visible={CreateSchemevisible}
      title="Notification Setting"
      onOk={() => setCreateSchemevisible(false)}
      onCancel={() => setCreateSchemevisible(false)}
      centered={true}
      className={styles.modal}
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
      {/* <Card loading={SchemeLisloading} bordered={false}> */}
        <Form {...layout} onFinish={CreateSchemeOnFinish} form={form} >
          <Form.Item label="Customer" name="cid" rules={[{ required: true, message: "Required!!" }]}>
            <Select loading={SchemeLisloading}>
                {SchemeLisresponse && SchemeLisresponse.response.map((item, index)=>{
                    return <Option key={index} value={item.cid}>{item.cid}</Option>
                })}
            </Select>
          </Form.Item >
          <Form.Item label="user" name="user" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="group" name="group" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="device" name="device" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="expire" name="expire" rules={[{ required: true, message: "Required!!" }]}>
            {/* <Input /> */}
            <DatePicker />
          </Form.Item>
          <Form.Item label="tracking" name="tracking" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="tracking_pool" name="tracking_pool" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="iot" name="iot" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="iot_poor" name="iot_poor" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="period_alive" name="period_alive" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="period_status" name="period_status" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="period_iot" name="period_iot" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="period_gps" name="period_gps" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="alive_timeout" name="alive_timeout" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
        </Form>
      {/* </Card> */}
    </Modal>
  );
};

export const CreateSchemeMF = React.memo(CreateSchemeF);
