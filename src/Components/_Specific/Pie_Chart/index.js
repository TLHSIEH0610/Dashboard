import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Doughnut } from 'react-chartjs-2';
// import styles from './Pie.module.scss'
import { Container, Row, Col, Card } from 'react-bootstrap'
import useURLloader from '../../../hook/useURLloader'


const PieChart = () => {
    // const url = '/api/statistic.json'
    const url = '/cmd?get={"statistic":{}}'
    const [healthPie, setHealthPie] = useState({})
    const [strengthPie, setStrengthPie] = useState({})
    const isFirstRun = useRef(true);
    const [loading, res] = useURLloader(url)
    useEffect(()=>{
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        let data = res.response.statistic.obj
        setHealthPie({
            datasets: [{
                data: [data.health.up, data.health.warning, data.health.critical, data.health.offline],
                backgroundColor: ["#28a745", "#ffc107", "#dc3545", "#343a40"]
            }],
            labels: ['up', 'warning', 'critical', 'offline']
        })
        setStrengthPie({
            datasets: [{
                data: [data.sim.excellent, data.sim.good, data.sim.fair, data.sim.poor],
                backgroundColor: ["#28a745", "#ffc107", "#dc3545", "#343a40"]
            }],
            labels: ['excellent', 'good', 'fair', 'poor']
        })
    }, [res])
    
    return(
        <Fragment>
        <Container>
            <Row>
                <Col>
                <Card>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                        <Doughnut data={strengthPie} option={'responsive: true, maintainAspectRatio: false'} />
                    </Card.Body>
                    </Card>
                </Col>
                <Col>
                <Card>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                        <Doughnut data={healthPie} option={'responsive: true, maintainAspectRatio: false'} />   
                    </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </Fragment>
    )
}

export default PieChart