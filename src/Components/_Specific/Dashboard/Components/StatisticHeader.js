import React, { useEffect, useState, useContext } from "react";
import { Card } from "antd";
// import { useHistory } from 'react-router-dom'
import Context from "../../../../Utility/Reduxx";
// import { Translator } from '../../../i18n/index'
import styles from "../dashboard.module.scss";
import axios from "axios";

// const [CustomerListLoading, CustomerListResponse] = useURLloader(
//   CustomerListUrl
// );
const StatisticHeaderC = () => {
  //   const history = useHistory()
  const { state } = useContext(Context);
  const [CustomerList, setCustomerList] = useState(null);
  const [SchemeList, setSchemeList] = useState(null);
  const [loading, setLoading] = useState(false);
  const level = localStorage.getItem("authUser.level");
  const cid = localStorage.getItem("authUser.cid");

  useEffect(() => {
    setLoading(true);
    function CustomerListUrl() {
        return axios.post(`/inf_mgnt?list_inf={${
            level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
          }}`)
      }
      function SchemeUrl() {
        return axios.post(`/scheme_mgnt?list_scheme={${
            level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
          }}`)
      }
   
    axios.all([CustomerListUrl(), SchemeUrl()])
    .then(axios.spread((acct, perms) =>{ 
        // if(state.Login.Cid !==''){
          let time = new Date(perms.data.response[0].scheme_list.expire * 1000)
          perms.data.response[0].scheme_list.expire = `${time.getFullYear()}-${
            time.getMonth() + 1
          }-${time.getDate()}`
        // }
        setCustomerList(acct.data.response[0].inf_list);
        setSchemeList(perms.data.response[0].scheme_list)
        // console.log(perms.data.response[0].scheme_list, perms)
        setLoading(false);
      }))
      .catch((error) => {
        console.log(error);
        setLoading(false);
      })
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.Login.Cid])
  // console.log(SchemeList)

  return (
    <Card
      bordered={false}
      loading={loading}
      className={styles.Card}
      style={{ height: 120, marginBottom:15 }}
    >
      <p style={{ fontSize: 20, fontWeight: "bold" }}>
        {CustomerList && (state.Login.Cid ==='' && level==='super_super' ? 'Proscend' : CustomerList.company)}
      </p>
      {/* <p>Alarm: </p> */}
      {SchemeList && <div className={styles.StatisticHeader}>
        <p>User: <span>{SchemeList.user}</span> / <span>{SchemeList.users}</span></p>
        <p>Device: <span>{SchemeList.device}</span> / <span>{SchemeList.devices}</span></p>
        <p>Plan expire: <span> { SchemeList.expire }</span></p>
      </div>}

    </Card>
  );
};
export default StatisticHeaderC;
