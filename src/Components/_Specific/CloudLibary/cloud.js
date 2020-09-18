import React, { useState, useEffect, useRef, Fragment, useContext } from 'react'
import styles from './cloud.module.scss'
import { Button, Card, Table, Input, Space, Modal, Upload, Select, Form, message } from 'antd'
import axios from 'axios'
// import useURLloader from '../../../hook/useURLloader'
import { DownloadOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { FcDeleteDatabase, FcDownload } from 'react-icons/fc'
import Context from '../../../Utility/Reduxx'
import reqwest from 'reqwest';
import MD5 from 'crypto-js/md5'
import md5 from 'blueimp-md5'

const CloudList = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState([{ key:'', name: '', type: '', date: '', model:'', size:'' }])
  const { state, dispatch } = useContext(Context)  
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [visible, setVisible] = useState(false)
  const [cMD5, setCMD5] = useState('')
  // const onSelectChange = selectedRowKeys => {
  //   console.log('selectedRowKeys changed: ', selectedRowKeys);
  //   setSelectedRowKeys(selectedRowKeys)
  // }

  const rowSelection = {
    selectedRowKeys,
    // onChange: onSelectChange,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  };
  const hasSelected = selectedRowKeys.length > 0;

  useEffect(() => {
    const FileRepostoryUrl = "api/CloudLibary.json";
    setLoading(true);
    axios.get(FileRepostoryUrl).then((res) => {
      const response = res.data.response.repository[0].list
      let Resdata = []
      response.forEach((item, index)=>{
        Resdata.push({ key: index, name: item.name, type: item.type, date: item.date, size: item.size, model: item.inf.model  })
      })
      setData(Resdata);
      setLoading(false);
    });
  },[])
// http://192.168.0.95:8000/repository?delete_file={"cid":"12345678901234567890123456789011","name":"abc","type":"cfg"}
  const deleteItem = (key) => {
    setLoading(true)
    const cid = localStorage.getItem('authUser.cid')
    let url = `/repository?delete_file={"cid":"${cid}","name":"${key.name}","type":"${key.type}"}`
    console.log(url)
    axios.get(url).then((res)=>{
      console.log(res)
      setLoading(false)
    })
    .catch((error)=>{
      console.log(error)
      setLoading(false)
    })
  }

// http://192.168.0.95:8000/repository?download_file={"cid":"12345678901234567890123456789011","name":"abc","type":"cfg"}
  const DownloadConfig = (key) => {
    setLoading(true)
    const cid = localStorage.getItem('authUser.cid')
    let url = `/repository?download_file={"cid":"${cid}","name":"${key.name}","type":"${key.type}"}`
    console.log(url)
    axios({
      url: url,
      // url: 'api/fota.xml',
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      setLoading(false)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'config.txt');
      document.body.appendChild(link);
      link.click()
    })
  }

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  }

  const searchInput = useRef('');
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
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
              </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
  //Upload function
  // const [fileList, setFileList] = useState([
    // {
    //   uid: '-1',
    //   name: 'xxx.png',
    //   status: 'done',
    //   url: 'http://www.baidu.com/xxx.png',
    // },
  // ])

  const handleChange = info => {
    let fileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);
    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(fileList)
    form.resetFields(['type', 'MD5'])
    setUploadFileType('')
    console.log(fileList)
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(fileList[0].originFileObj)
    fileReader.onload = (e)=>{
      console.log(fileList, md5(e.target.result))
      setCMD5(md5(e.target.result)) 
    }
    
      
    // form.resetFields(['MD5'])
    // form.setFieldsValue({MD5:md5(fileList[0])})  
  };

  // const props = {
  //   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  //   onChange: handleChange,
  //   multiple: false,
  // };
  const [fileList, setFileList] = useState([])
  const [file, setFile] = useState({})
  const [uploading, setUploading]= useState(false)

 const onFinish = (values) => {
  setUploading(true)
  console.log("Received values of form:", values);
  // console.log(fileList)
  const formData = new FormData();
  fileList.forEach(file => {
    formData.append('files[]', file);
  });
  
  // console.log(formData)
  const cid = localStorage.getItem('authUser.cid')
// http://192.168.0.95:8000/repository?upload_file={"cid":"12345678901234567890123456789011","name":"abc","type":"cfg","inf":inf}
  const url = `/repository?upload_file={"cid":${JSON.stringify(cid)},"name":${JSON.stringify(values.upload.file.name)},"type":${JSON.stringify(values.type)},"inf":${values.MD5 == undefined ? "{}" : JSON.stringify(values.MD5)}}`
  console.log(url)
  axios.post(url, formData).then((res)=>{
    console.log(res)
    setFileList([])
    setUploading(false)
    message.success('upload successfully.');
  })
  .catch((err)=>{
    console.log(err)
    setUploading(false)
    message.error('upload failed.');
  })
  // let hash = md5(values.upload.file)
  // console.log(hash)
  // You can use any AJAX library you like
  // reqwest({
  //   url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  //   method: 'post',
  //   processData: false,
  //   data: formData,
  //   success: () => {
  //     setFileList([])
  //     setUploading(false)
  //     message.success('upload successfully.');
  //   },
  //   error: () => {
      // setUploading(false)
      // message.error('upload failed.');
  //   },
  // });
};
  const props = {
    onRemove: file => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)  
    },
    onChange: handleChange,
    beforeUpload: file => {
      // console.log(fileList, file)
      setFileList([...fileList, file])
      // setFile(file)
      // setMD5(md5(file))    
      // form.setFieldsValue({MD5:md5(file)})  
      return false;
    },
    fileList,
  };

  const { Option, OptGroup } = Select;
  const [uploadFileType, setUploadFileType] = useState(null) 

  function FileSelecthandleChange(value) {
    console.log(`selected ${value}`);
  }

  const columns = [
    { 
      title: 'FileName',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name')
    },
    { 
      title: 'Model',
      dataIndex: 'model',
      width: '15%',
      ...getColumnSearchProps('model')
    },
    {
      title: 'FileType',
      dataIndex: 'type',
      width: '15%',
      ...getColumnSearchProps('type')
    },
  {
      title: 'CtratedDate',
      dataIndex: 'date',
      width: '25%',
      responsive: ['md'],
      ...getColumnSearchProps('date')
    },
    {
      title: 'Size(KB)',
      dataIndex: 'size',
      width: '15%',
      responsive: ['md']
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '20%',
      className:`${styles.actionCol}`,
      render: (text, record, index) => (
        <Fragment key={index}>
          <Button onClick={()=>DownloadConfig(record)} icon={<FcDownload />}></Button>
          <Button onClick={()=>deleteItem(record)} icon={<FcDeleteDatabase />}></Button>
        </Fragment>
      )
    }
  ]

  return (
    <Card title="Data on Clould Libary" className={styles.card} headStyle={{ display: 'none' }} >
        <Button type="primary"  loading={loading}  onClick={()=>setVisible(true)} className={styles.clickBtn} size={'large'} icon={<UploadOutlined />} >
          Upload
        </Button>
        <Modal
          title="Upload"
          visible={visible}
          onOk={()=>setVisible(false)}
          onCancel={()=>setVisible(false)}
          okButtonProps={{ form: 'FileUpload', key: 'submit', htmlType: 'submit', disabled:(fileList.length === 0), loading:uploading }}
          okText={uploading ? 'Uploading' : 'Start Upload'}
          cancelText="Cancel"
        >
        <Form
          id={'FileUpload'}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          form = {form}
        >
          <Form.Item
            label={'File'}
            name={'upload'}
            rules={[
              { required: true, message: "Please select a file" },
            ]}
          >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label={'File Type'}
            name={'type'}
            rules={[
              { required: true, message: "Please select a type" },
            ]}
          >
              <Select style={{ width: 200 }} onChange={(value)=>{
                FileSelecthandleChange(value) 
                setUploadFileType(value)
                form.setFieldsValue({MD5:cMD5}) 
                // console.log(fileList)
                // let hash = md5(file) 
                // setMD5(hash)    
                // form.setFieldsValue({MD5:MD5})                   
                // console.log(hash)
                }}>
                <OptGroup label="Restore">
                  <Option value="cfg">cfg</Option>
                </OptGroup>
                <OptGroup label="Upgrade">
                  <Option value="fw">fw</Option>
                </OptGroup>
              </Select>
          </Form.Item>
          {
            (uploadFileType==='fw' && 
            <Form.Item
            label={'MD5'}
            name={'MD5'}
            rules={[
              { required: true, message: "Please input the MD5 number!" },
            ]}
            >
              <Input placeholder="Please input a specific series of MD5"  disabled={true}/>
          </Form.Item>)
          }
      </Form>
      </Modal>
      {/* <Button type="primary" loading={loading} onClick={BatchDownload} icon={<DownloadOutlined />} size={'large'} className={styles.clickBtn} htmlType="submit">
        Download
      </Button>
      <Button type="primary" danger loading={loading} onClick={BatchDelete} icon={<RiDeleteBin2Line />} size={'large'} className={styles.clickBtn} >
        Delete
      </Button> */}
      <div>
        <div>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table columns={columns} dataSource={data} pagination={false}  className={styles.table} loading={loading} />
      </div>
    </Card>
  )
}

export default CloudList 


// http://192.168.0.95:8000/repository?upload_file={"cid":"12345678901234567890123456789011","name":"abc","type":"cfg","inf":inf}
// http://192.168.0.95:8000/repository?download_file={"cid":"12345678901234567890123456789011","name":"abc","type":"cfg"}
// http://192.168.0.95:8000/repository?delete_file={"cid":"12345678901234567890123456789011","name":"abc","type":"cfg"}
// http://192.168.0.95:8000/repository?rename_file={"cid":"12345678901234567890123456789011","old_name":"abc","new_name":"cde","type":"cfg"}
// http://192.168.0.95:8000/repository?list_file={}
// http://192.168.0.95:8000/repository?list_file={"cid":"12345678901234567890123456789011"}

