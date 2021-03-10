import React, { useEffect, useState, useContext } from "react";
import { Form } from "antd";
import Context from "../../../../Utility/Reduxx";
import useURLloader from "../../../../hook/useURLloader";
import { BulkConfigMF } from "./BulkConfigF";


const BulkConfigC = ({
  IsUpdate,
  setIsUpdate,
  models,
  cities,
  groups,
  dataSource,
  record,
  setSettingRecord
}) => {
  // const [IsUpdate, setIsUpdate] = useState(false)
  const { state } = useContext(Context);
  const [form] = Form.useForm();
  const [FileRepository, setFileRepository] = useState([]);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const NodeUrl = "/cmd";
  const NodeUrldata = `{"get":{"nodeInf":{"filter":{${
    level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
  }},"nodeInf":{"cid":{},"gid":{},"token":{},"id":{},"model":{},"name":{}}}}}`;
  const [Nodeloading, Noderesponse] = useURLloader(
    NodeUrl,
    NodeUrldata,
    IsUpdate
  );
  const [NodeData, setNodeData] = useState([]);

  // function levelJusgement(level){
  //   if(level==="super_super" || level === "super"){
  //     return (FileRepostoryUrl, FileRepostoryUrldata, IsUpdate)
  //   }else{
  //     return('','','')
  //   }
  // }

  const FileRepostoryUrl = "/repository";
  const FileRepostoryUrldata = `{"list_file":{${
    level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
  }}}`;
  const [Fileloading, Filereponse] = useURLloader(
    (level === "super_super" || level === "super") && FileRepostoryUrl, (level === "super_super" || level === "super") && FileRepostoryUrldata, IsUpdate
  );



  useEffect(() => {
    if (Noderesponse?.response) {
      let NodeData = Noderesponse.response.nodeInf.map((item, index) => {
        return {
          key: index,
          id: item.nodeInf.id,
          name: item.nodeInf.name,
          model: item.nodeInf.model,
        };
      });
      setNodeData(NodeData);

      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Noderesponse]);

  useEffect(() => {
   
    if (Filereponse?.response?.repository?.length) {
      // console.log(Filereponse)
      let files = new Set()
      Filereponse.response.repository.map((item)=>{
        return(
          item.list.filter((item)=>item.type==='yml').map((item)=>files.add(item))
        )
      })
      files=Array.from(files)
      setFileRepository(files);
      // console.log(files)
    } else {
      setFileRepository([]);
    }
  }, [Filereponse]);

  return (
    <BulkConfigMF
      Nodeloading={Nodeloading}
      NodeData={NodeData}
      models={models}
      FileRepository={FileRepository}
      Fileloading={Fileloading}
      groups={groups}
      cities={cities}
      dataSource={dataSource}
      record={record}
      setRecord={setSettingRecord}
      setIsUpdate={setIsUpdate}
      IsUpdate={IsUpdate}
    />
  );
};

export const BulkConfigMC = React.memo(BulkConfigC);
