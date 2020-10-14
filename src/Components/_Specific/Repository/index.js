import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  useContext,
} from "react";
import styles from "./cloud.module.scss";
import {
  Button,
  Card,
  Table,
  Input,
  Space,
  Modal,
  Upload,
  Select,
  Form,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
// import useURLloader from '../../../hook/useURLloader'
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FcDeleteDatabase, FcDownload } from "react-icons/fc";
import Context from '../../../Utility/Reduxx'
import md5 from "blueimp-md5";
import { useHistory } from "react-router-dom";
import { UserLogOut } from "../../../Utility/Fetch";
import Swal from "sweetalert2";

const CloudList = () => {
  const [form] = Form.useForm();
  const CompanyPD = [
    "M300",
    "M301",
    "M302",
    "M330",
    "M350",
    "M351",
    "M352",
    "M360",
  ];
  const history = useHistory();
  const [data, setData] = useState([
    { key: "", name: "", type: "", date: "", model: "", size: "" },
  ]);
  const { state } = useContext(Context)
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cMD5, setCMD5] = useState("");
  const IsActionUpdated = state.BackupRestore.IsActionUpdated
  const EditableContext = React.createContext();
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    // handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async (e) => {
      try {
        const values = await form.validateFields();
        // console.log(values, record);
        
        toggleEdit();
        if(record.name===values.name){return}
        const cid = localStorage.getItem('authUser.cid')
        const url = localStorage.getItem('authUser.cid') ==='proscend' ? `/repository?rename_file={${state.Login.Cid},"old_name":"${record.name}","new_name":"${values.name}","type":"${record.type}"}`  : `/repository?rename_file={"cid":"${cid}","old_name":"${record.name}","new_name":"${values.name}","type":"${record.type}"}`
        console.log(url)
        setUploading(true)
        axios.get(url).then((res)=>{
          setUploading(false)
          console.log(res)
          message.success('rename successfully.')
        })
        .catch((erro)=>{
          console.log(erro)
          message.error('rename failed.')
          setUploading(false)
        })
        // handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };

    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <Popconfirm title="Edit fileName?" onConfirm={() => toggleEdit()}>
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          // onClick={
          //   toggleEdit
          // }
        >
          {children}
        </div>
        </Popconfirm>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  // const handleSave = (row) => {
  //   const newData = [...data];
  //   const index = newData.findIndex((item) => row.key === item.key);
  //   const item = newData[index];
  //   newData.splice(index, 1, { ...item, ...row });
  //   setData(newData);
  // };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const [allFileList, setAllFileList] = useState([])
  useEffect(() => {
    const cid = localStorage.getItem("authUser.cid");
    const FileRepostoryUrl = cid ==='proscend' ? `repository?list_file={ ${state.Login.Cid}}`: `repository?list_file={ "cid":"${cid}"}`;
    setLoading(true);
    axios
      .get(FileRepostoryUrl)
      .then((res) => {
        console.log(res.data);
        const response = res.data.response.repository[0].list;
        let Resdata = [];
        let allFileList = []
        response.forEach((item, index) => {
          allFileList.push(item.name)
          Resdata.push({
            key: index,
            name: item.name,
            type: item.type,
            date: item.date,
            size: item.size,
            model: item.inf.model,
          });
        });
        setData(Resdata);
        setAllFileList(allFileList)
        setLoading(false);
        console.log("刷新");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          // dispatch({type:'setLogin', payload:{IsLogin: false}})
          UserLogOut();
          history.push("/login");
        }
      });
  }, [uploading, IsActionUpdated]);

  const deleteItem = (key) => {
    setUploading(true);
    const cid = localStorage.getItem("authUser.cid");
    let url = cid==='proscend'?  `/repository?delete_file={${state.Login.Cid},"name":"${key.name}","type":"${key.type}"}` :`/repository?delete_file={"cid":"${cid}","name":"${key.name}","type":"${key.type}"}` ;
    console.log(url);
    axios
      .get(url)
      .then((res) => {
        console.log(res);

        Swal.fire({
          title: `Delete ${key.name} complete!`,
          icon: "success",
          showConfirmButton: true,
          // timer: 1000
        });
      })
      .then(() => {
        setUploading(false);
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        Swal.fire({
          title: `Delete ${key.name} fail!`,
          icon: "error",
          showConfirmButton: true,
          // timer: 1000
        });
      });
  };

  const DownloadConfig = (key) => {
    setUploading(true);
    const cid = localStorage.getItem("authUser.cid");
    console.log(key)
    let url = cid ==='proscend' ? `/repository?download_file={${state.Login.Cid},"name":"${key.name}","type":"${key.type}"}` : `/repository?download_file={"cid":"${cid}","name":"${key.name}","type":"${key.type}"}`;
    console.log(url);
    const opt = {
      responseType: "blob",
    };
    axios
      .get(url, opt)
      .then((response) => {
        setUploading(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${key.name}`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const searchInput = useRef("");
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput.current = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
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
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(fileList);
    form.resetFields(["type", "MD5"]);
    setUploadFileType("");
    console.log(fileList);
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(fileList[0].originFileObj);
    fileReader.onload = (e) => {
      console.log(fileList, md5(e.target.result));
      setCMD5(md5(e.target.result));
    };
  };

  const onFinish = (values) => {
    setUploading(true);
    console.log("Received values of form:", values);
    const formData = new FormData();
    formData.append("file", values.upload.fileList[0].originFileObj);
    const cid = localStorage.getItem("authUser.cid");
    
    const url = cid ==='proscend' ? `/repository?upload_file={${state.Login.Cid},"name":"${values.filename || values.upload.file.name}","type":"${values.type}","inf": {"MD5":"${values.MD5 === undefined ? "123" : values.MD5}","model": "${values.model}"}}` : `/repository?upload_file={"cid":"${cid}","name":"${values.filename || values.upload.file.name}","type":"${values.type}","inf": {"MD5":"${values.MD5 === undefined ? "123" : values.MD5}","model": "${values.model}"}}`;
    console.log(url);
    console.log(allFileList, values.filename, values.upload.file.name)
    if(values.filename? allFileList.includes(values.filename) : allFileList.includes(values.upload.file.name) ){
      Swal.fire({
        title: `FileName Duplicated! Please try again`,
        icon: "error",
        showConfirmButton: true,
        // timer: 1000
      })
      setUploading(false)
      return
    }

    axios.post(url, formData)
      .then((res) => {
        console.log(res);
        setFileList([]);
        Swal.fire({
          title: `Upload complete!`,
          icon: "success",
          showConfirmButton: true,
          // timer: 1000
        });
      })
      .then(() => {
        setUploading(false);
        form.resetFields()
        setUploadFileType("")
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
        Swal.fire({
          title: `Fail, plaese try again!`,
          icon: "error",
          showConfirmButton: true,
          // timer: 1000
        });
        form.resetFields()
        setUploadFileType("")
      });
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    onChange: handleChange,
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const { Option, OptGroup } = Select;
  const [uploadFileType, setUploadFileType] = useState(null);

  function FileSelecthandleChange(value) {
    console.log(`selected ${value}`);
  }

  let columns = [
    {
      title: "FileName",
      dataIndex: "name",
      width: "30%",
      editable: true,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Model",
      dataIndex: "model",
      width: "15%",
      ...getColumnSearchProps("model"),
    },
    {
      title: "FileType",
      dataIndex: "type",
      width: "15%",
      ...getColumnSearchProps("type"),
    },
    {
      title: "CreatedDate",
      dataIndex: "date",
      width: "25%",
      responsive: ["md"],
      ...getColumnSearchProps("date"),
    },
    {
      title: "Size(KB)",
      dataIndex: "size",
      width: "15%",
      responsive: ["md"],
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "20%",
      className: `${styles.actionCol}`,
      render: (text, record, index) => (
        <Fragment key={index}>
          <Button
            onClick={() => DownloadConfig(record)}
            icon={<FcDownload />}
          ></Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => deleteItem(record)}>
          <Button
            icon={<FcDeleteDatabase />}
          ></Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  columns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        // handleSave: handleSave,
      }),
    };
  });

  return (
    <Card
      title="Data on Clould Libary"
      className={styles.card}
      headStyle={{ display: "none" }}
    >
      <Button
        type="primary"
        loading={loading}
        onClick={() => setVisible(true)}
        className={styles.clickBtn}
        size={"large"}
        icon={<UploadOutlined />}
      >
        Upload
      </Button>
      <Modal
        title="Upload"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        okButtonProps={{
          form: "FileUpload",
          key: "submit",
          htmlType: "submit",
          disabled: fileList.length === 0,
          loading: uploading,
        }}
        okText={uploading ? "Uploading" : "Start Upload"}
        cancelText="Cancel"
      >
        <Form
          id={"FileUpload"}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label={"File"}
            name={"upload"}
            rules={[{ required: true, message: "Please select a file" }]}
          >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label={"Model"}
            name={"model"}
            rules={[{ required: true, message: "Please select a model" }]}
          >
            <Select
              style={{ width: 200 }}
              onChange={(value) => {
                console.log(value);
              }}
            >
              {CompanyPD.map((item, index) => {
                return (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={"File Name"}
            name={"filename"}
            rules={[{ required: false, message: "Input a file name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"File Type"}
            name={"type"}
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Select
              style={{ width: 200 }}
              onChange={(value) => {
                FileSelecthandleChange(value);
                setUploadFileType(value);
                form.setFieldsValue({ MD5: cMD5 });
              }}
            >
              <OptGroup label="Restore">
                <Option value="cfg">cfg</Option>
              </OptGroup>
              <OptGroup label="Upgrade">
                <Option value="fw">fw</Option>
              </OptGroup>
            </Select>
          </Form.Item>
          {uploadFileType === "fw" && (
            <Form.Item
              label={"MD5"}
              name={"MD5"}
              rules={[
                { required: true, message: "Please input the MD5 number!" },
              ]}
            >
              <Input
                placeholder="Please input a specific series of MD5"
                disabled={true}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
      <div>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          columns={columns}
          dataSource={data}
          pagination={false}
          className={styles.table}
          // loading={loading}
          loading={uploading}
        />
      </div>
    </Card>
  );
};

export default CloudList;

// http://192.168.0.95:8000/repository?upload_file={"cid":"12345678901234567890123456789011","name":"abc","type":"cfg","inf":inf}
// http://192.168.0.95:8000/repository?download_file={"cid":"12345678901234567890123456789011","name":"abc","type":"cfg"}
// http://192.168.0.95:8000/repository?delete_file={"cid":"12345678901234567890123456789011","name":"abc","type":"cfg"}
// http://192.168.0.95:8000/repository?rename_file={"cid":"12345678901234567890123456789011","old_name":"abc","new_name":"cde","type":"cfg"}
// http://192.168.0.95:8000/repository?list_file={}
// http://192.168.0.95:8000/repository?list_file={"cid":"12345678901234567890123456789011"}

// https://ba6e036d2d9a.ngrok.io/repository?download_file={"cid":"proscend","name":"test123","type":"cfg"}
