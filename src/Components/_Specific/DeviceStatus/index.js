import React, { Fragment, useEffect, useContext, useState, useRef } from 'react'
import styles from './devicestatus.module.scss'
import { GetDeviceStatus } from '../../../Utility/Fetch'
import Context from '../../../Utility/Reduxx'
import DeviceStatusBar from './Bar'
import useURLloader from '../../../hook/useURLloader'

// export const ParentContext = createContext()

const DeviceStatus = () => {
    const { state, dispatch } = useContext(Context)
    const [deviceData, setDeviceData] = useState(null)
    const isFirstRun = useRef(true);
   

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const getStates = async () => {
            let data = await GetDeviceStatus(state.Topology.id)
            const response = data[1].response.device_status[0].obj.status
            setDeviceData(response)
            dispatch({type:'deviceStatusByID', payload:{deviceStatusByID: response}})
        }
        getStates()

    }, [state.Topology.id])

    const AlarmTable = () => {
        if (deviceData === null) {
            console.log(deviceData)
            return 'Please selecte a node'
        }
        if(deviceData.alarm.length === 0){
            console.log(deviceData)
            return 'No event log was found'
        }else{
            console.log(deviceData)

            let x = deviceData.alarm.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{item.level}</td>
                        <td>{item.message}</td>
                        <td>{item.trigger_time}</td>
                        <td>{item.recover_time}</td>
                    </tr>
                )
    
            })
    
            return (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Message</th>
                            <th>thigger Time</th>
                            <th>Recover Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {x}
                    </tbody>
                </table>
            )
        } 



    }

    return (
        <Fragment>
            {AlarmTable()}
            {/* <ParentContext.Provider value={deviceData}> */}
                <DeviceStatusBar/>
            {/* </ParentContext.Provider> */}
        </Fragment>
    )
}

export default DeviceStatus