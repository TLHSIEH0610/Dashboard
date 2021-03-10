import React, { useContext } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
} from "antd";
import axios from "axios";
import styles from "../management.module.scss";
import useURLloader from "../../../../hook/useURLloader";
import { UserLogOut } from '../../../../Utility/Fetch'
import { useHistory } from '../../Dashboard/node_modules/react-router-dom'
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
      console.log(values)
      // const CreateSchemeUrl = `scheme_mgnt?create_scheme={"cid":"${values.cid}", "scheme_list":{"user":${values.user},"group":${values.group},"device":${values.device},"expire":${values.expire._d.getTime()},"tracking":${values.tracking},"tracking_pool":${values.tracking_pool},"iot":${values.iot},"iot_poor":${values.iot_poor},"period_status":${values.period_status},"period_gps":${values.period_gps},"period_alive":${values.period_alive},"period_iot":${values.period_iot},"alive_timeout":${values.alive_timeout}}}`
      const config = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        url: '/scheme_mgnt',
        data: JSON.parse(`{"create_scheme":{"cid":"${values.cid}", "scheme_list":{"user":${values.user || 10},"group":${values.group || 50},"device":${values.device || 1000},"expire":${values.expire._d.getTime()},"tracking":${123},"tracking_pool":${123},"iot":${123},"iot_poor":${123},"period_status":${values.period_status},"period_gps":${values.period_gps},"period_alive":${values.period_alive},"period_iot":${values.period_iot},"alive_timeout":${values.period_alive + 30}}}}`),
      }
      axios(config).then((res)=>{
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
          {/* <Form.Item label="user" name="user" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="group" name="group" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="device" name="device" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="expire" name="expire" rules={[{ required: true, message: "Required xxxx-xx-xx!!" }]}>
            <Input placeholder='2020-12-12' />
          </Form.Item> */}
          <Form.Item label="Alive Period(s)" name="period_alive" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Status Period(s)" name="period_status" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="IoT Period(s)" name="period_iot" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="GPS Period(s)" name="period_gps" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
          <Form.Item style={{display:'none'}} label="alive_timeout" name="alive_timeout" rules={[{ required: true, message: "Required!!" }]}>
            <Input />
          </Form.Item>
        </Form>
      {/* </Card> */}
    </Modal>
  );
};

export const CreateSchemeMF = React.memo(CreateSchemeF);
