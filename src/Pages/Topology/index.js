import React, { Fragment } from 'react';
import TreePlot from '../../Components/_Specific/Tree'
import DeviceStatus from '../../Components/_Specific/DeviceStatus'
import { Card } from 'react-bootstrap'
import styles from './topology.module.scss'
import TopologyC from '../../Components/_Specific/Topology/index'

const Topology = () => {
    return (
        <Fragment>
            {/* <div className={styles.container}> */}
                <TopologyC/>
            {/* </div> */}
        </Fragment>
    )
}

export default Topology
