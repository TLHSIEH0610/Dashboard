import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  useContext,
} from "react";
import styles from "../devicebackup.module.scss";
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
import useURLloader from '../../../../hook/useURLloader'
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FcDeleteDatabase, FcDownload } from "react-icons/fc";
import Context from '../../../../Utility/Reduxx'
import md5 from "blueimp-md5";
import { Translator } from '../../../../i18n/index'


const RepositoryC = ({uploading, setUploading}) => {

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

  const [data, setData] = useState([
    { key: "", name: "", type: "", date: "", model: "", size: "" },
  ]);
  const { state } = useContext(Context)
  // const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cMD5, setCMD5] = useState("");
  // const IsActionUpdated = state.BackupRestore.IsActionUpdated
  const EditableContext = React.createContext();
  const cid = localStorage.getItem("authUser.cid");

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

    const save = async () => {
        const values = await form.validateFields();
        toggleEdit();
        if(record.name===values.name){return}
        const RenameUrl = `/repository?rename_file={"cid":"${record.cid}","old_name":"${record.name}","new_name":"${values.name}","type":"${record.type}"}`
        setUploading(true)
        axios.get(RenameUrl).then((res)=>{
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
  const FileRepostoryUrl =  cid==='proscend' ?  `/repository?list_file={${state.Login.Cid}}` : `/repository?list_file={"cid":"${cid}"}`;
  const [ReposLoading, ReposResponse] = useURLloader(FileRepostoryUrl, uploading)
  // console.log(FileRepostoryUrl)
  useEffect(() => {
      if(ReposResponse && ReposResponse.response.repository.length){
        const response = ReposResponse.response.repository;
        let Resdata = [];
        let allFileList = []
        response.forEach((item, index) => {
          item.list.forEach((list,listIndex)=>{
          allFileList.push(list.name)
          Resdata.push({
            cid: item.cid,
            key: `${index}_${listIndex}`,
            name: list.name,
            type: list.type,
            date: list.date,
            size: list.size,
            model: list.inf.model,
          });
          })
        });
        setData(Resdata);
        setAllFileList(allFileList)
        // setUploading(false);
        // console.log(Resdata);
      }else{
        setData([]);
        setAllFileList([])
        // setUploading(false);
      }
  }, [ReposResponse]);


  const deleteItem = (key) => {
    setUploading(true);
    let url = `/repository?delete_file={"cid":"${key.cid}","name":"${key.name}","type":"${key.type}"}` ;
    console.log(url);
    axios
      .get(url)
      .then((res) => {
        console.log(res);
        setUploading(false);
        message.success("delete successfully.");
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("delete fail.");
      });
  };

  const DownloadConfig = (key) => {
    setUploading(true);
    let url = `/repository?download_file={"cid":"${key.cid}","name":"${key.name}","type":"${key.type}"}` 
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
        message.error("download fail.");
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
    // form.resetFields();
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
    console.log(values)
    const UploadUrl = `/repository?upload_file={${cid==="proscend" ? (state.Login.Cid===''? `"cid":"proscend"` : state.Login.Cid ) : `"cid": "${cid}"`},"name":"${values.filename || values.upload.file.name}","type":"${values.type}","inf": {"MD5":"${values.MD5 === undefined ? "123" : values.MD5}","model": "${values.model}"}}`;
    console.log(UploadUrl);
    // console.log(allFileList, values.filename, values.upload.file.name)
    if(values.filename? allFileList.includes(values.filename) : allFileList.includes(values.upload.file.name) ){
      message.error("File Name is duplicated! Please try again!");
      setUploading(false)
      return
    }

    axios.post(UploadUrl, formData)
      .then((res) => {
        console.log(res);
        setFileList([]);
        message.success("upload successfully.");
        setUploading(false);
        form.resetFields()
        setUploadFileType("")
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
        message.error("upload fail.");
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

  // function FileSelecthandleChange(value) {
  //   // console.log(`selected ${value}`);
  // }

  let columns = [
    {
      title: Translator("ISMS.FileName"),
      dataIndex: "name",
      width: "30%",
      editable: true,
      ...getColumnSearchProps("name"),
      // <RiEdit2Fill className={styles.EditIcon} />
    },
    {
      title: Translator("ISMS.Model"),
      dataIndex: "model",
      width: "15%",
      ...getColumnSearchProps("model"),
    },
    {
      title: Translator("ISMS.FileType"),
      dataIndex: "type",
      width: "15%",
      ...getColumnSearchProps("type"),
    },
    {
      title: Translator("ISMS.CreatedDate"),
      dataIndex: "date",
      width: "25%",
      responsive: ["md"],
      ...getColumnSearchProps("date"),
    },
    {
      title: Translator("ISMS.Size"),
      dataIndex: "size",
      width: "15%",
      responsive: ["md"],
    },
    {
      title: Translator("ISMS.Action"),
      dataIndex: "action",
      width: "20%",
      className: `${styles.actionCol}`,
      render: (_, record, index) => (
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
        loading={uploading}
        onClick={() => setVisible(true)}
        className={styles.clickBtn}
        icon={<UploadOutlined />}
      >
         {Translator("ISMS.Upload")}
      </Button>
      <Modal
        title="Upload"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => {setVisible(false); form.resetFields(); props.onRemove()}}
        okButtonProps={{
          form: "FileUpload",
          key: "submit",
          htmlType: "submit",
          disabled: fileList.length === 0,
          loading: uploading,
        }}
        okText={uploading ? "Uploading" : "Start Upload"}
        cancelText="Cancel"
        // footer={[
        //   <Button
        //     key="submit"
        //     type="primary"
        //     loading={Schemeloading}
        //     onClick={() => {
        //       setSchemeModalvisible(false);
        //     }}
        //   >
        //     Confirm
        //   </Button>,
        // ]}
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
          loading={uploading || ReposLoading}
        />
      </div>
    </Card>
  );
};

export default RepositoryC;

