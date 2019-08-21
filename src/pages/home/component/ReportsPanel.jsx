import {useTranslation} from "react-i18next";
import React from "react";
import useReports from "../useReports";
import {ResponsivePie} from '@nivo/pie'
import {ResponsiveBar} from "@nivo/bar";
import './ReportsPanel.scss';
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import {EXECUTING} from "../../../core/api/actionTypes";
import Spinner from "react-bootstrap/Spinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartLine} from "@fortawesome/free-solid-svg-icons";

const ReportsPanel = () => {
    const {reports} = useReports();
    const {t} = useTranslation();
    return <Container fluid>
        <div style={{textAlign: 'center'}}>
            <h1 className="display-5"><FontAwesomeIcon icon={faChartLine}/> <span className="ml-2">{t('home.reports')}</span></h1>
        </div>

        <Row>
            <Col>
                <Card style={{width: '100hv'}}>
                    <Card.Body>
                        <Card.Title>
                            {t('home.forms-per-environment')}
                        </Card.Title>
                        {
                            reports.statusFormsPerEnvCount === EXECUTING ?
                                <div style={{textAlign: 'center'}}><Spinner animation="border" role="status"
                                                                            variant='success'>
                                    <span className="sr-only">{t('loading')}</span>
                                </Spinner></div>
                                : <div style={{height: '500px'}}><ResponsivePie
                                    data={reports.formsPerEnvCount}
                                    margin={{top: 40, right: 80, bottom: 80, left: 80}}
                                    innerRadius={0.5}
                                    padAngle={0.7}
                                    cornerRadius={3}
                                    colors={{scheme: 'nivo'}}
                                    borderWidth={1}
                                    borderColor={{from: 'color', modifiers: [['darker', 0.2]]}}
                                    radialLabelsSkipAngle={10}
                                    radialLabelsTextXOffset={6}
                                    radialLabelsTextColor="#333333"
                                    radialLabelsLinkOffset={0}
                                    radialLabelsLinkDiagonalLength={16}
                                    radialLabelsLinkHorizontalLength={24}
                                    radialLabelsLinkStrokeWidth={1}
                                    radialLabelsLinkColor={{from: 'color'}}
                                    slicesLabelsSkipAngle={10}
                                    slicesLabelsTextColor="#333333"
                                    animate={true}
                                    motionStiffness={90}
                                    motionDamping={15}
                                    legends={[
                                        {
                                            anchor: 'bottom',
                                            direction: 'row',
                                            translateY: 56,
                                            itemWidth: 100,
                                            itemHeight: 18,
                                            itemTextColor: '#999',
                                            symbolSize: 18,
                                            symbolShape: 'circle',
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemTextColor: '#000'
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                                /></div>
                        }

                    </Card.Body>
                </Card>

            </Col>
            <Col>
                <Card style={{width: '100hv'}}>
                    <Card.Body>
                        <Card.Title>
                            {t('home.types-of-forms')}
                        </Card.Title>

                        {
                            reports.statusTypeData === EXECUTING ?
                                <div style={{textAlign: 'center'}}><Spinner animation="border" role="status"
                                                                            variant='success'>
                                    <span className="sr-only">{t('loading')}</span>
                                </Spinner></div> : <div style={{height: '500px'}}><ResponsiveBar
                                    data={reports.typeData}
                                    keys={['wizard', 'form']}
                                    indexBy="name"
                                    margin={{top: 50, right: 130, bottom: 50, left: 60}}
                                    padding={0.3}
                                    colors={{scheme: 'nivo'}}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'Environments',
                                        legendPosition: 'middle',
                                        legendOffset: 32
                                    }}
                                    axisLeft={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'Total',
                                        legendPosition: 'middle',
                                        legendOffset: -40
                                    }}
                                    labelSkipWidth={12}
                                    labelSkipHeight={12}
                                    labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
                                    legends={[
                                        {
                                            dataFrom: 'keys',
                                            anchor: 'bottom-right',
                                            direction: 'column',
                                            justify: false,
                                            translateX: 120,
                                            translateY: 0,
                                            itemsSpacing: 2,
                                            itemWidth: 100,
                                            itemHeight: 20,
                                            itemDirection: 'left-to-right',
                                            itemOpacity: 0.85,
                                            symbolSize: 20,
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemOpacity: 1
                                                    }
                                                }
                                            ]
                                        }
                                    ]}

                                    animate={true}
                                    motionStiffness={90}
                                    motionDamping={15}
                                /></div>
                        }

                    </Card.Body>
                </Card>

            </Col>
        </Row>
    </Container>
};

export default ReportsPanel;
