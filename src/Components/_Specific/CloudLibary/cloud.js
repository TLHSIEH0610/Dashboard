import React, { useState, useEffect, useRef, Fragment, useContext } from 'react'
import styles from './cloud.module.scss'
import { Button, Card, Table, Input, Space, Modal } from 'antd'
import axios from 'axios'
// import useURLloader from '../../../hook/useURLloader'
import { DownloadOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { FcDeleteDatabase, FcDownload } from 'react-icons/fc'
import Context from '../../../Utility/Reduxx'

const CloudList = () => {
  // const url = 'http://localhost:3001/getlibrary'
  const url = '/api/CloudLibary.json'
  const [data, setData] = useState([{ FileName: '', FileType: '', UploadDate: '' }])
  const rawdata = [];
  const { state, dispatch } = useContext(Context)  
  // useEffect(()=>{
  //   axios.get('http://localhost:3001/getlibrary').then((res)=>{
  //     console.log(res.data)
  //   })
  // })
  
  data.forEach((item, index) => {
    rawdata.push({ key: item.key, FileName: item.FileName, FileType: item.FileType, UploadDate: item.UploadDate, Size: item.Size  })
  })
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [visible, setVisible] = useState(false)
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  useEffect(() => {
    setLoading(true)
    axios.get(url).then((res) => {
      console.log(res.data.CurrentFile)
      // let keyArr = Object.keys(res.data)
      // let valueArr = Object.values(res.data)
      // valueArr.map((value, index)=>{

      //     value['key'] = keyArr[index]

        
      // })
      // console.log(valueArr)
      // setData(Object.values(valueArr))
      setData(res.data.CurrentFile)
      setLoading(false)
    })
  }, [state.BackupRestore.BackupReq])

  const deleteItem = (key) => {
    console.log(key)
    let url = `/deletelibrary/${key}`
    console.log(url)
    axios.get(url).then((res)=>{
      console.log(res)
      dispatch({type:'updateCloud', payload:{BackupReq: ''}})
    })
    .catch((error)=>{
      console.log(error)
      dispatch({type:'updateCloud', payload:{BackupReq: ''}})
    })
  }

  const [loadings, setLoadings] = useState(false)
  const DownloadConfig = () => {
    setLoadings(true)
    console.log('ckick')
    axios({
      url: 'api/fota.xml',
      // url: 'RestoreConfig',
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      setLoadings(false)
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

  const columns = [
    {
      title: 'FileName',
      dataIndex: 'FileName',
      width: '40%',
      ...getColumnSearchProps('FileName')
    },
    {
      title: 'FileType',
      dataIndex: 'FileType',
      width: '25%',
      ...getColumnSearchProps('FileType')
    },
    {
      title: 'CtratedDate',
      dataIndex: 'UploadDate',
      width: '25%',
      ...getColumnSearchProps('UploadDate')
    },
    {
      title: 'Size(KB)',
      dataIndex: 'Size',
      width: '20%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '20%',
      render: (text, record, index) => (
        <Fragment key={index}><Button onClick={()=>DownloadConfig(record.key)} icon={<FcDownload />}></Button> <Button onClick={()=>deleteItem(record.key)} icon={<FcDeleteDatabase />}></Button></Fragment>
      )
    }
  ]

  return (
    <Card title="Data on Clould Libary" className={styles.card} headStyle={{ display: 'none' }}>
        <Button type="primary" onClick={()=>setVisible(true)}>
          Upload
        </Button>
        <Modal
          title="Modal"
          visible={visible}
          onOk={()=>setVisible(false)}
          onCancel={()=>setVisible(false)}
          okText="确认"
          cancelText="取消"
        >
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
        </Modal>
      <Button type="primary" loading={loadings} onClick={DownloadConfig} icon={<DownloadOutlined />} size={'large'} className={styles.clickBtn}>
        Download
      </Button>
      <Button type="primary" danger loading={loadings} onClick={DownloadConfig} icon={<RiDeleteBin2Line />} size={'large'}>
        Delete
            </Button>
      <div>
        <div>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={rawdata} pagination={false} scroll={{ x: 900, y: 800 }} className={styles.table} loading={loading} />
      </div>
    </Card>
  )
}

export default CloudList 