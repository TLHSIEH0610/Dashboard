import React, { Fragment, useState, useEffect, useContext } from "react";
import styles from "./Pie.module.scss";
import { Card } from "antd";
import useURLloader from "../../../hook/useURLloader";
import PieChartC from "./PieChart";
import Context from '../../../Utility/Reduxx'

import { Translator } from '../../../i18n/index'

const PieChart = () => {
  const { state } = useContext(Context) 
  const cid = localStorage.getItem('authUser.cid')
  const url =cid==='proscend' ? `/cmd?get={"statistic":{"filter":{${state.Login.Cid}}}}`:`/cmd?get={"statistic":{"filter":{"cid":"${cid}"}}}` ;
  const [loading, response] = useURLloader(url);
  const [PieData, setPieData] = useState([]);


  useEffect(() => {
    if (response) {
      setPieData(response.response.statistic.obj);

    }
  }, [response]);



  return (
    <Fragment>
      <div className={styles.PieWrapper}>
        <Card className={styles.PieCard} loading={loading}>
          <PieChartC
            dataSource={
              PieData.health && [
                PieData.health.up,
                PieData.health.warning,
                PieData.health.critical,
                PieData.health.offline,
              ]
            }
            // data={["up", "warning", "critical", "offline"]}
            data={[Translator("ISMS.up"),Translator("ISMS.warning"),Translator("ISMS.critical"),Translator("ISMS.offline")]}
            name={Translator('ISMS.DevicesHealth')}
            //  <p>{t('quickAdd.DevicesHealth')}</p>
          />
        </Card>
        <Card className={styles.PieCard} loading={loading}>
          <PieChartC
            dataSource={
              PieData.sim && [
                PieData.sim.excellent,
                PieData.sim.good,
                PieData.sim.fair,
                PieData.sim.poor,
              ]
            }
            // data={["excellent", "good", "fair", "poor"]}
            data={[Translator("ISMS.excellent"),Translator("ISMS.good"),Translator("ISMS.fair"),Translator("ISMS.poor")]}
            name={Translator('ISMS.DevicesStrength')}
          />
        </Card>
      </div>
    </Fragment>
  );
};

export default PieChart;
