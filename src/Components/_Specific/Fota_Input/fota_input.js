import React, { Fragment, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Form, Input, Button, Card, Upload, message, Modal, Table, Space } from 'antd';
import styles from './fota_input.module.scss'
import {  SearchOutlined } from '@ant-design/icons'
import FOTAform from './form'
import Highlighter from 'react-highlight-words';


const validateMessages = {
    required: '${label} is required!',
};

const Fota_Input = () => {
    const [xmlData, setXmlData] = useState([{ key: '', ModelName: '', Version: '', force: '', MD5: '', name: '', SoftwareMCSV: '', Transport: [{ Protocol: '', Host: '', Port: '', Path: '', LoginName: '', PassWord: '' }] }])
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        axios.get('/api/fota2.xml').then((res) => {
            let parser, xmlDoc;
            let response = res.data
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(response, "text/xml");
            let xmlUnit = []
            let information = xmlDoc.querySelectorAll("information");
            information.forEach((item) => {
                let Obj = {}
                Obj['key'] = item.getElementsByTagName('ModelName')[0].textContent
                Obj['ModelName'] = item.getElementsByTagName('ModelName')[0].textContent
                Obj['Version'] = item.getElementsByTagName('Version')[0].textContent
                Obj['force'] = item.getElementsByTagName('force')[0].textContent
                Obj['MD5'] = item.getElementsByTagName('MD5')[0].textContent
                Obj['name'] = item.getElementsByTagName('name')[0].textContent
                Obj['SoftwareMCSV'] = item.getElementsByTagName('SoftwareMCSV')[0].textContent
                let TransTemp = item.querySelectorAll("Transport")
                let TransArr = []
                TransTemp.forEach((Trans, index) => {
                    let TransObj = {}
                    TransObj['key'] = `${index}`
                    TransObj['Protocol'] = Trans.getElementsByTagName('Protocol')[0].textContent
                    TransObj['Host'] = Trans.getElementsByTagName('Host')[0].textContent
                    TransObj['Port'] = Trans.getElementsByTagName('Port')[0].textContent
                    TransObj['Path'] = Trans.getElementsByTagName('Path')[0].textContent
                    TransObj['LoginName'] = Trans.getElementsByTagName('LoginName')[0].textContent
                    TransObj['PassWord'] = Trans.getElementsByTagName('PassWord')[0].textContent
                    TransArr.push(TransObj)
                })
                Obj['Transport'] = TransArr

                xmlUnit.push(Obj)
            })
            // console.log(xmlUnit)
            setXmlData(xmlUnit)
            setLoading(false)
        })
    }, [])

    const [Evisible, setEvisible] = useState(false)
    const [Avisible, setAvisible] = useState(false)
    const [itemIndex, setItemIndex] = useState('')
    const handleOk = e => {
        setEvisible(false)
        setAvisible(false)
    };

    const handleCancel = e => {
        setEvisible(false)
        setAvisible(false)
    };
    const onFinishA = values => {
        console.log('123')
        values['Transport'] = [{ Protocol: values.Protocol0, Host: values.Host0, Port: values.Port0, Path: values.Path0 }, { Protocol: values.Protocol1, Host: values.Host1, Port: values.Port1, Path: values.Path1 }, { Protocol: values.Protocol2, Host: values.Host2, Port: values.Port2, Path: values.Path2 }]
        let newXml = [...xmlData]
        newXml.push(values)
        setXmlData(newXml)
        // console.log(newXml)
        DataToXMLString(newXml)
    }
    const onFinish = values => {
        // console.log(itemIndex)
        values['Transport'] = [{ Protocol: values.Protocol0, Host: values.Host0, Port: values.Port0, Path: values.Path0 }, { Protocol: values.Protocol1, Host: values.Host1, Port: values.Port1, Path: values.Path1 }, { Protocol: values.Protocol2, Host: values.Host2, Port: values.Port2, Path: values.Path2 }]
        console.log(values);
        let newXml = [...xmlData]
        newXml[itemIndex] = values
        setXmlData(newXml)
        // console.log(newXml)
        DataToXMLString(newXml)
        // console.log(str)
    };
    const [fileList, setFileList] = useState([])
    const [uploading, setUploading] = useState(false)

    const DataToXMLString = (newXml) => {
        let str = ''
        newXml.forEach((item) => {
            str += (`
            <?xml version="1.0" encoding="utf-8"?>
            <firmware>  
            <information>
            <ModelName>${item.ModelName}</ModelName>
            <Version>${item.Version}</Version>
            <force>${item.force}</force>
            <MD5>${item.MD5}</MD5>
            <name>${item.name}</name>
            <SoftwareMCSV>${item.SoftwareMCSV}</SoftwareMCSV>
            <Transport>
                <Protocol>${item.Transport[0].Protocol}</Protocol>
                <Host>${item.Transport[0].Host}</Host>
                <Port>${item.Transport[0].Port}</Port>
                <Path>${item.Transport[0].Path}</Path>
                <LoginName>${item.Transport[0].LoginName}</LoginName>
                <PassWord>${item.Transport[0].LoginName}</PassWord>
            </Transport>
            <Transport>
                <Protocol>${item.Transport[1].Protocol}</Protocol>
                <Host>${item.Transport[1].Host}</Host>
                <Port>${item.Transport[1].Port}</Port>
                <Path>${item.Transport[1].Path}</Path>
                <LoginName>${item.Transport[1].LoginName}</LoginName>
                <PassWord>${item.Transport[1].PassWord}</PassWord>
            </Transport>
            <Transport>
                <Protocol>${item.Transport[2].Protocol}</Protocol>
                <Host>${item.Transport[2].Host}</Host>
                <Port>${item.Transport[2].Port}</Port>
                <Path>${item.Transport[2].Path}</Path>
                <LoginName>${item.Transport[2].LoginName}</LoginName>
                <PassWord>${item.Transport[2].PassWord}</PassWord>
            </Transport>
          </information>
          </firmware>  
          `)
        })
        // console.log(str)
        return str
    }

    const deleteData = (index) => {
        console.log(index)
        setItemIndex(index)
        let newXml = [...xmlData]
        newXml.splice(index, 1)
        setXmlData(newXml)
        DataToXMLString(newXml)
    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
                ref={node => {
                    searchInput.current = node;
                }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                size={'small'} 
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => handleReset(clearFilters)} size={'small'}  style={{ width: 90 }}>
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            
            setTimeout(() => searchInput.current.select(), 100)
          }
        },
        render: text =>
            searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      })
      const[searchText, setSearchText] = useState('')
      const[searchedColumn, setSearchedColumn] = useState('')
    
     const handleSearch = (selectedKeys, confirm, dataIndex) => {
          confirm();
          setSearchText( selectedKeys[0])
          setSearchedColumn( dataIndex)
        }
      
      const  handleReset = clearFilters => {
          clearFilters();
          setSearchText('')
        }
    
      const searchInput = useRef('');
    const columns = [
        {
            title: 'ModelName',
            dataIndex: 'ModelName',
            width: '20%',
            ...getColumnSearchProps('ModelName')
        },
        {
            title: 'name',
            dataIndex: 'name',
            width: '25%',
            ...getColumnSearchProps('name')
        },
        {
            title: 'MD5',
            dataIndex: 'MD5',
            width: '25%',
            responsive: ['md'],
            ...getColumnSearchProps('MD5')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: '20%',
            render: ( text, record, index) => (
                <Fragment>
                    <div className={styles.EdtiDeleBtn} key={index}>
                        <Button
                        className={styles.EdtiBtn}
                        size={'large'} 
                        onClick={() => {
                        setItemIndex(index)
                        setEvisible(true)
                        form.setFieldsValue({
                        ModelName: record.ModelName,
                        Version: record.Version,
                        force: record.force,
                        name: record.name,
                        SoftwareMCSV: record.SoftwareMCSV,
                        MD5: record.MD5,
                        Protocol0: record.Transport[0].Protocol,
                        Host0: record.Transport[0].Host,
                        Port0: record.Transport[0].Port,
                        Path0: record.Transport[0].Path,
                        LoginName0: record.Transport[0].LoginName,
                        PassWord0: record.Transport[0].PassWord,
                        Protocol1: record.Transport[1].Protocol,
                        Host1: record.Transport[1].Host,
                        Port1: record.Transport[1].Port,
                        Path1: record.Transport[1].Path,
                        LoginName1: record.Transport[1].LoginName,
                        PassWord1: record.Transport[1].PassWord,
                        Protocol2: record.Transport[2].Protocol,
                        Host2: record.Transport[2].Host,
                        Port2: record.Transport[2].Port,
                        Path2: record.Transport[2].Path,
                        LoginName2: record.Transport[2].LoginName,
                        PassWord2: record.Transport[2].PassWord,
                    })}}>
                        Edit
                    </Button>
                    <Modal
                    title='FOTA Modify'
                    visible={Evisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    destroyOnClose={true}
                    okButtonProps={{ form: 'category-editor-form', key: 'submit', htmlType: 'submit' }}
                    calssName={styles.modal}
                    centered
                    scroll
                    maskStyle={{ background: 'transparent' }}
                    bodyStyle={{ display: 'flex', margin: '30px', justifyContent: 'center' }}
                    >
                    <FOTAform form={form} id={'category-editor-form'} validateMessages={validateMessages} onFinish={onFinish} name={'nest-messagesE'} />
                    </Modal>
                    <Button size={'large'}  danger onClick={() => {
                        deleteData(index)
                    }}>
                        Delete
                    </Button>
                    </div>
                </Fragment>
            )
        }
    ]

    return (
        <Fragment>
            <Card className={styles.card}>
                <Button
                    size={'large'}
                    type="primary"
                    className={styles.actionbtn}
                    onClick={() => {
                        setAvisible(true)
                        form.setFieldsValue({
                            ModelName: '',
                            Version: '',
                            force: '',
                            name: '',
                            SoftwareMCSV: '',
                            MD5: '',
                            Protocol0: '',
                            Host0: '',
                            Port0: '',
                            Path0: '',
                            LoginName0: '',
                            PassWord0: '',
                            Protocol1: '',
                            Host1: '',
                            Port1: '',
                            Path1: '',
                            LoginName1: '',
                            PassWord1: '',
                            Protocol2: '',
                            Host2: '',
                            Port2: '',
                            Path2: '',
                            LoginName2: '',
                            PassWord2: '',
                        })
                    }}>New Create
                </Button>
                <Modal
                    forceRender={true}
                    title='Create New FOTA'
                    visible={Avisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    destroyOnClose={true}
                    okButtonProps={{ form: 'category-add-form', key: 'submit', htmlType: 'submit' }}
                    calssName={styles.modal}
                    maskStyle={{ background: 'transparent' }}
                    bodyStyle={{ display: 'flex', margin: '30px', justifyContent: 'center' }}
                >
                    <FOTAform form={form} id={'category-add-form'} validateMessages={validateMessages} onFinish={onFinishA} name={'nest-messagesA'} />
                </Modal>
                <Table columns={columns} dataSource={xmlData} pagination={false} scroll={{ y: 800 }}  className={styles.table}  loading={loading}/> 
            </Card>
        </Fragment>
    )
}

export default Fota_Input





