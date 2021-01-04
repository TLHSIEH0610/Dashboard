import React, { useEffect, useState, useContext } from "react";
import { Form } from "antd";
// import styles from "../topology.module.scss";
// import axios from "axios";
// import { UserLogOut } from '../../../../Utility/Fetch'
// import { useHistory } from 'react-router-dom'
import Context from "../../../../Utility/Reduxx";
import useURLloader from "../../../../hook/useURLloader";
import { BulkConfigMF } from './BulkConfigF'

const BulkConfigC = ({IsUpdate}) => {
  // const [IsUpdate, setIsUpdate] = useState(false)
  const { state } = useContext(Context);
  // const [alarmLog, setAlarmLog] = useState([]);
  // const [currentAlarm, setCurrentAlarm] = useState([]);
  // const [uploading, setUploading] = useState(false);
  // const history = useHistory()
  // const { dispatch } = useContext(Context);
  const [form] = Form.useForm();
  const [FileRepository, setFileRepository] = useState([]);
  // const [userModel, setUserModel] = useState([]);
  // const [selectedModel, setSelectedModel] = useState("");
  const [ModelList, setModelList] = useState([]);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const NodeUrl= '/cmd'
  const NodeUrldata= `{"get":{"nodeInf":{"filter":{${level==='super_super'?  state.Login.Cid : `"cid":"${cid}"` }},"nodeInf":{"cid":{},"gid":{},"token":{},"id":{},"model":{},"name":{}}}}}`
  const [Nodeloading, Noderesponse] = useURLloader(NodeUrl, NodeUrldata, IsUpdate);
  const [NodeData, setNodeData] = useState([]);
  const FileRepostoryUrl= '/repository'
  const FileRepostoryUrldata= `{"list_file":{${level==='super_super'? state.Login.Cid : `"cid":"${cid}"`}}}`
  const [Fileloading, Filereponse] = useURLloader(FileRepostoryUrl, FileRepostoryUrldata, IsUpdate);

  useEffect(() => {
    if (Noderesponse?.response) {
      // console.log(Noderesponse.response)
      let Allmodel = new Set();
      let NodeData = Noderesponse.response.nodeInf.map((item, index) => {
        !Allmodel.has(item.nodeInf.model) && Allmodel.add(item.nodeInf.model);
        return({
          key: index,
          id: item.nodeInf.id,
          name: item.nodeInf.name,
          model: item.nodeInf.model,
        });
        
      });
      Allmodel = Array.from(Allmodel)
      setNodeData(NodeData);
      setModelList(Allmodel);
      // console.log(new Set())
      form.resetFields()
      // console.log(NodeData,Allmodel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [Noderesponse]);

  useEffect(() => {
    // console.log(Filereponse)
    if (Filereponse?.response.repository.length) {
      setFileRepository(Filereponse.response.repository[0].list);
      // console.log(Filereponse.response.repository[0].list)
    }else{
      setFileRepository([])
    }
  }, [Filereponse]);


  return (

        <BulkConfigMF Nodeloading={Nodeloading} NodeData={NodeData} ModelList={ModelList} FileRepository={FileRepository} Fileloading={Fileloading}/>

  );
};

export const BulkConfigMC = React.memo(BulkConfigC);
