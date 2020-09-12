import React, { Fragment } from 'react';
import TreePlot from '../../Components/_Specific/Tree'
import DeviceStatus from '../../Components/_Specific/DeviceStatus'
import { Card } from 'react-bootstrap'
import styles from './topology.module.scss'

const Topology = () => {
    return (
        <Fragment>
            <div className={styles.container}>
                <div className={styles.tree}>
                         <Card className={styles.card}>
                            <Card.Header as="h5">All node</Card.Header>
                            <Card.Body className={styles.cardbody}>
                                <TreePlot />
                            </Card.Body>
                        </Card>
                </div>
                <div className={styles.detail}>
                         <Card className={styles.card}>
                            <Card.Header as="h5">All node</Card.Header>
                            <Card.Body className={styles.cardbody}>
                              <DeviceStatus />
                            </Card.Body>
                        </Card>
                </div>
            </div>
        </Fragment>
    )
}

export default Topology