import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from './devicebackup.module.scss'
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Table, Input, Space, Form } from 'antd';
import axios from 'axios'
// import useURLloader from '../../../hook/useURLloader'
import Highlighter from 'react-highlight-words';
import Context from '../../../Utility/Reduxx'

const BackupBtn = () => {
  
  const url = '/api/nodes.json'
  const [data, setData] = useState([{ nodeInf: { id: '', model: '' } }])
  const { state, dispatch } = useContext(Context)  
  const rawdata = [];
  data.forEach((item) => {
    rawdata.push({ key: item.nodeInf.id, id: item.nodeInf.id, model: item.nodeInf.model })
  })
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

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
      setData(res.data.response.device_status)
      // console.log(res.data.response)
      setLoading(false)
    })
  }, [])

  const [loadings, setLoadings] = useState(false)

  const ReqConfig= () => {
    console.log(selectedRowKeys)
    let str='http://localhost:3001/libray/'
    selectedRowKeys.forEach((item)=>{
      str += `&${item}`
    })
    console.log(str)
    axios.get(str).then((res)=>{
      console.log(res)
      console.log(state)
      dispatch({type:'updateCloud', payload:{BackupReq: str}})
    })
    .catch(()=>{
      dispatch({type:'updateCloud', payload:{BackupReq: str}})
    })
  }
  

  const DownloadConfig = () => {
    setLoadings(true)
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
            // this.searchInput = node;
          }}
          //   ref={node => {
          //     this.searchInput = node;
          //   }}
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
      title: 'Device_ID',
      dataIndex: 'id',
      width: '30%',
      ...getColumnSearchProps('id')
    }
  ]

  return (
    <Card bordered={true} title="FileRequest" className={styles.card} headStyle={{ display: 'none' }}>
      <Button type="primary" loading={loadings} onClick={ReqConfig} icon={<DownloadOutlined />} size={'large'} className={styles.clickBtn}>
        Backup
      </Button>
      <div>
        <div >
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={rawdata} pagination={false} scroll={{ x: 300, y: 800 }} className={styles.table} width='300' loading={loading} />
      </div>
    </Card>
  )
}




export default BackupBtn 