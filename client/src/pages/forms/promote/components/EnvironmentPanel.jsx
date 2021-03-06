import React from 'react';
import useEnvContext from "../../../../core/context/useEnvContext";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {isMobile} from "react-device-detect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretLeft, faCaretRight, faCog} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ExtendedBootstrapSwitchButton from '../../../../common/ExtendedBootstrapSwitchButton';
import  uuid4 from "uuid4";

const EnvironmentPanel = ({form, setValue, isDisabled}) => {
    const {availableEnvironments, envContext} = useEnvContext();
    const {t} = useTranslation();
    const handleChange = (environment) => {
        setValue(form => ({
            ...form,
            environment: environment === form.environment ? null : environment
        }));
    };
    const availablePromitionEnvironments = availableEnvironments(envContext.id);
    return <Container>
        <Row>
            <Col>
                <hr className="hr-text" data-content="Select environment"/>
            </Col>
        </Row>
        <Row>
            {isMobile ? (availablePromitionEnvironments.length !== 0 ?
                _.map(availablePromitionEnvironments, (environment) => {
                    const id = environment.id;
                    return <ExtendedBootstrapSwitchButton
                        key={id}
                        data-cy={`promote-${environment.id}`}
                        checked={id === form.environment}
                        onlabel={t('form.promote.environment', {env: environment.label})}
                        onstyle='primary'
                        offlabel={<React.Fragment><FontAwesomeIcon icon={faCog}/><span
                            className="ml-1">{environment.label}</span></React.Fragment>}
                        offstyle='info'
                        style='w-100 mt-2'
                        onChange={() => {
                            handleChange(id)
                        }}
                    />

                }) : null) : (availablePromitionEnvironments.length !== 0 ?
                        _.chunk(availablePromitionEnvironments, 3).map((envs) => {
                            const cols = _.map(envs, (environment) => {
                                const id = environment.id;
                                return <Col key={id}><ExtendedBootstrapSwitchButton
                                    key={id}
                                    checked={id === form.environment}
                                    onlabel={t('form.promote.environment', {env: environment.label})}
                                    onstyle='primary'
                                    offlabel={<React.Fragment><FontAwesomeIcon icon={faCog}/><span
                                        className="ml-1">{environment.label}</span></React.Fragment>}
                                    offstyle='info'
                                    style='w-100 mt-2'
                                    onChange={() => {
                                        handleChange(id)
                                    }}
                                /></Col>
                            });
                            while(cols.length !== 3) {
                                cols.push(<Col key={uuid4()}/>);
                            }
                          return <Container key={uuid4()}><Row key={uuid4()}>{cols}</Row></Container>
                        })

                : null)
            }
        </Row>
        <Row>
            <Col>
                <ButtonToolbar className="mt-5">
                    <Button block={isMobile} className="mr-2"
                            onClick={() => {
                                form.stepper.previous();
                            }}
                            variant="secondary"><FontAwesomeIcon icon={faCaretLeft}/><span
                        className="ml-2">{t('form.promote.previous')}</span></Button>
                    <Button block={isMobile} disabled={isDisabled()} variant="primary"
                            data-cy={'promote-confirm-step'}
                            onClick={() => {
                                form.stepper.next();
                            }}
                            className="mr-2">{t('form.promote.next')}<span className="ml-2"><FontAwesomeIcon
                        icon={faCaretRight}/></span></Button>

                </ButtonToolbar>
            </Col>
        </Row>
    </Container>
};

export default EnvironmentPanel;


