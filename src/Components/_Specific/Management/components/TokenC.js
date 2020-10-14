import React, { useEffect, useState } from "react";
import {
  Card,
  Modal,
  Descriptions,
  Tag,
  Table,
  Tooltip,
  Popconfirm,
  Form,
  Input,
  message,
  Button
} from "antd";
import styles from "../management.module.scss";
import useURLloader from "../../../../hook/useURLloader";
import { FcDeleteDatabase, FcAddDatabase } from "react-icons/fc";
import { RiEdit2Fill } from "react-icons/ri";
import axios from 'axios'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const EditTokenForm = ({ record, EdieTokenvisible, setEdieTokenvisible, uploading, setUploading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
      form.setFieldsValue({
        token_list: record.token_list,
      });
  }, [record]);

  const columns = [
    {
      title: "Token",
      dataIndex: "token_list",
      key: "token_list",
      width: "20%",
      render: (_, EditTokenRecord, index) => {
        return (
          <Form.Item name={["token_list", index]}>
            <Input />
          </Form.Item>
        );
      },
    },
    {
      title: "Rename",
      dataIndex: "rename",
      key: "rename",
      width: "20%",
      render: (_, EditTokenRecord, index) => {
        return (
          <Form.Item name={["rename", index]}>
            <Input />
          </Form.Item>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      width: "20%",
      render: (_, EditTokenRecord) => {
        return (
          <Tooltip title="Delete Token">
            <Popconfirm
              title="Sure to Delete?"
              onConfirm={() => {
                deleteToken(EditTokenRecord);
                setEdieTokenvisible(false)
              }}
            >
              <FcDeleteDatabase className={styles.DeleteIcon} />
            </Popconfirm>
          </Tooltip>
        );
      },
    },
  ];

  const ModifyTokenonFinish = (values) => {
    console.log(values);
    setUploading(true)
    let token_list = ''
    for(let i=0; i<values.token_list.length; i++){
      if(values.rename[i] !== undefined){
        token_list += `{"old_token":"${values.token_list[i]}","new_token":"${values.rename[i]}"},`
      }
    }
    const ModifyTokeUrl = `/device_mgnt/token?modify_token={"cid":"${record.cid}", "token_list":[${token_list.substring(0,token_list.length-1)}]}`
    axios.get(ModifyTokeUrl).then((res)=>{
      console.log(res)
      setUploading(false)
      message.success("modify successfully");
      setEdieTokenvisible(false)
    }).catch((error)=>{
      console.log(error)
      setUploading(false)
      message.success("modify fail");
      setEdieTokenvisible(false)
    })  
  };

  const deleteToken = (EditTokenRecord) => {
    setUploading(true)
    console.log(EditTokenRecord)
    const deleteTokenUrl = `/device_mgnt/token?delete_token={"cid":"${record.cid}", "token_list":["${EditTokenRecord}"]}`
    axios.get(deleteTokenUrl).then((res)=>{
      console.log(res)
      setUploading(false)
      message.success("delete successfully");
    }).catch((error)=>{
      console.log(error)
      setUploading(false)
      message.error("delete fail");
    })
  };
      
  return (
    <Modal
        title="Edit Token"
        visible={EdieTokenvisible}
        onCancel={() => setEdieTokenvisible(false)}
        okButtonProps={{
          form: "EditToken",
          key: "submit",
          htmlType: "submit",
        }}
        width="60%"
        destroyOnClose={true}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={uploading}
            onClick={() => {
              form.submit();
            }}
          >
            Submit
          </Button>,
        ]}
      >     
    <Form
      {...layout}
      name="TokenForm"
      autoComplete="off"
      onFinish={ModifyTokenonFinish}
      // onFinishFailed={onFinishFailed}
      form={form}
    >
      <Table
        columns={columns}
        dataSource={record.token_list}
        pagination={false}
        loading={uploading}
        rowKey = {(record)=>record}
      />
    </Form>
    </Modal>
  );
};

export const TokenManagementC = () => {
  const [uploading, setUploading] = useState(false)
  const TokenUrl = `/device_mgnt/token?list_token={}`;
  const [TokenLoading, TokenResponse] = useURLloader(TokenUrl, uploading);
  const [TokenList, setTokenList] = useState([]);
  const [record, setRecord] = useState("");
  const [EdieTokenvisible, setEdieTokenvisible] = useState(false);

  useEffect(() => {
    if (TokenResponse) {
      let TokenList = [];
      TokenResponse.response.forEach((item, index) => {
        TokenList.push({
          key: index,
          cid: item.cid,
          token_list: item.token_list,
        });
      });
      // console.log(TokenList);
      setTokenList(TokenList);
    }
  }, [TokenResponse]);

  async function CreateToken(TokenTablerecord){
    setUploading(true)
    const generateTokenUrl = `/device_mgnt/token?generate_token={}`
    let newToken
    
    await axios.get(generateTokenUrl).then((res)=>{
      newToken = res.data.response.token
    })
    axios.get(`/device_mgnt/token?create_token={"cid":"${TokenTablerecord.cid}", "token_list":["${newToken}"]}`).then((resu)=>{
      console.log(resu)
      setUploading(false)
      message.success("Create successfully");
    }).catch((error)=>{
      console.log(error)
      setUploading(false)
      message.error("Create fail");
    })
  }

  const columns = [
    { title: "Customer", dataIndex: "cid", key: "cid", width: "20%" },
    {
      title: "TokenList",
      dataIndex: "token_list",
      key: "token_list",
      width: "20%",
      render: (_, TokenTablerecord) => {
        // console.log(TokenTablerecord)
        return TokenTablerecord.token_list.map((item, index) => {
          return (
            <Tag color="default" key={index}>
              {item}
            </Tag>
          );
        });
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "20%",
      render: (_, TokenTablerecord) => {
        // setRecord(record)
        return (
          <div className={styles.InformationBtnWrapper}>
            <Tooltip title="Edit Token">
              <a
                href="/#"
                disabled={TokenList.length === 0}
                onClick={(e) => {
                  e.preventDefault();
                  setEdieTokenvisible(true);
                  setRecord(TokenTablerecord);
                }}
              >
                <RiEdit2Fill className={styles.EditIcon} />
              </a>
            </Tooltip>
            <Tooltip title="Create Token">
            <Popconfirm
              title="Sure to add a token?"
              onConfirm={() => {
                CreateToken(TokenTablerecord);
              }}
            >
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <FcAddDatabase className={styles.CreateUserIcon} />
              </a>
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div>
        <EditTokenForm
          TokenList={TokenList}
          EdieTokenvisible={EdieTokenvisible}
          setEdieTokenvisible = {setEdieTokenvisible}
          // onFinish={onFinish}
          // onEditcid={onEditcid}
          uploading={uploading}
          setUploading={setUploading}
          record={record}
        />
      <Card>
        <Table
          columns={columns}
          dataSource={TokenList}
          pagination={false}
          loading={(TokenLoading || uploading)}
        />
      </Card>
    </div>
  );
};

export const TokenModelC = ({ Tokenvisible, setTokenvisible, record }) => {
  const GetTokenUrl = `/device_mgnt/token?list_token={"cid":"${record.cid}"}`;
  const [TokenLoading, TokenResponse] = useURLloader(GetTokenUrl);
  const [TokenList, setTokenList] = useState([]);
  useEffect(() => {
    if (TokenResponse) {
      setTokenList(TokenResponse.response[0].token_list);
    }
  }, [TokenResponse]);

  return (
    <Modal
      visible={Tokenvisible}
      onOk={() => setTokenvisible(false)}
      onCancel={() => setTokenvisible(false)}
      okText="confirm"
      cancelText="cancel"
      centered={true}
      width={"50%"}
      className={styles.modal}
      destroyOnClose={true}
      title="Token State"
    >
      <Card loading={TokenLoading} bordered={false}>
        <Descriptions bordered>
          {
            <Descriptions.Item label="Token">
              {TokenList.map((item, index) => {
                return <p key={index}>{item}</p>;
              })}
              <br />
            </Descriptions.Item>
          }
        </Descriptions>
      </Card>
    </Modal>
  );
};

// http://192.168.0.95:8000/device_mgnt/token?generate_token={}  # {"response": {"token": "1f6da00e816e40e3987acbfa8ed2c104"}}
// http://192.168.0.95:8000/device_mgnt/token?create_token={"cid":"12345678901234567890123456789011", "token_list":["11111111111111111111111111111111","22222222222222222222222222222222","33333333333333333333333333333333","44444444444444444444444444444444"]}
// http://192.168.0.95:8000/device_mgnt/token?modify_token={"cid":"12345678901234567890123456789011", "token_list":[{"old_token":"11111111111111111111111111111111","new_token":"00001111111111111111111111111111"},{"old_token":"22222222222222222222222222222222","new_token":"00002222222222222222222222222222"}]}
// http://192.168.0.95:8000/device_mgnt/token?delete_token={"cid":"12345678901234567890123456789012", "token_list":["00001111111111111111111111111111","00002222222222222222222222222222"]}
// http://192.168.0.95:8000/device_mgnt/token?list_token={} # {"response": [{"cid":"", "token_list":["33333333333333333333333333333333","44444444444444444444444444444444"]}]}
