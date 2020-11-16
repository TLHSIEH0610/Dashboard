import React, { useState, useEffect, Fragment, useContext } from "react";
import styles from "../devicebackup.module.scss";
import { Card, Form } from "antd";
import useURLloader from "../../../../hook/useURLloader";
import Context from "../../../../Utility/Reduxx";
import BkRsUgF from './BkRsUgF'
import { Translator } from '../../../../i18n/index'

const BkRsUgC = ({ uploading, setUploading }) => {
  const { state } = useContext(Context);
  const [form] = Form.useForm();
  const [FileRepository, setFileRepository] = useState([]);
  const [userModel, setUserModel] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [ModelList, setModelList] = useState([]);
  const cid = localStorage.getItem("authUser.cid");
  const NodeUrl = `/cmd?get={"nodeInf":{"filter":{${cid==='proscend'?  state.Login.Cid : `"cid":"${cid}"` }},"nodeInf":{"cid":{},"gid":{},"token":{},"id":{},"model":{},"name":{}}}}`;
  const [Nodeloading, Noderesponse] = useURLloader(NodeUrl, uploading);
  const [NodeData, setNodeData] = useState([]);
  const FileRepostoryUrl = `repository?list_file={${cid==='proscend'? state.Login.Cid : `"cid":"${cid}"`}}`;
  const [Fileloading, Filereponse] = useURLloader(FileRepostoryUrl, uploading);
  const props ={ uploading, setUploading, Nodeloading, Fileloading, form, FileRepository, userModel, NodeData, setUserModel, ModelList,  setSelectedModel, selectedModel }

  useEffect(() => {
    if (Noderesponse && Noderesponse.response) {
      // console.log(Noderesponse)
      let NodeData = [];
      let Allmodel = new Set();
      Noderesponse.response.nodeInf.forEach((item, index) => {
        NodeData.push({
          key: index,
          id: item.nodeInf.id,
          name: item.nodeInf.name,
          model: item.nodeInf.model,
        });
        !Allmodel.has(item.nodeInf.model) && Allmodel.add(item.nodeInf.model);
      });
      setNodeData(NodeData);
      setModelList(Allmodel);
      form.resetFields()
      // console.log(NodeData,Allmodel)
    }
  }, [Noderesponse]);

  useEffect(() => {
    // console.log(Filereponse)
    if (Filereponse && Filereponse.response.repository.length) {
      setFileRepository(Filereponse.response.repository[0].list);
    }else{
      setFileRepository([])
    }
  }, [Filereponse]);

  return (
    <Fragment>
      <Card
        bordered={true}
        title={Translator("ISMS.Action Request")} 
        className={styles.card}
      >
        <BkRsUgF {...props}/>
      </Card>
    </Fragment>
  );
};

export default BkRsUgC;
