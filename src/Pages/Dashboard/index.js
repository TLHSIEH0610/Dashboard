import React, { Component, Fragment } from 'react'
import PieChart from '../../Components/_Specific/Pie_Chart'
import Map from '../../Components/_Specific/GPS_Map'
import { Container,Row,Col } from 'react-bootstrap'


class Dashboard extends Component {
    render() {
        return (
            <Fragment>
                <Container>
                    <Row>
                        <Col><PieChart /></Col>
                    </Row>
                    <Row>
                        <Col><Map /></Col>
                    </Row>
                </Container>
            </Fragment>
        )
    }
}

export default Dashboard