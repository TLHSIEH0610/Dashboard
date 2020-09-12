import React, { useEffect, useContext, useState, useRef } from 'react'
// import styles from './devicestatus.module.scss'
import { Bar } from 'react-chartjs-2';
import Context from '../../../Utility/Reduxx'
import { Form } from 'react-bootstrap';


const DeviceStatusBar = () => {
    const [ view, setView ] = useState('kbps');
    const { state } = useContext(Context)
    const [BarData, setBarData] = useState({
        labels: ['LTE', 'WAN Ethernet', 'LAN Ethernet'],
        datasets: [
            {
                label: 'Tx',
                backgroundColor: "#93B5C6",
                data: [
                  0,
                  0,
                  0,
                ]
              },
              {
                label: 'Rx',
                backgroundColor: "#DDEDAA",
                data: [
                 0,
                 0,
                 0,
                ]
              }
        ]
    })
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }


        setBarData({
            labels: ['LTE', 'WAN Ethernet', 'LAN Ethernet'],
            datasets: [
                {
                    label: 'Tx',
                    backgroundColor: "#93B5C6",
                    data: [
                        state.Topology.deviceStatusByID.statistic.lte.up_kbps,
                        state.Topology.deviceStatusByID.statistic.wan.up_kbps,
                        state.Topology.deviceStatusByID.statistic.lan.up_kbps,
                    ]
                },
                {
                    label: 'Rx',
                    backgroundColor: "#DDEDAA",
                    data: [
                        state.Topology.deviceStatusByID.statistic.lte.down_kbps,
                        state.Topology.deviceStatusByID.statistic.wan.down_kbps,
                        state.Topology.deviceStatusByID.statistic.lan.down_kbps,
                    ]
                }
            ]
        })
        // console.log(BarData)

    }, [state.Topology.deviceStatusByID])

    const changeView = (e) => {
        setView(e.target.value)
        
        switch(e.target.value) {
            case 'kbps':
                BarData.datasets[0].data = [
                state.Topology.deviceStatusByID.statistic.lte.up_kbps,  
                state.Topology.deviceStatusByID.statistic.wan.up_kbps,
                state.Topology.deviceStatusByID.statistic.lan.up_kbps,
              ]
              BarData.datasets[1].data = [
                state.Topology.deviceStatusByID.statistic.lte.down_kbps,
                state.Topology.deviceStatusByID.statistic.wan.down_kbps,
                state.Topology.deviceStatusByID.statistic.lan.down_kbps,
              ]
              break;
            case 'kbytes':
                BarData.datasets[0].data = [
                state.Topology.deviceStatusByID.statistic.lte.tx_kbytes,
                state.Topology.deviceStatusByID.statistic.wan.tx_kbytes,
                state.Topology.deviceStatusByID.statistic.lan.tx_kbytes,
              ]
              BarData.datasets[1].data = [
                state.Topology.deviceStatusByID.statistic.lte.rx_kbytes,
                state.Topology.deviceStatusByID.statistic.wan.rx_kbytes,
                state.Topology.deviceStatusByID.statistic.lan.rx_kbytes,
              ]
              break
            case 'dropped_pkts':
              BarData.datasets[0].data = [
                state.Topology.deviceStatusByID.statistic.lte.tx_dropped_pkts,
                state.Topology.deviceStatusByID.statistic.wan.tx_dropped_pkts,
                state.Topology.deviceStatusByID.statistic.lan.tx_dropped_pkts,
              ]
              BarData.datasets[1].data = [
                state.Topology.deviceStatusByID.statistic.lte.rx_dropped_pkts,
                state.Topology.deviceStatusByID.statistic.wan.rx_dropped_pkts,
                state.Topology.deviceStatusByID.statistic.lan.rx_dropped_pkts,
              ]
            break
            default:
            }
    }
    if(state.Topology.deviceStatusByID === ""){
        return(
            <p>Empty</p>
        )
    }else{
        return(
            <Form>
            <Form.Check
              inline
              type="radio"
              label="bps"
            name={view}
              value="kbps"
              onChange={changeView}
            />
            <Form.Check
              inline
              type="radio"
              label="kbytes"
            name={view}
              value="kbytes"
              onChange={changeView}
            />
            <Form.Check
              inline
              type="radio"
              label="dropped_pkts"
              name={view}
              value="dropped_pkts"
              onChange={changeView}
            />
            <Bar data={BarData} />
          </Form>
        )
    }

}

export default DeviceStatusBar