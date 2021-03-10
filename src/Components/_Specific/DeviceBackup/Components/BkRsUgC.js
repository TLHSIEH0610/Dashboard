import React, { useState, useEffect, Fragment, useContext } from "react";
import styles from "../devicebackup.module.scss";
import { Card, Form } from "antd";
import useURLloader from "../../../../hook/useURLloader";
import Context from "../../../../Utility/Reduxx";
import BkRsUgF from './BkRsUgF'
import { useTranslation } from 'react-i18next';

const BkRsUgC = ({ uploading, setUploading, IsUpdate, setIsUpdate }) => {
  const { state } = useContext(Context);
  const [form] = Form.useForm();
  const [FileRepository, setFileRepository] = useState([]);
  const [userModel, setUserModel] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [ModelList, setModelList] = useState([]);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const NodeUrl= '/cmd'
  const NodeUrldata= `{"get":{"nodeInf":{"filter":{${level==='super_super'?  state.Login.Cid : `"cid":"${cid}"` }},"nodeInf":{"cid":{},"gid":{},"token":{},"id":{},"model":{},"name":{},"health":{}}}}}`
  const { t } = useTranslation();

  // const NodeUrl = `/cmd?get={"nodeInf":{"filter":{${level==='super_super'?  state.Login.Cid : `"cid":"${cid}"` }},"nodeInf":{"cid":{},"gid":{},"token":{},"id":{},"model":{},"name":{}}}}`;
  const [Nodeloading, Noderesponse] = useURLloader(NodeUrl, NodeUrldata, IsUpdate);
  const [NodeData, setNodeData] = useState([]);

  const FileRepostoryUrl= '/repository'
  const FileRepostoryUrldata= `{"list_file":{${level==='super_super'? state.Login.Cid : `"cid":"${cid}"`}}}`


  // const FileRepostoryUrl = `repository?list_file={${level==='super_super'? state.Login.Cid : `"cid":"${cid}"`}}`;
  const [Fileloading, Filereponse] = useURLloader(FileRepostoryUrl, FileRepostoryUrldata, IsUpdate);
  const props ={ uploading, setUploading, Nodeloading, Fileloading, form, FileRepository, userModel, NodeData, setUserModel, ModelList,  setSelectedModel, selectedModel, setIsUpdate, IsUpdate }

  useEffect(() => {
    if (Noderesponse?.response) {
      // console.log(Noderesponse)
      let NodeData = [];
      let Allmodel = new Set();

      Noderesponse.response.nodeInf.forEach((item, index) => {
        NodeData.push({
          key: index,
          id: item.nodeInf.id,
          name: item.nodeInf.name,
          model: item.nodeInf.model,
          health: item.nodeInf.health
        });
        !Allmodel.has(item.nodeInf.model) && Allmodel.add(item.nodeInf.model);
      });
      setNodeData(NodeData);
      setModelList(Allmodel);
      form.resetFields()
      // console.log(NodeData,Allmodel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [Noderesponse]);

  useEffect(() => {
    // console.log(Filereponse)
    if (Filereponse?.response?.repository.length) {
      let FileList = new Set()
      Filereponse.response.repository.map((item)=>{
        item.list.map((file)=>FileList.add(file))
      })
      FileList = Array.from(FileList)
      setFileRepository(FileList);
    }else{
      setFileRepository([])
    }
  }, [Filereponse]);

  return (
    <Fragment>
      <Card
        bordered={true}
        title={t("ISMS.Action Request")} 
        className={styles.card}
      >
        <BkRsUgF {...props}/>
      </Card>
    </Fragment>
  );
};

export default BkRsUgC;
