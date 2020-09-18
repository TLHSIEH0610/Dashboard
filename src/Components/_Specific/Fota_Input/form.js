import React  from 'react'
import { Form, Input } from 'antd';
import styles from './fota_input.module.scss'


const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const FOTAform = (props) => {
    const { onFinish, validateMessages, form, id, name } = props
    console.log(id)
    return (
        <Form {...layout} onFinish={onFinish} validateMessages={validateMessages} form={form} id={id} className={styles.form} name={name}
        >
            <div>
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
                    <Input id={`${name}_${id}`}/>
                </Form.Item>
                {/* <Form.Item
                    name={'force'}
                    label="force"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input  id={`${name}_${id}`}/>
                </Form.Item> */}
                <Form.Item
                   
                    id={`${name}_${id}`}
                    name={'MD5'}
                    label="MD5"

                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input  disabled={true}/>
                </Form.Item>
                <Form.Item
                    name={'SoftwareMCSV'}
                    label="SW_MCSV"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input id={`${name}_${id}`}/>
                </Form.Item>
                <Form.Item
                    name={'name'}
                    label="name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input id={`${name}_${id}`}/>
                </Form.Item>
                {/* <Form.Item
                    name={'name2'}
                >
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item> */}
            </div>
            {/* <div>
                <Form.Item
                    name={'LoginName'}
                    label="LoginName"
                    className={styles.accpass}
                >
                    <Input className={styles.disable} disabled />
                </Form.Item>
                <Form.Item
                    name={'PassWord'}
                    label="PassWord"
                    className={styles.accpass}
                >
                    <Input className={styles.disable} disabled />
                </Form.Item>
                <Form.Item label="Transport">
                    <Input.Group compact className={styles.group}>
                        <Form.Item
                            label="Protocol"
                            name={'Protocol0'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Protocol" />
                        </Form.Item>
                        <Form.Item
                            label="Host"
                            name={'Host0'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Host" />
                        </Form.Item>
                        <Form.Item
                            label='Port'
                            name={'Port0'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Path" />
                        </Form.Item>
                        <Form.Item
                            label='Path'
                            name={'Path0'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Port" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
                <Form.Item label="Transport">
                    <Input.Group compact>
                        <Form.Item
                            label="Protocol"
                            name={'Protocol1'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Protocol" />
                        </Form.Item>
                        <Form.Item
                            label="Host"
                            name={'Host1'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Host" />
                        </Form.Item>
                        <Form.Item
                            label='Port'
                            name={'Port1'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Port" />
                        </Form.Item>
                        <Form.Item
                            label='Path'
                            name={'Path1'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Path" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
                <Form.Item label="Transport">
                    <Input.Group compact>
                        <Form.Item
                            label="Protocol"
                            name={'Protocol2'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Protocol" />
                        </Form.Item>
                        <Form.Item
                            label="Host"
                            name={'Host2'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Host" />
                        </Form.Item>
                        <Form.Item
                            label='Port'
                            name={'Port2'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Port" />
                        </Form.Item>
                        <Form.Item
                            label='Path'
                            name={'Path2'}
                            noStyle
                        >
                            <Input style={{ width: 'calc(30% - 8px)', margin: '8px 8px', display: 'inline-block' }} placeholder="Input Path" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
            </div> */}
        </Form>
    )
}

export default FOTAform