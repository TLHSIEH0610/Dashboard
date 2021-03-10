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
  Row,
  Col,
  Tooltip
} from "antd";
import axios from "axios";
import useURLloader from "../../../../hook/useURLloader";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FcDeleteDatabase, FcDownload, FcSynchronize } from "react-icons/fc";
import Context from "../../../../Utility/Reduxx";
import { RiEdit2Fill } from 'react-icons/ri'

import SparkMD5 from "spark-md5";
import { useTranslation } from 'react-i18next';

const RepositoryC = ({ setIsUpdate, IsUpdate }) => {
  const [form] = Form.useForm();
  const [Renameform] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const [data, setData] = useState([
    { key: "", name: "", type: "", date: "", model: "", size: "" },
  ]);
  const { state } = useContext(Context);
  const [fileList, setFileList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cMD5, setCMD5] = useState("");
  // const EditableContext = React.createContext();
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const [modelList, setModelList] = useState(undefined);
  const { t } = useTranslation();
  const [editingKey, setEditingKey] = useState("");
  const NodeInfoUrl = "/cmd";
  const Urldata = `{"get":{"nodeInf":{"filter":{${
    level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
  }},"nodeInf":{"model":{}}}}}`;
  const [NodeInfoLoading, NodeInfoResponse] = useURLloader(
    NodeInfoUrl,
    Urldata,
    uploading
  );

  useEffect(() => {
    if (NodeInfoResponse?.response?.nodeInf) {
      let modelList = new Set();
      NodeInfoResponse.response.nodeInf.map((item) => {
        modelList.add(item.nodeInf.model);
      });
      modelList = Array.from(modelList);
      setModelList(modelList);
    }
  }, [NodeInfoResponse]);


  
  const edit = (index) => {
    // console.log(record.key)
    setEditingKey(index);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const RenameOnFinish = (values, record) => {
    // console.log(values, record);

    setUploading(true);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/repository",
      data: JSON.parse(
        `{"rename_file":{"cid":"${record.cid}","old_name":"${record.name}","new_name":"${values.name}","type":"${record.type}"}}`
      ),
    };
    axios(config)
      .then((res) => {
        setUploading(false);
        console.log(res);
        setIsUpdate(!IsUpdate);
        cancel()
        message.success("rename successfully.");
      })
      .catch((erro) => {
        console.log(erro);
        message.error("rename failed.");
        setUploading(false);
      });
  };

  const [RepoIsUpdate, setRepoIsUpdate ] = useState(false)
  const [allFileList, setAllFileList] = useState([]);
  const FileRepostoryUrl = "/repository";
  const FileRepostoryUrldata = `{"list_file":{${
    level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
  }}}`;

  // const FileRepostoryUrl =  level==='super_super' ?  `/repository?list_file={${state.Login.Cid}}` : `/repository?list_file={"cid":"${cid}"}`;
  const [ReposLoading, ReposResponse] = useURLloader(
    FileRepostoryUrl,
    FileRepostoryUrldata,
    IsUpdate, RepoIsUpdate
  );
  // console.log(ReposResponse)
  useEffect(() => {
    if (ReposResponse?.response?.repository.length) {
      const response = ReposResponse.response.repository;
      // console.log(response)
      let Resdata = [];
      let allFileList = [];
      response.forEach((item, index) => {
        item.list.forEach((list, listIndex) => {
          //set不可以看到yml以外的檔案
          if(level==='set'&&list.type!=='yml'){
            return
          }
          allFileList.push(list.name);
          Resdata.push({
            cid: item.cid,
            key: `${index}_${listIndex}`,
            name: list.name,
            type: list.type,
            date: list.date,
            size: list.size,
            model: list.inf?.model,
            md5: list.inf?.md5
          });
        });
      });
      setData(Resdata);
      setAllFileList(allFileList);
      // setUploading(false);
      // console.log(Resdata);
    } else {
      setData([]);
      setAllFileList([]);
      // setUploading(false);
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ReposResponse]);

  const deleteItem = (key) => {
    setUploading(true);
    // let url = `/repository?delete_file={"cid":"${key.cid}","name":"${key.name}","type":"${key.type}"}` ;
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/repository",
      data: JSON.parse(
        `{"delete_file":{"cid":"${key.cid}","name":"${key.name}","type":"${key.type}"}}`
      ),
    };
    console.log(config.data);
    axios(config)
      .then((res) => {
        console.log(res);
        setUploading(false);
        setIsUpdate(!IsUpdate);
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
    let url = `/repository?download_file={"cid":"${key.cid}","name":"${key.name}","type":"${key.type}"}`;
    // console.log(url);
    // const opt = {
    //   responseType: "blob",
    // };

    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/repository",
      data: JSON.parse(
        `{"download_file":{"cid":"${key.cid}","name":"${key.name}","type":"${key.type}"}}`
      ),
      responseType: "blob",
    };
    console.log(config.data, url);
    axios(config)
      .then((response) => {
        console.log(response.data);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${key.name}`);
        document.body.appendChild(link);
        link.click();
        setUploading(false);
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
          // placeholder={{t("ISMS.Search ")}}
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
            {t("ISMS.Search")}
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {t("ISMS.Reset")}
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
    /////////////////////////////////////////////////////////////////////////////
    var blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice,
      file = info.file,
      chunkSize = 2097152, // Read in chunks of 2MB
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();

    fileReader.onload = function (e) {
      console.log("read chunk nr", currentChunk + 1, "of", chunks);
      spark.append(e.target.result); // Append array buffer
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        console.log("finished loading");
        // console.info("computed hash", spark.end()); // Compute hash
        setCMD5(spark.end());
      }
    };

    fileReader.onerror = function () {
      console.warn("oops, something went wrong.");
    };

    function loadNext() {
      var start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize;

      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
    ///////////////////////////////////////////////////////////////////////////////////////////////
    setFileList(fileList);
    setUploadFileType("");
    // console.log(fileList);
    // const fileReader = new FileReader();
    // fileReader.readAsArrayBuffer(fileList[0].originFileObj);
    // fileReader.onload = (e) => {
    //   console.log(md5(e.target.result));
    //   setCMD5(md5(e.target.result));
    // };
  };

  const onFinish = (values) => {
    setUploading(true);
    console.log("Received values of form:", values);
    const formData = new FormData();
    formData.append("file", values.upload.fileList[0].originFileObj);
    const UploadUrl = `/repository?upload_file={${
      level === "super_super"
        ? state.Login.Cid === ""
          ? `"cid":"${cid}"`
          : state.Login.Cid
        : `"cid": "${cid}"`
    },"name":"${values.filename || values.upload.file.name}","type":"${
      values.type
    }","inf": {"md5":"${values.md5
    }","model": "${values.model}"}}`;
    console.log(UploadUrl);

    if (
      values.filename
        ? allFileList.includes(values.filename)
        : allFileList.includes(values.upload.file.name)
    ) {
      message.error("File Name is duplicated! Please try again!");
      setUploading(false);
      return;
    }

    axios
      .post(UploadUrl, formData)
      .then(() => {
        // console.log(res);
        setFileList([]);
        message.success("upload successfully.");
        setUploading(false);
        form.resetFields();
        setUploadFileType("");
        setIsUpdate(!IsUpdate);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
        message.error("upload fail.");
        form.resetFields();
        setUploadFileType("");
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
      title: t("ISMS.FileName"),
      dataIndex: "name",
      // width: "30%",
      // editable: true,
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index)=>
      // <Tooltip title={record.md5 ? `MD5: ${record.md5}` : null}>{text}</Tooltip>
      
        <Fragment>
        {editingKey !== index ? (
          <div className={styles.rename}>
            <Tooltip title={record.md5 ? `MD5: ${record.md5}` : null}>{text}</Tooltip>
            <Tooltip title={t("ISMS.rename")}>
              <RiEdit2Fill
                className={styles.renameIcon}
                // style={level === "get" && { display: "none" }}
                onClick={() => {
                  Renameform.setFieldsValue({
                    name: record.name ,
                  });
                  edit(index);
                }}
              />
            </Tooltip>
          </div>
        ) : (
          <Form
            form={Renameform}
            onFinish={(value) => RenameOnFinish(value, record)}
          >
            <Row>
              <Col span={18}>
                <Form.Item
                  style={{ margin: 0 }}
                  name={"name"}
                  rules={[{ required: true }]}
                  // initialValue={record.name ? record.name : record.id}
                >
                  <Input placeholder="New Device Name" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <a
                  href="/#"
                  onClick={(e) => {
                    e.preventDefault();
                    Renameform.submit()
                    // RenameOnFinish(record)
                  }}
                >
                  {t("ISMS.Save")}
                </a>
              </Col>
              <Col span={3}>
                <a
                  href="/#"
                  onClick={(e) => {
                    e.preventDefault();
                    cancel();
                  }}
                >
                  {t("ISMS.Cancel")}
                </a>
              </Col>
            </Row>
          </Form>
        )}
      </Fragment>
      
    },
    {
      title: t("ISMS.Model"),
      dataIndex: "model",
      // width: "15%",
      ...getColumnSearchProps("model"),
      // sorter:(a, b) => (a.model.length - b.model.length),
      // sortDirections:["descend", "ascend"]
    },
    {
      title: t("ISMS.FileType"),
      dataIndex: "type",
      // width: "15%",
      ...getColumnSearchProps("type"),
      // sorter:(a, b) => (a.type.length - b.type.length),
      // sortDirections:["descend", "ascend"]
    },
    {
      title: t("ISMS.CreatedDate"),
      dataIndex: "date",
      // width: "25%",
      responsive: ["md"],
      // ...getColumnSearchProps("date"),
    },
    {
      title: t("ISMS.Size"),
      dataIndex: "size",
      // width: "15%",
      responsive: ["md"],
    },
    {
      title: t("ISMS.Action"),
      dataIndex: "action",
      // width: "20%",
      className: `${styles.actionCol}`,
      render: (_, record, index) => (
        <Fragment key={index}>
          <Button
            onClick={() => DownloadConfig(record)}
            icon={<FcDownload />}
          ></Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deleteItem(record)}
          >
            <Button icon={<FcDeleteDatabase />}></Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  return (
    <Fragment>
    <Card
      // title="Data on Clould Libary"
      className={styles.card}
      headStyle={{ display: "none" }}
    >
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
      <Button
        type="primary"
        loading={uploading}
        onClick={() => setVisible(true)}
        className={styles.clickBtn}
        icon={<UploadOutlined style={{marginBottom:'5px'}} />}
      >
        {t("ISMS.Upload")}
      </Button>

      <Tooltip title={t("ISMS.Refresh")} style={{marginLeft:'auto'}}>
            <Button
              icon={<FcSynchronize style={{fontSize:'1.7rem'}} />}
              onClick={() => setRepoIsUpdate(!RepoIsUpdate)}
            />
          </Tooltip>
      </div>

      <Modal
        title={t("ISMS.Upload")}
        visible={visible}
        // onOk={() => setVisible(false)}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          props.onRemove();
          setUploadFileType(null);
        }}
        footer={[
          <Button
            key="submit"
            type="primary"
            disabled={fileList.length === 0}
            loading={uploading}
            onClick={() => {
              // setSchemeModalvisible(false);
              form.submit();
            }}
          >
            {uploading ? t("ISMS.Uploading") : t("ISMS.StartUpload")}
          </Button>,
        ]}
      >
        <Form
          onFinish={onFinish}
          form={form}
          layout="vertical"
        >
          <div className={styles.formwrap}>
            <Row gutter={24} justify="center">
              <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                <Form.Item
                  label={t("ISMS.File")}
                  name={"upload"}
                  rules={[{ required: true, message: "Please select a file" }]}
                >
                  <Upload {...props} maxCount={1}>
                    <Button icon={<UploadOutlined />}>{t("ISMS.SelectFile")}</Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  label={t("ISMS.Model")}
                  name={"model"}
                  rules={[{ required: true, message: "Please select a model" }]}
                >
                  <Select loading={NodeInfoLoading} placeholder={t("ISMS.Select")}>
                    {modelList?.map((item, index) => {
                      return (
                        <Option key={index} value={item}>
                          {item}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("ISMS.FileName")}
                  name={"filename"}
                  rules={[{ required: false, message: "Input a file name" }]}
                >
                  <Input placeholder={t("ISMS.InputFileName(Optional)")}/>
                </Form.Item>
                <Form.Item
                  label={t("ISMS.FileType")}
                  name={"type"}
                  rules={[{ required: true, message: "Please select a type" }]}
                  // style={{display:'none'}}
                >
                  <Select
                    placeholder={t("ISMS.Select")}
                    onChange={(value) => {
                      setUploadFileType(value);
                      form.setFieldsValue({ md5: cMD5 });
                    }}
                  >
                    <OptGroup label={t("ISMS.Restore")}>
                      <Option value="cfg" disabled={level==='set'}>Cfg</Option>
                    </OptGroup>
                    <OptGroup label={t("ISMS.Upgrade")}>
                      <Option value="fw" disabled={level==='set'}>Fw</Option>
                    </OptGroup>
                    <OptGroup label="YAML">
                      <Option value="yml">Yml</Option>
                    </OptGroup>
                  </Select>
                </Form.Item>

                  <Form.Item
                    style={uploadFileType !== "fw" && {display:'none'}}
                    label={"MD5"}
                    name={"md5"}
                  >
                    <Input
                      disabled={true}
                    />
                  </Form.Item>

              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
      <div>
        <Table
          rowClassName={() => "editable-row"}
          columns={columns}
          dataSource={data}
          pagination={false}
          className={styles.table}
          loading={uploading || ReposLoading}
        />
      </div>
    </Card>
    </Fragment>
  );
};

export default RepositoryC;
