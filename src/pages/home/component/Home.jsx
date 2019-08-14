import React from 'react';
import EnvironmentListPanel from "./EnvironmentListPanel";
import ReportsPanel from "./ReportsPanel";
import {useTranslation} from "react-i18next";
import config from "react-global-configuration"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTachometerAlt} from '@fortawesome/free-solid-svg-icons'

const Home = () => {
    const environments = config.get('environments');
    const {t} = useTranslation();
    return <React.Fragment>
        <div style={{textAlign: 'center'}}><h1 className="display-3"><FontAwesomeIcon icon={faTachometerAlt}/>
            <span> {t('home.heading.title')}</span></h1></div>
        <hr/>
        <Container fluid>
            <Row>
                <Col><ReportsPanel/></Col>
            </Row>
        </Container>
        <hr/>
        <Container fluid>
            <Row>
                <Col><EnvironmentListPanel environments={environments}/></Col>
            </Row>
        </Container>

    </React.Fragment>
};

export default Home;
