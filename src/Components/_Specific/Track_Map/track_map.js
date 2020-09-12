import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import styles from './track_map.module.scss'

import { Form, Input, Switch, Button } from 'antd';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const TrackMap = () => {
    const [form] = Form.useForm()
    const [data, Setdata]=useState(null)

    useEffect(() => {
        axios.get('/api/fota.xml').then((res) => {
            let parser, xmlDoc;
            let response = res.data
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(response, "text/xml");
            const   force = xmlDoc.getElementsByTagName("force")[0].textContent;
             const  MD5 = xmlDoc.getElementsByTagName("MD5")[0].textContent;
             const name = xmlDoc.getElementsByTagName("name")[0].textContent;
            const SoftwareMCSV = xmlDoc.getElementsByTagName("SoftwareMCSV")[0].textContent;
            const Protocol = xmlDoc.getElementsByTagName("Protocol")[0].textContent;
            const  Port = xmlDoc.getElementsByTagName("Port")[0].textContent;
            const ModelName = xmlDoc.getElementsByTagName("ModelName")[0].textContent;
            const Version = xmlDoc.getElementsByTagName("Version")[0].textContent;
            const host = xmlDoc.getElementsByTagName("Host")[0].textContent;
            // setXmldata({ force, MD5, name, SoftwareMCSV, Protocol, Port, ModelName, Version, host })
            // console.log(xmldata)
            const formChange = value => {
                form.setFieldsValue({
                    ModelName: ModelName,
                    Version: Version,
                    name: name,
                    Protocol: Protocol,
                    Port: Port,
                    force: force,
                    SoftwareMCSV: SoftwareMCSV,
                    host: host,
                    MD5: MD5
                });
              };
            formChange()
            console.log(ModelName)
            // form.setFieldsValue({
            //     ModelName: ModelName
            // })
        })
    }, [data])

    const onFinish = values => {
        console.log(values);
    };
    
    

    return (
        <Fragment>
            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} form={form}
            >
                <Form.Item
                    name={'ModelName'}
                    label="ModelName"

                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'Version'}
                    label="Version"

                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'SoftwareMCSV'}
                    label="SoftwareMCSV"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'url'}
                    label="url"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Transport">
                    <Input.Group compact>
                        <Form.Item
                            name={'Protocol'}
                            noStyle
                            rules={[{ required: true, message: 'Protocol is required' }]}
                        >
                            <Input style={{ width: '50%' }} placeholder="Input Protocol" />
                        </Form.Item>
                        <Form.Item
                            name={'host'}
                            noStyle
                            rules={[{ required: true, message: 'host is required' }]}
                        >
                            <Input style={{ width: '50%' }} placeholder="Input Host" />
                        </Form.Item>
                        <Form.Item
                            name={'Port'}
                            noStyle
                            rules={[{ required: true, message: 'Port is required' }]}
                        >
                            <Input style={{ width: '50%' }} placeholder="Input Port" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>

                <Form.Item name="Force" label="Force" valuePropName='checked'>
                    <Switch />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
          </Button>
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default TrackMap





