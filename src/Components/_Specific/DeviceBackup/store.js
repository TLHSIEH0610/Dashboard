import React, { useState, useEffect, useRef } from 'react'
import styles from './devicebackup.module.scss'
import { SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Table, Input, Space, Upload, Form, Select } from 'antd';
import axios from 'axios'
// import useURLloader from '../../../hook/useURLloader'
import Highlighter from 'react-highlight-words';


const StoreBtn = () => {
  const url = '/api/nodes.json'
  const [data, setData] = useState([{ nodeInf: { id: '', model: '' } }])
  const rawdata = [];
  data.forEach((item) => {
    rawdata.push({ key: item.nodeInf.id, id: item.nodeInf.id, model: item.nodeInf.model })
  })

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    axios.get(url).then((res) => {
      setData(res.data.response.device_status)
      // console.log(res.data.response)
      setLoading(false)
    }).then(() => {
      // console.log(data)
    })
  }, [])

  const normFile = e => {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };


  const onFinish = values => {
    console.log('Received values of form: ', values);
  };
  //
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png',
    },
  ])

  const handleChange = info => {
    let fileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);
    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(fileList)
  };

  const props = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange: handleChange,
    multiple: false,
  };
  //
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
            size={'small'}
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

  const { Option } = Select;

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onBlur() {
    console.log('blur');
  }

  function onFocus() {
    console.log('focus');
  }

  function onSearch(val) {
    console.log('search:', val);
  }

  const columns = [
    {
      title: 'Device_ID',
      dataIndex: 'id',
      width: '30%',
      ...getColumnSearchProps('id')
    },
    {
      title: 'Config',
      dataIndex: 'upload',
      width: '30%',
      render: (text, record, index) => (
        <Form.Item
          // className={styles.FormItem}
          name={record.id}
          // valuePropName="fileList"
          // getValueFromEvent={normFile}
        >
          {/* <Upload {...props} fileList={fileList}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload> */}
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a config"
            optionFilterProp="children"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Select.Option value="jack">015xxxxx</Select.Option>
            <Select.Option value="lucy">016xxxxx</Select.Option>
            <Select.Option value="tom">018xxxxx</Select.Option>
          </Select>
        </Form.Item>
      )
    }
  ]

  return (
    <Card title="FileRequest" className={styles.card} headStyle={{ display: 'none' }}  >
      <Form
        className={styles.form}
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
      >
        <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} size={'large'} style={{ marginBottom: '21px' }}>
          Restore
        </Button>
        </Form.Item>
        <Table columns={columns} dataSource={rawdata} pagination={false} scroll={{ x: 300, y: 800 }} className={styles.table} width='300' loading={loading} />
      </Form>
    </Card>
  )
}

export default StoreBtn


